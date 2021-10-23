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
            'SELECT * FROM accounts WHERE student_id = ? OR school_id = ?',
            [id,id],
            function (err, results) {
                if (err) { console.log(err); reject(); }
                resolve(results[0]);
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
                resolve("A new account has been created!");
            }
        )
    });
};
let update = (account_username, account_inf) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'UPDATE accounts SET ? WHERE account_username =?', 
            [account_inf, account_username],
            function(err){
                if (err) { console.log(err); reject();}
                resolve("A new account has been updated!");
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
                resolve("A new account has been deleted!");
            }
        )
    });
};

module.exports = {
    select,
    get_accountById,
    get_accountByUsername,
    create,
    update,
    remove
}