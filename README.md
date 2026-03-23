# Express-Middleware-Performance-Logger

Installation instructions

1. Run npm install 'Express-middleware-performance-logger'

2. Import performanceLogger and errorLogger from package in express server

3. Call app.use(performanceLogger/errorLogger) 

Performance logger configuration options

The performanceLogger comes with 3 different logging options, minimal, standard, verbose. 
These options dictate how much request/response information is logged.

You can choose which of these options you want to use by passing in the option as a second argument
Example:

app.use(perfomanceLogger({mode:"minimal"})) will output request method and server response time only

app.use(perfomanceLogger({mode:"standard"})) will ouput the same information, as well as params, status code, and the URL

app.use(perfomanceLogger({mode:"versbose"})) will output all request response information

