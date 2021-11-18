const conn = require('../dbconnect');


let get_user_id = (user_email) => {
    return new Promise ((resolve, reject) => {
        try {
            conn.query(
                'SELECT user_id FROM users WHERE user_email = ?',
                user_email,
                function(err,results){
                    if(err){
                        console.log(err);
                    }else {
                        resolve(results[0].user_id);
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
                'INSERT INTO accounts SET ?', 
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
let isExist_idNumber = (user_idNumber) => { 
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT user_id FROM users  WHERE user_idNumber=? ',
            [user_idNumber],
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
let isExist_email = (user_email) => { 
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT user_id FROM users  WHERE user_email= ?',
            [user_email],
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
let isExist_phoneNumber = (user_phoneNumber) => { 
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT user_id FROM users  WHERE user_phoneNumber= ?',
            [user_phoneNumber],
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

let add_user = (user, account_address) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'INSERT INTO users SET ?', 
            user,
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
    get_user_id,
    add_user,
    add_account,
    isExist_username,
    isExist_address,
    isExist_email,
    isExist_idNumber,
    isExist_phoneNumber
}