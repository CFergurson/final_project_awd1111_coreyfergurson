const express = require('express');
const debug = require('debug')('app:routes:group');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  res.render('home', { title: 'Home'});
  
  // db.getAllGroups()
  //   .then((results) => {
  //     res.render('home', { title: 'Home', groups: results });
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
  // try {
  //   const sortBy = req.query.sortBy;
  //   const search = req.query.search;

  //   const sortByOptionList = {
  //     selected: sortBy || '',
  //     options: [
  //       { value: 'name asc', text: 'A-Z' },
  //       { value: 'name desc', text: 'Z-A' },
  //       { value: 'member_count asc', text: '# of Members Ascending' },
  //       { value: 'member_count desc', text: '# of Members Descending' },
  //     ],
  //   };

  //   let query = db.getAllGroups();

  //   if (search) {
  //     query = query.whereRaw('MATCH (name) AGAINST (? IN NATURAL LANGUAGE MODE)', [search]);
  //   } else if (sortBy) {
  //     query = query.orderBy(...sortBy.split(' '));
  //   } else {
  //     query = query.orderBy('name');
  //   }
  //   const groups = await query;
  //   res.render('home', { title: 'Home', groups, sortByOptionList, search });
  // } catch (err) {
  //   next(err);
  // }
});

router.get('/add', (req, res, next) => {
  res.render('add-group', { title: 'Add Group' });
});

router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const group = await db.findGroupById(id);

    if (group) {
      res.render('edit-group', { title: 'Edit Group', group });
    } else {
      res.status(404).type('text/plain').send('group not found');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/delete/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const group = await db.findGroupById(id);

    if (group) {
      res.render('delete', { title: 'Delete Group', group });
    } else {
      res.status(404).type('text/plain').send('group not found');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  debug('pulling view of group')
  try {
    const id = req.params.id;
    debug(id);
    const group = await db.findGroupById(id);
    
    const posts = await db.findPostsByGroupId(group._id);
  debug(posts);
    res.render('group', {title: 'Group', group, posts})
  } catch (err) {
    next(err);
  }
});

router.get('/:group_id', (req, res, next) => {
  const group_id = req.params.group_id;
  db.findPostsByGroupId(group_id)
    .then((posts) => {
      res.render('group', { title: 'Group', posts });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
