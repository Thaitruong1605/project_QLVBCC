pragma solidity >=0.4.22 <0.9.0;

import "./Ownable.sol";

contract InterfaceStudent {
    function addCertificates(address _address, bytes32 _hashedCert) external{}
}
contract Student is Ownable{
  struct Certificate {
    uint8 state;
    address issuerAddress;
    bytes32 certHash;
  }
  bytes32[] public certificateList; // mang hashed_cert
  mapping (bytes32 => Certificate) mapCertificates; // hashed_cert => Certificate
 
  event addCert(address _address, bytes32 _hashedCert);

  constructor() public {
    transferOwnership(msg.sender);
  }

  function transfer(address newOwner) public {
    transferOwnership(newOwner);
  }

  function addCertificates(address _address, bytes32 _hashedCert) external{
    certificateList.push(_hashedCert);
    mapCertificates[_hashedCert] = Certificate(uint8(0), _address, _hashedCert);
    emit addCert(_address, _hashedCert);
  }
  
  function _deactivateCertificate(bytes32 _certHash) external{
    mapCertificates[_certHash].state = 0;
  }

  function _deleteCertificate(bytes32 _certHash) external{
    mapCertificates[_certHash].state = 2;
  }

  function viewCertificate(bytes32 _certHash) public view returns (uint8, address, bytes32){
    Certificate storage cert = mapCertificates[_certHash];
    return (cert.state, cert.issuerAddress, cert.certHash);
  }
}
