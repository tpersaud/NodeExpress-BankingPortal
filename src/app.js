const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const accountData = fs.readFileSync(
  path.join(__dirname, 'json', 'accounts.json'), 'UTF8'
);
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync(
  path.join(__dirname, 'json', 'users.json'), 'UTF8'
);

const users = JSON.parse(userData);

app.get('/', (req, res) => {
  res.render('index', { title: 'Account Summary', accounts });
});

app.get('/savings', (req, res) => {
  res.render('account', { account: accounts.savings })
});

app.get('/checking', (req, res) => {
  res.render('account', { account: accounts.checking })
});

app.get('/credit', (req, res) => {
  res.render('account', { account: accounts.credit })
});

app.get('/profile', (req, res) => {
  res.render('profile', { user: users[0]});
});

app.get('/transfer', (req, res) => {
  res.render('transfer');
});

app.post('/transfer', (req, res) => {
  const amount = parseInt(req.body.amount, 10);
  const from = req.body.from;
  const to = req.body.to;

  accounts[from].balance -= amount;
  accounts[to].balance += amount;

  const accountsJSON = JSON.stringify(accounts, null, 4);

  fs.writeFileSync(
    path.join(__dirname, 'json', 'accounts.json'),
    accountsJSON,
    'UTF8'
  );

  res.render('transfer', { message: 'Transfer Completed' });
});

app.get('/payment', (req, res) =>{
  res.render('payment', { account: accounts.credit });
});

app.post('/payment', (req, res) => {
  let amount = parseInt(req.body.amount, 10);

  accounts.credit.balance -= amount;
  accounts.credit.available += amount;

  const accountsJSON = JSON.stringify(accounts, null, 4);

  fs.writeFileSync(
    path.join(__dirname, 'json', 'accounts.json'),
    accountsJSON,
    'UTF8'
  );

  res.render('payment', { message: 'Payment Successful', accounts: accounts.credit });
});

app.listen(3000, () => console.log('PS Project Running on port 3000!'));