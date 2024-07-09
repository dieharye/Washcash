import { PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';
dotenv.config();

import { logger, randVal, readCsv, sleep } from './utils';
import { buy, sell } from './executor/jupiter';
import { ALLOWED_TOKENS, DELAY_RANGE_WALLETS, MAX_TRIGGER_PER_ROUND } from './constants';
import { WalletInstance } from './types';

const triggerFromWallet = async (wallets: WalletInstance[]) => {
  logger.info(`  --> Starting new round`);

  // Choose a wallet randomly
  const [walletIdx] = randVal(0, wallets.length, 1, true);

  const selectedWalletIns = wallets[walletIdx];
  logger.info(`    wallet ${walletIdx} is selected: ${selectedWalletIns.keypair.publicKey.toBase58()}`);

  const [triggerCount] = randVal(0, MAX_TRIGGER_PER_ROUND, 1, true);
  logger.info(`    triggering trades for ${triggerCount} tokens`);

  // Trigger random count of trades from selected wallet
  for (let i = 0; i < triggerCount; i++) {
    const [solAmount] = randVal(selectedWalletIns.solAmountRange[0], selectedWalletIns.solAmountRange[1], 1);
    const [tokenIdx] = randVal(0, ALLOWED_TOKENS.length, 1, true);
    logger.info(`      trying to buy ${solAmount} SOL for ${ALLOWED_TOKENS[tokenIdx]} token`);

    // Trigger buy token
    buy(selectedWalletIns.keypair, new PublicKey(ALLOWED_TOKENS[tokenIdx]), solAmount).then((txId) => {
      if (txId) {
        // Schedule sell token if buy tx succeed
        const [sellDelay] = randVal(selectedWalletIns.sellDelayRange[0], selectedWalletIns.sellDelayRange[1], 1, true);
        logger.info(`       schedule to sell this token in ${sellDelay} ms`);

        setTimeout(() => {
          logger.info(
            `   -> Triggering sell ${ALLOWED_TOKENS[tokenIdx]} from ${selectedWalletIns.keypair.publicKey.toBase58()}`,
          );
          sell(selectedWalletIns.keypair, new PublicKey(ALLOWED_TOKENS[tokenIdx]));
        }, sellDelay);
      }
    });

    // Await random time for next tx
    const [delayTime] = randVal(selectedWalletIns.txDelayRange[0], selectedWalletIns.txDelayRange[1], 1, true);
    logger.info(`      awaiting for ${delayTime} ms for next tx`);
    await sleep(delayTime);
  }

  // Invoke `triggerFromWallet after random delay
  const [walletDelay] = randVal(DELAY_RANGE_WALLETS[0], DELAY_RANGE_WALLETS[1], 1);
  logger.info(`    Schedule to trigger next round in ${walletDelay}ms`);

  setTimeout(() => {
    triggerFromWallet(wallets);
  }, walletDelay);
};

export const main = async () => {
  logger.info(`Volume bot is running`);

  // Force stop for debug
  // return;

  // Load configured wallets & thresholds
  const wallets = await readCsv();
  logger.info(`${wallets.length} wallets loaded`);

  // End if no wallet loaded
  if (!wallets.length) return;

  // Stop if no tokens are allowed
  if (!ALLOWED_TOKENS.length) return;

  // Trigger sending txs from random wallet
  triggerFromWallet(wallets);
};
