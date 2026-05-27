const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccount;

try {
  const envCredential = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!envCredential) {
    serviceAccount = require('../../firebase-service-account.json');
  } else if (envCredential.startsWith('{')) {
    serviceAccount = JSON.parse(envCredential);
  } else {
    const credentialPath = path.resolve(process.cwd(), envCredential);
    
    if (!fs.existsSync(credentialPath)) {
      throw new Error(`File kredensial Firebase tidak ditemukan di: ${credentialPath}`);
    }
    
    const rawData = fs.readFileSync(credentialPath, 'utf8');
    serviceAccount = JSON.parse(rawData);
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK berhasil terhubung.');
  }
} catch (error) {
  console.error('Gagal menginisialisasi Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };