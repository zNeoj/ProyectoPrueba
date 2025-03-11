const mysql = require('mysql2');

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
      console.log('Connected to MySQL database!!');
      
      // Set up events only once we have a successful connection
      setupConnectionEvents();
      
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
  
// Initiate connection attempt
connectWithRetry();

module.exports = connection;