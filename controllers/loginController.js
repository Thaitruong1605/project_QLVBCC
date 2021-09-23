const loginModel = require("../models/loginModel");

let checkAccount = (account_address) => {
    return new Promise (async (resolve,reject) => {
        try {
            let account = await loginModel.findAccount(account_address).then();
            console.log(account);
            if (account) resolve(account);
            reject("Không tìm thấy người dùng");
        }catch(err){
            reject(err);
        }
    });
}
module.exports = {
    checkAccount
}