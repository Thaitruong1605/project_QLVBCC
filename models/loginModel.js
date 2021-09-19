const conn = require("../dbconnect");

let findUser = (email) => {
    return new Promise((resolve, reject) => {
        try {
            conn.query(
                'SELECT email, password, kindOfUser FROM users WHERE email = "'+ email +'"',
                function (err, result) {
                    console.log(this.sql);
                    if (err) { reject(err); }
                    else if (result.length > 0) {
                        let user = {
                            email: result[0].email,
                            password: result[0].password,
                            kindOfUser: result[0].kindOfUser
                        };
                        resolve(user);
                    } else
                        reject("Tài khoản chưa được đăng ký.");
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