import os
import json
import hashlib
import base64
from algosdk.v2client import algod, indexer
from algosdk import account, transaction
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

INDEXER_ADDRESS = "https://testnet-idx.algonode.cloud"
INDEXER_TOKEN = ""

APP_ID = int(os.getenv("APP_ID"))

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
indexer_client = indexer.IndexerClient(INDEXER_TOKEN, INDEXER_ADDRESS)

private_key = os.getenv("PRIVATE_KEY")
sender = account.address_from_private_key(private_key)


# ─────────────────────────────
# HASH METADATA
# ─────────────────────────────
def compute_metadata_hash(metadata: dict):
    metadata_json = json.dumps(metadata, sort_keys=True)
    return hashlib.sha256(metadata_json.encode()).digest()


# ─────────────────────────────
# CREATE ARC-3 NFT
# ─────────────────────────────
def create_nft(metadata_hash: bytes):

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
    result = transaction.wait_for_confirmation(algod_client, txid, 4)

    return result["asset-index"]


# ─────────────────────────────
# REGISTER IN SMART CONTRACT
# ─────────────────────────────
def register_product(asset_id: int, metadata_hash: bytes):

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
    transaction.wait_for_confirmation(algod_client, txid, 4)


# ─────────────────────────────
# FULL MINT FLOW
# ─────────────────────────────
def mint_product(metadata: dict):

    metadata_hash = compute_metadata_hash(metadata)
    asset_id = create_nft(metadata_hash)
    register_product(asset_id, metadata_hash)

    return {
        "assetId": asset_id,
        "metadataHash": base64.b64encode(metadata_hash).decode()
    }


# ─────────────────────────────
# TRANSFER NFT
# ─────────────────────────────
def transfer_nft(asset_id: int, receiver: str):

    params = algod_client.suggested_params()

    txn = transaction.AssetTransferTxn(
        sender=sender,
        sp=params,
        receiver=receiver,
        amt=1,
        index=asset_id
    )

    signed_txn = txn.sign(private_key)
    txid = algod_client.send_transaction(signed_txn)
    transaction.wait_for_confirmation(algod_client, txid, 4)

    return {"message": "Transfer successful"}


# ─────────────────────────────
# GET OWNER
# ─────────────────────────────
def get_asset_owner(asset_id):

    response = indexer_client.asset_balances(asset_id)

    balances = response.get("balances", [])

    for acc in balances:
        if acc.get("amount") == 1:
            return acc.get("address")

    return None


# ─────────────────────────────
# GET BOX DATA
# ─────────────────────────────
def get_box_data(asset_id):

    box_name = b"PROD_" + asset_id.to_bytes(8, "big")
    box = algod_client.application_box_by_name(APP_ID, box_name)

    raw_value = base64.b64decode(box["value"])

    metadata_hash = raw_value[:32]
    manufacturer = raw_value[32:]

    return metadata_hash, manufacturer


# ─────────────────────────────
# VERIFY PRODUCT
# ─────────────────────────────
def verify_product(asset_id: int, backend_metadata: dict):

    backend_hash = compute_metadata_hash(backend_metadata)
    box_hash, manufacturer = get_box_data(asset_id)
    nft_hash = get_asset_metadata_hash(asset_id)
    owner = get_asset_owner(asset_id)

    return {
        "verified": backend_hash == box_hash == nft_hash,
        "owner": owner,
        "manufacturer": manufacturer,
        "assetId": asset_id
    }


def get_asset_metadata_hash(asset_id):

    asset_info = algod_client.asset_info(asset_id)
    b64_hash = asset_info["params"]["metadata-hash"]

    return base64.b64decode(b64_hash)
