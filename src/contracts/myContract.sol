pragma solidity >=0.4.22 <0.9.0;  

contract Ownable {
  address private _owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  /**
  * @dev The Ownable constructor sets the original `owner` of the contract to the sender
  * account.
  */
  constructor() public {
    _owner = msg.sender;
    emit OwnershipTransferred(address(0), _owner);
  }

  /**
  * @return the address of the owner.
  */
  function owner() public view returns(address) {
    return _owner;
  }

  /**
  * @dev Throws if called by any account other than the owner.
  */
  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  /**
  * @return true if `msg.sender` is the owner of the contract.
  */
  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }

  /**
  * @dev Allows the current owner to relinquish control of the contract.
  * @notice Renouncing to ownership will leave the contract without an owner.
  * It will not be possible to call the functions with the `onlyOwner`
  * modifier anymore.
  */
  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }

  /**
  * @dev Allows the current owner to transfer control of the contract to a newOwner.
  * @param newOwner The address to transfer ownership to.
  */
  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }

  /**
  * @dev Transfers control of the contract to a newOwner.
  * @param newOwner The address to transfer ownership to.
  */
  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}

contract System is Ownable{ 
  address[] public schoolAddresses;
  address[] public studentAddresses;
  mapping (address => address) public mapSchool; // school address => contract
  mapping (address => address) public mapStudent; // student address => contract

  mapping (string => address) public emailToContract;

  event addedSchool(address newSchool, address newContract);
  event addedStudent(address newStudent, address newContract);
  event changedSchoolContract(address _schoolAddr,address _contractAddr);
  event changedStudentContract(address _studentAddr,address _contractAddr);
  
  constructor() public{
    transferOwnership(address(0x3E5C773519D38EB7996A5cADFDb8C8256889cB79));
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
  function _isStudent(address studentAddr) internal view returns(bool) {
    for (uint i=0; i< studentAddresses.length; i++){
      if (studentAddr == studentAddresses[i]) return true;
    }
    return false;
  }
  function addSchool( string memory name, string memory addressPlace, string memory phoneNumber, string memory email, string memory fax, string memory website, address schoolAddr)public onlyOwner(){
    require(!(_isSchool(schoolAddr)));
    schoolAddresses.push(schoolAddr);
    School schoolContract = new School(name, addressPlace, phoneNumber, email, fax, website, schoolAddr);
    mapSchool[schoolAddr] = address(schoolContract);
    emit addedSchool(schoolAddr, address(schoolContract));
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
  // STUDENT CONTRACT -----------------------------------
  function addStudent(address _studentAddr, string memory _email) public onlyOwner(){
    // check if studentAddress is exist
    for(uint i = 0 ; i< studentAddresses.length; i++){
      if (studentAddresses[i] == _studentAddr){
        return;
      }
    }
    Student stuContract;
    studentAddresses.push(_studentAddr);
    if(emailToContract[_email] == address(0)){
      stuContract = new Student(_studentAddr);
      emailToContract[_email] = address(stuContract);
    }else {
      stuContract = Student(emailToContract[_email]);
      stuContract.transferOwnership(_studentAddr);
    }
    // push student address to array
    mapStudent[_studentAddr] = address(stuContract);
    emit addedStudent(_studentAddr, address(stuContract));
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
  function getStudentContractAddr(address stuAddr) public view returns(address) {
    return (mapStudent[stuAddr] != address(0))? mapStudent[stuAddr] : address(0);
  }
  function createTempContractbyEmail (string memory _email) public onlyOwner(){
    require(emailToContract[_email] == address(0));
    Student stuC = new Student(msg.sender);
    emailToContract[_email] = address(stuC);
  }
  function getContractbyEmail (string memory _email) public view returns(address){
    return emailToContract[_email];
  }
} 

contract School is Ownable{
  string public name;
  string public addressPlace;
  string public phoneNumber;
  string public email;
  string public fax; 
  string public website;

  constructor(
    string memory _name,
    string memory _addressPlace,
    string memory _phoneNumber,
    string memory _email,
    string memory _fax,
    string memory _website,
    address schAddr
  ) public {
    name = _name;
    addressPlace = _addressPlace;
    phoneNumber = _phoneNumber;
    email = _email;
    fax = _fax;
    website = _website;
    transferOwnership(schAddr);
  }
  function getSchool() public view{
    name;
    addressPlace;
    phoneNumber;
    email;
    fax; 
    website;
  }
}

contract Student is Ownable{
  struct Certificate {
    uint8 state;
    address schoolAddress;
    bytes32 certHash;
  }

  bytes32[] public certificateList; // mang hashed_cert
  mapping (bytes32 => Certificate) mapCertificates; // hashed_cert => Certificate
  System public system;

  event addedCertificate(address _address, bytes32 _certHash);
  event deactivatedCertificate(address _address, bytes32 _certHash);
  event deletedCertificate(address _address, bytes32 _certHash);

  constructor(address stuAddr) public {
    system = System(msg.sender);
    transferOwnership(stuAddr);
  }
  
  modifier onlySchool() {
    require(system._isSchool(msg.sender));
    _;
  }

  function addCertificate(bytes32 _hashedCert) public onlySchool(){
    certificateList.push(_hashedCert);
    mapCertificates[_hashedCert] = Certificate(uint8(1), msg.sender, _hashedCert);
    emit addedCertificate(msg.sender, _hashedCert);
  }
  function deactivateCertificate(bytes32 _certHash) public onlySchool(){
    require(msg.sender == mapCertificates[_certHash].schoolAddress);
    mapCertificates[_certHash].state = uint8(0);
    emit deactivatedCertificate(msg.sender, _certHash);
  }
  function deleteCertificate(bytes32 _certHash) public onlySchool(){
    require(msg.sender == mapCertificates[_certHash].schoolAddress);
    mapCertificates[_certHash].state = uint8(2);
    emit deletedCertificate(msg.sender, _certHash);
  }
  function viewCertificate(bytes32 _certHash) public view returns(uint8, address, bytes32){
    Certificate storage cert = mapCertificates[_certHash];
    return (cert.state, cert.schoolAddress, cert.certHash);
  }
  
}