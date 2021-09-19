const conn = require("../dbconnect");
const bcrypt = require("bcrypt");

let addUser = (user) => {
    return new Promise(async (resolve, reject) => {
        let checkEmail = await isExist_email(user.email);
        if (checkEmail){
            reject("Email đã được đăng ký!");
        }else {
            const SALT = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, SALT);
            conn.query(
                'INSERT INTO users set ? ', 
                user,
                function(err){
                    console.log(this.sql);
                    if (err) { 
                        reject({error: err});
                    }
                    resolve("A new user has been created!");
                }
            );
        }
    });
};

let isExist_email = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            conn.query(
                'SELECT email FROM users WHERE email= "'+email +'"',
                function(err,rows){
                    if(err){ console.log(err); }
                    if(rows != ''){ resolve(true); }
                    else { resolve(false); }
                }
            )
        }catch(err){
            reject(err);
        }
    });
};

module.exports = {
    addUser: addUser,
}