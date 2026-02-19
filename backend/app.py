from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
from collections import defaultdict
import os
from services.algorand_service import (
    mint_product,
    verify_product,
    transfer_nft
)
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGO_URI"))
db = client['product_verification']
products_collection = db['products']
transfers_collection = db['transfers']
scans_collection = db['scans']   # 👈 NEW: store verification scans


@app.route('/api/register', methods=['POST'])
def register_product():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    data['tokenId'] = str(data['tokenId'])
    products_collection.insert_one(data)

    return jsonify({"message": "Product registered"}), 200


    
@app.route("/api/mint", methods=["POST"]) #NEW
def api_mint():

    data = request.json

    metadata = {
        "product_name": data["product_name"],
        "serial_number": data["serial_number"],
        "model": data["model"],
        "color": data["color"],
        "manufacturer": data["manufacturer"]
    }

    result = mint_product(metadata)

    return jsonify(result), 200

@app.route("/api/verify/<int:asset_id>", methods=["POST"]) #NEW
def api_verify(asset_id):

    backend_metadata = request.json

    result = verify_product(asset_id, backend_metadata)

    return jsonify(result), 200

@app.route("/api/transfer-onchain", methods=["POST"]) #NEW
def api_transfer():

    data = request.json

    result = transfer_nft(
        asset_id=int(data["assetId"]),
        receiver=data["receiver"]
    )

    return jsonify(result), 200





if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
