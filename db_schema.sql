--This is db_Schema.sql
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_accounts (
    email_account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_address TEXT NOT NULL,
    user_id  INT, --the user that the email account belongs to
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert default data (if necessary here)

-- Set up three users
INSERT INTO users ('user_name') VALUES ('Simon Star');
INSERT INTO users ('user_name') VALUES ('Dianne Dean');
INSERT INTO users ('user_name') VALUES ('Harry Hilbert');

-- Give Simon two email addresses and Diane one, but Harry has none
INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@gmail.com', 1); 
INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('simon@hotmail.com', 1); 
INSERT INTO email_accounts ('email_address', 'user_id') VALUES ('dianne@yahoo.co.uk', 2); 

-- I wrote this code
--Creates the Authors table
CREATE TABLE IF NOT EXISTS authors (
    authors_id INTEGER PRIMARY KEY AUTOINCREMENT,
    authorsName TEXT,
    blogTitle TEXT,
    author_email TEXT NOT NULL,
    author_password TEXT NOT NULL
);

-- Creates the Articles table
CREATE TABLE IF NOT EXISTS articles (
    articles_id INTEGER PRIMARY KEY,
    articles_title TEXT NOT NULL,
    articles_content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME,
    published_at DATETIME,
    likes INTEGER DEFAULT 0,
    reads INTEGER DEFAULT 0,
    author_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES authors(authors_id)
);

-- Creates the comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER,
    comment_name TEXT NOT NULL,
    comment_content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(articles_id)
);

-- Insert data into the Authors table
INSERT INTO authors (authorsName, blogTitle, author_email, author_password)
VALUES
    ('Simon K', 'Adventure In Code', 'simonk@gmail.com', 'Password1'),
    ('Dianne D', 'Coding Journey', 'dianned@yahoo.com', 'Password2'),
    ('Harry H', 'Tech Explorations', 'harryh@hotmail.com', 'Password3');


-- Insert data into the Articles table
INSERT INTO articles (articles_title, articles_content, created_at, author_id) 
VALUES 
    ('Introduction to SQL', 'This is an introductory article about SQL.', '2023-01-01 12:00:00', 1),
    ('Advanced Python Programming', 'Exploring advanced Python concepts and techniques.', '2023-02-15 14:30:00', 2),
    ('Web Development with JavaScript', 'Building dynamic web applications using JavaScript.', '2023-03-10 10:45:00', 1);

-- End of my code

COMMIT;
