##  Coursework Template ##
### CM2040 Database Networks and the Web ###

What I had to use:-

* NodeJS 
    - follow the install instructions at https://nodejs.org/en/
    - we recommend using the latest LTS version
* Sqlite3 
    - follow the instructions at https://www.tutorialspoint.com/sqlite/sqlite_installation.htm 
    - Note that the latest versions of the Mac OS and Linux come with SQLite pre-installed

* ejs
    - Used this to create pages.

Additional libraries :
* express-session
    - I used this to validate the email address and password for login and register page.

* joi
    - When creating password should be minimum 8 characters with at least one number and capital letter and should be a string.

* Run ```npm install``` from the project directory to install all the node packages.
* Run ``` npm run build-db-win``` builds the schema on windows
* Run ```npm run build-db``` to create the database on Mac or Linux 
* Run ```npm run start``` to start serving the web app (Access via http://localhost:3000)


Browsing to the following routes:

* http://localhost:3000
* http://localhost:3000/users/list-users
* http://localhost:3000/users/add-user
* http://localhost:3000/author/home
* http://localhost:3000/reader/home
* http://localhost:3000/login
* http://localhost:3000/register

To login where it goes to the author routes page:
* Your Email : simonk@gmail.com
* Password : Password1 
