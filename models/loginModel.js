const conn = require('../dbconnect');

let findAccount = (account_username) => {
    return new Promise((resolve, reject) => {
        try {
            conn.query(
                'SELECT * FROM accounts WHERE account_username = ? ',
                [account_username],
                function (err, result) {
                    if (err) { 
                        console.log(err);
                    }
                    else if (result.length > 0) {
                        let user = result[0];
                        resolve(user);
                    } 
                    reject('Không tìm thấy người dùng!');
                }
            );
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}
module.exports = {
    findAccount
}