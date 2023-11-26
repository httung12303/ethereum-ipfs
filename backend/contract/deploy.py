from web3 import Web3

from .contract_data import ABI, BYTECODE

def deploy_contract():
  web3 = Web3(Web3.HTTPProvider('http://localhost:8545'));

  web3.defaultAccount = web3.eth.accounts[0]

  DStorage = web3.eth.contract(abi=ABI, bytecode=BYTECODE)

  tx_hash = DStorage.constructor().transact({
    'from': web3.eth.accounts[0]
  })

  tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

  with open('./data/contract_address', 'w') as contract_address_file:
    contract_address_file.write(tx_receipt.contractAddress)