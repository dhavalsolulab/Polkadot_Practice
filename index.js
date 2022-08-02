const { mnemonicGenerate, mnemonicValidate } = require("@polkadot/util-crypto");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");
const keyring = new Keyring({ type: "sr25519" });
const connect = async () => {
  const wsProvider = new WsProvider("wss://westend-rpc.polkadot.io");
  const api = new ApiPromise({ provider: wsProvider });
  return api.isReady;
};

const createAccount = (mnemonic) => {
  mnemonic =
    mnemonic && mnemonicValidate(mnemonic) ? mnemonic : mnemonicGenerate();
  const account = keyring.addFromMnemonic(mnemonic);
  return { account, mnemonic };
};
const main = async (api) => {
  console.log(`Our client is connected: ${api.isConnected}`);

  const mnemonic =
    "cruel leader remember night skill clump question focus nurse neck battle federal";
  const { account: medium1 } = createAccount(mnemonic);
  const balance = await api.derive.balances.all(medium1.address);
  const available = balance.availableBalance.toNumber();
  const dots = available / 10 ** api.registry.chainDecimals;
  const print = dots.toFixed(4);
  console.log(`Address ${medium1.address} has ${print} DOT`);
};
connect()
  .then(main)
  .catch((err) => {
    console.error(err);
  })
  .finally(() => process.exit());
