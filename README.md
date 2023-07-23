# USWAP

## Getting Started

`yarn install`

## /contracts

`USwapLP` is responsible for swaping tokens and providing liquidity from Lending Pools.

### Deployed Contracts

| Network       | Address                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Mumbai        | [0x6d7a8e9dafa9606f21d5f8fa8a1a2a31e7687091](https://mumbai.polygonscan.com/address/0x6d7a8e9dafa9606f21d5f8fa8a1a2a31e7687091)     |
| MantleTestnet | [0x6d7a8e9DAfa9606F21d5f8FA8a1a2A31e7687091](https://explorer.mantle.xyz/address/0x6d7a8e9DAfa9606F21d5f8FA8a1a2A31e7687091)        |
| LineaTestnet  | [0x0](https://rinkeby.etherscan.io/address/0x0)                                                                                     |
| Chiado        | [0x6d7a8e9DAfa9606F21d5f8FA8a1a2A31e7687091](https://blockscout.chiadochain.net/address/0x6d7a8e9DAfa9606F21d5f8FA8a1a2A31e7687091) |

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
