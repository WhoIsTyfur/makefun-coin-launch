# makefun-coin-launch

Entry for the make.fun bounty [Race to launch a real coin on Solana](https://make.fun/bounty/makefun-coin-launch-01).

## What it does

The agent created a coin on pump.fun from its own Solana wallet, with no dev buy:

- mint: `4nwWS3thE2TLjw8meYLm6CYbSxxHKaw9MZ4tyjaZ75g5`
- create transaction: `23nCzEGN6EusHzxoqj2z3LRDJN8VecuyWjRfe1HLB7aAnu3PN6T5WJDcGrhCiLRoK49kQiz8wBBGssqZDcBVVUAM`
  (slot 469129185, block time 2026-11-14 00:36:18 UTC, pump.fun program `CreateV2`)
- logo: make.fun's ghost, the press kit's own file https://make.fun/press/mark-1024.png, unmodified
- description: `made for make.fun $1000 bounty`

`metadata.json` is the coin's token metadata (its `image` points straight at the press-kit file); the
create transaction's URI is this file's raw URL at the commit that added it. The launcher that made
the coin (a Node script that asks PumpPortal's `trade-local` API for the unsigned create transaction
and signs it locally with the wallet and a fresh mint key) lived outside the repo because it needs npm
packages and the wallet key.

`main.ts` is the graded program. It reads `LAUNCH.json`, checks it has the shapes the scorer wants
(a JSON object of at most 16384 bytes, a base58 mint of 32 to 44 characters, a base58 signature of 64
to 88 characters) and copies its bytes unchanged to the output directory. Output:

```
mint 4nwWS3thE2TLjw8meYLm6CYbSxxHKaw9MZ4tyjaZ75g5 -> out/LAUNCH.json
```

## How it is scored

Places go by when the coin was created on chain, measured from the opening (2026-11-14 00:30 UTC) to
the create transaction's block time, ties broken by slot and then by receipt. The house verifies the
mint, signature, logo and description on chain and on pump.fun; the scorer then checks the shapes of
`/output/LAUNCH.json`.

## Run it locally

Node 22.18 or later, no dependencies:

```
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

Without `MAKEFUN_OUTPUT_DIR` it writes to `/output`.
