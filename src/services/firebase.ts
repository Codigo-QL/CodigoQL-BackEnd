import * as admin from 'firebase-admin';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS;

if (!serviceAccountString) {
  throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_CREDENTIALS não está definida.');
}

const serviceAccount = JSON.parse(serviceAccountString);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const firebaseAdmin = admin;
