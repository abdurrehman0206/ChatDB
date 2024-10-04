@echo off

echo Activating virtual environment...
cd E:\Coding\Pablo\Chat with SQL\.venv\Scripts
call activate

echo Virtual environment activated. Starting the Python model...
cd E:\Coding\Pablo\Chat with SQL

rem Start the Python model in a new command window and return control to the batch file
start cmd /k python text_to_sql.py

echo Python model started.

echo Now starting Node.js backend...
cd E:\Coding\Pablo\Chat with SQL\sql-chat

rem Start the Node.js server in a new command window and return control to the batch file
start cmd /k node server.js

echo Node.js backend started.

echo Now starting React frontend...
cd E:\Coding\Pablo\Chat with SQL\sql-chat
npm start

echo All processes are running. Press Ctrl+C to stop.
pause


