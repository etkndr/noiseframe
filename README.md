<h1 align="center">noiseframe - sample sequencer</h1>
<p>
  <a href="https://github.com/etkndr/noiseframe/wiki" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>

> [noiseframe](https://noiseframe.onrender.com/) is a tool for sketching out quick musical ideas from user-uploaded sample files. Created, developed, and maintained by Eric Kinder*, noiseframe is continuing to be added to and expanded upon. Check back periodically for new features.


* Huge thanks to [Kaho Cheung](https://github.com/unkleho) for his [Reactronica](https://reactronica.com) package, which integrates Tone.js with React

## Technologies Used

noiseframe was built using the following technologies:

- Python
- Flask
- SQLAlchemy/Alembic
- WTForms
- JavaScript
- React
- Redux

### 🏠 [Homepage](https://onrender.onrender.com/home)

## Installation

### Initial Configuration
#### Flask

1. Clone repository
    ```bash
    https://github.com/etkndr/noiseframe.git
    ```

2. Install dependencies
    ```bash
    pipenv install -r requirements.txt
    ```

3. Create a **.env** file based on the example with proper settings for your
   development environment
    - Make sure the SQLite3 database connection URL is in the **.env** file
    - The env example organizes all tables inside the `flask_schema` schema, defined
        by the `SCHEMA` environment variable.  Replace the value for
        `SCHEMA` with a unique name, **making sure you use the snake_case
        convention**.
    <br></br>

4. Start shell, migrate and seed your database, and run Flask app

   ```bash
   pipenv shell
   ```
   and then
   ```bash
   flask db upgrade &&
   flask seed all &&
   flask run
   ```

5. Now that you have your backend Flask server running. You need to run the React App in development in a different terminal instance.

#### React
1. In a new terminal, open the react directory
    ```bash
    cd react-app
    ```

2. Install all your dependencies before starting the application.
    ```bash
    npm install &&
    npm start
    ```

3. At this point, the application should be up and running, and will be available in your web browser at http://localhost:3000/

![image](https://github.com/etkndr/noiseframe/assets/103692901/de55040c-2660-4b0d-adc2-17869b05be41)

![image](https://github.com/etkndr/noiseframe/assets/103692901/0c3b79e0-ce39-4fb9-8a55-feaa9b161a79)

![image](https://github.com/etkndr/noiseframe/assets/103692901/2f0ab110-210f-4c88-a21a-fbd47bc0e2cc)



