const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

// Function to run a query
function runQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

// Function to get rows from a query
function getRows(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = { runQuery, getRows };
