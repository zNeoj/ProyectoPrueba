const express = require('express');
const cors = require('cors');
const cookies = require('cookie-parser');
require('dotenv').config();
// const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookies());

const connection = require('./config/database.js');
const routesGomitas = require('./routes/gomitas.js');


const port = process.env.PORT || 3000;

// Print the environment variables for debugging
console.log('host:', process.env.DB_HOST);
console.log('user:', process.env.DB_USER);
console.log('password:', process.env.DB_PASSWORD);
console.log('database:', process.env.DB_NAME);

    // Only set up your API routes once connected
    setupApiRoutes();

// Set up the API routes
function setupApiRoutes() {
  app.get('/', (req, res) => {
    res.cookie("eso", "tilin", { maxAge: 1000 * 60 * 30});
    res.json({ message: 'Welcome to the API!',
      alert: `You've been granted a cookie`
     });
  });

  app.get('/cookieTest', (req, res) => {
    if (req.cookies.eso == "tilin")
      res.status(200).send("buena galletita bro");
    else
      res.sendStatus(404);
  });

  app.get('/api/dataa', (req, res) => {
    // Check if we have a valid connection
    if (!connection || connection.state === 'disconnected') {
      return res.status(500).json({ error: 'Database connection is not established' });
    }
    
    connection.query('SELECT * FROM your_table', (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  });

  app.use('/gomitas', routesGomitas);
}



// Start the server
const server = app.listen(port, () => {
  console.log(`Back-end escuchando en http://localhost:${port}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('HTTP server closed');
    
    // Close database connection
    if (connection) {
      connection.end(err => {
        if (err) {
          console.error('Error closing database connection:', err);
          process.exit(1);
        }
        console.log('Database connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});