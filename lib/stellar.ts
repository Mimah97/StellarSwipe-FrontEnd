import { Horizon } from "@stellar/stellar-sdk";

export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const HORIZON_URL = "https://horizon-testnet.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);

export async function getAccountBalances(publicKey: string) {
  const account = await server.loadAccount(publicKey);
  return account.balances;
}
