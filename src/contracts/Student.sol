pragma solidity >=0.4.22 <0.9.0;

import "./Ownable.sol";
import "./Issuer.sol";

contract Student is Ownable{
  struct Certificate {
    uint8 state;
    address issuerAddress;
    bytes32 certHash;
  }
  
  bytes32[] public certificateList; // mang hashed_cert
  
  mapping (bytes32 => Certificate) mapCerfiticates; // hashed_cert => Certificate
  
  constructor() public {
    transferOwnership(msg.sender);
  }

  function transfer(address newOwner) public {
    transferOwnership(newOwner);
  }

  function _addCerfiticates(address _address, bytes32 _hashedCert) internal{
    certificateList.push(_hashedCert);
    mapCerfiticates[_hashedCert] = Certificate(uint8(0), _address, _hashedCert);
  }
  
  function _deactivateCertificate(bytes32 _certHash) internal{
    mapCerfiticates[_certHash].state = 0;
  }

  function _deleteCertificate(bytes32 _certHash) internal{
    mapCerfiticates[_certHash].state = 2;
  }

  function viewCertificate(bytes32 _certHash) public view returns (uint8, address, bytes32){
    Certificate storage cert = mapCerfiticates[_certHash];
    return (cert.state, cert.issuerAddress, cert.certHash);
  }
}