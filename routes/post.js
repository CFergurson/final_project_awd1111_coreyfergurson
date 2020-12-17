const express = require('express');
const debug = require('debug')('app:routes:group');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  res.render('posts', { title: 'Posts'});
});
router.get('/add', (req, res, next) => {
  res.render('add-post', { title: 'Add Post' });
});

router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await db.findPostById(id);

    if (post) {
      res.render('edit-post', { title: 'Edit post', post });
    } else {
      res.status(404).type('text/plain').send('post not found');
    }
  } catch (err) {
    next(err);
  }
});
router.get('/delete/:id', async (req, res, next) => {
  try{
    const id = req.params.id;
    const post = await db.findPostById(id);
    
    if(post){
      res.render('delete-post', {title: 'Delete Post', post});
    }else{
      res.status(404).type('text/plain').send('post not found')
    }
  }catch(err){
    next(err);
  }
});
module.exports = router;