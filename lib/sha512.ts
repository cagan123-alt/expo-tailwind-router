import * as Crypto from 'expo-crypto';
async function sha512(password: string): Promise<string> {
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    password,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  return hashedPassword;
}

export default sha512;
