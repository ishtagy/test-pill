import { ethers } from "hardhat";
import deployToken from "./deployToken";

async function main() {
  const [deployer, user1] = await ethers.getSigners();
  // Deploy the UddugToken contract using the deployToken script
  const token = await deployToken();
  const MINT_AMOUNT = 1000;

  console.log(
    "User token balance before mint: ",
    await token.balanceOf(user1.address)
  );

  console.log("Minting tokens...");
  // Mint tokens to user1
  await token.connect(deployer).mint(user1.address, MINT_AMOUNT);

  console.log(
    "User token balance after mint: ",
    await token.balanceOf(user1.address)
  );
}

main();
