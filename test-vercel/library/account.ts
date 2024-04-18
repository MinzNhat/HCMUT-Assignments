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
import { ForgotPass, Response, SignUp } from "./libraryType/type";

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

export class UsersOperation {
  constructor() { }

  async handleAuth() {
    let result: Response = { error: true, data: null };

    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result2 = await signInWithPopup(auth, provider);
      const user = result2.user;

      if (result2) {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { email: user.email, timestamp: serverTimestamp(), profilePicture: user.photoURL, }, { merge: true });

        result.error = false;
        result.data = user;

      }
      return result;
    } catch (error) {
      return result;
    }
  };

  async handleSignUp(userAccount: SignUp) {
    let result: Response = { error: true, data: undefined };

    if (userAccount.password.length < 8) {
      return result;
    }

    try {
      const auth = getAuth();
      const response = await createUserWithEmailAndPassword(auth, userAccount.email, userAccount.password);

      if (response) {
        result.error = false;
        result.data = response;
        const user = response.user;
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { email: user.email, timestamp: serverTimestamp(), profilePicture: user.photoURL, }, { merge: true });
      }
      return result;
    } catch (error) {
      return result;
    }
  };

  async handleSignIn(userAccount: SignUp) {
    let result: Response = { error: true, data: null };

    try {
      const auth = getAuth();
      const response = await signInWithEmailAndPassword(auth, userAccount.email, userAccount.password);

      if (response) {
        result.error = false;
        result.data = response;
      }
      return result;
    } catch (error) {
      return result;
    }
  };

  async handleGetUserProfilePicture() {
    let result: Response = { error: true, data: null };

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.profilePicture) {
            result.error = false;
            result.data = data.profilePicture;
          }
        }
      } catch (error) {
        return result
      }
    }

    return result;
  };

  async getUserEmail() {
    let result: Response = { error: true, data: null };

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.email) {
            result.error = false;
            result.data = data.email;
          }
        }
      } catch (error) {
        return result;
      }
    }

    return result;
  };

  async onClickLogOut() {
    const auth = getAuth();
    auth.signOut();
  };

  async checkUserLoggedIn() {
    let result: Response = { error: true, data: null };

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      result.error = false;
      result.data = true;
    } else {
      result.error = false;
      result.data = false;
    }

    return result;
  };

  async handleForgotPass(userAccount: ForgotPass) {
    let result: Response = { error: true, data: undefined };

    try {
      const auth = getAuth();
      const response = await sendPasswordResetEmail(auth, userAccount.email);
      result.error = false;
      result.data = response;
      return result;
    } catch (error) {
      return result;
    }
  };
};