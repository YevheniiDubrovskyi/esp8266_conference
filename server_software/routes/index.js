const express = require('express');
const bodyParser = require('body-parser');
const Unit = require('../models/unit');

const router = express.Router();
const jsonParser = bodyParser.json();

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
  Unit.findById({id: req.params.id})
    .exec()
    .then((unit) => {
      return res.render('chart', unit);
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/', (req, res) => {
  Unit.find({})
    .limit()
    .then((units) => {
      res.render('main', { unitList: units });
    })
    .catch((err) => {
      console.log(err);
    })
});