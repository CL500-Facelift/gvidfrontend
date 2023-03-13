const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require("cors");

// create connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'gvidproject'
});

// create express app
const app = express();
var corsOptions = {
    origin: "http://172.20.10.10:4200"
};

app.use(cors(corsOptions));


app.use(cors(corsOptions));
app.use(bodyParser.json()); // add this line to parse incoming request bodies as JSON

// define routes
app.get('/employees', (req, res) => {
    // get all employees from the database
    pool.query('SELECT * FROM Employee', (err, results, fields) => {
        if (err) throw err;
        res.send(results);
    });
});

app.post('/employees', (req, res) => {
    // create a new employee in the database
    const { name, hire_date } = req.body;
    const values = [name, hire_date];
    pool.query('INSERT INTO Employee (name, hire_date) VALUES (?, ?)', values, (err, results, fields) => {
        if (err) throw err;
        res.send('Employee created successfully.');
    });
});

app.post('/login', async (req, res) => {
    console.log('test' + req.body.name)
    try {
        pool.execute('SELECT * FROM Employee WHERE name = ?', [req.body.name], (err,result)=>{
            if (undefined){

            }else {
            if (result.length > 0 && result[0].password === req.body.password) {
                res.send({ success: true });
            } else {
                res.send({ success: false, message: 'Invalid name or password' });
            }
        }});

    } catch (error) {
        res.status(500).send({ success: false, message: 'Error logging in: ' + error.message });
    }
});

// start the server
app.listen(3000, '172.20.10.10' , () => {
    console.log('Server started on port 3000.');
});

app.post('/employees/:employeeId/login', (req, res) => {
    const employeeId = req.params.employeeId;
    const link = req.body.link;

    // get the employee's timetable
    pool.query('SELECT id FROM Timetable WHERE employee_id = ? ORDER BY login DESC LIMIT 1', [employeeId], (err, results, fields) => {
        if (err) throw err;

        const timetableId = results[0].id;

        // update the timetable with the login time and link
        const now = moment();
        const loginTime = now.format('YYYY-MM-DD HH:mm:ss');
        pool.query('UPDATE Timetable SET login = ?, link = ? WHERE id = ?', [loginTime, link, timetableId], (err, results, fields) => {
            if (err) throw err;

            res.send('Login successful.');
        });
    });
});

app.post('/employees/:name/workingtime', (req, res) => {
    const name = req.params.name;
    const now = new Date().toISOString();
    const loginTime = now.slice(0, 19).replace('T', ' ');

    const insertTimetableSql = `INSERT INTO Timetable (id, login) VALUES (NULL, '${loginTime}')`;
    pool.query(insertTimetableSql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging in');
        } else {
            const timetableId = result.insertId;
            const insertEmpTimetableSql = `INSERT INTO Employee_Timetable (employee_id, timetable_id) VALUES ((SELECT id FROM Employee WHERE name = '${name}'), '${timetableId}')`;
            pool.query(insertEmpTimetableSql, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error logging in');
                } else {
                    console.log(`Employee ${name} logged in at ${now}`);
                    res.status(200).send(`Employee ${name} logged in at ${now}`);
                }
            });
        }
    });
});

app.get('/workingtime/:name', (req, res) => {
    const name = req.params.name;
    console.log(name);

    // fetch the employee's name and working time from the database
    const sql = `
    SELECT Employee.name, TIMEDIFF(NOW(), Timetable.login) AS working_time
    FROM Employee
    INNER JOIN Employee_Timetable ON Employee.id = Employee_Timetable.employee_id
    INNER JOIN Timetable ON Employee_Timetable.timetable_id = Timetable.id
    WHERE Employee.id = (SELECT Employee.id FROM Employee WHERE Employee.name = ?)
    ORDER BY Timetable.login DESC
    LIMIT 1
  `;
    pool.query(sql, [name], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching working time');
        } else {
            if (results.length === 0) {
                res.status(404).send('Employee not found');
            } else {
                const { name, working_time } = results[0];
                res.send({ name, working_time });
            }
        }
    });
});