import { Keypair, Connection, PublicKey } from '@solana/web3.js';

import { RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT } from '../constants';
import { getBuyTxWithJupiter, getSellTxWithJupiter } from '../utils/swapOnlyAmm';
import { execute } from './legacy';
import { logger } from '../utils';

export const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export function getAssociatedTokenAddressSync(
  mint: PublicKey,
  owner: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): PublicKey {
  const [address] = PublicKey.findProgramAddressSync(
      [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
      associatedTokenProgramId
  );

  return address;
}

export const buy = async (wallet: Keypair, baseMint: PublicKey, amount: number) => {
  let solBalance: number = 0;
  try {
    solBalance = await solanaConnection.getBalance(wallet.publicKey);
  } catch (error) {
    console.log('Error getting balance of wallet');
    return null;
  }
  if (solBalance == 0) {
    console.log(`Insufficient fee in wallet`);
    return null;
  }
  try {
    let tx = await getBuyTxWithJupiter(wallet, baseMint, amount);
    if (tx == null) {
      console.log(`Error getting buy transaction`);
      return null;
    }
    const latestBlockhash = await solanaConnection.getLatestBlockhash();
    const txSig = await execute(tx, latestBlockhash);
    const tokenBuyTx = txSig ? `https://solscan.io/tx/${txSig}` : '';
    logger.info(`Buy tx succeed: ${tokenBuyTx}`);
    return tokenBuyTx;
  } catch (error) {
    return null;
  }
};

export const sell = async (wallet: Keypair, baseMint: PublicKey) => {
  try {
    const tokenAta = getAssociatedTokenAddressSync(baseMint, wallet.publicKey);
    const tokenBalInfo = await solanaConnection.getTokenAccountBalance(tokenAta);
    if (!tokenBalInfo) {
      console.log('Balance incorrect');
      return null;
    }
    const tokenBalance = tokenBalInfo.value.amount;
    if (BigInt(tokenBalance) == BigInt(0)) {
      console.log(`Zero token balance in wallet`);
      return null;
    }

    try {
      const sellTx = await getSellTxWithJupiter(wallet, baseMint, tokenBalance);

      if (sellTx == null) {
        console.log(`Error getting sell transaction`);
        return null;
      }

      const latestBlockhashForSell = await solanaConnection.getLatestBlockhash();
      const txSellSig = await execute(sellTx, latestBlockhashForSell, false);
      const tokenSellTx = txSellSig ? `https://solscan.io/tx/${txSellSig}` : '';
      logger.info(`Buy tx succeed: ${tokenSellTx}`);
      return tokenSellTx;
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
};
