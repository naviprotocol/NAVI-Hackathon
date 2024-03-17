
import { NAVISDKClient } from 'navi-sdk'
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {depositToken, borrowToken, flashloan,repayFlashLoan, SignAndSubmitTXB, mergeTokens} from 'navi-sdk/dist/libs/PTB'
import { Pool, PoolConfig } from "navi-sdk/dist/types";
import { pool } from 'navi-sdk/dist/address'

const mnemonic = "tiger bread actor they fish nice assist couch shrimp kite conduct mesh";
const client = new NAVISDKClient({mnemonic: mnemonic, networkType: "mainnet", wordLength: 12});

// Initialize the TransactionBlock
let txb = new TransactionBlock();
let sender = client.getPublicKey(0);
console.log(sender)
txb.setSender(sender);

const poolName = 'USDC'; // Supported: Sui/NAVX/vSui/USDC/USDT/WETH/CETUS/HAsui
const amount_to_borrow = 1*1e6; //Borrow 1 USDC

const USDC_Pool: PoolConfig = pool[poolName as keyof Pool];
const [balance, receipt] = flashloan(txb, USDC_Pool, amount_to_borrow); // Flashloan 1 usdc

//Transfer the flashloan money to the account
const this_coin = txb.moveCall({
    target: '0x2::coin::from_balance',
    arguments: [balance],
    typeArguments: [USDC_Pool.type],
});

//Get the repayment object
const repayBalance = txb.moveCall({
    target: '0x2::coin::into_balance',
    //#Todo: Replace {your_repay_coin_object_id} with the object id of the coin you want to repay with
    arguments: [txb.object('{your_repay_coin_object_id}')],
    typeArguments: [USDC_Pool.type],
});

const [e_balance] = repayFlashLoan(txb, USDC_Pool, receipt, repayBalance); // Repay with USDC

//Extra token after repay
const e_coin = txb.moveCall({
    target: '0x2::coin::from_balance',
    arguments: [e_balance],
    typeArguments: [USDC_Pool.type],
});

//Transfer the borrowed money and left_money after repay to teh account
txb.transferObjects([e_coin, this_coin], client.getPublicKey(0));
const result = SignAndSubmitTXB(txb, client.client(0), client.keypair(0));
console.log("result: ", result);
