const { ethers, network} = require("hardhat");
const path = require('path');
const saveTransactionGasUsed = require("../utils/saveTransactionGasUsed");
const adresses = require("./0000_addresses.json")
const { DATA } = require("../utils/opt")


const opt = {
  owner: DATA.deploy.ownerAddress,
  contractName: DATA.NFT.contractName,
  name: DATA.NFT.name,
  symbol: DATA.NFT.symbol,
  baseURI: DATA.NFT.baseURI,
}

async function main() {
  const contractABI = require('../artifacts/contracts/' + opt.contractName + ".sol/" + opt.contractName + ".json");

  const Contract = await ethers.getContractAt(contractABI.abi, adresses[network.name][opt.contractName]);

  console.log("Contract value is updating... Network:"+ network.name);
 
  try {
    const tx = await Contract.createHolders(DATA.nftOwners, DATA.nftIds);
    const receipt = await tx.wait();
    console.log("Success tx:", receipt.hash);

    await saveTransactionGasUsed(path.basename(__filename), receipt.gasUsed.toString())
  } catch (error) {
    console.error("Error! Message:", error.message);
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
