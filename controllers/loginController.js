const loginModel = require("../models/loginModel");

let checkUser = (account_address) => {
    return new Promise (async (resolve,reject) => {
        try {
            let user = await loginModel.findUser(account_address).then();
            if (user) resolve(user);
            reject("Không tìm thấy người dùng");
        }catch(err){
            reject(err);
        }
    });
}
module.exports = {
    checkUser: checkUser
}