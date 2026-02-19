from pyteal import *

def approval_program():

    WL_PREFIX = Bytes("WL_")
    PROD_PREFIX = Bytes("PROD_")

    is_creator = Txn.sender() == Global.creator_address()

    # ─────────────────────────────
    # On Create (DO NOTHING)
    # ─────────────────────────────
    on_create = Approve()

    # ─────────────────────────────
    # Add Whitelist
    # Args: ["addWL", address]
    # ─────────────────────────────
    add_whitelist = Seq(
        Assert(is_creator),
        App.box_put(
            Concat(WL_PREFIX, Txn.application_args[1]),
            Bytes("1")
        ),
        Approve()
    )

    # ─────────────────────────────
    # Remove Whitelist
    # ─────────────────────────────
    remove_whitelist = Seq(
        Assert(is_creator),
        Pop(
            App.box_delete(
                Concat(WL_PREFIX, Txn.application_args[1])
            )
        ),
        Approve()
    )

    # ─────────────────────────────
    # Mint Product
    # Args: ["mint", asset_id_bytes, metadata_hash]
    # ─────────────────────────────
    mint_product = Seq(

        # Check whitelist
        (wl := App.box_get(Concat(WL_PREFIX, Txn.sender()))),
        Assert(wl.hasValue()),

        # Ensure product does not exist
        (existing := App.box_get(
            Concat(PROD_PREFIX, Txn.application_args[1])
        )),
        Assert(Not(existing.hasValue())),

        # Store metadataHash + manufacturer
        App.box_put(
            Concat(PROD_PREFIX, Txn.application_args[1]),
            Concat(
                Txn.application_args[2],
                Txn.sender()
            )
        ),

        Approve()
    )

    handle_noop = Cond(
        [Txn.application_args[0] == Bytes("addWL"), add_whitelist],
        [Txn.application_args[0] == Bytes("removeWL"), remove_whitelist],
        [Txn.application_args[0] == Bytes("mint"), mint_product],
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
    )

    return program


def clear_program():
    return Approve()
