import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("USwapLP", {
    from: deployer,
    args: ["0x75FB4953bB6122a25A6411032c9BD415f1b93282"],
    log: true,
  });
};
export default func;
func.tags = ["USwapLP"];
