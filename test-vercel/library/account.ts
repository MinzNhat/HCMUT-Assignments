import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Route } from "react-router-dom";

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

// Modify handleAuth to set isGoogleUser to true on successful sign in
export const handleAuth = async () => {
  let result: SignInResult = { errors: true, data: undefined };

  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result2 = await signInWithPopup(auth, provider);
    const user = result2.user;
    if (result2) {
      const docRef = doc(db, "users", user.uid); // replace 'users' with your collection name

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
      if (response) {
        const user = response.user;
        const docRef = doc(db, "users", user.uid); // replace 'users' with your collection name

        await setDoc(
          docRef,
          {
            email: user.email,
            timestamp: serverTimestamp(),
            profilePicture: user.photoURL, //URL to user profile picture
          },
          { merge: true }
        );
      }
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

export const getUserProfilePicture = async (
  userId: string
): Promise<string | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.profilePicture) {
        return data.profilePicture;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile picture:", error);
    return null;
  }
};
// this function return user profile picture by URL string

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
    console.error("Error getting user email:", error);
    return null;
  }
};
//this function return user email by string

export const onClickLogOut = () => {
  const auth = getAuth();
  auth.signOut();
};
// handle Logout button

export const checkUserLoggedIn = (): boolean => {
  const auth = getAuth();
  const user = auth.currentUser;
  return !!user;
};
// this function return user status if user is logged in or not if user logged in then logged in true if checking status is true page loading

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
    console.error("Error during password reset:", error);
    return result;
  }
};
//handle forgot password reset

export const checkUserExist = async (userId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
};
//function check user existence
