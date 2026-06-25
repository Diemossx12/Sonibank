export const API_BASE_URL = 'https://api.sonibank.ne/v1';
export const TOKEN_KEY = 'sonibank_access_token';
export const REFRESH_TOKEN_KEY = 'sonibank_refresh_token';
export const SESSION_TIMEOUT = 180000; // 3 minutes en ms
export const OTP_VALIDITY = 180; // 3 minutes en secondes
export const MAX_PIN_ATTEMPTS = 3;
export const CURRENCY = 'FCFA';
export const APP_NAME = 'SONIBANK';

export const TRANSFER_LIMITS = {
  INTERNAL_PER_OPERATION: 5000000,
  INTERNAL_DAILY: 10000000,
  EXTERNAL_PER_OPERATION: 2000000,
  EXTERNAL_DAILY: 5000000,
};
