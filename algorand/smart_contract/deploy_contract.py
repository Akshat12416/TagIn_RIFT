import base64
import os
from algosdk.v2client import algod
from algosdk import account, transaction
from dotenv import load_dotenv

load_dotenv()

# Connect to Algorand Testnet (AlgoNode)
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

# Load creator account
creator_private_key = os.getenv("PRIVATE_KEY")
creator_address = account.address_from_private_key(creator_private_key)

def compile_program(source_code):
    compiled = algod_client.compile(source_code)
    return base64.b64decode(compiled["result"])

def deploy():
    with open("approval.teal") as f:
        approval_program = compile_program(f.read())

    with open("clear.teal") as f:
        clear_program = compile_program(f.read())

    params = algod_client.suggested_params()

    txn = transaction.ApplicationCreateTxn(
        sender=creator_address,
        sp=params,
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
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
