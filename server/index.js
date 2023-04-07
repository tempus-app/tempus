const express = require("express")
const app = express()
const port = 5000
const { Pool } = require("pg")
const cors = require("cors")

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

app.get("/approval", (req, res) => {
	pool.query('SELECT * FROM approval_entity', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving users from database');
		} else {
			console.log(result.rows);
      res.send(result.rows);
    }
  });
})

app.post("/approval", (req, res) => {
	console.log(req.body);
	const query = `
			INSERT INTO approval_entity("timesheetWeek", "submittedBy", "submissionDate", "time", "project")
			VALUES($1, $2, $3, $4, $5)
	`;
	const values = [
			req.body.dateRange,
			req.body.nameOfUser,
			req.body.currentDate,
			req.body.totalHours,
			req.body.selectedProject
	];

	pool.query(query, values, (err, result) => {
			if (err) {
					console.error(err);
					res.status(500).send('Error inserting into database');
			} else {
					res.send(result.rows);
			}
	});
});


app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
