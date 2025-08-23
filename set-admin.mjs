import admin from 'firebase-admin';
// The 'with { type: "json" }' is important for importing JSON in ES modules.
import serviceAccount from './fine-interface-firebase-adminsdk.json' with { type: 'json' };

// --- Configuration ---
// IMPORTANT: Change this to the email address of the user you want to make an admin.
const userEmail = 'studiominsky@gmail.com'; 
// ---------------------

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const user = await admin.auth().getUserByEmail(userEmail);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  
  console.log(`✅ Successfully set admin claim for ${userEmail}`);
  process.exit(0);

} catch (error) {
  console.error('❌ Error setting custom claims:', error.message);
  process.exit(1);
}