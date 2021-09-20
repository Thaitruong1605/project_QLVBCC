pragma solidity >=0.4.22 <0.9.0;  

import "./Ownable.sol";
import "./Student.sol";
import "./Issuer.sol";

contract System is Ownable{
  address[] public issuerAddresses;
  address[] public studentAddresses;
  Student student;
  Issuer issuer;

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

// issuer
  function addIssuer (address _issuerAddr) public onlyOwner(){
    _addIssuer(_issuerAddr);
  }
  function _addIssuer(address _issuerAddr) internal {
    require(_issuerAddr != address(0));
    emit addedIssuer(_issuerAddr);
    issuerAddresses.push(_issuerAddr);
  }
  function changeIssuerContract(address _oldAddr, address _newAddr) public onlyOwner(){
    require(mapIssuer[_oldAddr] != address(0));
    mapIssuer[_newAddr] = mapIssuer[_oldAddr];
    mapIssuer[_oldAddr] = address(0);
  }
// student
  function addStudent(address _studentAddr) public onlyOwner(){
    _addStudent(_studentAddr);
  }
  function _addStudent (address _studentAddr) internal {
    require(_studentAddr != address(0));
    emit addedIssuer(_studentAddr);
    studentAddresses.push(_studentAddr);
  }
  function changeStudentContract(address studentAddr, address contractAddr) public onlyOwner(){
    mapStudent[studentAddr] = contractAddr;
    student = Student(msg.sender);
    student.transfer(studentAddr);
  }
} 
