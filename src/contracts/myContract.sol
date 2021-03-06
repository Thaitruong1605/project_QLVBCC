pragma solidity >=0.4.22 <0.9.0;  
pragma experimental ABIEncoderV2;

contract Ownable {
  address private _owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  constructor() public {
    _owner = msg.sender;
    emit OwnershipTransferred(address(0), _owner);
  }
  function owner() public view returns(address) {
    return _owner;
  }
  modifier onlyOwner() {
    require(isOwner());
    _;
  }
  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }
  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}

contract System is Ownable{ 
  address[] public schoolAddresses;
  address[] public userAddresses;
  mapping (address => address) public mapSchool; // school address => contract
  mapping (address => address) public mapUser; // user address => contract

  mapping (string => address) public idnumberToContract;

  event addedSchool(string schoolCode, address newSchool, address newContract);
  event changedSchoolContract(address _schoolAddr, address _contractAddr);
  
  event addedUser(string idnumber, address newUser, address newContract);
  event changedUserContract(address _userAddr,address _contractAddr);

  event createdUserContractWithIDNumber(string _idnumber);
  
  constructor() public{
    transferOwnership(address(msg.sender));
  } 
  modifier onlySchool() {
    require(isSchool());
    _;
  }
  function isSchool() public view returns(bool) {
    if (mapSchool[msg.sender] != address(0)) return true;
    return false;
  }
  function _isSchool(address schoolAddr) public view returns(bool) {
    for (uint i=0; i< schoolAddresses.length; i++){
      if (schoolAddr == schoolAddresses[i]) return true;
    }
    return false;
  }
  function _isSchoolContract(address schoolCA ) public view returns(bool) {
    for (uint i=0; i< schoolAddresses.length; i++){
      if (mapSchool[schoolAddresses[i]] == schoolCA) return true;
    }
    return false;
  }
  function _isUser(address userAddr) internal view returns(bool) {
    for (uint i=0; i< userAddresses.length; i++){
      if (userAddr == userAddresses[i]) return true;
    }
    return false;
  }
  function addSchool( string memory name,string memory code, string memory addressPlace, string memory phoneNumber, string memory email, string memory fax, string memory website, address schoolAddr)public onlyOwner(){
    require(!(_isSchool(schoolAddr)));
    schoolAddresses.push(schoolAddr);
    School schoolContract = new School(name, code, addressPlace, phoneNumber, email, fax, website, schoolAddr);
    mapSchool[schoolAddr] = address(schoolContract);
    emit addedSchool(code, schoolAddr, address(schoolContract));
  }
  
  function changeSchoolContract(address _schoolAddr, address _contractAddr) public onlyOwner(){
    for(uint i = 0 ; i< schoolAddresses.length; i++){
      if (schoolAddresses[i] == _schoolAddr){
        mapSchool[_schoolAddr] = _contractAddr;
        emit changedSchoolContract(_schoolAddr, _contractAddr);
        return;
      }
    }
  }
  function getSchoolContractAddr(address _schoolAddr) public view returns(address){
    if(mapSchool[_schoolAddr] == address(0)){
      return address(0);
    }
    return mapSchool[_schoolAddr];
  }
  function addUser(address _userAddr, string memory _idnumber, address _userCA) public onlyOwner(){
    userAddresses.push(_userAddr);
    idnumberToContract[_idnumber] = _userCA;
    mapUser[_userAddr] = _userCA;
    emit addedUser(_idnumber, _userAddr, _userCA);
  }
  function changeUserContract(address _userAddr, address _contractAddr) public onlyOwner(){
    for (uint i = 0 ; i< userAddresses.length; i++){
      if (userAddresses[i] == _userAddr) {
        mapUser[_userAddr] = _contractAddr;
        emit changedUserContract(_userAddr, _contractAddr);
        break;
      }
    }
  }
  function getUserContractAddr(address userAddr) public view returns(address) {
    return (mapUser[userAddr] != address(0))? mapUser[userAddr] : address(0);
  }
  function createUserContractWithIDNumber (string memory _idnumber, address _sysCA) public onlyOwner(){
    require(idnumberToContract[_idnumber] == address(0));
    User userC = new User(msg.sender,_sysCA);
    idnumberToContract[_idnumber] = address(userC);
    emit createdUserContractWithIDNumber(_idnumber);
  }
  function getContractbyIDNumber (string memory _idnumber) public view returns(address){
    return idnumberToContract[_idnumber];
  }
} 

