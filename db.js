const debug = require('debug')('app:db');
const config = require('config');
const {MongoClient, ObjectID} = require('mongodb');

let _database = null;

const connect = async () => {
  if(!_database){
    const dbUrl = config.get('db.url');
    const dbName = config.get('db.name');
    const poolSize = config.get('db.poolSize');
    const client = await MongoClient.connect(dbUrl, {
      useUnifiedTopology: true,
      poolSize: poolSize,
    });
    _database = client.db(dbName);
  }
  return _database;
}



const getAllGroups = async () => {
  const database = await connect();
  return database.collection('groups').find({}).toArray();
};

const findPostsByGroupId = async (group_id) => {
  const database = await connect();
  return database.collection('posts').find({group_id: group_id}).toArray();
}
const findGroupById = async (id) => {
  const database = await connect();
  return database.collection('groups').findOne({_id: new ObjectID(id)});
}
const insertGroup = async (group) => {
  const database = await connect();
  return database.collection('groups').insertOne(group);
}
const updateGroup = async (group) => {
  const database = await connect();
  return database.collection('groups').updateOne(
    {_id: new ObjectID(group._id)},
    {
      $set: {
        name: group.name,
        description: group.description,
        member_count: group.memberCount
      },
  });
};
const deleteGroup = async (id) => {
  const database = await connect();
  return database.collection('groups').deleteOne({_id: new ObjectID(id)});
};

const findUserByUsername = async (username) => {
  const database = await connect();
  return database.collection('users').findOne({username: username});
};
const findUserById = async (id) => {
  const database = await connect();
  return database.collection('users').findOne({_id: new ObjectID(id)});
}
const getAllUsers = async () => {
  const database = await connect();
  return database.collection('users').find({}).toArray();
};
const insertUser = async (user) => {
  const database = await connect();
  return database.collection('users').insertOne(user);
};
const updateUser = async (user) => {
  const database = await connect();
  return database.collection('users').updateOne(
    {_id: new ObjectID(user._id) }, 
  {
  $set: {
    username: user.username,
    email: user.email,
    bio: user.bio,
}
   
  });
};
const deleteUser = async (id) => {
  const database = await connect();
  return database.collections('users').deleteOne({_id: new ObjectID(id)});
}


module.exports.getAllGroups = getAllGroups;
module.exports.findPostsByGroupId = findPostsByGroupId;
module.exports.findGroupById = findGroupById;
module.exports.insertGroup = insertGroup;
module.exports.updateGroup = updateGroup;
module.exports.deleteGroup = deleteGroup;
module.exports.findUserByUsername = findUserByUsername;
module.exports.getAllUsers = getAllUsers;
module.exports.findUserById = findUserById;
module.exports.insertUser = insertUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.connect = connect;