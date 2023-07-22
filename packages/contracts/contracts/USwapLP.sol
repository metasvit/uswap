// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.9;

import {ILendingPool} from "./interfaces/ILendingPool.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract USwapLP is Multicall, ReentrancyGuard {
    ILendingPool public lendingPool;

    constructor(ILendingPool _lendingPool) {
        lendingPool = _lendingPool;
    }

    // user must approve this contract to spend fromToken before calling
    function swapWithBorrow(
        address sender,
        address fromToken,
        uint256 fromAmount,
        address toToken,
        uint256 toAmount
    )public nonReentrant {
        // transfer fromToken to this contract
        IERC20(fromToken).transferFrom(sender, address(this), fromAmount);

        // borrow toToken from LendingPool
        lendingPool.borrow(toToken, toAmount, 1, 1, address(this));

        // transfer toToken to sender
        IERC20(toToken).transferFrom(address(this), sender, toAmount);
    }
}
