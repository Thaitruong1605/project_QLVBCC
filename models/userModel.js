const conn = require('../dbconnect');

let user_selectAll = () => {
    return new Promise( (resolve, reject) => {
        conn.query(
            'SELECT account_address, phoneNumber, email, password, kindOfUser, state FROM users',
            function (err, results) {
                if (err) { reject(err); }
                else {
                    resolve(results);
                }
            }
        )
    }); 
}
let user_selectbyEmail = (email) => {
    return new Promise( async (resolve, reject) => {
        conn.query(
            'SELECT account_address, phoneNumber, email, password, kindOfUser, state FROM users WHERE email = ?',
            email,
            function (err, results) {
                if (err) { reject(err); }
                else {
                    resolve(results);
                }
            }
        )
    });
}
let user_update = (email, user_inf) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'UPDATE users SET ? WHERE username= ? ', 
            [user_inf, email],
            function(err){
                console.log(this.sql);
                if (err) { reject(err);}
                resolve("A new user has been created!");
            }
        )
    });
};
let user_delete = (email) => {
    return new Promise(async (resolve, reject) => {
        conn.query(
            'DELETE FROM users WHERE username= ? ',
            email,
            function (err) {
                if (err) { reject(err); }
                else {
                    resolve("A row has been deleted");
                }
            }
        );
    })
};

module.exports = {
    user_selectAll,
    user_selectbyEmail,
    user_update,
    user_delete,
}