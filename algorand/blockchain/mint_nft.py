import os
import json
import hashlib
from algosdk.v2client import algod
from algosdk import account, transaction
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

APP_ID = 755771651  # <-- replace

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

private_key = os.getenv("PRIVATE_KEY")
sender = account.address_from_private_key(private_key)


# ─────────────────────────────
# STEP 1: Create Metadata
# ─────────────────────────────
def create_metadata():

    metadata = {
        "product_name": "Verified Shoes",
        "serial_number": "SN123456",
        "model": "V1",
        "color": "Black",
        "manufacturer": sender
    }

    metadata_json = json.dumps(metadata, sort_keys=True)
    metadata_hash = hashlib.sha256(metadata_json.encode()).digest()

    return metadata, metadata_hash


# ─────────────────────────────
# STEP 2: Create ARC-3 NFT
# ─────────────────────────────
def create_nft(metadata_hash):

    params = algod_client.suggested_params()

    txn = transaction.AssetCreateTxn(
        sender=sender,
        sp=params,
        total=1,
        decimals=0,
        default_frozen=False,
        unit_name="VPRD",
        asset_name="VerifiedProduct",
        manager=sender,
        reserve=None,
        freeze=None,
        clawback=None,
        url="https://your-backend.com/metadata.json",
        metadata_hash=metadata_hash
    )

    signed_txn = txn.sign(private_key)
    txid = algod_client.send_transaction(signed_txn)

    print("Creating NFT...")
    result = transaction.wait_for_confirmation(algod_client, txid, 4)

    asset_id = result["asset-index"]
    print("✅ NFT Created")
    print("Asset ID:", asset_id)

    return asset_id


# ─────────────────────────────
# STEP 3: Register in Smart Contract
# ─────────────────────────────
def register_product(asset_id, metadata_hash):

    params = algod_client.suggested_params()

    txn = transaction.ApplicationNoOpTxn(
        sender=sender,
        sp=params,
        index=APP_ID,
        app_args=[
            b"mint",
            asset_id.to_bytes(8, "big"),
            metadata_hash
        ],
        boxes=[
            (APP_ID, b"PROD_" + asset_id.to_bytes(8, "big"))
        ]
    )

    signed_txn = txn.sign(private_key)
    txid = algod_client.send_transaction(signed_txn)

    print("Registering product in contract...")
    transaction.wait_for_confirmation(algod_client, txid, 4)
    print("✅ Product Registered On-Chain")


if __name__ == "__main__":

    metadata, metadata_hash = create_metadata()
    asset_id = create_nft(metadata_hash)
    register_product(asset_id, metadata_hash)

    print("\n🎉 Product Mint Flow Complete")
