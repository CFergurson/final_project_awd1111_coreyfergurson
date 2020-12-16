const bcrypt = require('bcrypt');
const password = 'Password';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if(err){
    console.error(err);
  }else{
    console.log(password);
    console.log(hash);
  }
})