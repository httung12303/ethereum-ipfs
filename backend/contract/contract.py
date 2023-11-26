from web3 import Web3
from .contract_data import ABI

with open('./data/contract_address', 'r') as contract_address_file:
  CONTRACT_ADDRESS = contract_address_file.read()

web3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)