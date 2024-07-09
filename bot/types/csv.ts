import { Keypair } from '@solana/web3.js';
import base58 from 'bs58';

// Define the type for the CSV file content
export interface RowData {
  id: string;
  privKey: string;
  solAmountRange: string;
  txDelayRange: string;
  sellDelayRange: string;
}

export const COL_COUNT = 6;

export const parseCsvRow = (row: RowData) => {
  return {
    id: row.id,
    keypair: Keypair.fromSecretKey(base58.decode(row.privKey)),
    solAmountRange: row.solAmountRange.split('-').map((val) => parseFloat(val)),
    txDelayRange: row.txDelayRange.split('-').map((val) => parseFloat(val)),
    sellDelayRange: row.sellDelayRange.split('-').map((val) => parseFloat(val)),
  };
};

// Define the type for the CSV file content
export interface WalletInstance {
  id: string;
  keypair: Keypair;
  solAmountRange: number[];
  txDelayRange: number[];
  sellDelayRange: number[];
}
