import os
import subprocess
import base64
from algosdk.v2client import algod
from algosdk import account, transaction
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

creator_private_key = os.getenv("PRIVATE_KEY")
creator_address = account.address_from_private_key(creator_private_key)

def deploy():
    print("Building contract using Algorand Python...")
    # Get absolute path relative to script to ensure correct execution
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

    subprocess.run(
        ["bash", "-c", "source ../../venv/bin/activate && puyapy contract.py --out-dir build"],
        cwd=os.path.join(base_dir, "algorand", "smart_contract"),
        check=True
    )

    build_dir = os.path.join(base_dir, "algorand", "smart_contract", "build")
    
    with open(os.path.join(build_dir, "VerifiedProduct.approval.teal")) as f:
        approval_src = f.read()
    with open(os.path.join(build_dir, "VerifiedProduct.clear.teal")) as f:
        clear_src = f.read()

    approval_program = algod_client.compile(approval_src)["result"]
    clear_program = algod_client.compile(clear_src)["result"]

    approval_bytes = base64.b64decode(approval_program)
    clear_bytes = base64.b64decode(clear_program)

    params = algod_client.suggested_params()
    txn = transaction.ApplicationCreateTxn(
        sender=creator_address,
        sp=params,
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=approval_bytes,
        clear_program=clear_bytes,
        global_schema=transaction.StateSchema(10, 10),
        local_schema=transaction.StateSchema(0, 0)
    )

    signed_txn = txn.sign(creator_private_key)
    txid = algod_client.send_transaction(signed_txn)

    print("Deploying contract...")
    result = transaction.wait_for_confirmation(algod_client, txid, 4)

    print("✅ Contract Deployed")
    print("Application ID:", result["application-index"])
    print("Creator Address:", creator_address)

if __name__ == "__main__":
    deploy()
