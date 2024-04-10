import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDZ4OnCgIJmfbD5e68xLndPzDMk9lEsd3s",
  authDomain: "hcmutassignment.firebaseapp.com",
  projectId: "hcmutassignment",
  storageBucket: "hcmutassignment.appspot.com",
  messagingSenderId: "974473698245",
  appId: "1:974473698245:web:ae076a183c7c35095549ac",
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firestore = firebase.firestore();

export const handleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // The user is signed in or signed up successfully
  } catch (error) {
    console.error("Error during sign-in or sign-up:", error);
  }
};

//this handle button onClick event to sign up // sign in web with Google authentication

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
    }
    return result;
  } catch (error) {
    console.error("Error during sign up:", error);
    return result;
  }
};

//Handle button sign up
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
    console.error("Error during sign in:", error);
    return result;
  }
};
//handle Sign in button
