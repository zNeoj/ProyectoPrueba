CREATE TABLE IF NOT EXISTS your_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO your_table (name, description) VALUES 
('Item 1', 'Description for item 1'),
('Item 2', 'Description for item 2'),
('Item 3', 'Description for item 3');