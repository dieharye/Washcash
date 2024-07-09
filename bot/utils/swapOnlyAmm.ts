import { PublicKey, Keypair, VersionedTransaction } from '@solana/web3.js';

import { NATIVE_TOKEN_ADDR } from '../constants';
import { sleep } from './utils';

export const getBuyTxWithJupiter = async (wallet: Keypair, baseMint: PublicKey, amount: number) => {
  // Delay 100ms for JUP latency
  await sleep(100);
  try {
    const lamports = Math.floor(amount * 10 ** 9);
    const quoteResponse = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${NATIVE_TOKEN_ADDR}&outputMint=${baseMint.toBase58()}&amount=${lamports}&slippageBps=100`,
      )
    ).json();

    // get serialized transactions for the swap
    const { swapTransaction } = await (
      await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: wallet.publicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 52000,
        }),
      })
    ).json();

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // sign the transaction
    transaction.sign([wallet]);
    return transaction;
  } catch (error) {
    console.error(error);
    console.log('Failed to get buy transaction');
    return null;
  }
};

export const getSellTxWithJupiter = async (wallet: Keypair, baseMint: PublicKey, amount: string) => {
  // Delay 100ms for JUP latency
  await sleep(100);
  try {
    const quoteResponse = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${baseMint.toBase58()}&outputMint=${NATIVE_TOKEN_ADDR}&amount=${amount}&slippageBps=100`,
      )
    ).json();

    // get serialized transactions for the swap
    const { swapTransaction } = await (
      await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: wallet.publicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 52000,
        }),
      })
    ).json();

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // sign the transaction
    transaction.sign([wallet]);
    return transaction;
  } catch (error) {
    console.error(error);
    console.log('Failed to get sell transaction');
    return null;
  }
};
