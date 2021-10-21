const conn = require('../dbconnect');

let select = () => {
    return new Promise( (resolve, reject) => {
        conn.query(
            'SELECT account_address, account_type, account_status, student_id, school_id FROM accounts',
            function (err, results) {
                if (err) { reject(err); }
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
                if (err) { reject(err); }
                resolve(results);
            }
        )
    });
}
let get_studentInfo = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT account_address, account_type, account_status, a.student_id, student_name, student_address, student_birth, student_phone, student_email FROM accounts a JOIN students s ON a.student_id = s.student_id WHERE a.student_id = ?',
            [id],
            function (err, results) {
                if (err) { reject(err); }
                resolve(results);
            }
        )
    });
}
let get_issuerInfo = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(
            'SELECT account_address, account_type, account_status, a.school_id, issuer_code, issuer_website, issuer_name, issuer_address, issuer_phone, issuer_fax, issuer_email, issuer_modifieddate, issuer_createddate FROM accounts a JOIN issuers i ON a.school_id = i.school_id WHERE a.school_id = ?',
            [id],
            function (err, results) {
                if (err) { reject(err); }
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
                if (err) { reject(err);}
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
                if (err) { reject(err);}
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
                if (err) { reject(err);}
                resolve("A new account has been deleted!");
            }
        )
    });
};

module.exports = {
    select,
    selectbyaddress,
    get_studentInfo,
    get_issuerInfo,
    create,
    update,
    remove
}