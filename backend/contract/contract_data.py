import json

with open('./data/ABI.json') as abi_file:
  ABI = json.load(abi_file)

with open('./data/bytecode') as bytecode_file:
  BYTECODE = bytecode_file.read()
