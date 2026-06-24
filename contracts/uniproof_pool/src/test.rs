#![cfg(test)]

extern crate std;

use super::{UniProofPoolContract, UniProofPoolContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn setup() -> (Env, UniProofPoolContractClient<'static>, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(UniProofPoolContract, ());
    let client = UniProofPoolContractClient::new(&env, &contract_id);
    let admin = Address::generate(&env);
    let student = Address::generate(&env);

    (env, client, admin, student)
}

#[test]
fn creates_and_funds_a_pool() {
    let (env, client, admin, _) = setup();
    let name = String::from_str(&env, "Emergency Aid Grant");

    let created = client.create_pool(&admin, &1, &name, &250);
    assert_eq!(created.balance_xlm, 0);
    assert_eq!(created.award_xlm, 250);
    assert!(created.active);

    let funded = client.fund_pool(&admin, &1, &2_500);
    assert_eq!(funded.balance_xlm, 2_500);
}

#[test]
fn releases_a_verified_claim_once() {
    let (env, client, admin, student) = setup();
    let name = String::from_str(&env, "Emergency Aid Grant");
    let nullifier = String::from_str(&env, "claim_ada_emergency");

    client.create_pool(&admin, &1, &name, &250);
    client.fund_pool(&admin, &1, &2_500);

    let receipt = client.claim(&student, &1, &nullifier, &true);
    let pool = client.get_pool(&1);

    assert_eq!(receipt.amount_xlm, 250);
    assert_eq!(pool.balance_xlm, 2_250);
    assert!(client.has_claimed(&nullifier));
}

#[test]
#[should_panic(expected = "claim already used")]
fn rejects_duplicate_nullifier() {
    let (env, client, admin, student) = setup();
    let name = String::from_str(&env, "Emergency Aid Grant");
    let nullifier = String::from_str(&env, "claim_ada_emergency");

    client.create_pool(&admin, &1, &name, &250);
    client.fund_pool(&admin, &1, &2_500);
    client.claim(&student, &1, &nullifier, &true);
    client.claim(&student, &1, &nullifier, &true);
}

#[test]
#[should_panic(expected = "proof rejected")]
fn rejects_unverified_claim() {
    let (env, client, admin, student) = setup();
    let name = String::from_str(&env, "Emergency Aid Grant");
    let nullifier = String::from_str(&env, "claim_ada_emergency");

    client.create_pool(&admin, &1, &name, &250);
    client.fund_pool(&admin, &1, &2_500);
    client.claim(&student, &1, &nullifier, &false);
}
