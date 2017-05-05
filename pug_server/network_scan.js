const http = require('http');
const Promise = require('bluebird');

const ipPrefix = '192.168.0.';
const ipMin = 0;
const ipMax = 255;
const unitHeader = 'unit-type';
const responseTimeout = 5000;
const options = {
  host: null,
  path: '/',
  method: 'GET',
  port: '80'
};

function request(options) {
  return new Promise(function(resolve, reject) {
    const req = http.request(options, resolve).on('error', reject);
    req.end();

    setTimeout(reject, responseTimeout);
  });
}

function scan() {
  const unitsList = [];
  const requestsList = [];
  let i = ipMin - 1;

  while (++i < ipMax) {
    options.host = ipPrefix + i;

    const ip = options.host;

    const req = request(options)
      .then((res) => {
        const headers = res.headers;

        if (headers.hasOwnProperty(unitHeader)) {
          unitsList.push(ip);
        }
      })
      .catch((err) => {});

    requestsList.push(req);
  }

  return Promise.all(requestsList).then(() => {
    return unitsList;
  });
}

module.exports = scan;