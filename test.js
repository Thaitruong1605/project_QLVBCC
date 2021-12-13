// /admin/user/auth?user_idNumber=111111111119;

var sysI = await System.deployed();

var schCA = await sysI.getSchoolContractAddr('0xa0fEC0106eAe31874cEfF9E35B4eC5bdD0a0FA67');
let schI = await School.at(schCA);

var userCA = await sysI.getContractbyIDNumber('111111111111');

await schI.addCertificate('0xa63ecc09dbb327c5f785ede8cb5c7e2a80c7ee8b5a353b02a1601ff28ec6d55c','35','ipfs',userCA,{from: '0xa0fEC0106eAe31874cEfF9E35B4eC5bdD0a0FA67'});
await schI.addCertificate('0xa63ecc09dbb327c5f785ede8cb5c7e2a80c7ee8b5a353b02a1601ff28ec6d552','311','ipfs2',userCA,{from: '0xa0fEC0106eAe31874cEfF9E35B4eC5bdD0a0FA67'});

let userI = await User.at(userCA);
await schI.deactivateCertificate('0xcfee65b98d2fe26de322ed5907bd38268fa6d8cef5064ac8458c733494e302d3','0xa0fEC0106eAe31874cEfF9E35B4eC5bdD0a0FA67', {from: '0xa0fEC0106eAe31874cEfF9E35B4eC5bdD0a0FA67'})
let result = await userI.viewCertificate('0xa63ecc09dbb327c5f785ede8cb5c7e2a80c7ee8b5a353b02a1601ff28ec6d55c');

var data = await userI.getAllCertificate();