import os
from algosdk.v2client import algod
from algosdk import account, transaction
from algosdk.encoding import decode_address
from dotenv import load_dotenv

load_dotenv()

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""
APP_ID = 755785502   # your app id

algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

private_key = os.getenv("PRIVATE_KEY")
creator = account.address_from_private_key(private_key)

manufacturer_address = "HK4U4NCRSHZGR6KBNZMC56YLY2G5KCYRPE6PMYMD3E26W22XACINXICBCM"

params = algod_client.suggested_params()

txn = transaction.ApplicationNoOpTxn(
    sender=creator,
    sp=params,
    index=APP_ID,
    app_args=[
        b"addWL",
        decode_address(manufacturer_address)   # 🔥 CRITICAL FIX
    ],
    boxes=[
        (APP_ID, b"WL_" + decode_address(manufacturer_address))
    ]
)

signed = txn.sign(private_key)
txid = algod_client.send_transaction(signed)

print("Adding whitelist...")
transaction.wait_for_confirmation(algod_client, txid, 4)
print("✅ Whitelisted correctly (raw public key)")
