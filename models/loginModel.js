const conn = require("../dbconnect");

let findAccount = (account_address) => {
    console.log(account_address);
    return new Promise((resolve, reject) => {
        try {
            conn.query(
                'SELECT * FROM accounts WHERE account_address = ? ',
                [account_address],
                function (err, result) {
                    console.log(this.sql);
                    if (err) { 
                        reject(err); 
                    }
                    else if (result.length > 0) {
                        let user = result[0];
                        resolve(user);
                    } else
                        reject("Tài khoản chưa được đăng ký");
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}
module.exports = {
    findAccount
}