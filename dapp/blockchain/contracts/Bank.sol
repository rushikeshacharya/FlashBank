// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    uint256 blockingTime;
    address admin;

    constructor() {
        blockingTime = 30 seconds;
        admin = msg.sender;
    }

    struct Deposit {
        uint256 amount;
        uint256 time;
    }

    event AmountDeposited(address userAddress, Deposit userDetails);
    event AmountWithdrawn(address userAddress, uint256 amount);
    event BlockingTimeUpdated(uint256 oldBlockingTime, uint256 newBlockingTime);

    bool public reentrancyLock;
    mapping(address => Deposit[]) private userBalances;
    mapping(address => uint256) private totalAmount;

    function deposit(uint256 amount) external payable {
        require(amount > 0, "Invalid amount");
        require(!reentrancyLock);
        userBalances[msg.sender].push(
            Deposit({amount: amount, time: block.timestamp})
        );
        totalAmount[msg.sender] += amount;
        reentrancyLock = false;
        emit AmountDeposited(
            msg.sender,
            Deposit({amount: amount, time: block.timestamp})
        );
    }

    function withdraw(uint256 amount) external {
        require(amount <= totalAmount[msg.sender], "Insufficient amount");
        require(amount > 0, "No ether to withdraw");
        require(!reentrancyLock);

        Deposit[] storage temp = userBalances[msg.sender];
        uint256 availableWithdrwalAmount;
        for (uint256 i = 0; i < temp.length; i++) {
            if (
                temp[i].amount >= amount &&
                block.timestamp > temp[i].time + blockingTime
            ) {
                temp[i].amount -= amount;
                totalAmount[msg.sender] -= amount;
                availableWithdrwalAmount += amount;

                if (temp[i].amount == 0) {
                    delete temp[i];
                }
            }

            if (availableWithdrwalAmount == amount) {
                break;
            }
        }

        require(
            availableWithdrwalAmount == amount,
            "Withdrawal not allowed yet"
        );

        // payable(msg.sender).transfer(amount);
        reentrancyLock = false;
        emit AmountWithdrawn(msg.sender, amount);
    }

    function changeBlockingTime(uint timeInSeconds) external {
        uint256 oldTime = blockingTime;
        require(admin == msg.sender, "Only Admin can change the time");
        require(timeInSeconds > 0, "Invalid time value");
        blockingTime = timeInSeconds;
        emit BlockingTimeUpdated(oldTime, timeInSeconds);
    }

    function getDeposits(
        address user
    ) external view returns (Deposit[] memory) {
        return userBalances[user];
    }

    function getBalance(address user) external view returns (uint256) {
        return totalAmount[user];
    }

    function getBlokingTime() external view returns (uint256) {
        return blockingTime;
    }

    receive() external payable {
        this.deposit(msg.value);
    }
}
