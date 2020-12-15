const db = require('../db');
const express = require('express');
const debug = require('debug')('app:api:group');
const joi = require('joi');

const router = express.Router();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const sendError = (err, res) => {
  debug(err);
  if(err.isJoi){
    res.json({error: err.details.map((x) => x.message).join('\n') });
  }else{
    res.json({error: err.message});
  }
}
router.get('/', async (req, res, next) => {
  debug('got all groups');
  try{
    const collation = { locale: 'en_US', strength: 1 };
    const search = req.query.search;
    const sortBy = req.query.sortBy;
    // const member_count = req.query.member_count;
    // const description = req.query.description;

    const matchStage = {};
    if(search){
      matchStage.$text = {$search: search};
    }
    // if(description){
    //   matchStage.description = {$eq: description};
    // }
    // if(member_count){
    //   matchStage.member_count = {$eq: member_count};
    // }
  let sortStage = null;
  switch(sortBy){
    case 'name':
      sortStage = {name: 1};
      break;
   case 'name desc':
     sortStage = {name: -1};
     break;
    case 'member_count':
      sortStage = {member_count: 1};
      break;
      case 'member_count desc':
      sortStage = {member_count: -1};
      break;
    default: 
    sortStage = search ? {relevance: -1} : {name: 1};
    break;
  }
    const pipeline = [
      {$match: matchStage},
      {
        $project: {
          name: 1,
          description: 1,
          member_count: 1,
          relevance: search ? {$meta: 'textScore'} : null, 
        },
      },
      {$sort: sortStage},
    ];
    const conn = await db.connect();
    const cursor = conn.collection('groups').aggregate(pipeline, {collation: collation});

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
router.get('/id/:group_id', async (req, res, next) => {
  debug('find by id');
  try {
    const id = req.params.group_id;
    const group = await db.findPostsByGroupId(id);
    res.json(group);
  } catch (err) {
    next(err);
  }
});
router.get('/id/:id', async (req, res, next) => {
  debug('find the group by id')
  try{
    const schema = joi.number().min(1).required();
    const id = await schema.validateAsync(req.params.id);
    const group = await db.findGroupById(id);
    res.json(group);
  }catch(err){
    //next(err, res);
    sendError(err, res);
  }
});
router.post('/', async (req, res, next) => {
  debug('insert group');
  try {
    const schema = joi.object({
      name: joi.string().required().min(3).max(100).trim(),
      description: joi.string().required().min(1).max(100).trim(),
      memberCount: joi.number().required().min(0).max(9999),
    });
    const group = await schema.validateAsync(req.body);
    const result = await db.insertGroup(group);
    res.json(result);
  }catch(err){
    //next(err)
   sendError(err, res);
  }
});
router.put('/:id', async (req, res, next) => {
  debug('update group');
  try{
    const schema = joi.object({
      id: joi.number().min(1).required(),
      name: joi.string().required().min(3).max(100).trim(),
      description: joi.string().required().min(3).max(100).trim(),
      member_count: joi.number().required().min(0).max(9999)
    });
    let group = req.body;
    group.id = req.params.id;
    group = await schema.validateAsync(group);
    debug(group);
    const result = await db.updateGroup(group);
    debug(`result: ${result}`);
    res.json(result);
  }catch(err){
    sendError(err, res);
  }
});
router.delete('/:id', async(req, res, next) => {
  debug('delete group');
  try{
    const schema = joi.number().min(1).required();
    const id = await schema.validateAsync(req.params.id);
    const result = await db.deleteGroup(id);
    res.json(result);
  }catch(err){
    sendError(err, res);
  }
});

module.exports = router;

