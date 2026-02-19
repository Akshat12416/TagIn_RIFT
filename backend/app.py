from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

from services.algorand_service import (
    mint_product,
    verify_product,
    is_whitelisted
)

load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["product_verification"]

products_collection = db["products"]
transfers_collection = db["transfers"]


# ─────────────────────────────
# ON-CHAIN WHITELIST CHECK
# ─────────────────────────────
@app.route("/api/check-whitelist/<address>", methods=["GET"])
def check_whitelist(address):

    allowed = is_whitelisted(address)

    return jsonify({
        "allowed": allowed
    }), 200


# ─────────────────────────────
# GET PRODUCT
# ─────────────────────────────
@app.route("/api/product/<token_id>", methods=["GET"])
def get_product_by_token_id(token_id):

    product = products_collection.find_one(
        {"tokenId": str(token_id)}, {"_id": 0}
    )

    if product:
        return jsonify(product), 200
    else:
        return jsonify({"error": "Product not found"}), 404


# ─────────────────────────────
# STORE MINT RESULT (After Wallet Signing)
# ─────────────────────────────
@app.route("/api/mint", methods=["POST"])
def api_mint():

    data = request.json

    products_collection.insert_one({
        "product_name": data["product_name"],
        "serial_number": data["serial_number"],
        "model": data["model"],
        "type": data["type"],
        "color": data["color"],
        "manufacture_date": data["manufacture_date"],   # 👈 IMPORTANT
        "tokenId": str(data["tokenId"]),
        "metadataHash": data["metadataHash"],
        "manufacturer": data["manufacturer"],
        "owner": data["manufacturer"],
        "createdAt": datetime.utcnow()
    })



    return jsonify({"message": "Stored successfully"}), 200


# ─────────────────────────────
# VERIFY
# ─────────────────────────────
@app.route("/api/verify/<int:asset_id>", methods=["POST"])
def api_verify(asset_id):

    backend_metadata = request.json
    result = verify_product(asset_id, backend_metadata)

    return jsonify(result), 200


# ─────────────────────────────
# UPDATE DB AFTER WALLET TRANSFER
# ─────────────────────────────
@app.route("/api/transfer", methods=["POST"])
def transfer_ownership():

    data = request.json

    token_id = str(data["tokenId"])
    from_address = data["from"]
    to_address = data["to"]
    tx_id = data["txId"]
    timestamp = data["timestamp"]

    # Update owner in products collection
    products_collection.update_one(
        {"tokenId": token_id},
        {"$set": {"owner": to_address}}
    )

    # Insert transfer record
    transfers_collection.insert_one({
        "tokenId": token_id,
        "from": from_address,
        "to": to_address,
        "txId": tx_id,
        "timestamp": timestamp
    })

    return jsonify({"message": "Ownership updated in DB"}), 200


@app.route('/api/products/<address>', methods=['GET'])
def get_products_by_manufacturer(address):
    try:
        products = list(
            products_collection.find(
                {"manufacturer": address},
                {"_id": 0}
            )
        )
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# ─────────────────────────────
# LOG SCAN EVENT
# ─────────────────────────────
@app.route("/api/scan", methods=["POST"])
def log_scan():

    data = request.json

    scans_collection = db["scans"]

    scans_collection.insert_one({
        "tokenId": str(data["tokenId"]),
        "manufacturer": data["manufacturer"],
        "owner": data["owner"],
        "isVerified": data["isVerified"],
        "source": data["source"],  # manual or nfc
        "timestamp": data["timestamp"]
    })

    return jsonify({"message": "Scan logged"}), 200


@app.route('/api/transfers/<token_id>', methods=['GET'])
def get_transfers(token_id):
    try:
        transfers = list(
            transfers_collection.find(
                {
                    "$or": [
                        {"tokenId": token_id},
                        {"tokenId": str(token_id)},
                        {"tokenId": int(token_id)}
                    ]
                },
                {"_id": 0}
            )
        )
        return jsonify(transfers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500






if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
