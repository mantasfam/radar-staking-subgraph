// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/iRadarStake.sol";
import "./interfaces/iRadarToken.sol";
import "./interfaces/iRadarStakingLogic.sol";

contract RadarStake is iRadarStake, Ownable, ReentrancyGuard {

    constructor(address radarTokenContractAddr) {
        radarTokenContract = iRadarToken(radarTokenContractAddr);
    }

    /** EVENTS */
    event AddedToStake(address indexed owner, uint256 amount);
    event RemovedFromStake(address indexed owner, uint256 amount);

    /** PUBLIC VARS */
    iRadarToken public radarTokenContract;
    iRadarStakingLogic public radarStakingLogicContract;
    uint256 public totalStaked;
    Apr[] public allAprs;

    /** PRIVATE VARS */
    mapping(address => Stake) private _stakedTokens;

    /** MODIFIERS */
    modifier onlyStakingLogicContract() {
        require(_msgSender() == address(radarStakingLogicContract), "RadarStake: Only the StakingLogic contract can call this");
        _;
    }

    modifier requireVariablesSet() {
        require(address(radarTokenContract) != address(0), "RadarStake: Token contract not set");
        require(address(radarStakingLogicContract) != address(0), "RadarStake: StakingLogic contract not set");
        require(allAprs.length > 0, "RadarStake: No APR set");
        _;
    }

    /** PUBLIC */
    function getAllAprs() external view returns(Apr[] memory) {
        return allAprs;
    }

    function getApr(uint256 index) external view returns(Apr memory) {
        return allAprs[index];
    }
    
    function getAllAprsLength() external view returns (uint256) {
        return allAprs.length;
    }

    function getStake(address addr) external view returns (Stake memory) {
        return _stakedTokens[addr];
    }

    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }

    /** ONLY STAKING LOGIC CONTRACT */
    function addToStake(uint256 amount, address addr) external onlyStakingLogicContract {
        require(amount >= 0, "RadarStake: Amount has to be 0 or higher");
        require(addr != address(0), "RadarStake: Cannot use the null address");

        uint256 _totalStaked = totalStaked;

        Stake memory myStake = _stakedTokens[addr];
        if (myStake.totalStaked > 0 && _totalStaked >= myStake.totalStaked) {
            // subtract the current stake
            _totalStaked -= myStake.totalStaked;
        } else {
            // set to 0 if myStake is bigger than the amount of totalStaked tokens (which should never happen)
            _totalStaked = 0;
        }

        // save new object
        _stakedTokens[addr] = Stake({
            totalStaked: myStake.totalStaked + amount,
            lastStakedTimestamp: block.timestamp,
            cooldownSeconds: 0, // cooldown is not yet defined
            cooldownTriggeredAtTimestamp: 0 // cooldown is not yet defined
        });

        _totalStaked += myStake.totalStaked + amount;
        totalStaked = _totalStaked;

        emit AddedToStake(addr, amount);
    }

    function triggerUnstake(address addr, uint256 cooldownSeconds) external onlyStakingLogicContract {
        require(addr != address(0), "RadarStake: Cannot use the null address");
        require(cooldownSeconds > 0, "RadarStake: Cooldown seconds must be bigger than 0");

        Stake memory myStake = _stakedTokens[addr];
        require(myStake.totalStaked >= 0, "RadarStake: You have no stake yet");

        if (myStake.cooldownSeconds <= 0) {
            myStake.cooldownSeconds = cooldownSeconds;
            myStake.cooldownTriggeredAtTimestamp = block.timestamp;
            _stakedTokens[addr] = myStake;
        }
    }

    function removeFromStake(uint256 amount, address addr) external onlyStakingLogicContract {
        require(amount >= 0, "RadarStake: Amount cannot be lower than 0");
        require(addr != address(0), "RadarStake: Cannot use the null address");
        Stake memory myStake = _stakedTokens[addr];
        require(myStake.cooldownSeconds >= 0, "RadarStake: CooldownSeconds cannot be lower than 0");
        
        require(myStake.totalStaked >= amount, "RadarStake: You cannot unstake more than you have staked");
        require(totalStaked >= amount, "RadarStake: Cannot unstake more than is staked in total");

        if (myStake.totalStaked == amount) {
            // clean memory when the whole stake is being taken out
            delete(_stakedTokens[addr]);
        } else {
            // save new object
            myStake.totalStaked = myStake.totalStaked - amount;
            _stakedTokens[addr] = myStake;
        }
        totalStaked -= amount;

        emit RemovedFromStake(addr, amount);
    }

    /** ONLY OWNER */
    // called when we deploy a new version of our staking rewards logic (new features etc.)
    function setContracts(address radarStakingLogicContractAddr) external onlyOwner {
        require(radarStakingLogicContractAddr != address(0), "RadarStake: Cannot use the null address");
        radarStakingLogicContract = iRadarStakingLogic(radarStakingLogicContractAddr);
    }

    // e.g apr = 300 => 3% APR
    function changeApr(uint256 apr) external onlyOwner {
        require(apr >= 0, "RadarStake: APR cannot be lower than 0");

        // set endTime for previous APR to make rewards calculations easier later on
        if (allAprs.length > 0) {
            Apr storage previousApr = allAprs[allAprs.length - 1];
            previousApr.endTime = block.timestamp;
        }

        // add new APR to the array so rewards can start accruing for this new APR from now on
        allAprs.push(Apr({
            startTime: block.timestamp,
            endTime: 0,
            apr: apr
        }));
    }

    // this is needed so that our RadarStakingLogic contract is allowed to call transferFrom() in the name of this contract so that users can get their payout when they call RadarStakingLogic.harvest or RadarStakingLogic.unstake
    function allowTokenTransfers(uint256 amount) external onlyOwner {
        require(amount >= 0, "RadarStake: Amount cannot be lower than 0");

        radarTokenContract.approve(address(radarStakingLogicContract), amount);
    }

    // if someone sends RADAR to this contract by accident we want to be able to send it back to them
    function withdrawRewardTokens(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "RadarStake: Cannot use the null address");
        require(amount >= 0, "RadarStake: Amount cannot be lower than 0");
        
        uint256 radarBalance = radarTokenContract.balanceOf(address(this));
        require(radarBalance >= amount, "RadarStake: Cannot withdraw more than is available");
        
        require(radarBalance - amount >= totalStaked, "RadarStake: Cannot withdraw more than is staked");
        radarTokenContract.approve(address(this), amount);
        radarTokenContract.transferFrom(address(this), to, amount);
    }

    // if someone sends ETH to this contract by accident we want to be able to send it back to them
    function withdraw() external onlyOwner {
        uint256 totalAmount = address(this).balance;

        bool sent;
        (sent, ) = owner().call{value: totalAmount}("");
        require(sent, "RadarStake: Failed to send funds");
    }
}