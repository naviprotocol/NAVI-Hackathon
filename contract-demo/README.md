# Sui-coin-demo

- **Docs**: https://github.com/sui-foundation/sui-move-intro-course/blob/main/unit-three/lessons/5_managed_coin.md

- **Cli**:
  - fauct:
    ``` curl --location --request POST 'https://faucet.devnet.sui.io/gas' \
          --header 'Content-Type: application/json' \
          --data-raw '{
          "FixedAmountRequest": {
              "recipient": "<YOUR SUI ADDRESS>"
            }  
      }'
    ```
  - build: ``` sui move build ```
  - pulish: ``` sui client publish --gas-budget 20000000 ```
  - mint:
    ```
      sui client call --package <PACKGE_ID> --module <MODULE_NAME>  --function <FUNCTION_NAME> --args <TREASURY_CAP> <AMOUNT> <RECIPIENT> --gas-budget 2000000
    ```
