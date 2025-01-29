import { GoogleAuth } from 'google-auth-library';
import serviceAccount from '../../../api/src/config/serviceAccount.json';

const auth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/cloud-healthcare']
});

export const getGoogleAuthToken = async () => {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}; 