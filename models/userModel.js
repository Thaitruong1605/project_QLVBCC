const conn = require('../dbconnect');

let select = () => {
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'SELECT * FROM users',
        function(error, results){
          if (error) {console.log(error); reject();}
          resolve(results);
        }
      )
    }catch(err){console.log(err)}
  })
}
let select_byId = (user_id) => {
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'SELECT * FROM users WHERE user_id= ?',
        [user_id],
        function(error, results){
          if (error) {console.log(error); reject();}
          resolve(results[0]);
        }
      )
    }catch(err){console.log(err)}
  })
}
let select_idNumberbyId = (user_id) => {
  return new Promise((resolve, reject)=> {
    conn.query(
      `SELECT user_idNumber
      FROM users
      WHERE user_id = '${user_id}'`,
      function(error, results){
        if (error) {console.log(error); reject();}
        resolve(results[0]['user_idNumber']);
      }
    )
  })
}
let insert = (user_info)=>{
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'INSERT INTO users SET ?',
        user_info,
        function(error){
          if (error) {console.log(error); reject();}
          resolve();
        }
      )
    }catch(err){console.log(err)}
  })
}
let update = (user_id, user_info)=>{
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'UPDATE users SET ? WHERE user_id= ?',
        [user_info, user_id],
        function(error){
          if (error) {console.log(error); reject();}
          resolve();
        }
      )
    }catch(err){console.log(err)}
  })
}
let remove = (user_id)=>{
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'DELETE FROM users WHERE user_id= ?',
        [user_id],
        function(error){
          if (error) {console.log(error); reject();}
          resolve();
        }
      )
    }catch(err){console.log(err)}
  })
}
let auth = (user_id) => {
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        `UPDATE users SET user_isAuth='1' WHERE user_id = ?`,
        [user_id],
        function(error){
          if (error) {console.log(error); reject();}
          resolve();
        }
      )
    }catch(err){console.log(err)}
  })
}
module.exports = {
  select,
  select_byId,
  select_idNumberbyId,
  insert,
  update,
  remove,
  auth
}