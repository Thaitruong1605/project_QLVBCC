pragma solidity >=0.4.0 <0.9.0;

import "./Ownable.sol";

contract Issuer is Ownable{
  string public name;
  string public addressPlace;
  string public phoneNumber;
  string public email;
  string public fax; 
  string public website;

  event newIssuer (
    string name,
    string addressPlace,
    string phoneNumber,
    string email,
    string fax,
    string website
  );

  constructor(
    string memory _name,
    string memory _addressPlace,
    string memory _phoneNumber,
    string memory _email,
    string memory _fax,
    string memory _website
  ) public {
    name = _name;
    addressPlace = _addressPlace;
    phoneNumber = _phoneNumber;
    email = _email;
    fax = _fax;
    website = _website;
    transferOwnership(msg.sender);
    emit newIssuer(name, addressPlace, phoneNumber, email, fax, website);
  }

  function getData() public view{
    name;
    addressPlace;
    phoneNumber;
    email;
    fax; 
    website;
  }
}