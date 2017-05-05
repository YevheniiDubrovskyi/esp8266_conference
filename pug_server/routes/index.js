const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const Unit = require('../models/unit');
const scan = require('../network_scan');
const ws = require('express-ws')(express)

const router = express.Router();
const jsonParser = bodyParser.json();

const responseTimeout = 5000;
const options = {
  host: null,
  path: null,
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

// router.ws('/data/:id', (ws, req) => {
//   console.log(req.params.id);
//   setInterval(() => {
//     Unit.findById({_id: req.params.id})
//       .exec()
//       .then((unit) => {
//         options.host = unit.ip;
//         options.path = unit.data;

//         return request(options)
//           .then((innerResponse) => {
//             console.log(innerResponse.response.match(unit.regExp)[0]);
//             ws.send(innerResponse.response.match(unit.regExp)[0]);
//           });
//       });
      
//   }, 10000);
// });

router.get('/edit/:id', (req, res) => {
  Unit.findById({id: req.params.id})
    .exec()
    .then((unit) => {
      return res.render('edit', unit);
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/chart/:id', (req, res) => {
  Unit.findById({_id: req.params.id})
    .exec()
    .then((unit) => {
      return res.render('chart', {unit: unit});
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/scan', (req, res) => {
  scan()
    .then((ipList) => {
      res.end(JSON.stringify(ipList));
    });
});

router.route('/add')
  .get((req, res) => {
    return res.render('add');
  })
  .post(jsonParser, (req, res) => {
    const unitRaw = req.body;

    options.host = req.body.ip;
    options.path = '/';

    request(options)
      .then((innerResponse) => {
        unitRaw.unitType = innerResponse.headers['unit-type'];

        const unit = new Unit(unitRaw);

        unit.save((err) => {
          console.log(err);
        });
      })
      .catch((err) => {});
  });

router.get('/test/:ip/:path?', (req, res) => {
  options.host = req.params.ip;
  options.path = '/' + req.params.path;

  request(options)
    .then((innerResponse) => {
      let data = '';

      innerResponse.setEncoding('utf8');
      innerResponse.on('data', (chunk) => {
        data += chunk;
      });

      innerResponse.on('end', () => {
        res.end(data);
      });
    })
    .catch((err) => {});
});

router.get('/', (req, res) => {
  Unit.find({})
    .limit()
    .then((unitsList) => {
      res.render('main', {
        unitsList: unitsList
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;