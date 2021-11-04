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
  mapping (address => address) public mapSchool;
  mapping (address => address) public mapStudent;
  
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
    for (uint i=0; i<= schoolAddresses.length; i++){
      if (msg.sender == schoolAddresses[i]) return true;
    }
    return false;
  }
  function _isSchool(address schoolAddr) internal view returns(bool) {
    for (uint i=0; i<= schoolAddresses.length; i++){
      if (schoolAddr == schoolAddresses[i]) return true;
    }
    return false;
  }
  function _isStudent(address studentAddr) internal view returns(bool) {
    for (uint i=0; i<= studentAddresses.length; i++){
      if (studentAddr == studentAddresses[i]) return true;
    }
    return false;
  }

  function addSchool ( string memory name, string memory addressPlace, string memory phoneNumber, string memory email, string memory fax, string memory website, address schoolAddr)public onlyOwner(){
    if (!_isSchool(schoolAddr)){
      schoolAddresses.push(schoolAddr);
      School schoolContract = new School(name, addressPlace, phoneNumber, email, fax, website, schoolAddr);
      mapSchool[schoolAddr] = address(schoolContract);
      emit addedSchool(schoolAddr, address(schoolContract));
    }
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
  function addStudent(address _studentAddr) public onlyOwner(){
    for(uint i = 0 ; i< studentAddresses.length; i++){
      if (studentAddresses[i] == _studentAddr){
        return;
      }
    }
    studentAddresses.push(_studentAddr);
    Student stuContract = new Student(_studentAddr);
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
} 

contract School is Ownable{
  string public name;
  string public addressPlace;
  string public phoneNumber;
  string public email;
  string public fax; 
  string public website;
  
  System public system;

  constructor(
    string memory _name,
    string memory _addressPlace,
    string memory _phoneNumber,
    string memory _email,
    string memory _fax,
    string memory _website,
    address schAddr
  ) public {
    system = System(msg.sender);
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
  function setSystem(address sysAddr) public {
      system = System(sysAddr);
  }
  function addCertificate (address stuAddr, bytes32 ipfs, bytes32 certHash ) public onlyOwner(){
    address stuContractAddress = system.getStudentContractAddr(stuAddr);
    if(stuContractAddress != address(0)) {
      Student stuContract = Student(stuContractAddress);
      stuContract._addCertificate(ipfs, certHash);
    }
  }
  function deactivateCertificate(address stuAddr, bytes32 certHash) public onlyOwner(){
    address stuContractAddress = system.getStudentContractAddr(stuAddr);
    if(stuContractAddress != address(0)) {
      Student stuContract = Student(stuContractAddress);
      stuContract._deactivateCertificate(certHash);
    }
  }
  function deleteCertificate(address stuAddr, bytes32 certHash) public onlyOwner(){
    address stuContractAddress = system.getStudentContractAddr(stuAddr);
    if(stuContractAddress != address(0)) {
      Student stuContract = Student(stuContractAddress);
      stuContract._deleteCertificate(certHash);
    }
  }
}

contract Student is Ownable{
  struct Certificate {
    uint8 state;
    address schoolAddress;
    bytes32 ipfs;
    bytes32 certHash;
  }
  struct Degree {
    uint8 state;
    address schoolAddress;
    bytes32 ipfs;
    bytes32 degreeHash;
  }
  
  bytes32[] public certificateList; // mang hashed_cert
  mapping (bytes32 => Certificate) mapCertificates; // hashed_cert => Certificate
  bytes32[] public degreeList; // mang hashed_cert
  mapping (bytes32 => Degree) mapDegrees; // hashed_cert => Certificate
  System public system;

  event addCertificate(address _address, bytes32 _certHash);
  event deactivateCertificate(address _address, bytes32 _certHash);
  event deleteCertificate(address _address, bytes32 _certHash);

  event addDegree(address _address, bytes32 _certHash);
  event deactivateDegree(address _address, bytes32 _certHash);
  event deleteDegree(address _address, bytes32 _certHash);

  constructor(address stuAddr) public {
    system = System(msg.sender);
    transferOwnership(stuAddr);
  }
  
  modifier onlySchool() {
    require(system.isSchool());
    _;
  }

  function _addCertificate(bytes32 _ipfs,bytes32 _hashedCert) external onlySchool(){
    certificateList.push(_hashedCert);
    mapCertificates[_hashedCert] = Certificate(uint8(1), msg.sender, _ipfs, _hashedCert);
    emit addCertificate(msg.sender, _hashedCert);
  }
  function _deactivateCertificate(bytes32 _certHash) external onlySchool(){
    mapCertificates[_certHash].state = uint8(0);
    emit deactivateCertificate(msg.sender, _certHash);
  }
  function _deleteCertificate(bytes32 _certHash) external onlySchool(){
    mapCertificates[_certHash].state = uint8(2);
    emit deleteCertificate(msg.sender, _certHash);
  }
  function viewCertificate(bytes32 _certHash) public view returns(uint8, address, bytes32, bytes32){
    Certificate storage cert = mapCertificates[_certHash];
    return (cert.state, cert.schoolAddress, cert.certHash, cert.ipfs);
  }

  function _addDegree(bytes32 _ipfs,bytes32 _degreeHash) external onlySchool(){
    degreeList.push(_degreeHash);
    mapDegrees[_degreeHash] = Degree(uint8(1), msg.sender, _ipfs, _degreeHash);
    emit addDegree(msg.sender, _degreeHash);
  }
  function _deactivateDegree(bytes32 _degreeHash) external onlySchool(){
    mapDegrees[_degreeHash].state = uint8(0);
    emit deactivateDegree(msg.sender, _degreeHash);
  }
  function _deleteDegree(bytes32 _degreeHash) external onlySchool(){
    mapDegrees[_degreeHash].state = uint8(2);
    emit deleteDegree(msg.sender, _degreeHash);
  }
  function viewDegree(bytes32 _degreeHash) public view returns(uint8, address, bytes32, bytes32){
    Degree storage degree = mapDegrees[_degreeHash];
    return (degree.state, degree.schoolAddress, degree.degreeHash, degree.ipfs);
  }
  
}
