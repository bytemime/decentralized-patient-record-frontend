import web3 from "./web3";
const address = "0xD8F0E30A61eD71244c6e0d5C99A84a48726797AC";
const abi = [
  {
    constant: false,
    inputs: [
      {
        name: "_str",
        type: "string"
      }
    ],
    name: "setHash",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getHash",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

export default new web3.eth.Contract(abi, address);
