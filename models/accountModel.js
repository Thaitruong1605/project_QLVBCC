const conn = require('../dbconnect');

let select = () => {
    return new Promise( (resolve, reject) => {
        conn.query(
            `SELECT * FROM accounts WHERE account_type != 'issuer'`,
            function (err, results) {
                if (err) { console.log(err); reject(); }
                else {
                    resolve(results);
                }
            }
        )
    }); 
}
let get_accountByUsername = (account_username) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT * FROM accounts WHERE account_username = ?',
            [account_username],
            function (err, results) {
                if (err) { console.log(err); reject(); }
                resolve(results[0]);
            }
        )
    });
}
let get_accountById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM accounts WHERE user_id = '${id}' OR school_id = '${id}' OR issuer_id = '${id}' `,
            function (err, results) {
                if (err) { console.log(err); reject(); }
                resolve(results[0]);
            }
        )
    });
}
let number_school_user = () => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT account_type, COUNT(account_username) AS number FROM accounts WHERE 
            account_type ='school' OR 
            account_type = 'user'
            GROUP BY account_type`,
            function (err, results) {
                if (err) { console.log(err); reject(); }
                resolve(results);
            }
        )
    });
}
let create = (account_inf) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'INSERT INTO accounts SET ?', 
            account_inf,
            function(err){
                if (err) { console.log(err); reject();}
                resolve('A new account has been created!');
            }
        )
    });
};
let update = (account_inf, account_username) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'UPDATE accounts SET ? WHERE account_username =?', 
            [account_inf, account_username],
            function(err){
                if (err) { console.log(err); reject();}
                resolve('A new account has been updated!');
            }
        )
    });
};
let remove = (account_username) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'DELETE FROM accounts WHERE account_username=?', 
            [account_username],
            function(err){
                if (err) { console.log(err); reject();}
                resolve('A new account has been deleted!');
            }
        )
    });
};
let removeSchoolAccounts = (school_id) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'DELETE FROM accounts WHERE school_id=?', 
            [school_id],
            function(err){
                if (err) { console.log(err); reject();}
                resolve('A new account has been deleted!');
            }
        )
    });
}
let removeByIssuerId = (issuer_id) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'DELETE FROM accounts WHERE issuer_id=?', 
            [issuer_id],
            function(err){
                if (err) { console.log(err); reject();}
                resolve('A new account has been deleted!');
            }
        )
    });
};
let removeByUserId = (user_id) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'DELETE FROM accounts WHERE user_id=?', 
            [user_id],
            function(err){
                if (err) { console.log(err); reject();}
                resolve('A new account has been deleted!');
            }
        )
    });
};
let get_password = (account_username) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'SELECT account_password FROM accounts WHERE account_username=?', 
            [account_username],
            function(err,data){
                if (err) { console.log(err); reject();}
                resolve(data[0].account_password);
            }
        )
    });
};
let update_school = (account_inf, school_id) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'UPDATE accounts SET ? WHERE school_id =?', 
            [account_inf, school_id],
            function(err){
                if (err) { console.log(err); reject();}
                resolve('A new account has been updated!');
            }
        )
    });
};
module.exports = {
    select,
    get_accountById,
    get_accountByUsername,
    get_password,
    number_school_user,
    create,
    update,
    update_school,
    remove,
    removeByIssuerId,
    removeByUserId,
    removeSchoolAccounts
}