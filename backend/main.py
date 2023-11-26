from contract import deploy_contract, web3, contract
from flask import Flask, request, jsonify
from flask_cors import CORS
from ipfs import ipfs_api
from file_management import file_exists, get_file_info

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

@app.route('/add', methods=["POST"])
def add_file():
   try:
      file_path = request.get_json()['file_path']
      print(file_path)
      if not file_exists(file_path):
         raise Exception("File does not exist.")
      
      file_hash = ipfs_api.add(file_path)['Hash']
      exists = contract.functions.fileExists(file_hash).call()

      if exists:
         return jsonify({
            'error': 'File already added to IPFS'
         }), 409

      file_size, file_type, file_name = get_file_info(file_path)
      file_type = 'no extension' if file_type == '' else file_type
      tx_hash = contract.functions.fileUpload(file_hash, file_size, file_type, file_name).transact(
         {
            'from': web3.eth.accounts[0],
            'gas': 50000000
         }
      )
      tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
      return jsonify({
         'file_hash': file_hash,
         'transaction_status': tx_receipt['status']
      }), 201
   except Exception as e:
      return jsonify({
         'error': str(e)
      }), 400
     
@app.route('/get_file')
def get_file():
  file_id = request.args.get('file_id')
  file = contract.functions.files(int(file_id)).call()
  return jsonify(file), 200

@app.route('/get_file/all')
def get_all_files():
   file_count = contract.functions.fileCount().call()
   return jsonify({
      'files': [contract.functions.files(i).call() for i in range(1, file_count + 1)]
   }), 200

@app.route('/file_count')
def get_file_count():
   return jsonify({
      'file_count': contract.functions.fileCount().call()
   }), 200


if __name__ == '__main__':
    app.run(debug=True)







