module.exports = {
  firebaseType: process.env.TYPE,
  fireebaseProjectId: process.env.PROJECT_ID,
  firebasePrivateKeyId: process.env.PRIVATE_KEY_ID,
  firebasePrivateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
  firebaseClientEmail: process.env.CLIENT_EMAIL,
  firebaseClientId: process.env.CLIENT_ID,
  firebaseAuthUrl: process.env.AUTH_URI,
  firebaseTokenUrl: process.env.TOKEN_URI,
  firebaseAuthProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
  firebaseClientX509CertUrl: process.env.CLIENT_X509_CERT_URL,
}
