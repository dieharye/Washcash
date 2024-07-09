import { PublicKey } from '@solana/web3.js';

export const NATIVE_TOKEN_ADDR = 'So11111111111111111111111111111111111111112';
export const NATIVE_TOKEN = new PublicKey(NATIVE_TOKEN_ADDR);

export const ALLOWED_TOKENS = [
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // JUP
];
export const WALLETS_CSV_URL = 'wallets.csv';
