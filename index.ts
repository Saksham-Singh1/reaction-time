import express from 'express';
import { ConnectionPool } from 'mssql';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Azure SQL Database Connection Configuration
const dbConfig = {
  user: 'your_username',         // Replace with your Azure SQL username
  password: 'your_password',     // Replace with your Azure SQL password
  server: 'your_server.database.windows.net', // Replace with your Azure SQL server name
  database: 'your_database',     // Replace with your Azure SQL database name
  options: {
    encrypt: true,               // Enable encryption for Azure SQL
    trustServerCertificate: false // Adjust as needed
  }
};

const pool = new ConnectionPool(dbConfig);

// Connect to Azure SQL Database
// pool.connect().then(() => console.log("Connected to Azure SQL Database")).catch(console.error);

// Endpoint to store reaction time
app.post('/api/reaction-time', async (req, res) => {
  const { arrowDirection, reactionTime } = req.body;

  try {
    const query = `
      INSERT INTO reaction_times (arrow_direction, reaction_time_ms)
      VALUES (@arrowDirection, @reactionTime)
    `;
    const request = pool.request();
    request.input('arrowDirection', arrowDirection);
    request.input('reactionTime', reactionTime);
    await request.query(query);

    res.status(200).json({ message: 'Reaction time recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record reaction time' });
  }
});



// Serve static files (HTML, CSS, JavaScript)
app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});