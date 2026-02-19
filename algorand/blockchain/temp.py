from algosdk import mnemonic

mn = "earn physical direct allow betray monster hero coil man vacuum sand ignore judge chimney emotion boy uncover rose pause below elbow fluid ridge absorb smoke"

private_key = mnemonic.to_private_key(mn)
print(private_key)
