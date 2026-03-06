// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

interface IDonateLinkRead {
    function totalDonationsCount() external view returns (uint256);
}

contract DonateLinkAutomation is AutomationCompatibleInterface {
    IDonateLinkRead public donateLinkMain;
    uint256 public lastKnownCount;
    uint256 public lastUpkeepTimestamp;
    uint256 public upkeepInterval = 300; // 5 minutes

    event MilestoneReached(uint256 totalDonations);
    event LeaderboardRefreshTriggered(uint256 timestamp);

    constructor(address _donateLinkMain) {
        donateLinkMain = IDonateLinkRead(_donateLinkMain);
        lastUpkeepTimestamp = block.timestamp;
    }

    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 currentCount = donateLinkMain.totalDonationsCount();
        bool countChanged = currentCount > lastKnownCount;
        bool timeElapsed = (block.timestamp - lastUpkeepTimestamp) >= upkeepInterval;

        upkeepNeeded = countChanged || timeElapsed;
        performData = abi.encode(currentCount, countChanged, timeElapsed);
    }

    function performUpkeep(bytes calldata) external override {
        // Re-read state directly — do NOT trust performData from caller
        uint256 currentCount = donateLinkMain.totalDonationsCount();
        bool countChanged = currentCount > lastKnownCount;
        bool timeElapsed = (block.timestamp - lastUpkeepTimestamp) >= upkeepInterval;

        require(countChanged || timeElapsed, "No upkeep needed");

        if (countChanged) {
            lastKnownCount = currentCount;
            if (currentCount % 10 == 0) {
                emit MilestoneReached(currentCount);
            }
        }

        if (timeElapsed) {
            lastUpkeepTimestamp = block.timestamp;
            emit LeaderboardRefreshTriggered(block.timestamp);
        }
    }
}
