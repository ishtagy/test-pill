import { ethers } from "hardhat";
import { expect } from "chai";
import { UddugToken } from "../../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("UddugToken Test", function () {
  // Constants for test values
  const INITIAL_SUPPLY = 1000000;
  const MINT_AMOUNT = 1000;
  const TRANSFER_AMOUNT = 100;
  const BURN_AMOUNT = 200;

  // Variables for contract instance and signers
  let uddugToken: UddugToken,
    deployer: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];

    // Deploy the UddugToken contract
    let uddugTokenFactory = await ethers.getContractFactory(
      "UddugToken",
      deployer
    );
    uddugToken = await uddugTokenFactory.deploy(INITIAL_SUPPLY);
  });

  // Check if the initial supply is minted to the deployer
  it("Should deploy and mint initial supply", async function () {
    expect(await uddugToken.balanceOf(deployer.address)).to.equal(
      INITIAL_SUPPLY
    );
  });

  describe("Mint Function Tests", () => {
    it("Owner can successfully mint tokens", async function () {
      // Mint tokens to user1 and check the balance
      await uddugToken.connect(deployer).mint(user1.address, MINT_AMOUNT);

      expect(await uddugToken.balanceOf(user1.address)).to.equal(MINT_AMOUNT);
    });

    it("Doesn't allow non-owner to mint tokens", async function () {
      // Attempt to mint tokens by user1 and expect it to revert
      await expect(uddugToken.connect(user1).mint(user1.address, MINT_AMOUNT))
        .to.be.reverted;
    });
  });

  describe(" Burn Function Tests", () => {
    it("Owner can successfully burn tokens", async function () {
      // Mint tokens to user1, burn, and check the balance
      await uddugToken.connect(deployer).mint(user1.address, MINT_AMOUNT);
      expect(await uddugToken.balanceOf(user1.address)).to.equal(MINT_AMOUNT);
      await uddugToken.connect(deployer).burn(user1.address, BURN_AMOUNT);
      expect(await uddugToken.balanceOf(user1.address)).to.equal(
        MINT_AMOUNT - BURN_AMOUNT
      );
    });

    it("Doesn't allow non-owner to burn tokens", async function () {
      // Attempt to burn tokens by user1 and expect it to revert
      await expect(
        uddugToken.connect(user1).burn(deployer.address, MINT_AMOUNT)
      ).to.be.reverted;
    });

    it("Emits an event when burning tokens", async function () {
      // Burn tokens and check if the 'Burn' event is emitted
      await expect(
        uddugToken.connect(deployer).burn(deployer.address, 100)
      ).to.emit(uddugToken, "Burn");
    });
  });

  describe("Transfer Function Tests", () => {
    it("Should transfer tokens between accounts", async function () {
      // Mint tokens to user1, transfer to user2, and check balances
      await uddugToken.connect(deployer).mint(user1.address, MINT_AMOUNT);

      await uddugToken.connect(user1).transfer(user2.address, TRANSFER_AMOUNT);

      expect(await uddugToken.balanceOf(user1.address)).to.equal(
        MINT_AMOUNT - TRANSFER_AMOUNT
      );
      expect(await uddugToken.balanceOf(user2.address)).to.equal(
        TRANSFER_AMOUNT
      );
    });
    it("Emits an event when transferring tokens", async function () {
      // Mint tokens and check if the 'Mint' event is emitted
      await expect(
        uddugToken.connect(deployer).mint(user1.address, 100)
      ).to.emit(uddugToken, "Mint");
    });
  });

  describe("TransferFrom Function Tests", () => {
    beforeEach(async () => {
      // Mint tokens to user1 before each test
      await uddugToken.connect(deployer).mint(user1.address, MINT_AMOUNT);
    });

    it("Should allow approved users to spend token", async function () {
      // Approve user2 to spend TRANSFER_AMOUNT tokens from user1 and check balances
      await uddugToken.connect(user1).approve(user2.address, TRANSFER_AMOUNT);

      await uddugToken
        .connect(user2)
        .transferFrom(user1.address, user2.address, TRANSFER_AMOUNT);

      expect(await uddugToken.balanceOf(user2.address)).to.equal(
        TRANSFER_AMOUNT
      );
    });

    it("Doesn't allow unapproved users to spend tokens", async function () {
      // Attempt to transferFrom without approval and expect it to revert
      await expect(
        uddugToken
          .connect(user2)
          .transferFrom(user1.address, user2.address, TRANSFER_AMOUNT)
      ).to.be.reverted;
    });
  });
});
