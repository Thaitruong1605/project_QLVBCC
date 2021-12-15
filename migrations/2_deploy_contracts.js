const System = artifacts.require("System");
const School = artifacts.require("School");
const User = artifacts.require("User");

module.exports = async function (deployer) {
  await deployer.deploy(System,{from: "0x07f8d0185A8822734Da52F2e8A4db9A6DD4fCc7e" }); 
  let sysI = await System.deployed();
  await deployer.deploy(User,'0x741fC1C592203fD326cE4B8F02D3050840E1C458',sysI.address,{from: "0x07f8d0185A8822734Da52F2e8A4db9A6DD4fCc7e" }); 
  let userI = await User.deployed();
  await sysI.addUser('0x741fC1C592203fD326cE4B8F02D3050840E1C458','111111111111',userI.address,{from: "0x07f8d0185A8822734Da52F2e8A4db9A6DD4fCc7e" }); // add user 1
  await sysI.addSchool('Đại học Cần Thơ','CTU','Khu II, Đ. 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ', '(84-292) 383266', 'dhct@ctu.edu.vn', '(84-292) 383847', 'www.ctu.edu.vn', '0xa0fEC0106eAe31874cEfF9E35B4eC5bdD0a0FA67',{from: "0x07f8d0185A8822734Da52F2e8A4db9A6DD4fCc7e" });
};


