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
                        console.log(this.sql);
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
let add_account = (account_address, account_type, student_id) => {
    return new Promise (async (resolve, reject) => {
        if (await isExist_account(account_address)) reject({err: "Tài khoản đã được đăng ký"});
        try{
            conn.query(
                "INSERT INTO accounts (account_address, account_type, account_status, student_id) VALUES (?, ?, 'Processing', ?)", 
                [account_address, account_type, student_id],
                function(err){
                    if(err) reject(err);
                    resolve("A new account has been created!");
                }
            )
        }catch(err){
            reject(err);
        }
    });
}
let isExist_account = (account_address) => {
    return new Promise( (resolve, reject) => {
        try {
            conn.query(
                'SELECT account_address FROM accounts WHERE account_address = ?',
                account_address,
                function(error, results){
                    if(error){ console.log(error); }
                    else if(results != ''){ resolve(true); }
                    else { resolve(false); }
                }
            )
        }catch(err){
            reject(err);
        }
    });
}

let isExist_student = (student_phone, student_email) => { 
    return new Promise((resolve, reject) => {
        try{
            conn.query(
                'SELECT student_email FROM students WHERE student_email =?',
                student_email,
                function(error, results){
                    if(error){ console.log(error); }
                    else if(results != '') resolve(1);
                    try{
                        conn.query(
                            'SELECT student_phone FROM students WHERE student_phone =?',
                            student_phone,
                            function(error, results){
                                if(error){ console.log(error); }
                                else if(results != '') resolve(2);
                                resolve(false); 
                            }
                        )
                    }catch(err){
                        reject(err)
                    } 
                }
            )
        }catch(err){
            reject(err)
        }
    });
}
let add_Student = (student) => {
    return new Promise(async (resolve, reject) => {
        let isExist = await isExist_student(student.student_phone, student.student_email).then();
        if (isExist == 1) reject("Email đã được đăng ký!");
        else if (isExist == 2) reject("Số điện thoại đã được đăng ký!");
        else try {
            conn.query(
                'INSERT INTO students (student_name, student_address, student_birth, student_phone, student_email) VALUES (?, ?, ?, ?, ?)', 
                [student.student_name, student.student_address, student.student_birth, student.student_phone, student.student_email],
                async function(err){
                    if (err) { 
                        console.log(this.sql);
                        reject({error: err});
                    }
                    try {
                        await get_student_id(student.student_email).then(async function(results){
                            var student_id = results;
                            try {
                                await add_account(student.account_address, 'student', student_id);
                            } catch (err){
                                console.log(err)
                            }
                        });
            
                    }catch (err){
                        console.log(err)
                    }

                    resolve("A new student has been created!");
                }
            );
        }catch(err){
            console.log(err);
        }
    });
};
module.exports = {
    add_Student,
    
}