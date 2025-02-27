# ton-whales-deposit-withdraw

## Install

```bash
npm install
```

## How to use

### Deposit

1. Look into [`.env`](./env.example) and change `AMOUNT_DEPOSIT` to the amount you want to deposit (the actual deposit will be `AMOUNT_DEPOSIT` + some fees)
2. Run `npx blueprint run` or `npm run start`
3. Select `deposit`
4. Select either `testnet` or `mainnet`
5. Select `TON Connect compatible mobile wallet (example: Tonkeeper)`
6. Confirm in your wallet
7. Receive a receipt with refunded fee

### Withdraw

1. Look into [`.env`](./env.example) and change `AMOUNT_WITHDRAW` to the amount you want to withdraw (you'll have to send some fee with the withdraw request)
2. Run `npx blueprint run` or `npm run start`
3. Select `withdraw`
4. Select either `testnet` or `mainnet`
5. Select `TON Connect compatible mobile wallet (example: Tonkeeper)`
6. Confirm in your wallet
7. Receive a receipt with the withdrawn amount + refunded fee

### Recover stake from elector

In case controller doesn't recover the stake from elector, it can be done by anyone else.

1. Run `npx blueprint run` or `npm run start`
2. Select `recover`
3. Select either `testnet` or `mainnet`
4. Select `TON Connect compatible mobile wallet (example: Tonkeeper)`
5. Confirm in your wallet

### View members

1. Run `npx blueprint run` or `npm run start`
2. Select `get-members`
3. Select either `testnet` or `mainnet`
4. Select `TON Connect compatible mobile wallet (example: Tonkeeper)`
5. The members will be printed in the console

## Custom Pool

Look into [`.env`](./env.example) and change the `POOL_ADDRESS` to the address of the pool you want to use.
