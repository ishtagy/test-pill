import { ethers } from "hardhat";
import deployToken from "./deployToken";

async function main() {
  const [deployer, user1] = await ethers.getSigners();
  // Deploy the UddugToken contract using the deployToken script
  const token = await deployToken();
  const BURN_AMOUNT = 200;
  const MINT_AMOUNT = 1000;

  // Mint tokens to user1
  await token.connect(deployer).mint(user1.address, MINT_AMOUNT);

  console.log(
    "User token balance before burn: ",
    await token.balanceOf(user1.address)
  );

  console.log("Burning tokens...");
  // Burn tokens from user1's address
  await token.connect(deployer).burn(user1.address, BURN_AMOUNT);

  console.log(
    "User token balance after burn: ",
    await token.balanceOf(user1.address)
  );
}

main();
