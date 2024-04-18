// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc
} from 'firebase/firestore';
import { Car, Response } from './libraryType/type';

const firebaseConfig = {
    apiKey: "AIzaSyCQVhfhnMG3TPsgZaX2viK1AKiruUkpBvc",
    authDomain: "laptrinhnangcao-aeb32.firebaseapp.com",
    projectId: "laptrinhnangcao-aeb32",
    storageBucket: "laptrinhnangcao-aeb32.appspot.com",
    messagingSenderId: "280682153048",
    appId: "1:280682153048:web:73242b55214b6e9ec4762d",
    measurementId: "G-HBRLQSWFDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
const colRef = collection(db, 'books');
const CarRef = collection(db, 'Car');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');


export class CarsOperation {
    constructor() { }
    async createCar(carInfo: Car) {
        let response: Response = {
            error: false,
            data: null
        }
        await addDoc(CarRef, {
            type: carInfo.type,
            licensePlate: carInfo.licenseplate,
            engineFuel: carInfo.enginefuel,
            height: carInfo.height,
            length: carInfo.length,
            mass: carInfo.mass,
            status: carInfo.status,
            price: carInfo.price
        })
            .then((docRef) => {
                response.data = docRef.id;

            }).catch((err) => {
                response.error = true;
            })
        return response
    }
};