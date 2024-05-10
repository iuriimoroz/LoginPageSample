const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const { runQuery, getRows } = require('./db');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/home');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const rows = await getRows("SELECT * FROM users WHERE username = ?", [username]);
    
    if (!rows.length) {
      // Send a response with an error message
      return res.status(400).send(`Invalid username or password. <a href="/">Login</a>`);
    }

    const isValidPassword = await bcrypt.compare(password, rows[0].password_hash);
    if (!isValidPassword) {
      // Send a response with an error message
      return res.status(400).send(`Invalid username or password. <a href="/">Login</a>`);
    }

    req.session.userId = rows[0].id;
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred. Please try again later. <a href="/">Login</a>`);
  }
});
  
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const rows = await getRows("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length) {
      // Send a response with an error message
      return res.status(400).send(`Username is already taken. <a href="/register">Register</a>`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await runQuery("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, hashedPassword]);
    res.send('User registered successfully. <a href="/">Login</a>');
  } catch (err) {
    console.error(err);
    // Send a response with an error message
    res.status(500).send(`An error occurred while registering. Please try again later. <a href="/register">Register</a>`);
  }
});

app.get('/home', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }

  try {
    const rows = await getRows("SELECT username FROM users WHERE id = ?", [req.session.userId]);
    if (!rows.length) {
      return res.send('User not found.');
    }
    res.render('home', { username: rows[0].username });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred. Please try again later.');
  }
});

app.get('/logout', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  req.session.destroy();
  res.redirect('/');
});

// Ensure that the users table is created before handling any requests
runQuery("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password_hash TEXT)")
  .then(() => {
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error creating users table:', err);
  });
