const conn = require('../dbconnect');

let school_select = () => {
  return new Promise((resolve, reject) => {
    conn.query(
      'SELECT school_id, school_code, school_name, school_placeAddress, school_website, school_email, school_phoneNumber, school_fax, school_createTime, school_modifyTime FROM schools',
      function (err, results) {
        if (err) {
          console.log(err);reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

let school_selectbyId = (id) => {
  return new Promise(async (resolve, reject) => {
    conn.query(
      'SELECT school_id, school_code, school_name, school_placeAddress, school_website, school_email, school_phoneNumber, school_fax, school_createTime, school_modifyTime FROM schools WHERE school_id = ?',
      id, 
      function (err, results) {
        if (err) {
          console.log(err);reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};
let school_getIdbyEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    conn.query(
      'SELECT school_id FROM schools WHERE school_email = ?',
      email, 
      function (err, results) {
        if (err) {
          console.log(err);reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};

let school_create = (school_inf) => {
  return new Promise(async (resolve, reject) => {
    conn.query(
      'INSERT INTO schools SET ?',
      school_inf,
      function (err) {
        console.log(this.sql);
        if (err) {
          console.log(err);reject(err);
        }
        resolve('A new school has been created!');
      }
    );
  });
};

let school_update = (id, school_inf) => {
  return new Promise(async (resolve, reject) => {
    conn.query(
      'UPDATE schools SET ? WHERE school_id= ? ',
      [school_inf, id],
      function (err) {
        console.log(this.sql);
        if (err) {
          console.log(err);reject(err);
        }
        resolve('A new school has been updated!');
      }
    );
  });
};

let school_delete = (id) => {
  return new Promise(async (resolve, reject) => {
    conn.query('DELETE FROM schools WHERE school_id= ? ',
    id,
    function (err) {
      if (err) {
        console.log(err);reject(err);
      } else {
        resolve('A row has been deleted');
      }
    });
  });
};

module.exports = {
  school_select,
  school_selectbyId,
  school_getIdbyEmail,
  school_create,
  school_update,
  school_delete
};
