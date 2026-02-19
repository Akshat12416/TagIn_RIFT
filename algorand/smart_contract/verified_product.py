from pyteal import *

def approval_program():

    WL_PREFIX = Bytes("WL_")
    PROD_PREFIX = Bytes("PROD_")

    # ─────────────────────────────
    # On Create
    # ─────────────────────────────
    on_create = Seq([
        App.globalPut(
            Concat(WL_PREFIX, Global.creator_address()),
            Int(1)
        ),
        Return(Int(1))
    ])

    is_owner = Txn.sender() == Global.creator_address()

    # ─────────────────────────────
    # Add to Whitelist
    # ─────────────────────────────
    add_whitelist = Seq([
        Assert(is_owner),
        App.globalPut(
            Concat(WL_PREFIX, Txn.application_args[1]),
            Int(1)
        ),
        Return(Int(1))
    ])

    # ─────────────────────────────
    # Remove from Whitelist
    # ─────────────────────────────
    remove_whitelist = Seq([
        Assert(is_owner),
        App.globalPut(
            Concat(WL_PREFIX, Txn.application_args[1]),
            Int(0)
        ),
        Return(Int(1))
    ])

    # ─────────────────────────────
    # Mint Product
    # ─────────────────────────────
    mint_product = Seq([
        # Ensure sender is whitelisted
        Assert(
            App.globalGet(
                Concat(WL_PREFIX, Txn.sender())
            ) == Int(1)
        ),

        # Check if box already exists
        Assert(
            Not(
                Seq(
                    (box := App.box_get(
                        Concat(PROD_PREFIX, Txn.application_args[1])
                    )),
                    box.hasValue()
                )
            )
        ),

        # Store metadataHash + manufacturer
        App.box_put(
            Concat(PROD_PREFIX, Txn.application_args[1]),
            Concat(
                Txn.application_args[2],  # 32-byte metadata hash
                Txn.sender()              # 32-byte manufacturer address
            )
        ),

        Return(Int(1))
    ])

    handle_noop = Cond(
        [Txn.application_args[0] == Bytes("addWL"), add_whitelist],
        [Txn.application_args[0] == Bytes("removeWL"), remove_whitelist],
        [Txn.application_args[0] == Bytes("mint"), mint_product]
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
    )

    return program


def clear_program():
    return Return(Int(1))
