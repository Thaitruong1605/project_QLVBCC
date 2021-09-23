const conn = require('../dbconnect');

let select = () => {
    return new Promise( (resolve, reject) => {
        conn.query(
            'SELECT account_address, account_type, account_status, student_id, issuer_id FROM accounts',
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
            'SELECT account_address, account_type, account_status, student_id, issuer_id FROM accounts WHERE account_address = ?',
            [account_address],
            function (err, results) {
                if (err) { reject(err); }
                resolve(results);
            }
        )
    });
}

let get_accountdetail = (id) => {
    return new Promise ((resolve, reject) =>{
        var type = id.sub(0, 3);
        if (type == "STU"){
            try {
                'SELECT * FROM students WHERE student_id = ?',
                [type],
                function(error, results){
                    if (error) reject (error);
                    resovle (results);
                }
            }catch(err){ reject(err)}
        }else if(type == "ISR"){
            try {
                'SELECT * FROM issuers WHERE issuer_id = ?',
                [type],
                function(error, results){
                    if (error) reject (error);
                    resovle (results);
                }
            }catch(err){ reject(err)}
        }
        reject("Sai id!");
    })
}

let update = (email, user_inf) => {
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

module.exports = {
    select,
    selectbyaddress,
    get_accountdetail,
    update
}