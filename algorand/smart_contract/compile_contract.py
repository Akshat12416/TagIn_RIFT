from pyteal import *
from verified_product import approval_program, clear_program

if __name__ == "__main__":
    approval = compileTeal(
        approval_program(),
        mode=Mode.Application,
        version=8
    )

    clear = compileTeal(
        clear_program(),
        mode=Mode.Application,
        version=8
    )

    with open("approval.teal", "w") as f:
        f.write(approval)

    with open("clear.teal", "w") as f:
        f.write(clear)

    print("Contract compiled successfully.")
