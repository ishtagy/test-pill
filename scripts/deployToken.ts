import { ethers } from "hardhat";

/**
 * @notice Deploys the UddugToken contract with an initial supply.
 * @returns Deployed instance of the UddugToken contract.
 */
async function deployToken() {
  const INITIAL_SUPPLY = 1000000;
  const [deployer] = await ethers.getSigners();
  let uddugTokenFactory = await ethers.getContractFactory(
    "UddugToken",
    deployer
  );
  let uddugToken = await uddugTokenFactory.deploy(INITIAL_SUPPLY);

  // Return the deployed instance of the UddugToken contract
  return uddugToken;
}

export default deployToken;
