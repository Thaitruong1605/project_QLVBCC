const { resolveInclude } = require('ejs');
const conn = require('../dbconnect');

let select = () => {
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'SELECT * FROM students',
        function(error, results){
          if (error) {console.log(error); reject();}
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
        'SELECT * FROM students WHERE student_id= ?',
        [student_id],
        function(error, results){
          if (error) {console.log(error); reject();}
          resolve(results[0]);
        }
      )
    }catch(err){console.log(err)}
  })
}
let insert = (student_info)=>{
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'INSERT INTO students SET ?',
        student_info,
        function(error){
          if (error) {console.log(error); reject();}
          resolve("A row has been created");
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
          if (error) {console.log(error); reject();}
          resolve("A row has been updated");
        }
      )
    }catch(err){console.log(err)}
  })
}
let remove = (student_id)=>{
  return new Promise((resolve, reject)=> {
    try{
      conn.query(
        'DELETE FROM students WHERE student_id= ?',
        [student_id],
        function(error){
          if (error) {console.log(error); reject();}
          resolve("A row has been deleted");
        }
      )
    }catch(err){console.log(err)}
  })
}
module.exports = {
  select,
  select_byId,
  insert,
  update,
  remove
}