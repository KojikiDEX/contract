import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.parseEther("0.001");

  const lock = await ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );

  const factory = await ethers.deployContract("KojikiFactory", [
    "0x99EDeCAc3106Ae3C322b84C30aEae03086586B63",
  ]);
  await factory.waitForDeployment();
  console.log("factory contract deployed at " + factory.target);
  const owner = "0x99EDeCAc3106Ae3C322b84C30aEae03086586B63";
  // const factory = "0x459bA2f7871336e95B78990C0e20636A54fdf6D2";
  const weth = "0x4200000000000000000000000000000000000006";
  const router = await ethers.deployContract("KojikiRouter", [
    factory.target,
    weth,
  ]);
  await router.waitForDeployment();
  console.log("router contract deployed at " + router.target);
  // const router = "0x680eb29BAC5AE6A56A2f8c688AC7f46B95f45a92";

  const sake = await ethers.deployContract("SakeToken", [
    "1400000000000000000000000",
    "1000000000000000000000000",
    "188583676300000",
    owner,
  ]);
  await sake.waitForDeployment();
  console.log("sake contract " + sake.target);

  const xSake = await ethers.deployContract("SakeStakeToken", [sake.target]);
  await xSake.waitForDeployment();
  console.log("xSake contract " + xSake.target);

  const master = await ethers.deployContract("KojikiMaster", [
    sake.target,
    "1692513641",
  ]);
  await master.waitForDeployment();
  console.log("master contract " + master.target);

  const nftPoolFactory = await ethers.deployContract("NFTPoolFactory", [
    master.target,
    sake.target,
    xSake.target,
  ]);
  await nftPoolFactory.waitForDeployment();
  console.log("NFTPoolFactory contract " + nftPoolFactory.target);

  const positionHelper = await ethers.deployContract("PositionHelper", [
    router,
    weth,
  ]);
  await positionHelper.waitForDeployment();
  console.log("positionHelper contract " + positionHelper.target);

  const raitoPoolFactory = await ethers.deployContract("RaitoPoolFactory", [
    sake.target,
    xSake.target,
    owner,
    owner,
  ]);
  await raitoPoolFactory.waitForDeployment();
  console.log("raitoPoolFactory contract " + raitoPoolFactory.target);

  // const yieldBooster = await ethers.deployContract('YieldBooster', [xSake.target]);
  // await yieldBooster.waitForDeployment();
  // console.log('yieldBooster contract ' + yieldBooster.target);

  // const dividEnd = await ethers.deployContract('Dividends', [xSake.target, "1691020800"]);
  // await dividEnd.waitForDeployment();
  // console.log('dividEnd contract ' + dividEnd.target);

  // const usdcContract = await ethers.deployContract('FiatTokenV2_1');
  // await usdcContract.waitForDeployment();
  // console.log('USDC contract ' + usdcContract.target);

  const dividendsContract = await ethers.deployContract("Dividends", [
    xSake.target,
    "1692513641",
  ]);
  await dividendsContract.waitForDeployment();
  console.log(
    "dividends contract " +
      dividendsContract.target +
      " with params " +
      xSake.target +
      " " +
      "1692513641"
  );

  const fairAuctionContract = await ethers.deployContract("FairAuction", [
    sake.target,
    xSake.target,
    "0x4200000000000000000000000000000000000006",
    "0x0000000000000000000000000000000000000000",
    "1692945641",
    "1693032041",
    "0xd76cAaaEC0C95fe3973B7E2B9A0107e6D3C5DB4D",
    "6000000000000000000",
    "4000000000000000000",
    "100000000000000000",
    "300000000000000000",
    "0",
  ]);
  await fairAuctionContract.waitForDeployment();
  console.log("fairAuctionContract contract " + fairAuctionContract.target);

  const yieldBoosterContract = await ethers.deployContract("YieldBooster", [
    xSake.target,
  ]);
  await yieldBoosterContract.waitForDeployment();
  console.log("yieldBoosterContract contract " + yieldBoosterContract.target);

  const launchPadContract = await ethers.deployContract("Launchpad", [
    xSake.target,
  ]);
  await launchPadContract.waitForDeployment();
  console.log("launchPadContract contract " + launchPadContract.target);

  const multicall = await ethers.deployContract("Multicall2");
  await multicall.waitForDeployment();
  console.log("launchPadContract contract " + multicall.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
