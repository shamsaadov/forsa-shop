-- Create user if not exists and grant privileges
CREATE USER IF NOT EXISTS 'forsa'@'%' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON forsa.* TO 'forsa'@'%';
FLUSH PRIVILEGES; 