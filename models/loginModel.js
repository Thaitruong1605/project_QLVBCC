const conn = require("../dbconnect");

let findUser = (account_address) => {
    return new Promise((resolve, reject) => {
        try {
            conn.query(
                'SELECT * FROM account WHERE account_address = ? ',
                account_address,
                function (err, result) {
                    if (err) { 
                        console.log(this.sql);
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
    findUser: findUser
}