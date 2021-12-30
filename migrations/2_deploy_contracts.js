const System = artifacts.require("System");
const School = artifacts.require("School");
const User = artifacts.require("User");

module.exports = async function (deployer) {
  await deployer.deploy(System,{from: "0x16D1A3156d05DcFB8bF90C1a6495cdBc6C58c5df" }); 
};


