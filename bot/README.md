# Wallet warming up bot script

## Install
`yarn install` to install dependencies.

Preferred node version is `v20.11.1`

## Configure bot

### Prepare a wallets
- Should prepare at least one wallet private key and fund some mainnet sol there \
Copy `wallets.example.csv` to `wallets.csv` then input your wallets

- Should set env for script run \
  Copy `.env.cop` to `.env` and set solana mainnet RPC and some global configs

- Also may need to change `ALLOWED_TOKENS` list in `/constants/tokens.ts`

### Run bot
After install node dependencies, run `yarn start`
