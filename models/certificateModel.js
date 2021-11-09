const conn = require("../dbconnect");

let select_byissuer = (issuer_id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT c.*, ck_name, cn_name 
      FROM certificates c 

      LEFT JOIN certkind ck ON c.ck_id = ck.ck_id
      LEFT JOIN certname cn ON c.cn_id = cn.cn_id
      WHERE c.issuer_id = ?`,
      issuer_id,
      function (err, results) {
        if (err) {
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
};
let select_byschool = (school_id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT c.*, ck_name, cn_name 
      FROM certificates c 
      LEFT JOIN accounts a ON c.issuer_id = a.issuer_id
      LEFT JOIN certkind ck ON c.ck_id = ck.ck_id
      LEFT JOIN certname cn ON c.cn_id = cn.cn_id
      WHERE a.school_id = ?`,
      school_id,
      function (err, results) {
        if (err) {
          reject();
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
          reject();
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
      // console.log(this.sql);
      if (err) {
        reject();
      } else {
        resolve("A new row has been created!");
      }
    });
  });
};
let update = (number, data) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "UPDATE certificates SET ? WHERE number=?",
      [data, number],
      function (err) {
        if (err) {
          reject();
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
          reject();
        } else {
          resolve("A row has been deleted!");
        }
      }
    );
  });
};
let get_ipfs_hash = (number) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT ipfs_hash FROM certificates  WHERE number=?",
      [number],
      function (err, results) {
        if (err) {
          reject();
        } else {
          resolve(results[0].ipfs_hash);
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
          reject();
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
let cert_search = (cn_id,number,student_name,regno) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT cn.cn_name, c.student_name, ipfs_hash, student_birth, number, regno
      FROM certificates c
      LEFT JOIN certname cn ON c.cn_id = cn.cn_id
      WHERE c.cn_id = ? AND status = 'Done' AND 
      ( number = ? OR student_name = ? OR regno = ?)`,
      [cn_id,number,student_name,regno],
      function (err, results) {
        console.log(this.sql)
        if (err) {
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}
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
          reject();
        }
        resolve(results);
      }
    );
  })
};
let certname_getbyKindId= (ck_id) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      `SELECT cn_id, cn_name
      FROM certname
      WHERE ck_id = ?`,
      ck_id,
      function(err, results){
        if (err){
          console.log(err);
          reject();
        }
        resolve(results);
      }
    );
  })
};
let certname_getbyschool = (school_id, id) => { 
  sql = "SELECT cn_id, cn_name FROM certname WHERE school_id='"+school_id+"'"; 
  sql += (id)? "' cn_id = '"+id+"'":'';
  return new Promise((resolve, reject) =>{
    conn.query(
      sql,
      function(err, results){
        if (err){
          reject();
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
        if (err){
          console.log(err);
          reject();
        }
        resolve();
      }
    );
  })
};
let certname_create = (school_id, ck_id,name) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "INSERT INTO certname (cn_name,school_id,ck_id) VALUES (?,?,?)",
      [name,school_id,ck_id],
      function(err){
        if (err){
          console.log(err);
          reject();
        }
        resolve();
      }
    );
  })
};
let certname_remove = (school_id, id) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "DELETE FROM certname WHERE cn_id= ? AND school_id= ?",
      [id,school_id],
      function(err, results){
        if (err){
          console.log(err);
          reject();
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
          reject();
        }
        resolve(results);
      }
    );
  })
};
let certkind_getbyschool = (school_id, id ) => { 
  sql = "SELECT ck_id, ck_name FROM certkind WHERE school_id='"+school_id+"'"; 
  sql += (id)? "' ck_id = '"+id+"'":'';
  return new Promise((resolve, reject) =>{
    conn.query(
      sql,
      function(err, results){
        if (err){
          console.log(err);
          reject();
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
          reject();
        }
        resolve();
      }
    );
  })
};
let certkind_create = (school_id, name) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "INSERT INTO certkind (ck_name,school_id) VALUES (?,?)",
      [name,school_id],
      function(err, results){
        if (err){
          console.log(err);
          reject();
        }
        resolve();
      }
    );
  })
};
let certkind_remove = (id) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      "DELETE FROM certkind WHERE ck_id= ? AND school_id= ?",
      [id,school_id],
      function(err, results){
        if (err){
          console.log(err);
          reject();
        }
        resolve();
      }
    );
  })
};

module.exports = {
  select_byschool,
  select_byissuer,
  select_byNumber,
  get_certformipfs,
  cert_search,
  create,
  update,
  get_ipfs_hash,
  update_ipfs_hash,
  delete_byNumber,
  certname_get, certname_getbyschool, certname_create, certname_update, certname_remove,certname_getbyKindId,
  certkind_get, certkind_getbyschool, certkind_create, certkind_update, certkind_remove
};
