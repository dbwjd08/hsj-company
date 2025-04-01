import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAuCM7ObM4ZhagAjk7nFHGykgddOgeNULw',
  authDomain: 'yuppie-1ea4b.firebaseapp.com',
  projectId: 'yuppie-1ea4b',
  storageBucket: 'yuppie-1ea4b.appspot.com',
  messagingSenderId: '925709111976',
  appId: '1:925709111976:web:5c4c6ea8aa8ab69ee0e89d',
  measurementId: 'G-40KPCG4BXG',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
