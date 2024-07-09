import csvParser from 'csv-parser';
import fs from 'fs';
import { WALLETS_CSV_URL } from '../constants';
import { logger } from './logger';
import { RowData, WalletInstance, parseCsvRow } from '../types';

export const randVal = (min: number, max: number, count: number, isInt: boolean = false): number[] => {
  const arr: number[] = [];

  // Randomize pairs of elements
  for (let i = 0; i < count; i++) {
    // Generate a random adjustment within the range
    let adjustment = Math.random() * (max - min) + min;

    // Prevent rand to be max
    if (adjustment == max) adjustment = min;
    arr.push(isInt ? Math.floor(adjustment) : adjustment);
  }
  return arr;
};

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

// Function to read CSV file
export function readCsv(filename: string = WALLETS_CSV_URL): Promise<WalletInstance[]> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filename)) {
      logger.error(`Wallets config csv ${filename} is not exist`);
      resolve([]);
      return;
    }
    let result: WalletInstance[] = [];
    fs.createReadStream(filename, 'utf-8')
      .pipe(csvParser())
      .on('data', (row: RowData) => {
        result.push(parseCsvRow(row));
      })
      .on('end', () => {
        resolve(result);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}
