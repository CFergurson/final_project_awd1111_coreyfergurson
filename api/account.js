const db = require('../db');
const express = require('express');
const debug = require('debug')('app:api:account');
const joi = require('joi');

const router = express.Router();
router.use(express.urlencoded({extended: false}));
router.use(express.json());

const sendError = (err, res) => {
  debug(err);
  if(err.isJoi){
    res.json({error: err.details.map((x) => x.message).join('\n')});
  }else{
    res.json({error: err.message});
  }
}

router.get('/', async (req, res, next) => {
  debug('got all users');
 try{
   const collation = {locale: 'en_US', strength: 1};
   const search = req.query.search;
   const sortBy = req.query.sortBy;

   const matchStage = {};
   if(search){
     matchStage.$text = {$search: search};
   }
   let sortStage = null
   switch(sortBy){
     case 'username':
       sortStage = {username: 1};
       break;
      case 'username desc': 
      sortStage = {username: -1};
      break;
      default:
        sortStage = search ? {relevance: -1} : {username: 1};
        break;
   }
   const pipeline = [
     {$match: matchStage},
     {
       $project: {
         username: 1,
         bio: 1,
         email: 1,
         relevance: search ? {$meta: 'textScore'} : null,
       },
     },
     {$sort: sortStage},
   ];
   const conn = await db.connect();
   const cursor = conn.collection('users').aggregate(pipeline, {collation: collation});
   res.type('application/json');
   res.write('[\n');
   for await (const doc of cursor){
     res.write(JSON.stringify(doc));
     res.write(',\n');
   }
   res.end('null]');
 }catch (err){
   next(err);
 }
});
// router.get('id/:id')

router.post('/', async(req, res, next) => {
  debug('insert user');
  try{
    const schema = joi.object({
      username: joi.string().required().min(1).max(100).trim(),
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    const user = await schema.validateAsync(req.body);
    const result = await db.insertUser(user);
    res.json(result);
  }catch(err){
    sendError(err, res);
  }
});

router.put('/:id', async (req, res, next) => {
  debug('update user');
  try{
    const schema = joi.object({
      id: joi.number().min(1).required(),
      username: joi.string().required().min(1).max(100).trim(),
      email: joi.string().email().required(),
      bio: joi.string().required().min(1).max(200),
    });
    let user = req.body;
    user.id = req.params.id;
    user = await schema.validateAsync(user);
    debug(user);
    const result = await db.updateUser(user);
    debug(`results ${result}`);
    res.json(result);
  }catch(err){
    sendError(err, res);
  }
});

router.delete('/:id', async(req, res, next) => {
  debug('delete user');
  try{
    const schema = joi.number().min(1).required();
    const id = await schema.validateAsync(req.params.id);
    const result = await db.deleteUser(id);
    res.json(result);
  }catch(err){
    sendError(err, res);
  }
});
module.exports = router;