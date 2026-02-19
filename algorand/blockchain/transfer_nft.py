import os
from algosdk.v2client import algod
from algosdk import account, transaction
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

ASSET_ID = 755772786  # replace if needed

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

private_key = os.getenv("PRIVATE_KEY")
sender = account.address_from_private_key(private_key)


# ─────────────────────────────
# Step 1 — Recipient Opt-In
# ─────────────────────────────
def opt_in(receiver_address):

    params = algod_client.suggested_params()

    txn = transaction.AssetTransferTxn(
        sender=receiver_address,
        sp=params,
        receiver=receiver_address,
        amt=0,
        index=ASSET_ID
    )

    print("⚠ Recipient must sign this transaction in their wallet.")


# ─────────────────────────────
# Step 2 — Transfer NFT
# ─────────────────────────────
def transfer_nft(receiver_address):

    params = algod_client.suggested_params()

    txn = transaction.AssetTransferTxn(
        sender=sender,
        sp=params,
        receiver=receiver_address,
        amt=1,
        index=ASSET_ID
    )

    signed_txn = txn.sign(private_key)
    txid = algod_client.send_transaction(signed_txn)

    print("Transferring NFT...")
    transaction.wait_for_confirmation(algod_client, txid, 4)

    print("✅ NFT Transferred Successfully")


if __name__ == "__main__":

    receiver = "EMKJ5AMYYB6XZTNDXWU6M2NTYQY7ZPPSLSSMALZHAXOUWOPTDNVJ5UUBFA"

    transfer_nft(receiver)
