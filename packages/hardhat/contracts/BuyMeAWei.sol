// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BuyMeAWei is Ownable {
    struct Profile {
        string name;
        string description;
        string handle;
        uint256 totalDonations;
        uint256 pendingBalance;
        bool exists;
        mapping(address => uint256) donations;
    }

    mapping(address => Profile) public profiles;
    mapping(string => address) public handleToAddress;

    uint256 public donationTaxPercentage = 5;

    event ProfileCreated(address indexed walletAddress, string name, string description, string handle);
    event ProfileUpdated(address indexed walletAddress, string name, string description);
    event DonationReceived(address indexed donor, address indexed recipient, uint256 amount);
    event BalanceWithdrawn(address indexed walletAddress, uint256 amount);

    function createProfile(string memory _name, string memory _description, string memory _handle) public {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_description).length > 0, "Description is required");
        require(bytes(_handle).length > 0, "Handle is required");
        require(handleToAddress[_handle] == address(0), "Handle already exists");
        require(keccak256(bytes(_handle)) != keccak256(bytes("dashboard")), "Handle is reserved");
        require(!profiles[msg.sender].exists, "Profile already exists");

        Profile storage profile = profiles[msg.sender];
        profile.name = _name;
        profile.description = _description;
        profile.handle = _handle;

        handleToAddress[_handle] = msg.sender;

        emit ProfileCreated(msg.sender, _name, _description, _handle);
    }

    function updateProfile(string memory _name, string memory _description) public {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_description).length > 0, "Description is required");

        Profile storage profile = profiles[msg.sender];
        require(bytes(profile.handle).length > 0, "Profile not found");

        profile.name = _name;
        profile.description = _description;

        emit ProfileUpdated(msg.sender, _name, _description);
    }

    function donate(address _recipient) public payable {
        Profile storage profile = profiles[_recipient];
        require(bytes(profile.handle).length > 0, "Profile not found");

        uint256 amount = msg.value;
        uint256 donationTax = (amount * donationTaxPercentage) / 100;
        uint256 donationAmount = amount - donationTax;

        // Update profile's total donations and individual donation amount
        profile.totalDonations += donationAmount;
        profile.donations[msg.sender] += donationAmount;

        // Add donation amount to pending balance
        profile.pendingBalance += donationAmount;

        emit DonationReceived(msg.sender, _recipient, donationAmount);

        payable(owner()).transfer(donationTax);
    }

    function setDonationTaxPercentage(uint256 _percentage) public onlyOwner {
        require(_percentage <= 100, "Percentage must be between 0 and 100");
        donationTaxPercentage = _percentage;
    }

    function withdrawBalance() public {
        Profile storage profile = profiles[msg.sender];
        require(bytes(profile.handle).length > 0, "Profile not found");

        uint256 balance = profile.pendingBalance;
        require(balance > 0, "No balance to withdraw");

        profile.pendingBalance = 0;

        emit BalanceWithdrawn(msg.sender, balance);

        payable(msg.sender).transfer(balance);
    }
}
