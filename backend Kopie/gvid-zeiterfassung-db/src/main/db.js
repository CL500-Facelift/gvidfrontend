const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'gvidproject'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

connection.query('SELECT * FROM Employee', function(err, results, fields) {
    if (err) throw err;
    console.log(results);
});

connection.end(function(err) {
    if (err) throw err;
    console.log('Connection to MySQL database closed.');
});
