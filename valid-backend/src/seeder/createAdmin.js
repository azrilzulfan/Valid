const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('../../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

const setupAdminAccount = async () => {
  const adminEmail = 'superadmin@valid.com';
  const adminPassword = 'PasswordAdminValid2026!';
  const adminName = 'Super Admin Valid';

  try {
    console.log('--- Memulai Proses Seeding Akun Admin ---');

    // 1. Cek apakah user sudah ada di Firebase Auth agar tidak error duplikat
    try {
      await auth.getUserByEmail(adminEmail);
      console.log(`[INFO] Email ${adminEmail} sudah terdaftar. Proses seeding dilewati.`);
      process.exit(0);
    } catch (authError) {
      if (authError.code !== 'auth/user-not-found') {
        throw authError;
      }
    }

    // 2. Buat user di Firebase Auth
    const userRecord = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: adminName,
      emailVerified: true,
    });

    console.log(`[SUCCESS] Akun Firebase Auth berhasil dibuat dengan UID: ${userRecord.uid}`);

    // 3. Simpan data tambahan ke Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: adminEmail,
      displayName: adminName,
      role: 'admin',
      vocationField: 'Administrator',
      location: 'Bogor, Indonesia',
      bio: 'Akun administrator utama sistem VALID.',
      createdAt: new Date().toISOString(),
      reputationPoints: 9999,
    });

    console.log(`[SUCCESS] Profil Firestore berhasil dikonfigurasi sebagai ROLE: admin.`);
    console.log('\nSilakan login di frontend menggunakan:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Proses pembuatan admin gagal:', error.message);
    process.exit(1);
  }
};

setupAdminAccount();
