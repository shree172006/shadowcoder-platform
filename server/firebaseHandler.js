import functions from 'firebase-functions';
import app from './serverApp.js';

/**
 * Firebase Cloud Functions Export
 * Exports Express API as a 100% Free Serverless Cloud Function (2M free requests/mo)
 */
export const api = functions.https.onRequest(app);
