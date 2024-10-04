@echo off

echo Activating virtual environment...
cd Z:\ReactJS\ChatDB\.venv\Scripts
call activate

echo Virtual environment activated.

echo Installing necessary Python packages...
cd Z:\ReactJS\ChatDB
pip install -r requirements.txt

echo Necessary Python packages installed.

echo Starting the Python model...
start cmd /k python text_to_sql.py

echo Python model started.

echo Now starting Node.js backend...
cd Z:\ReactJS\ChatDB\WebInterface

rem Start the Node.js server in a new command window and return control to the batch file
start cmd /k node server.js

echo Node.js backend started.

echo Now starting React frontend...
cd Z:\ReactJS\ChatDB\WebInterface
npm start

echo All processes are running. Press Ctrl+C to stop.
pause