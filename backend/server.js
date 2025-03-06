const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Print the environment variables for debugging
console.log('host:', process.env.DB_HOST);
console.log('user:', process.env.DB_USER);
console.log('password:', process.env.DB_PASSWORD);
console.log('database:', process.env.DB_NAME);

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

let connection;

// Function to connect to the database with retries
function connectWithRetry() {
  console.log('Attempting to connect to MySQL...');
  
  // If there's an existing connection attempt, end it
  if (connection) {
    try {
      connection.end();
    } catch (err) {
      console.log('Error ending previous connection:', err.message);
    }
  }
  
  connection = mysql.createConnection(dbConfig);
  
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to database:', err);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
      return;
    }
    console.log('Connected to MySQL database!');
    
    // Set up events only once we have a successful connection
    setupConnectionEvents();
    
    // Only set up your API routes once connected
    setupApiRoutes();
  });
}

function setupConnectionEvents() {
  connection.on('error', err => {
    console.error('Database connection error:', err);
    
    // Don't throw errors, handle them gracefully
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || 
        err.code === 'ECONNREFUSED' ||
        err.fatal) {
      console.log('Database connection lost or refused. Reconnecting...');
      setTimeout(connectWithRetry, 5000);
    }
  });
}

// Set up the API routes
function setupApiRoutes() {
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
  });

  app.get('/api/data', (req, res) => {
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

// Initiate connection attempt
connectWithRetry();