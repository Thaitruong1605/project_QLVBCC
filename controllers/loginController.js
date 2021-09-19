const loginModel = require("../models/loginModel");
const bcrypt = require("bcrypt");

let checkUser = (email, password) => {
    return new Promise (async (resolve,reject) => {
        try {
            let user = await loginModel.findUser(email).then();
            if (user){
                bcrypt.compare(password, user.password). then( isMatch => {
                    if (isMatch){
                        console.log(isMatch);
                        resolve(user);
                    }else {
                        reject("Sai mật khẩu!");
                    }
                })
            }else 
            reject("Không tìm thấy người dùng");
        }catch(err){
            reject(err);
        }
    });
}
module.exports = {
    checkUser: checkUser
}