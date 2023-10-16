// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IKojikiMaster.sol";
import "./interfaces/tokens/ISakeStakeToken.sol";
import "./NFTPool.sol";


contract NFTPoolFactory {
  IKojikiMaster public immutable master; // Address of the master
  IERC20 public immutable sakeToken;
  ISakeStakeToken public immutable sakeStakeToken;

  mapping(address => address) public getPool;
  address[] public pools;

  constructor(
    IKojikiMaster master_,
    IERC20 _sakeToken,
    ISakeStakeToken sakeStakeToken_
  ) {
    master = master_;
    sakeToken = _sakeToken;
    sakeStakeToken = sakeStakeToken_;
  }

  event PoolCreated(address indexed lpToken, address pool);

  function poolsLength() external view returns (uint256) {
    return pools.length;
  }

  function createPool(address lpToken) external returns (address pool){
    require(getPool[lpToken] == address(0), "pool exists");

    bytes memory bytecode_ = _bytecode();
    bytes32 salt = keccak256(abi.encodePacked(lpToken));
    /* solhint-disable no-inline-assembly */
    assembly {
        pool := create2(0, add(bytecode_, 32), mload(bytecode_), salt)
    }
    require(pool != address(0), "failed");
    NFTPool(pool).initialize(master, sakeToken, sakeStakeToken, IERC20(lpToken));
    getPool[lpToken] = pool;
    pools.push(pool);

    emit PoolCreated(lpToken, pool);
  }

  function _bytecode() internal pure virtual returns (bytes memory) {
    return type(NFTPool).creationCode;
  }
}