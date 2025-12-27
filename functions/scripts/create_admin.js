/**
 * Script para crear usuario admin en Firebase Auth
 * Ejecutar con: node scripts/create_admin.js
 */
const admin = require('firebase-admin');
const path = require('path');

// Inicializar con credenciales de servicio si existen, o usar emulador
const serviceAccountPath = path.join(__dirname, '../service-account.json');

try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Using production Firebase');
} catch (e) {
    // Para emulador
    admin.initializeApp({
        projectId: 'coollabora-clinical'
    });
    console.log('⚠️ Using Firebase emulator (no service account found)');
}

const ADMIN_EMAIL = 'yocarlos98@gmail.com';
const ADMIN_PASSWORD = 'Coollabora2024!'; // Cambiar después del primer login

async function createAdmin() {
    try {
        // Verificar si el usuario ya existe
        try {
            const existingUser = await admin.auth().getUserByEmail(ADMIN_EMAIL);
            console.log(`ℹ️ User already exists: ${existingUser.uid}`);

            // Actualizar custom claims para marcarlo como admin
            await admin.auth().setCustomUserClaims(existingUser.uid, { admin: true });
            console.log('✅ Admin claims updated');
            return;
        } catch (e) {
            if (e.code !== 'auth/user-not-found') throw e;
        }

        // Crear nuevo usuario
        const user = await admin.auth().createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            displayName: 'Admin Coollabora',
            emailVerified: true
        });

        console.log(`✅ Admin user created: ${user.uid}`);

        // Establecer custom claims
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        console.log('✅ Admin claims set');

        console.log('\n========================================');
        console.log('CREDENCIALES DE ADMIN:');
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log('========================================');
        console.log('⚠️ IMPORTANTE: Cambiar la contraseña después del primer login');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    process.exit(0);
}

createAdmin();
