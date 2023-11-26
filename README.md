# Distributed storage using Private Ethereum + IPFS network

## About
This project is a simple implementation of a private network that allows users to upload and retrieve files on an IPFS servers. The information about these files are stored on a smart contract deplyed in a private Ethereum network.

## Set up Private Ethereum Network

### Download Geth

Download the latest version of Geth [here](https://geth.ethereum.org/downloads).

### Create genesis.json

`genesis.json` provides the configuration for the network's genesis block and the entire network as a whole.

Here is a sample `genesis.json`:
```json
{
  "config": {
    "chainid": 241123,
    "homeSteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "ethash": {}
  },
  "difficulty": "0x200000",
  "gasLimit": "0x90000000",
  "alloc": {}
}
```

That file has some notable attributes:
- `chainid`: The id of our chain, you can use any arbitrary id as long as it does not match Ethereum mainnet (1) or popular testnets.
- `ethash`: The consensus algorithm. `ethash` will implement PoW in the network, choose `clique` for PoA and `casper` for PoS.
- `gasLimit`: The target gas limit of the network.

### Initialize Geth with genesis.json

```bash
# Initialize the network with genesis block configuration
geth --datadir NETWORK_DIRECTORY genesis.json
```

### Create account


We only need 1 account for this project but you can create as many accounts as you want. The keystore directory is located in the network folder, this is where the accounts' information are stored. 

```bash
clef newaccount --keystore PATH_TO_KEYSTORE
```
### Deploy the smart contract
Before we deploy the contract, we need a node up and mining to confirm the transaction which deploy the contract.

First, we run Geth client. In this step, we do not to expose any API endpoint:
```bash
geth --datadir NETWORK_DIRECTORY --nodiscover
```

Second, connect to Geth's JavaScript console:
```bash
geth attach \\.\pipe\geth.ipc
```
Then, start a miner:
```JavaScript
// Set an etherbase, which is the account the mined wei goes to
miner.setEtherbase(eth.accounts[0]);

// Start mining
miner.start();

// Check for mined wei
eth.getBalance(eth.accounts[0]);
```
Lastly, from the `ethereum-ipfs/backend`, run the `deploy.py` file. In the `data` folder, you will find the `ABI.json` and `bytecode` files. These files contain compiled data of the contract, ready for deployment.

### Run Geth node

For our project to work, we need to run Geth with some options:
- `http` and `ws.api` arguments: These define the API configurations we'll use to interact with our Ethereum network.
- `networkid`: This argument specify an ID for the private network. Only nodes (in the same chain) with the same network id can communicate or transact with each other.
- `unlock` arguments: Our accounts are locked by default. We need to unlock one of them to use as a sender for our transactions.
- `nodiscover`: This argument is optional. It prevents nodes from communicating, since we only want nodes to interact with the smart contract.

```bash
geth --datadir NETWORK_DIRECTORY --nodiscover --http --http.addr localhost --http.port 8545 --http.corsdomain=* --http.api web3,eth,debug,personal,net --ws.api web3,eth,debug,personal,net --networkid 241123 --allow-insecure-unlock --unlock ACCOUNT --password PASSWORD_FILE
```

## Set up IPFS

Follow this [guide](https://medium.com/@s_van_laar/deploy-a-private-ipfs-network-on-ubuntu-in-5-steps-5aad95f7261b)

## Install dependencies

Backend's dependencies:
```bash
cd backend
pip install -r requirements.txt
```
Frontend's dependencies:
```bash
cd frontend
npm i
```

## Start the app

Remember to start the Ethereum and IPFS networks first.

```bash
# On a terminal
npm run dev:frontend

# On another
npm run start:backend
```

