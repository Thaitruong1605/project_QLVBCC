const conn = require("../dbconnect");

let select = () =>{
  return new Promise((resolve, reject) => {
    conn.query(
      'SELECT * FROM issuers',
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
      id, 
      function(err , results){
        if (err) { console.log(err) , reject()}
        resolve(results[0]);
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
        resolve("A row have been inserted");
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
        resolve("A row have been updated");
      }
    );
  })
}
let remove = (di) =>{
  return new Promise((resolve, reject) => {
    conn.query(
      'DEELTE FROM issuers WHERE issuer_id = ?',
      id,
      function(err , results){
        if (err) { console.log(err) , reject(); }
        resolve("A row have been deleted");
      }
    );
  })
}

module.exports = {
  select,
  selectById,
  create,
  update,
  remove
}