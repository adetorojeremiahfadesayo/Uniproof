# Ubuntu Build and Testnet Deploy

This is the fallback path for machines where Windows Installer or MSVC `link.exe` is broken.

GitHub Actions runs on Ubuntu, so it can build and test the UniProof contract without installing Visual Studio on your laptop.

## Step 1: Use Main

The deploy workflow is now on `main`. If you need to update it again, push `main`:

```powershell
git push origin main
```

## Step 2: Run Ubuntu Contract CI

1. Open the GitHub repo.
2. Go to **Actions**.
3. Select **Ubuntu Contract CI**.
4. Click **Run workflow**.
5. Choose branch `main`.
6. Click **Run workflow**.

This workflow runs:

```bash
npm ci
npm test -- --run
npm run build
rustup target add wasm32v1-none
cargo test -p uniproof_pool
cargo build -p uniproof_pool --target wasm32v1-none --release
```

If it succeeds, download the `uniproof-pool-wasm` artifact from the workflow run.

## Step 3: Deploy to Stellar Testnet

1. Open **Actions**.
2. Select **Deploy UniProof Contract to Stellar Testnet**.
3. Click **Run workflow**.
4. Choose branch `main`.
5. Click **Run workflow**.

The deploy workflow:

- installs Stellar CLI on Ubuntu,
- builds the WASM,
- creates and funds a temporary Stellar testnet identity,
- deploys `uniproof_pool.wasm`,
- verifies the deployed contract interface is available,
- initializes two demo pools,
- writes the testnet contract ID to the workflow summary.

## Step 4: Copy the Contract ID

After the deploy workflow finishes:

1. Open the workflow run.
2. Scroll to the **Summary** section.
3. Copy `UNIPROOF_TESTNET_CONTRACT_ID`.
4. Put that contract ID in the hackathon submission and project docs.

## Important

This deploy is testnet only. It is good for the hackathon demo.

Do not deploy this contract to mainnet yet because the current contract models balances internally and does not move real Stellar assets.
