# USWAP

## Getting Started

`yarn install`

## /contracts

`USwapLP` is responsible for swaping tokens and providing liquidity from Lending Pools.

### Deployed Contracts

| Network | Address                                         |
| ------- | ----------------------------------------------- |
| Kovan   | [0x0](https://kovan.etherscan.io/address/0x0)   |
| Ropsten | [0x0](https://ropsten.etherscan.io/address/0x0) |
| Rinkeby | [0x0](https://rinkeby.etherscan.io/address/0x0) |
| Goerli  | [0x0](https://goerli.etherscan.io/address/0x0)  |

## /backend

1. Start backend

```bash
yarn workspace backend start
```

### APIs

| API                  | Method | QueryParams      | Description           |
| -------------------- | ------ | ---------------- | --------------------- |
| `/api/v1/tokens`     | GET    |                  | List all tokens       |
| `/api/v1/identities` | GET    | address          | Get adress identities |
| `/api/v1/quotes`     | GET    | from, to, amount | Get quotes            |

## /frontend

1. Start frontend

```bash
yarn workspace frontend dev
```
