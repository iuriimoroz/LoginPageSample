# Login Page Project

## Description
This project is a simple login page application built using Express.js, SQLite3, and bcrypt. It allows users to register with a username and password, log in, and log out. Passwords are securely hashed before being stored in the database.

## Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/iuriimoroz/LoginPageSample
   ```
2. Navigate to the project directory:
   ```bash
   cd LoginPage
   ```
3. Install dependencies using npm:
   ```bash
   npm install
     ```

## Usage
1.  Start the server:
   ```bash
   node server.js
   ```
2. Open your web browser and navigate to http://localhost:3000.
3. You will be redirected to the login page. If you don't have an account, you can register by clicking on the "Register" link.
4. After registering or logging in with your credentials, you will be redirected to the home page, where you can see your username.
5. To log out, simply click on the "Logout" link.

## Dependencies
Express
express-session
body-parser
bcrypt
EJS
SQLite3
## Contributing
If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (git checkout -b feature/your-feature-name).
3. Make your changes and commit them (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature/your-feature-name).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License.