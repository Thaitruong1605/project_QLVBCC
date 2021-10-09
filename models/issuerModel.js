const conn = require("../dbconnect");

let issuer_select = () => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT issuer_id, issuer_website, issuer_code, issuer_name, issuer_address, issuer_phone, issuer_email, issuer_fax, issuer_modifieddate, issuer_createddate FROM issuers",
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

let issuer_selectbyId = (id) => {
  return new Promise(async (resolve, reject) => {
    conn.query(
      "SELECT issuer_id, issuer_website, issuer_code, issuer_name, issuer_address, issuer_phone, issuer_fax, issuer_email FROM issuers WHERE issuer_id = ?",
      id, 
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

let issuer_create = (issuer_inf) => {
  return new Promise(async (resolve, reject) => {
    conn.query(
      "INSERT INTO issuers SET ?",
      issuer_inf,
      function (err) {
        console.log(this.sql);
        if (err) {
          reject(err);
        }
        resolve("A new issuer has been created!");
      }
    );
  });
};

let issuer_update = (id, issuer_inf) => {
  return new Promise(async (resolve, reject) => {
    conn.query(
      "UPDATE issuers SET ? WHERE issuer_id= ? ",
      [issuer_inf, id],
      function (err) {
        console.log(this.sql);
        if (err) {
          reject(err);
        }
        resolve("A new issuer has been updated!");
      }
    );
  });
};

let issuer_delete = (id) => {
  return new Promise(async (resolve, reject) => {
    conn.query("DELETE FROM issuers WHERE issuer_id= ? ",
    id,
    function (err) {
      if (err) {
        reject(err);
      } else {
        resolve("A row has been deleted");
      }
    });
  });
};

module.exports = {
  issuer_select,
  issuer_selectbyId,
  issuer_create,
  issuer_update,
  issuer_delete
};
