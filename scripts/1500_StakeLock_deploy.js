const { ethers, network } = require("hardhat");
const saveContractAddress = require("../utils/saveContractAddress");
const path = require('path');
const saveTransactionGasUsed = require("../utils/saveTransactionGasUsed");
const { DATA } = require("../utils/opt")

const opt = {
  contractName: DATA.stakingLock.contractName,
  ownerAddress: DATA.deploy.ownerAddress,
  tokenAddress: DATA.deploy.tokenAddress,
  launchTime: DATA.stakingLock.launchTime,
  rewardPeriod: DATA.stakingLock.rewardPeriod,
  penaltySecond: DATA.stakingLock.penaltySecond,
}

async function main() {
  const CONTRACT = await ethers.getContractFactory(opt.contractName);
  const contract = await CONTRACT.deploy(
    opt.ownerAddress, opt.tokenAddress, opt.launchTime, opt.penaltySecond);

  console.log("Deploy Verify Options: ### ", contract.target,
  opt.ownerAddress, opt.tokenAddress, opt.launchTime, opt.penaltySecond, " ###"
  );


  const deploymentTransaction = await contract.deploymentTransaction();
  const receipt = await deploymentTransaction.wait();

  await contract.waitForDeployment()

  await saveContractAddress(opt.contractName, contract.target);
  await saveTransactionGasUsed(path.basename(__filename), receipt.gasUsed.toString())
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
