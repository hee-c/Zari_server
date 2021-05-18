const admin = require('firebase-admin');

const {
  firebaseType,
  fireebaseProjectId,
  firebasePrivateKeyId,
  firebasePrivateKey,
  firebaseClientEmail,
  firebaseClientId,
  firebaseAuthUrl,
  firebaseTokenUrl,
  firebaseAuthProviderX509CertUrl,
  firebaseClientX509CertUrl,
} = require('../constants/serviceAccountKey');

const serviceAccount = {
  type: firebaseType,
  project_id: fireebaseProjectId,
  private_key_id: firebasePrivateKeyId,
  private_key: firebasePrivateKey,
  client_email: firebaseClientEmail,
  client_id: firebaseClientId,
  auth_uri: firebaseAuthUrl,
  token_uri: firebaseTokenUrl,
  auth_provider_x509_cert_url: firebaseAuthProviderX509CertUrl,
  client_x509_cert_url: firebaseClientX509CertUrl,
};

console.log(firebasePrivateKey)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// admin.initializeApp({
//   credential: admin.credential.cert({
//     type: process.env.TYPE,
//     project_id: process.env.PROJECT_ID,
//     private_key_id: process.env.PRIVATE_KEY_ID,
//     private_key: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
//     client_email: process.env.CLIENT_EMAIL,
//     client_id: process.env.CLIENT_ID,
//     auth_uri: process.env.AUTH_URI,
//     token_uri: process.env.TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
//   })
// });
