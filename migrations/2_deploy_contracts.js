const System = artifacts.require("System");
const Issuer = artifacts.require("Issuer");
const Student = artifacts.require("Student");

module.exports = function (deployer) {
  deployer.deploy(System);
};


