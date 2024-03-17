module helloworld::ebscoin {
    use std::option;
     use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// The type identifier of coin. The coin will have a type
    /// tag of kind: `Coin<package_object::mycoin::MYCOIN>`
    /// Make sure that the name of the type matches the module's name.
    struct EBSCOIN has drop {}

    /// Module initializer is called once on module publish. A treasury
    /// cap is sent to the publisher, who then controls minting and burning
    fun init(witness: EBSCOIN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(witness, 8, b"EBSCOIN", b"", b"", option::none(), ctx);
        let s = b"init";
        std::debug::print(&s);
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    public entry fun hello() {
      let s = b"hello";
      std::debug::print(&s);
    }

    /// Cap Holder can mint new coins
    public entry fun mint(
        treasury_cap: &mut TreasuryCap<EBSCOIN>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx)
    }

    /// Cap Holder can burn coins
    public entry fun burn(treasury_cap: &mut TreasuryCap<EBSCOIN>, coin: Coin<EBSCOIN>) {
        coin::burn(treasury_cap, coin);
    }
}