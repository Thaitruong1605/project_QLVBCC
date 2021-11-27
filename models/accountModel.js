const conn = require('../dbconnect');

let select = () => {
    return new Promise( (resolve, reject) => {
        conn.query(
            'SELECT * FROM accounts',
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
            'SELECT * FROM accounts WHERE user_id = ? OR school_id = ? OR issuer_id = ?',
            [id,id,id],
            function (err, results) {
                if (err) { console.log(err); reject(); }
                resolve(results[0]);
            }
        )
    });
}
let get_stuAbyEmail = (email)=> {
    return new Promise ((resolve, reject) => {
        conn.query(
            `SELECT account_address FROM accounts a
            LEFT JOIN users s ON a.user_id = s.user_id
            WHERE s.user_email = ?`,
            email,
            function(err, results){
                if (err){ console.log(err); reject();}
                resolve(results[0]);
            }
        )
    })
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

module.exports = {
    select,
    get_accountById,
    get_accountByUsername,
    get_stuAbyEmail,
    get_password,
    create,
    update,
    remove,
    removeByIssuerId
}