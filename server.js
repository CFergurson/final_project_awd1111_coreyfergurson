require('dotenv').config();

const debug = require('debug')('app:startup');
const express = require('express');
const hbs = require('express-handlebars');
const config = require('config');
const db = require('./db');
const colors = require('colors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { join } = require('lodash');
const joi = require('joi');
//const router = require('./routes/group');

const app = express();
app.engine('handlebars', hbs({
  helpers: {
    not: (value) => !value,
    eq: (a, b) => a == b,
    or: (a, b) => a || b,
    and: (a, b) => a && b,
    tern: (condition, a, b) => (condition ? a : b), 
  },
}));
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(cookieParser());
joi.objectId = require('joi-objectid')(joi);

const sendError = (err, res) => {
  debug(err);
  if(err.isJoi){
    res.json({error: err.details.map((x) => x.message).join('\n') });
  }else{
    res.json({error: err.message});
  }
}


app.get('/', (req, res) => res.render('intro'));
app.use('/account', require('./routes/account'));
app.use('/api/account', require('./api/account'));
app.get('/login', (req, res) => {
  res.render('login', {Title: 'Login'});
});
app.get('/home', (req, res) => {
  res.render('home', {Title: 'Home'});
});


// const data = {
  //   title: 'Login Form', 
  //   loginForm: {
  //     isValid: true,
  //     username,
  //     password,
  //   },
  // };
  // if(!username || username != 'admin') {
  //   data.loginForm.isValid = false;
  //   debug(`Invalid Username`.red);
  // }else{
  //   debug(`Username: ${username}`.green)
  // }
  // if(!password || password != 'password') {
  //   data.loginForm.isValid = false;
  //   debug(`Invalid Password`.red);
  // }else{
  //   debug(`Password : ${password}`.green)
  // }
  // if(data.loginForm.isValid == true) {
  //   debug('Form submitted'.green);
  //   res.redirect('/group');
  // }else{
  //   debug('Form is not submitted'.green);
  //   res.render('login', data.loginForm);
  // }




app.use('/group', require('./routes/group'));
app.use('/api/group', require('./api/group'));
app.use('/post', require('./routes/post'));
app.use('/api/post', require('./api/post'));
app.use('/', express.static('public'));
app.use(require('./middleware/error404'));
app.use(require('./middleware/error500'));


const hostname = config.get('http.hostname');
const port = config.get('http.port');
app.listen(port, () => {
  debug(`Server is listening on http://${hostname}:${port}/`);
});
