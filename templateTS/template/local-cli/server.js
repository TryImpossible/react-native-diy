/* eslint-disable no-console */
const http = require('http');
const logger = require('./logger');

const hostName = '192.168.192.247';
const port = 9090;
const server = http.createServer((req, res) => {
  req.setEncoding('utf-8');
  res.setHeader('Content-Type', 'text/plain');
  res.end(JSON.stringify({ code: 0, message: 'success', data: {} }));
  logger.info(req.method);
  if (req.method === 'GET') {
    console.log('get', req.url);
  } else if (req.method === 'POST') {
    req.addListener('data', (data) => {
      console.log('post', data);
    });
  }
});

server.listen(port, hostName, () => {
  logger.info(`local-server is running at http//${hostName}:${port}`);
});
