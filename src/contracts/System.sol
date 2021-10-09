pragma solidity >=0.4.22 <0.9.0;  

import "./Ownable.sol";
import "./Student.sol";

contract System is Ownable{
  address[] public issuerAddresses;
  address[] public studentAddresses;

  mapping (address => address) public mapIssuer;
  mapping (address => address) public mapStudent;

  constructor() public{
    transferOwnership(msg.sender);
  } 

  event addedIssuer(  
    address newIssuer
  );
  event addedStudent(  
    address newStudent
  );
  event changedIssuerContract(address _issuerAddr,address _contractAddr);
  event changedStudentContract(address _studentAddr,address _contractAddr);
// issuer
  function addIssuer (address _issuerAddr) public onlyOwner(){
    _addIssuer(_issuerAddr);
  }
  function _addIssuer(address _issuerAddr) internal {
    require(_issuerAddr != address(0));
    emit addedIssuer(_issuerAddr);
    issuerAddresses.push(_issuerAddr);
  }

  function changeIssuerContract(address _issuerAddr, address _contractAddr) public onlyOwner(){
    for(uint i = 0 ; i< issuerAddresses.length; i++){
      if (issuerAddresses[i] == _issuerAddr){
        mapIssuer[_issuerAddr] = _contractAddr;
        emit changedIssuerContract(_issuerAddr, _contractAddr);
        break;
      }
    }
  }
// student
  function addStudent(address _studentAddr) public onlyOwner(){
    _addStudent(_studentAddr);
  }
  function _addStudent (address _studentAddr) internal {
    require(_studentAddr != address(0));
    emit addedStudent(_studentAddr);
    studentAddresses.push(_studentAddr);
  }
  function changeStudentContract(address _studentAddr, address _contractAddr) public onlyOwner(){
    for (uint i = 0 ; i< studentAddresses.length; i++){
      if (studentAddresses[i] == _studentAddr) {
        mapStudent[_studentAddr] = _contractAddr;
        emit changedStudentContract(_studentAddr, _contractAddr);
        break;
      }
    }
  }
  function addCerf(address _studentAddress, address _issuerAddress, bytes32 _hashedCert) public onlyOwner(){
    InterfaceStudent stu = InterfaceStudent(mapStudent[_studentAddress]);
    stu.addCertificates(_issuerAddress,_hashedCert);
  }
} 
