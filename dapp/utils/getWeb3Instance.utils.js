import { Web3 } from "web3";
import fsPromise from "fs/promises";
import "dotenv/config";

const HOST = process.env.BLOCKCHAIN_HOST;
const bankContractAddress = process.env.BANK_CONTRACT_ADDRESS;
const senderPK = process.env.ACCOUNT_PRIVATE_KEY;

const web3 = new Web3(new Web3.providers.HttpProvider(HOST));
const account = web3.eth.accounts.privateKeyToAccount(senderPK);
web3.eth.accounts.wallet.add(account);
const filePath = "./blockchain/artifacts/contracts/Bank.sol/Bank.json";
const getABI = async () => {
  const data = await fsPromise.readFile(filePath, "utf-8");
  return await JSON.parse(data)["abi"];
};

export const getContractInstance = async () => {
  const ABI = await getABI();
  const contractInsatnace = new web3.eth.Contract(ABI, bankContractAddress);
  contractInsatnace.options.handleRevert = true;
  return contractInsatnace;
};

export const getWeb3Instance = () => {
  return web3;
};
