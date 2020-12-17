const db = require('../db');
const express = require('express');
const debug = require('debug')('app:api:login');
const joi = require('joi');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const sendError = (err, res) => {
  debug(err);
  if (err.isjoi) {
    res.json({ error: err.details.map((x) => x.message).join('\n') });
  } else {
    res.json({ error: err.message });
  }
};


router.post('/', async (req, res, next) => {
  debug('Trying to login in');
  try{

    const username = req.body.username;
    const password = req.body.password;
     result = '';
    debug(username + ' username');
    let accepted = false;
    if(!username || !password){
      result = "Invalid Username or password."
    }else{
      const user = await db.findUserByUsername(username);
      debug(user);
      if(user.username == username){
  
        const result = await bcrypt.compare(password, user.password);
        debug(password);
        debug(user.password);
        debug(result);
          if(result){
            accepted = true;
            debug('Form submitted'.green);
            res.redirect('/home');
          }else{
            result = "Invalid username or password";
            debug('Form is not submitted'.red);
          res.json(result);
          }
          
        
        // if(user.password == password){
        //   debug('Form submitted'.green);
        //   res.redirect('/group');
        // }else{
        //   debug('Form is not submitted'.red);
        //   res.redirect('/login');
        // }
      }else if(accepted == false){
        result = "invalid username or password";
        debug('No user'.red);
        res.json(result);
      }else{
        result = "Invalid username or password";
        res.json(result);
      }
    }
  
  }catch(err){
 sendError(err, res);
  }
  
  
  
  

});

module.exports = router;