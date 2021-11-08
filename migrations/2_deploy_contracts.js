const System = artifacts.require("System");
const School = artifacts.require("School");
const Student = artifacts.require("Student");

module.exports = async function (deployer) {
  await deployer.deploy(System); 
  let sysI = await System.deployed();
  await sysI.addStudent('0xE729e45f44EBD8AEC64460F1f0cCAA76D5024701','thaitruong1605@gmail.com');
  await sysI.addSchool('Đại học Cần Thơ','Khu II, Đ. 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ', '(84-292) 383266', 'dhct@ctu.edu.vn', '(84-292) 383847', 'www.ctu.edu.vn', '0x70cE91A72dbE08aaD8766aE09E977d559C13B806');
};