contract School is Ownable{
  string public name;
  string public code;
  string public addressPlace;
  string public phoneNumber;
  string public email;
  string public fax; 
  string public website;
  
  event addedCertificate(address _userCAddr,string _certNumber, bytes32 _certHash);
  event deactivatedCertificate(address _userCAddr,string _certNumber, bytes32 _certHash);

  constructor(
    string memory _name,
    string memory _code,
    string memory _addressPlace,
    string memory _phoneNumber,
    string memory _email,
    string memory _fax,
    string memory _website,
    address schAddr
    ) public {
      name = _name;
      code = _code;
      addressPlace = _addressPlace;
      phoneNumber = _phoneNumber;
      email = _email;
      fax = _fax;
      website = _website;
      transferOwnership(schAddr);
    }
  function getSchool() public view returns (string memory, string memory, string memory, string memory, string memory, string memory, string memory){
    return (name, code, addressPlace ,phoneNumber , email, fax, website);
  }
  function addCertificate(bytes32 _hashedCert,string memory _certNumber,string memory _ipfs, address userCAddr) public onlyOwner(){
    User userI = User(userCAddr);
    require (address(userI) != address(0));
    userI.addCertificate(_hashedCert, _certNumber, _ipfs);
    emit addedCertificate(userCAddr, _certNumber,  _hashedCert);
  }
  function deactivateCertificate(bytes32 _certHash, string memory _certNumber, address userCAddr) public onlyOwner(){
    User userI = User(userCAddr);
    require (address(userI) != address(0));
    userI.deactivateCertificate(_certHash, _certNumber);
    emit deactivatedCertificate(userCAddr, _certNumber, _certHash);
  }
}

contract User is Ownable{
  struct Certificate {
    uint8 state;
    address schoolAddress;
    bytes32 certHash;
    string ipfs;
  }

  bytes32[] public certificateList;
  mapping (bytes32 => Certificate) mapCertificates;
  System public system;

  event addedCertificate(string _certNumber, bytes32 _certHash, string _ipfs);
  event deactivatedCertificate(string _certNumber);

  constructor(address userAddr, address _sysCA) public {
    system = System(_sysCA);
    transferOwnership(userAddr);
  }
  
  modifier onlySchool() {
    require(system._isSchoolContract(msg.sender));
    _;
  }
  function addCertificate(bytes32 _hashedCert, string memory _certNumber, string memory _ipfs) public onlySchool(){
    mapCertificates[_hashedCert] = Certificate(uint8(1), msg.sender, _hashedCert, _ipfs);
    certificateList.push(_hashedCert);
    emit addedCertificate(_certNumber, _hashedCert, _ipfs);
  }
  function deactivateCertificate(bytes32 _certHash, string memory _certNumber) public onlySchool(){
    require( mapCertificates[_certHash].schoolAddress == msg.sender);
    mapCertificates[_certHash].state = uint8(0);
    emit deactivatedCertificate(_certNumber);
  }
  function viewCertificate(bytes32 _certHash) public view returns(uint8, address, bytes32, string memory){
    Certificate storage cert = mapCertificates[_certHash];
    return (cert.state, cert.schoolAddress, cert.certHash, cert.ipfs);
  }
  function getAllCertificate() public view returns(Certificate[] memory) {
    Certificate[] memory returnData = new Certificate[](certificateList.length);
    uint i=0;
    for (i; i<= certificateList.length-1; i++){
      returnData[i] = (mapCertificates[certificateList[i]]);
    }
    return returnData;
  }
}
