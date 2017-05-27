const express = require('express');
const bodyParser = require('body-parser');

const { scan, request } = require('../utils');

const ipListMock = require('../mocks/ip-list.mock');

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/scan', (req, res) => {
  setTimeout(() => {
    res.status(200)
       .json(ipListMock);
   }, 2000);

  // scan().then(ipList => {
  //   res.status(200)
  //      .json({ ipList });
  // })
});

router.post('/unit', jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const { ip, path } = req.body;
  request({
    host: ip,
    path,
    method: 'GET',
    port: '80',
  }, 2000)
    .then(unitData => {
      res.status(200)
         .json(unitData);
    })
    .catch(err => {
      res.status(500)
         .json(err);
    });
});

module.exports = router;