const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const debug = require('debug')('app:routes:account');

const router = express.Router();
router.use(express.urlencoded({extended: false}));

router.get('/', async (req, res, next) => {
  res.render('users', {title: 'User List'});
  // try{
  //   const sortBy = req.query.sortBy;
  //   const search = req.query.search;

  //   const sortByOptionList = {
  //     selected: sortBy || '',
  //     options: [
  //       {value: 'username asc', text: 'Username A-Z'},
  //       {value: 'username desc', text: 'Username Z-A'},
  //       {value: 'email asc', text: 'Email A-Z'},
  //       {value: 'email desc', text: 'Email Z-A'},
  //     ],
  //   };

  //   let query = db.getAllUsers();

  //   if(search) {
  //     query = query.whereRaw('MATCH (username) AGAINST (? IN NATURAL LANGUAGE MODE)', [search]);
  //   }else if(sortBy){
  //     query = query.orderBy(...sortBy.split(' '));
  //   }else{
  //     query = query.orderBy('username');
  //   }
  //   const users = await query;
  //   res.render('users', {title: 'User List', users, sortByOptionList, search});
  // }catch(err){
  //   next(err);
  // }
});
router.get('/add', (req, res, next) => {
  res.render('add-user', {title: 'Add User'});
})
router.get('/edit/:id', async (req, res, next) => {
  try{
    const id = req.params.id;
    const user = await db.findUserById(id);
    
    if(user){
      res.render('edit-user', {title: 'Edit User', user});
    }else{
      res.status(404).type('text/plain').send('user not found')
    }
  }catch(err){
    next(err);
  }
});
router.get('/:id', async (req, res, next) => {
  debug('pulling view of user')
  
  try{
    const id = req.params.id;
  const user = await db.findUserById(id);
  debug(user);
    if(user){
      res.render('view-user', {title: 'User', user});
    }else{
      res.status(404).type('text/plain').send('user not found');
    }
  }catch(err){
    next(err);
  }
})

module.exports = router;