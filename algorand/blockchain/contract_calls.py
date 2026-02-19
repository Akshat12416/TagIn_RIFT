import os
from algosdk.v2client import algod
from algosdk import account, transaction
from algosdk.encoding import decode_address
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

APP_ID = 755771651   # <-- replace this

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

private_key = os.getenv("PRIVATE_KEY")
sender = account.address_from_private_key(private_key)

def call_app(app_args):

    params = algod_client.suggested_params()

    txn = transaction.ApplicationNoOpTxn(
        sender=sender,
        sp=params,
        index=APP_ID,
        app_args=app_args
    )

    signed_txn = txn.sign(private_key)
    txid = algod_client.send_transaction(signed_txn)

    print("Transaction sent:", txid)
    transaction.wait_for_confirmation(algod_client, txid, 4)
    print("Confirmed ✅")


# ─────────────────────────────
# Add Whitelist
# ─────────────────────────────
def add_to_whitelist(address):
    call_app([
        b"addWL",
        decode_address(address)
    ])


# ─────────────────────────────
# Remove Whitelist
# ─────────────────────────────
def remove_from_whitelist(address):
    call_app([
        b"removeWL",
        decode_address(address)
    ])


if __name__ == "__main__":
    # Example usage:
    test_address = "EMKJ5AMYYB6XZTNDXWU6M2NTYQY7ZPPSLSSMALZHAXOUWOPTDNVJ5UUBFA"
    add_to_whitelist(test_address)
