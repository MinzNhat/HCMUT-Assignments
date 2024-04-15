import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZ4OnCgIJmfbD5e68xLndPzDMk9lEsd3s",
  authDomain: "hcmutassignment.firebaseapp.com",
  projectId: "hcmutassignment",
  storageBucket: "hcmutassignment.appspot.com",
  messagingSenderId: "974473698245",
  appId: "1:974473698245:web:ae076a183c7c35095549ac",
};

firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firestore = firebase.firestore();

export const handleAuth = async () => {
  let result: SignInResult = { errors: true, data: undefined };

  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result2 = await signInWithPopup(auth, provider);
    const user = result2.user;
    if (result2) {
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        {
          email: user.email,
          timestamp: serverTimestamp(),
          profilePicture: user.photoURL,
        },
        { merge: true }
      );
      result.errors = false;
      result.data = user;
      return result;
    }
  } catch (error) {
    return result;
  }
};

interface SignUpResult {
  errors: boolean;
  data?: any;
}

export const handleSignUp = async (
  email: string,
  password: string
): Promise<SignUpResult> => {
  let result: SignUpResult = { errors: true, data: undefined };
  if (password.length < 8) {
    console.error("Error: Password should be at least 8 characters long.");
    return result;
  }

  try {
    const auth = getAuth();
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (response) {
      result.errors = false;
      result.data = response;
      const user = response.user;
      const docRef = doc(db, "users", user.uid);

      await setDoc(
        docRef,
        {
          email: user.email,
          timestamp: serverTimestamp(),
          profilePicture: user.photoURL,
        },
        { merge: true }
      );
    }
    return result;
  } catch (error) {
    return result;
  }
};

interface SignInResult {
  errors: boolean;
  data?: any;
}

export const handleSignIn = async (
  email: string,
  password: string
): Promise<SignInResult> => {
  let result: SignInResult = { errors: true, data: undefined };

  try {
    const auth = getAuth();
    const response = await signInWithEmailAndPassword(auth, email, password);
    if (response) {
      result.errors = false;
      result.data = response;
    }
    return result;
  } catch (error) {
    return result;
  }
};

export const getUserProfilePicture = async (): Promise<string | null> => {
  const auth = getAuth();
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.profilePicture) {
              resolve(data.profilePicture);
            }
          }
        } catch (error) {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const getUserEmail = async (userId: string): Promise<string | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.email) {
        return data.email;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const onClickLogOut = () => {
  const auth = getAuth();
  auth.signOut();
};

export const checkUserLoggedIn = (): Promise<boolean> => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        resolve(true); // User is signed in.
      } else {
        resolve(false); // No user is signed in.
      }
    });
  });
};

interface ForgotPw {
  errors: boolean;
  data?: any;
}
export const handleForgotPass = async (email: string): Promise<ForgotPw> => {
  let result: ForgotPw = { errors: true, data: undefined };

  try {
    const auth = getAuth();
    const response = await sendPasswordResetEmail(auth, email);
    result.errors = false;
    result.data = response;
    return result;
  } catch (error) {
    return result;
  }
};

export const checkUserExist = async (userId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    return false;
  }
};
