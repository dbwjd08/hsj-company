import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword as _updatePassword,
} from 'firebase/auth';
import { auth } from './firebase';
import { fetchLoginFirebaseAuthFirebaseLoginPost } from '@/src/api/yuppieComponents';

interface TokenType {
  access_token: string | undefined;
  default_universe_id: number | undefined;
  session_id: string | undefined;
}

interface UserType {
  email: string | null;
  uid: string | null;
  emailVerified: boolean | null;
  displayName: string | null;
  username?: string | null;
  age?: string | null;
}

const { persistAtom } = recoilPersist();

const tokenState = atom<TokenType>({
  key: 'token',
  default: {
    access_token: undefined,
    default_universe_id: undefined,
    session_id: undefined,
  },
  effects_UNSTABLE: [persistAtom],
});

const userState = atom<UserType>({
  key: 'user',
  default: {
    email: null,
    uid: null,
    emailVerified: null,
    displayName: null,
    age: null,
    username: null,
  },
  effects: [
    ({ setSelf }) => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setSelf({
            email: currentUser.email,
            uid: currentUser.uid,
            emailVerified: currentUser.emailVerified,
            displayName: currentUser.displayName,
          });
        } else {
          setSelf({
            email: null,
            uid: null,
            emailVerified: null,
            displayName: null,
          });
        }
      });
      return () => unsubscribe();
    },
  ],
});

const signUp = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await updateProfile(userCredential.user, { displayName });
  return sendEmailVerification(userCredential.user);
};

const logIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
  if (auth.currentUser) {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetchLoginFirebaseAuthFirebaseLoginPost({
      body: {
        idToken,
      },
    });

    return {
      emailVerified: auth.currentUser.emailVerified,
      access_token: res.access_token,
      default_universe_id: res.default_universe_id,
      session_id: res.session_id,
      username: res.username,
      age: res.user.age_range,
    };
  } else {
    return {};
  }
};

const logOut = async () => {
  await signOut(auth);
};

const sendEmail = () => {
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser);
  } else {
    return null;
  }
};

const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

const updateName = (displayName: string) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return updateProfile(currentUser, { displayName });
  } else {
    return null;
  }
};

const updatePassword = (password: string) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return _updatePassword(currentUser, password);
  } else {
    null;
  }
};

export {
  tokenState,
  userState,
  signUp,
  logIn,
  logOut,
  sendEmail,
  resetPassword,
  updateName,
  updatePassword,
};
