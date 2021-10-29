const conn = require('../dbconnect');

let select = (school_id) =>{
  return new Promise((resolve, reject) => {
    conn.query(
      'SELECT i.issuer_id, i.issuer_name, account_username, account_status  FROM issuers i LEFT JOIN accounts a ON i.issuer_id = a.issuer_id WHERE i.school_id = ?',
      school_id,
      function(err , results){
        if (err) { console.log(err) , reject()}
        resolve(results);
      }
    );
  })
}
let selectById = (id) =>{
  return new Promise((resolve, reject) => {
    conn.query(
      'SELECT * FROM issuers WHERE issuer_id = ?',
      [id], 
      function(err , results){
        if (err) { console.log(err) , reject()}
        resolve(results[0]);
      }
    );
  })
}
let getIdbyEmail = (email) => { 
  return new Promise((resolve, reject) => {
    conn.query(
      'SELECT issuer_id FROM issuers WHERE issuer_email = ?',
      email, 
      function(err , results){
        if (err) { console.log(err) , reject()}
        resolve(results[0].issuer_id);
      }
    );
  })
}
let create = (issuer_info) =>{
  return new Promise((resolve, reject) => {
    conn.query(
      'INSERT INTO issuers SET ?',
      issuer_info,
      function(err){
        if (err) { console.log(err) , reject(); }
        resolve('A row have been inserted');
      }
    );
  })
}
let update = (issuer_info, id) =>{
  return new Promise((resolve, reject) => {
    conn.query(
      'UPDATE issuers SET ? WHERE issuer_id = ?',
      [issuer_info, id],
      function(err){
        if (err) { console.log(err) , reject(); }
        resolve('A row have been updated');
      }
    );
  })
}
let remove = (id) =>{
  return new Promise((resolve, reject) => {
    conn.query(
      'DELETE FROM issuers WHERE issuer_id = ?',
      id,
      function(err , results){
        if (err) { console.log(err) , reject(); }
        resolve('A row have been deleted');
      }
    );
  })
}

module.exports = {
  select,
  selectById,
  getIdbyEmail,
  create,
  update,
  remove
}