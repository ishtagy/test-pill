import { ethers } from "hardhat";
import deployToken from "./deployToken";

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();
  // Deploy the UddugToken contract using the deployToken script
  const token = await deployToken();

  const MINT_AMOUNT = 1000;
  const TRANSFER_AMOUNT = 100;

  // Mint tokens to user1
  await token.connect(deployer).mint(user1.address, MINT_AMOUNT);

  // Display user token balances before transferring
  console.log(
    "User1 token balance before transfer: ",
    await token.balanceOf(user1.address)
  );
  console.log(
    "User2 token balance before transfer: ",
    await token.balanceOf(user2.address)
  );

  console.log("Transfering tokens...");
  // Transfer tokens from user1 to user2
  await token.connect(user1).transfer(user2.address, TRANSFER_AMOUNT);

  // Display user token balances after transferring
  console.log(
    "User1 token balance after transfer: ",
    await token.balanceOf(user1.address)
  );
  console.log(
    "User2 token balance after transfer: ",
    await token.balanceOf(user2.address)
  );
}

main();
