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

let insert = (data) => {
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
          console.log(this.sql);
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
          console.log(this.sql);
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

module.exports = {
  select_byissuer,
  select_byNumber,
  insert,
  update,
  update_ipfs_hash,
  delete_byNumber,
};
