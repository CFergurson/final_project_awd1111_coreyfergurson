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
  debug('got all posts');
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
    case 'title':
      sortStage = {title: 1};
      break;
   case 'title desc':
     sortStage = {title: -1};
     break;
    default: 
    sortStage = search ? {relevance: -1} : {title: 1};
    break;
  }
    const pipeline = [
      {$match: matchStage},
      {
        $project: {
          // name: 1,
          // description: 1,
          // member_count: 1,
          title: 1,
          body: 1,
          relevance: search ? {$meta: 'textScore'} : null, 
        },
      },
      {$sort: sortStage},
    ];
    const conn = await db.connect();
    const cursor = conn.collection('posts').aggregate(pipeline, {collation: collation});

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
router.post('/', async (req, res, next) => {
  debug('insert post');
 
  try {
    const schema = joi.object({
      title: joi.string().required().min(1).max(100).trim(),
      body: joi.string().required().min(1).max(100).trim(),
    });
    
    
    post = await schema.validateAsync(req.body);
    
    const result = await db.insertPost(post);
    debug(result);
    res.json(result);
    // debug(group.memberCount);
    // if(!post.title){
    //   error = "Please enter a valid title";
    //   if(error){
    //     res.render('add-post', {title: "Posts", post ,error: error});
    //   }else{
    //     await db.insertPost(post);
    //     res.render('posts');
    //   }
    // }
    
    
  }catch(err){
    // next(err)
    sendError(err, res);
   
  }
});
router.post('/:id', async (req, res, next) => {
  debug('update post');
  try{
    const schema = joi.object({
      _id: joi.objectId().required(),
      // id: joi.number().min(1).required(),
      title: joi.string().required().min(3).max(100).trim(),
      body: joi.string().required().min(3).max(100).trim()
      
    });
    // let group = req.body;
    // group.id = req.params.id;
    post = await schema.validateAsync(req.body);
    debug(post);
  const result = await db.updatePost(post);
    // debug(`result: ${result}`);
    res.json(result)
  }catch(err){
    sendError(err, res);
  }
});
router.post('/delete/:id', async(req, res, next) => {
  debug('delete post');

  try{
    const schema = joi.objectId().required();
    const id = await schema.validateAsync(req.params.id);
    debug(id);
    await db.deletePost(id);
    res.render('posts');
  }catch(err){
    sendError(err, res);
  }
});

module.exports = router;