const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'gvid'
});

const corsOptions = {
  origin: 'http://192.168.178.171:4200'
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

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

// Route to start working time
app.post('/employees/:id/workingtime/start', (req, res) => {
  const id = req.params.id;
  const startTime = Date.now();
  const values = [id, startTime];
  // Added code
  pool.query('SELECT * FROM Employee WHERE id = ?', [id], (err, results, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error starting working time');
    } else {
      if (results.length === 0) {
        res.status(404).send(`Employee with id ${id} not found.`);
      } else {
        pool.query('INSERT INTO Employee_Timetable (employee_id, timetable_id) VALUES (?, ?)', values, (err, results, fields) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error starting working time');
          } else {
            console.log(`Working time started for employee ${id} at ${startTime}`);
            res.status(200).send(`Working time started for employee ${id} at ${startTime}`);
          }
        });
      }
    }
  });
});

app.post('/employees/:name/workingtime/end', (req, res) => {
  const name = req.params.name;
  const endTime = Date.now();
  const values = [endTime, name];
  // Added code
  pool.query('SELECT * FROM Employee WHERE name = ?', [name], (err, results, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error ending working time');
    } else {
      if (results.length === 0) {
        res.status(404).send(`Employee with name ${name} not found.`);
      } else {
        pool.query(`UPDATE Employee_Timetable SET end_time = ? WHERE timetable_id IN (SELECT id FROM Timetable WHERE DATE(login) = CURDATE() AND employee_id = ?)`, values, (err, results, fields) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error ending working time');
          } else {
            console.log(`Working time ended for employee ${name} at ${endTime}`);
            res.status(200).send(`Working time ended for employee ${name} at ${endTime}`);
          }
        });
      }
    }
  });
});



// Route to end working time
app.get('/employees/:id/workingtime', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT SUM(workingtime) AS total_working_time FROM Timetable WHERE id IN (SELECT timetable_id FROM Employee_Timetable WHERE employee_id = ?)', [id], (err, results, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error getting working time');
    } else {
      const totalWorkingTime = results[0].total_working_time;
      res.status(200).send(`Total working time for employee ${id} is ${totalWorkingTime} hours.`);
    }
  });
});

// Route to get working time
app.get('/employees/:name/workingtime', (req, res) => {
  const name = req.params.name;
  pool.query('SELECT SUM(workingtime) AS working_time FROM Timetable JOIN Employee_Timetable ON Timetable.id = Employee_Timetable.timetable_id WHERE employee_id = ?', [name], (err, results, fields) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error getting working time');
    } else {
      const workingTime = results[0].working_time;
      res.status(200).send(`Working time for ${name} is ${workingTime} minutes.`);
    }
  });
});

app.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    pool.execute('SELECT * FROM Employee WHERE name = ?', [name], (err,result)=>{
      if (undefined){

      } else {
        if (result.length > 0 && result[0].password === password) {
          res.send({ success: true, employeeId: parseInt(result[0].id) });
        } else {
          res.send({ success: false, message: 'Invalid name or password' });
        }
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Error logging in: ' + error.message });
  }
});



// Start the server
app.listen(3000, '192.168.178.171' , () => {
  console.log('Server started on port 3000.');
});
