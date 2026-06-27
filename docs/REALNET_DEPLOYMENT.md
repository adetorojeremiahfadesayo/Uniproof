# UniProof Realnet Deployment Runbook

Realnet here means Stellar Mainnet, also called Pubnet or the Public Network.

## Current Readiness

Do not deploy this contract to handle real funds yet.

Current blockers found on June 26, 2026:

- `stellar` CLI is not installed or not on `PATH`.
- `cargo test -p uniproof_pool` and the WASM build fail because Windows cannot find the MSVC linker `link.exe`.
- `contracts/uniproof_pool` currently tracks `balance_xlm` inside contract storage. It does not move real Stellar assets, SAC tokens, or native XLM. Mainnet deployment would be a demo state contract, not a production aid disbursement contract.
- No funded mainnet signer has been configured in Stellar CLI.
- No mainnet RPC provider has been configured.
- No third-party security review has been completed.

Frontend checks are currently passing:

```powershell
npm test -- --run
npm run build
```

## Required Before Mainnet

1. Install Visual Studio Build Tools with the C++ toolchain, or build from a Rust/Soroban-ready Linux or WSL environment.
2. Install Stellar CLI.
3. Configure a mainnet RPC provider.
4. Configure a locally stored signer. Do not paste a secret key into chat.
5. Rebuild the contract from source on the deployment machine.
6. Run contract tests and frontend tests.
7. Decide whether this release is demo-only or production funds-enabled.
8. If production funds-enabled, replace the internal `balance_xlm` model with real Stellar asset movement.
9. Run a security review before any real value is at risk.

If Windows Installer keeps failing, use the Ubuntu GitHub Actions path in `docs/UBUNTU_GITHUB_ACTIONS.md` to build and deploy to testnet without local Visual Studio.

## Mainnet Network Facts

Stellar Mainnet uses this passphrase:

```text
Public Global Stellar Network ; September 2015
```

Mainnet requires real XLM for minimum balances, transaction fees, and rent. Friendbot is not available on Mainnet.

## Commands Once Ready

Check local tools:

```powershell
stellar --version
cargo --version
rustc --version
```

Build and test:

```powershell
cargo test -p uniproof_pool
cargo build -p uniproof_pool --target wasm32v1-none --release
npm test -- --run
npm run build
```

Configure a mainnet network alias if your Stellar CLI does not already include one:

```powershell
stellar network add `
  --global mainnet `
  --rpc-url <MAINNET_RPC_PROVIDER_URL> `
  --network-passphrase "Public Global Stellar Network ; September 2015"
```

Deploy:

```powershell
stellar contract deploy `
  --wasm target/wasm32v1-none/release/uniproof_pool.wasm `
  --source-account <LOCAL_MAINNET_IDENTITY> `
  --network mainnet `
  --alias uniproof_pool
```

Record the returned contract ID in:

- `docs/CONTRACT.md`
- `README.md`
- frontend environment/config when the real adapter is wired

## Demo-Only Initialization

Only use these calls if you accept that `balance_xlm` is internal contract state and not real transferred funds.

```powershell
stellar contract invoke `
  --id <CONTRACT_ID> `
  --source-account <LOCAL_MAINNET_IDENTITY> `
  --network mainnet `
  -- `
  create_pool `
  --admin <ADMIN_ADDRESS> `
  --pool_id 1 `
  --name "Emergency Aid Grant" `
  --award_xlm 250

stellar contract invoke `
  --id <CONTRACT_ID> `
  --source-account <LOCAL_MAINNET_IDENTITY> `
  --network mainnet `
  -- `
  fund_pool `
  --admin <ADMIN_ADDRESS> `
  --pool_id 1 `
  --amount_xlm 2500
```
