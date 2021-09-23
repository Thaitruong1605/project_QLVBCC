const { resolveInclude } = require('ejs');
const conn = require('../dbconnect');

let select = () => {
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'SELECT student_id, student_name, student_address, student_birth, student_phone, student_email FROM students',
        function(error, results){
          if (error) {reject(err);}
          resolve(results);
        }
      )
    }catch(err){console.log(err)}
  })
}
let select_byId = (student_id) => {
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'SELECT student_id, student_name, student_address, student_birth, student_phone, student_email FROM students WHERE student_id= ?',
        [student_id],
        function(error, results){
          if (error) {reject(err);}
          resolve(results[0]);
        }
      )
    }catch(err){console.log(err)}
  })
}
let update = (student_id, student_info)=>{
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'UPDATE students SET ? WHERE student_id= ?',
        [student_info, student_id],
        function(error){
          if (error) {reject(err);}
          resolve("A row has been updated");
        }
      )
    }catch(err){console.log(err)}
  })
}

module.exports = {
  select,
  select_byId,
  update
}