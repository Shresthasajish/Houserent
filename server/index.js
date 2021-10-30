/*******************************************************
 *      Server Starts From Here                        *
 *******************************************************/
'use strict';

const http = require('http');
const app = require('./app');
const port = 4040;
const env = 'Development';
const app_name = 'RentNHire Server';
const server = http.createServer(app);

app.set('PORT_NUMBER', port);

//  Start the app on the specific interface (and port).
server.listen(port, () => {
  const data = new Date();
  console.log('|--------------------------------------------');
  console.log('| Server       : ' + app_name);
  console.log('| Environment  : ' + env);
  console.log('| Port         : ' + port);
  console.log(
    '| Date         : ' +
    data
      .toJSON()
      .split('T')
      .join(' '),
  );
  console.log('|--------------------------------------------');
  console.log('| Waiting For Database Connection ');
});


process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
