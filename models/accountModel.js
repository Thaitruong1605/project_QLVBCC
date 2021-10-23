const conn = require('../dbconnect');

let select = () => {
    return new Promise( (resolve, reject) => {
        conn.query(
            'SELECT account_address, account_type, account_status, student_id, school_id FROM accounts',
            function (err, results) {
                if (err) { console.log(err); reject(); }
                else {
                    resolve(results);
                }
            }
        )
    }); 
}
let selectbyaddress = (account_address) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT account_address, account_type, account_status, student_id, school_id FROM accounts WHERE account_address = ?',
            [account_address],
            function (err, results) {
                if (err) { console.log(err); reject(); }
                resolve(results);
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
let update = (account_address, account_inf) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'UPDATE accounts SET ? WHERE account_address=?', 
            [account_inf, account_address],
            function(err){
                if (err) { console.log(err); reject();}
                resolve("A new account has been updated!");
            }
        )
    });
};
let remove = (account_address) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'DELETE FROM accounts WHERE account_address=?', 
            [account_address],
            function(err){
                if (err) { console.log(err); reject();}
                resolve("A new account has been deleted!");
            }
        )
    });
};

module.exports = {
    select,
    selectbyaddress,
    get_accountById,
    create,
    update,
    remove
}