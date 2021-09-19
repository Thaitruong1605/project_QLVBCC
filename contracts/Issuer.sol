pragma solidity >=0.4.0 <0.9.0;

import "./Ownable.sol";
import "./Student.sol";

contract Issuer is Ownable{
  string public name;
  
  event newIssuer (
    string name
  );

  constructor(string memory _name)
  public {
    transferOwnership(msg.sender);
    name = _name;
    emit newIssuer(name);
  }
}