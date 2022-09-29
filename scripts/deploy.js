const { ethers } = require("hardhat");

const main = async() => {
  const [deployer] = await ethers.getSigners();

  const UChildDAI = await ethers.getContractFactory("UChildDAI");
  const uChildDAI = await UChildDAI.deploy(deployer.address);

  console.log("uChildToken address:", uChildDAI.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
