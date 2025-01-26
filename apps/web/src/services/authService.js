import axios from 'axios';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const authService = {
  // Google Auth
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      await this.registerWithBackend(result.user, token);
      return result.user;
    } catch (error) {
      console.error('Google auth error:', error);
      if (error.code === 'auth/api-key-not-valid') {
        throw new Error('Invalid Firebase configuration');
      }
      throw error;
    }
  },

  // Email/Password Auth
  async login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      await this.registerWithBackend(result.user, token);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const { email, password, firstName, lastName } = userData;
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      
      await this.registerWithBackend({
        ...result.user,
        firstName,
        lastName
      }, token);
      
      return result.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Backend Integration
  async registerWithBackend(user, token) {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Backend registration error:', error);
      throw error;
    }
  },

  // Utility Functions
  getCurrentUser() {
    return auth.currentUser;
  },

  async getAuthToken() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is signed in');
      }
      return user.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  }
};

// Export commonly used functions directly
export const { 
  signInWithGoogle,
  login,
  register,
  logout,
  getCurrentUser,
  getAuthToken 
} = authService;

export const getApiUrl = () => API_URL; 