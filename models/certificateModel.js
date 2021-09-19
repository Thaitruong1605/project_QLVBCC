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

let insert = (data) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO issuer SET ?", data, function (err) {
      if (err) {
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
      "UPDATE certificates SET ? WHERE issuer_id=?, number=?",
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

module.exports = {
  select_byissuer,
  insert,
  update,
};
