const express = require('express');
let { accounts, users, writeJSON } = require('../data');

const router = express.Router();

router.get('/transfer', (req, res) => {
  res.render('transfer');
});

router.post('/transfer', (req, res) => {
  const amount = parseInt(req.body.amount, 10);
  const from = req.body.from;
  const to = req.body.to;

  accounts[from].balance -= amount;
  accounts[to].balance += amount;

  writeJSON();

  res.render('transfer', { message: 'Transfer Completed' });
});

router.get('/payment', (req, res) =>{
  res.render('payment', { account: accounts.credit });
});

router.post('/payment', (req, res) => {
  let amount = parseInt(req.body.amount, 10);

  accounts.credit.balance -= amount;
  accounts.credit.available += amount;

  writeJSON();

  res.render('payment', { message: 'Payment Successful', account: accounts.credit });
});

module.exports = router;