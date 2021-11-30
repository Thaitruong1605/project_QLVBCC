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
          resolve(results[0]);
        }
      }
    );
  });
};
let select_byIdNumber = (user_idNumber) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT 
        c.number, c.regno, c.createTime,
        cn.cn_name, 
        ck.ck_name, ck.school_name 
      FROM certificates c 
      LEFT JOIN ( 
        SELECT ck.ck_id, ck.ck_name, sch.school_name FROM certkind ck
        LEFT JOIN schools sch ON ck.school_id = sch.school_id ) ck ON ck.ck_id = c.ck_id
      LEFT JOIN certname cn ON cn.cn_id = c.cn_id 
      WHERE user_idNumber = "${user_idNumber}" `,
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
let select_recentlyCert = (issuer_id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT number,regno,cn_name,user_name,user_idNumber,user_birth,status, createTime
        FROM certificates c
        LEFT JOIN certname cn ON c.cn_id = cn.cn_id
        WHERE createTime IN (SELECT MAX(createTime) FROM certificates) AND 
        issuer_id = '${issuer_id}'`,
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
      "UPDATE certificates SET ipfs_hash = ?, status='done'  WHERE number=?",
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
let get_ipfs_hashbyhash = (hash) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT ipfs_hash FROM certificates  WHERE hash=?",
      [hash],
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
let cert_search = (cn_id,number,user_name,regno) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT cn.cn_name, c.user_name, ipfs_hash, user_birth, number, regno
      FROM certificates c
      LEFT JOIN certname cn ON c.cn_id = cn.cn_id
      WHERE c.cn_id = ? AND status = 'Done' AND 
      ( number = ? OR user_name = ? OR regno = ?)`,
      [cn_id,number,user_name,regno],
      function (err, results) {
        if (err) {
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}
let check_cert = (numberList, regnoList) => {
  return new Promise((resolve, reject)=> {
    conn.query(
      `SELECT number, regno 
      FROM certificates
      WHERE NUMBER IN `+numberList+`
        OR regno IN `+regnoList
      
      ,function(err,data){
        if(err){
          console.log(err);
          reject();
        }
        resolve(data);
      }
    )
  })
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
let countall = (school_id) => { 
  return new Promise((resolve, reject) =>{
    conn.query(
      `SELECT COUNT(ck.ck_name) AS certnum, ck.ck_name FROM certificates c
      LEFT JOIN certkind ck ON c.ck_id = ck.ck_id
      WHERE ck.school_id = "${school_id}"
      GROUP BY ck.ck_name`,
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
let count_groupByIssuer = (school_id)=>{
  return new Promise((resolve, reject) =>{
    conn.query(
      `SELECT account_username, tmp.* FROM accounts a 
      LEFT JOIN (SELECT c.issuer_id,ck.ck_name, COUNT(ck.ck_id) AS number FROM certificates c
      LEFT JOIN certkind ck ON ck.ck_id = c.ck_id 
      WHERE ck.school_id = "${school_id}"
      GROUP BY ck.ck_id, c.issuer_id) AS tmp ON tmp.issuer_id = a.issuer_id
      WHERE a.account_type ='issuer' `,
      function(err, results){
        if (err){
          console.log(err);
          reject();
        }
        resolve(results);
      }
    );
  })
}
let list_cert = (data) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT c.number, c.regno, cn.cn_name, a.account_username, c.user_name, c.status, c.createTime FROM certificates c
      LEFT JOIN certname cn ON c.cn_id = cn.cn_id
      LEFT JOIN accounts a ON a.issuer_id = c.issuer_id
          WHERE c.cn_id LIKE '%${data.cn_id}%' AND
          createTime >= '${data.fromDate}' AND
          createTime <= '${data.toDate}' AND
          user_name LIKE '%${data.user_name}%' AND
          regno LIKE '%${data.regno}%' AND
          number LIKE '%${data.number}%'`,
      function(err, results){
        console.log(this.sql);
        if (err){
          console.log(err);
          reject();
        }
        resolve(results);
      }
    )
  })
}
module.exports = {
  select_byschool,select_byIdNumber,select_byissuer,select_byNumber,get_ipfs_hashbyhash,check_cert,countall,count_groupByIssuer,select_recentlyCert,
  get_certformipfs,
  cert_search,
  create,
  update,
  get_ipfs_hash,
  update_ipfs_hash,
  delete_byNumber,
  certname_get, certname_getbyschool, certname_create, certname_update, certname_remove,certname_getbyKindId,
  certkind_get, certkind_getbyschool, certkind_create, certkind_update, certkind_remove,
  list_cert
};
