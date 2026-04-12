import os
from algosdk.v2client import algod
from algosdk import account
from algosdk.atomic_transaction_composer import AtomicTransactionComposer, AccountTransactionSigner
from algosdk.abi import Method
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

APP_ID = 758713172   # <-- replace this

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

private_key = os.getenv("PRIVATE_KEY")
sender = account.address_from_private_key(private_key)
signer = AccountTransactionSigner(private_key)

# ─────────────────────────────
# Add Whitelist
# ─────────────────────────────
def add_to_whitelist(address):
    params = algod_client.suggested_params()
    atc = AtomicTransactionComposer()
    
    method = Method.from_signature("addWL(address)void")
    
    atc.add_method_call(
        app_id=APP_ID,
        method=method,
        sender=sender,
        sp=params,
        signer=signer,
        method_args=[address]
    )
    
    print("Sending transaction...")
    result = atc.execute(algod_client, 4)
    print("Confirmed ✅ txid:", result.tx_ids[0])


# ─────────────────────────────
# Remove Whitelist
# ─────────────────────────────
def remove_from_whitelist(address):
    params = algod_client.suggested_params()
    atc = AtomicTransactionComposer()
    
    method = Method.from_signature("removeWL(address)void")
    
    atc.add_method_call(
        app_id=APP_ID,
        method=method,
        sender=sender,
        sp=params,
        signer=signer,
        method_args=[address]
    )
    
    print("Sending transaction...")
    result = atc.execute(algod_client, 4)
    print("Confirmed ✅ txid:", result.tx_ids[0])


if __name__ == "__main__":
    # Example usage:
    test_address = "EMKJ5AMYYB6XZTNDXWU6M2NTYQY7ZPPSLSSMALZHAXOUWOPTDNVJ5UUBFA"
    add_to_whitelist(test_address)
