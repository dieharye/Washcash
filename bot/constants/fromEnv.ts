import { Logger } from 'pino';
import { logger } from '../utils';

export const retrieveEnvVariable = (variableName: string, logger: Logger) => {
  const variable = process.env[variableName] || '';
  if (!variable) {
    logger?.error(`${variableName} is not set`);
    process.exit(1);
  }
  return variable;
};

export const RPC_ENDPOINT = retrieveEnvVariable('RPC_ENDPOINT', logger);
export const RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable('RPC_WEBSOCKET_ENDPOINT', logger);

export const TX_FEE = Number(retrieveEnvVariable('TX_FEE', logger));

export const LOG_LEVEL = retrieveEnvVariable('LOG_LEVEL', logger);
export const MAX_TRIGGER_PER_ROUND = Number(retrieveEnvVariable('MAX_TRIGGER_PER_ROUND', logger));

export const DELAY_RANGE_WALLETS = retrieveEnvVariable('DELAY_RANGE_WALLETS', logger)
  .split('-')
  .map((val) => Number(val));
