const express = require("express")
const app = express()
const port = 5000
const { Pool } = require("pg")
const cors = require("cors")

app.use(cors())

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

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
