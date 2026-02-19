import os
import json
import hashlib
import base64
from algosdk.v2client import algod, indexer
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

INDEXER_ADDRESS = "https://testnet-idx.algonode.cloud"
INDEXER_TOKEN = ""

APP_ID = 755771651
ASSET_ID = 755772786  # replace if needed

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
indexer_client = indexer.IndexerClient(INDEXER_TOKEN, INDEXER_ADDRESS)


# ─────────────────────────────
# Simulated Backend Metadata
# (Later this will come from MongoDB)
# ─────────────────────────────
def get_backend_metadata():

    metadata = {
        "product_name": "Verified Shoes",
        "serial_number": "SN123456",
        "model": "V1",
        "color": "Black",
        "manufacturer": get_asset_owner(ASSET_ID)
    }

    return metadata


# ─────────────────────────────
# Compute SHA256 Hash of Metadata
# ─────────────────────────────
def compute_metadata_hash(metadata):

    metadata_json = json.dumps(metadata, sort_keys=True)
    return hashlib.sha256(metadata_json.encode()).digest()


# ─────────────────────────────
# Get Box Data (Contract Storage)
# ─────────────────────────────
def get_box_data(asset_id):

    box_name = b"PROD_" + asset_id.to_bytes(8, "big")
    box = algod_client.application_box_by_name(APP_ID, box_name)

    # Decode base64 to raw bytes
    raw_value = base64.b64decode(box["value"])

    metadata_hash = raw_value[:32]
    manufacturer = raw_value[32:]

    return metadata_hash, manufacturer



# ─────────────────────────────
# Get NFT Metadata Hash (ASA)
# ─────────────────────────────
def get_asset_metadata_hash(asset_id):

    asset_info = algod_client.asset_info(asset_id)
    b64_hash = asset_info["params"]["metadata-hash"]

    return base64.b64decode(b64_hash)


# ─────────────────────────────
# Get Current Owner
# ─────────────────────────────
def get_asset_owner(asset_id):

    response = indexer_client.asset_balances(asset_id)

    balances = response.get("balances", [])

    for acc in balances:
        if acc.get("amount") == 1:
            return acc.get("address")

    return None


# ─────────────────────────────
# Verification Engine
# ─────────────────────────────
def verify():

    backend_metadata = get_backend_metadata()
    backend_hash = compute_metadata_hash(backend_metadata)

    box_hash, manufacturer = get_box_data(ASSET_ID)
    nft_hash = get_asset_metadata_hash(ASSET_ID)
    owner = get_asset_owner(ASSET_ID)

    print("Backend Hash :", backend_hash)
    print("Box Hash     :", box_hash)
    print("NFT Hash     :", nft_hash)
    print("Owner        :", owner)

    if backend_hash == box_hash == nft_hash:
        print("\n✅ PRODUCT VERIFIED")
    else:
        print("\n❌ COUNTERFEIT DETECTED")


if __name__ == "__main__":
    verify()
