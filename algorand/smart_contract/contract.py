from algopy import ARC4Contract, Bytes, Global, Txn, Account, BoxMap, arc4, String

class VerifiedProduct(ARC4Contract):
    def __init__(self) -> None:
        self.whitelist = BoxMap(Account, String, key_prefix="WL_")
        self.products = BoxMap(Bytes, Bytes, key_prefix="PROD_")

    @arc4.abimethod
    def addWL(self, address: Account) -> None:
        assert Txn.sender == Global.creator_address, "Only creator can add to whitelist"
        self.whitelist[address] = String("1")

    @arc4.abimethod
    def removeWL(self, address: Account) -> None:
        assert Txn.sender == Global.creator_address, "Only creator can remove from whitelist"
        if address in self.whitelist:
            del self.whitelist[address]

    @arc4.abimethod
    def mint(self, asset_id_bytes: Bytes, metadata_hash: Bytes) -> None:
        assert Txn.sender in self.whitelist, "Sender not in whitelist"
        assert asset_id_bytes not in self.products, "Product already exists"
        
        # Store metadataHash (32 bytes) + manufacturer account bytes (32 bytes)
        self.products[asset_id_bytes] = metadata_hash + Txn.sender.bytes
