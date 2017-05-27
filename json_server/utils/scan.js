const http = require('http');
const Promise = require('bluebird');
const arpscan = require('arpscan');
const nodeArp = require('node-arp');

const request = require('./request');

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

function getMac(ip) {
  return new Promise((resolve, reject) => {
    nodeArp.getMac(ip, (err, mac) => {
      if (err) return reject(err);

      resolve(mac);
    });
  });
}

function scan() {
  const unitsList = [];
  const requestsList = [];
  let i = ipMin - 1;

  while (++i < ipMax) {
    options.host = ipPrefix + i;

    const ip = options.host;

    const req = request(options, responseTimeout)
      .then(res => {
        const headers = res.headers;

        if (headers.hasOwnProperty(unitHeader)) {
          return Promise.all([ Promise.resolve(ip), getMac(ip) ]);
        } else {
          return Promise.resolve(null);
        }
      })
      .then(res => {
        if (!res) return;

        unitsList.push({
          ip: res[0],
          mac: res[1]
        });
      })
      .catch(err => {});

    requestsList.push(req);
  }

  // const arpScan = arpscan((err, data) => {
  //   if (err) console.error('Error: ', err);

  //   console.log('Data: ', data);
  // }, { sudo: true });

 // requestsList.push(arpScan);

  return Promise.all(requestsList).then(() => {
    return unitsList;
  });
}

module.exports = scan;