const System = artifacts.require("System");
const School = artifacts.require("School");
const Student = artifacts.require("Student");

module.exports = async function (deployer) {
  await deployer.deploy(System); 
  var sysI = await System.deployed();
  await sysI.addStudent('0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701','thaitruong1605@gmail.com',{from: '0x3E5C773519D38EB7996A5cADFDb8C8256889cB79'})
  // await s
};


