const conn = require("../dbconnect");
const bcrypt = require("bcrypt");


let get_student_id = (student_email) => {
    return new Promise ((resolve, reject) => {
        try {
            conn.query(
                'SELECT student_id FROM students WHERE student_email = ?',
                student_email,
                function(err,results){
                    if(err){
                        console.log(err);
                    }else {
                        resolve(results[0].student_id);
                    }
                }
            )
        }catch (err){
            console.log(err);
        }
    })
}
let add_account = (account) => {
    return new Promise (async (resolve, reject) => {
        try{
            conn.query(
                "INSERT INTO accounts SET ?", 
                [account],
                function(err){
                    if(err){
                        console.log(err);
                        reject();
                    } 
                    resolve();
                }
            )
        }catch(err){
            console.log(err);
            reject();
        }
    });
}
let isExist_address = (account_address) => {
    return new Promise( (resolve, reject) => {
        conn.query(
            'SELECT account_address FROM accounts WHERE account_address = ?',
            account_address,
            function(error, results){
                if(error){ reject(); }
                if(results != ''){  resolve(true); }
                resolve(false); 
            }
        )
    });
}
let isExist_username = (account_username) => {
    return new Promise( (resolve, reject) => {
        conn.query(
            'SELECT account_username FROM accounts WHERE account_username = ?',
            account_username,
            function(error, results){
                if(error){ console.log(error); reject(); }
                if(results != ''){ resolve(true); }
                resolve(false); 
            }
        )
    });
}
let isExist_idNumber = (student_idNumber) => { 
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT student_id FROM students  WHERE student_idNumber=? ',
            [student_idNumber],
            function(error, results){
                if(error){ console.log(error); reject()}
                if (results != ''){
                    resolve(true);
                }
                resolve(false);
            }
        )   
    });
}
let isExist_email = (student_email) => { 
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT student_id FROM students  WHERE student_email= ?',
            [student_email],
            function(error, results){
                if(error){ console.log(error); reject()}
                if (results != ''){
                    resolve(true);
                }
                resolve(false);
            }
        )   
    });
}
let isExist_phoneNumber = (student_phoneNumber) => { 
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT student_id FROM students  WHERE student_phoneNumber= ?',
            [student_phoneNumber],
            function(error, results){
                if(error){ console.log(error); reject()}
                if (results != ''){
                    resolve(true);
                }
                resolve(false);
            }
        )   
    });
}

let add_student = (student, account_address) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'INSERT INTO students SET ?', 
            student,
            async function(err){
                if (err) {
                    console.log(err);
                    reject();
                }
                resolve();
            }
        );
    });
};
module.exports = {
    get_student_id,
    add_student,
    add_account,
    isExist_username,
    isExist_address,
    isExist_email,
    isExist_idNumber,
    isExist_phoneNumber
}