const conn = require("../dbconnect");

let select_byissuer = (issuer_id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM certificates WHERE issuer_id=?",
      issuer_id,
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};
let select_byNumber = (number) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM certificates WHERE number=?",
      number,
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

let create = (data) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO certificates SET ?", data, function (err) {
      if (err) {
        console.log(this.sql);
        reject(err);
      } else {
        resolve("A new row has been created!");
      }
    });
  });
};

let update = (number, issuer_id, data) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "UPDATE certificates SET ? WHERE issuer_id=? and number=?",
      [data, issuer_id, number],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve("A row has been updated!");
        }
      }
    );
  });
};
let update_ipfs_hash = (number, ipfs_hash) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "UPDATE certificates SET ipfs_hash = ?, status='Done'  WHERE number=?",
      [ipfs_hash, number],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve("A row has been deleted!");
        }
      }
    );
  });
};
let delete_byNumber = (number) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "DELETE FROM certificates WHERE number=?",
      [number],
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve("A row has been deleted!");
        }
      }
    );
  });
};
let get_certformipfs = (url) => {
  return new Promise((resolve, reject) => {
    http.get("http://ipfs.io/ipfs/" + ipfs_hash, function (res) {
      let data = "",
        json_data;
      res.on("data", function (stream) {
        data += stream;
      });
      res.on("end", function () {
        json_data = JSON.parse(data);
        resolve(json_data);
      });
    });
    reject("Fail")
  });
};
// CERT NAME ---------------------------------------------------
let certname_get = (id) => { 
  sql = "SELECT cn_id, cn_name FROM certname ";
  sql += (id)? " WHERE cn_id = '"+id+"'":"";
  return new Promise((resolve, reject) =>{
    conn.query(
      sql,
      function(err, results){
        if (err){
          console.log(err);
          reject(err);
        }
        resolve(results);
      }
    );
  })
};
let certname_getbyissuer = (id, issuer_id) => { 
  sql = "SELECT cn_id, cn_name FROM certname WHERE issuer_id='"+issuer_id+"'"; 
  sql += (id)? "' cn_id = '"+id+"'":'';
  return new Promise((resolve, reject) =>{
    conn.query(
      sql,
      function(err, results){
        console.log(this.sql);
        if (err){
          console.log(err);
          reject(err);
        }
        resolve(results);
      }
    );
  })
};
let certname_update = (id,name) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "UPDATE certname SET cn_name=? WHERE cn_id=?",
      [name,id],
      function(err, results){
        console.log(this.sql);
        if (err){
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  })
};
let certname_create = (name, issuer_id) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "INSERT INTO certname (cn_name,issuer_id) VALUES (?,?)",
      [name,issuer_id],
      function(err, results){
        if (err){
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  })
};
let certname_remove = (id) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "DELETE FROM certname WHERE cn_id= ?",
      [id],
      function(err, results){
        if (err){
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  })
};
// CERT KIND ---------------------------------------------------
let certkind_get = (id) => { 
  sql = "SELECT ck_id, ck_name FROM certkind ";
  sql += (id)? " WHERE ck_id = '"+id+"'":"";
  return new Promise((resolve, reject) =>{
    conn.query(
      sql,
      function(err, results){
        if (err){
          console.log(err);
          reject(err);
        }
        resolve(results);
      }
    );
  })
};
let certkind_getbyissuer = (id, issuer_id) => { 
  sql = "SELECT ck_id, ck_name FROM certkind WHERE issuer_id='"+issuer_id+"'"; 
  sql += (id)? "' ck_id = '"+id+"'":'';
  return new Promise((resolve, reject) =>{
    conn.query(
      sql,
      function(err, results){
        if (err){
          console.log(err);
          reject(err);
        }
        resolve(results);
      }
    );
  })
};
let certkind_update = (id,name) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "UPDATE certkind SET ck_name=? WHERE ck_id=?",
      [name,id],
      function(err, results){
        if (err){
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  })
};
let certkind_create = (name, issuer_id) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "INSERT INTO certkind (ck_name,issuer_id) VALUES (?,?)",
      [name,issuer_id],
      function(err, results){
        if (err){
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  })
};
let certkind_remove = (id) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "DELETE FROM certkind WHERE ck_id= ?",
      [id],
      function(err, results){
        if (err){
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  })
};
module.exports = {
  select_byissuer,
  select_byNumber,
  create,
  update,
  update_ipfs_hash,
  delete_byNumber,
  certname_get, certname_getbyissuer, certname_create, certname_update, certname_remove,
  certkind_get, certkind_getbyissuer, certkind_create, certkind_update, certkind_remove
};
