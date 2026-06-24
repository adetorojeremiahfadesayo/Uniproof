#![no_std]

#[cfg(test)]
mod test;

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Pool {
    pub admin: Address,
    pub name: String,
    pub balance_xlm: i128,
    pub award_xlm: i128,
    pub active: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ClaimReceipt {
    pub pool_id: u32,
    pub recipient: Address,
    pub nullifier: String,
    pub amount_xlm: i128,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Pool(u32),
    Nullifier(String),
}

#[contract]
pub struct UniProofPoolContract;

#[contractimpl]
impl UniProofPoolContract {
    pub fn create_pool(
        env: Env,
        admin: Address,
        pool_id: u32,
        name: String,
        award_xlm: i128,
    ) -> Pool {
        admin.require_auth();

        if award_xlm <= 0 {
            panic!("award must be positive");
        }

        let key = DataKey::Pool(pool_id);
        if env.storage().persistent().has(&key) {
            panic!("pool already exists");
        }

        let pool = Pool {
            admin,
            name,
            balance_xlm: 0,
            award_xlm,
            active: true,
        };

        env.storage().persistent().set(&key, &pool);
        pool
    }

    pub fn fund_pool(env: Env, admin: Address, pool_id: u32, amount_xlm: i128) -> Pool {
        admin.require_auth();

        if amount_xlm <= 0 {
            panic!("fund amount must be positive");
        }

        let key = DataKey::Pool(pool_id);
        let mut pool: Pool = env.storage().persistent().get(&key).expect("pool missing");

        if pool.admin != admin {
            panic!("admin mismatch");
        }

        pool.balance_xlm += amount_xlm;
        env.storage().persistent().set(&key, &pool);
        pool
    }

    pub fn claim(
        env: Env,
        recipient: Address,
        pool_id: u32,
        nullifier: String,
        proof_verified: bool,
    ) -> ClaimReceipt {
        recipient.require_auth();

        if !proof_verified {
            panic!("proof rejected");
        }

        let pool_key = DataKey::Pool(pool_id);
        let mut pool: Pool = env
            .storage()
            .persistent()
            .get(&pool_key)
            .expect("pool missing");

        if !pool.active {
            panic!("pool inactive");
        }

        if pool.balance_xlm < pool.award_xlm {
            panic!("insufficient pool balance");
        }

        let nullifier_key = DataKey::Nullifier(nullifier.clone());
        if env.storage().persistent().has(&nullifier_key) {
            panic!("claim already used");
        }

        pool.balance_xlm -= pool.award_xlm;
        env.storage().persistent().set(&pool_key, &pool);
        env.storage().persistent().set(&nullifier_key, &true);

        ClaimReceipt {
            pool_id,
            recipient,
            nullifier,
            amount_xlm: pool.award_xlm,
        }
    }

    pub fn get_pool(env: Env, pool_id: u32) -> Pool {
        env.storage()
            .persistent()
            .get(&DataKey::Pool(pool_id))
            .expect("pool missing")
    }

    pub fn has_claimed(env: Env, nullifier: String) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Nullifier(nullifier))
    }
}
