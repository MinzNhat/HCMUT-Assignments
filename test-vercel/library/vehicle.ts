// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc,
    setDoc
} from 'firebase/firestore';
import { Car, Response } from './libraryType/type';
import { app, db } from './account'
import { constants } from 'buffer';
import { data } from 'autoprefixer';
import { Result } from 'postcss';


// Initialize Firebase
const CarRef = collection(db, 'Car');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

class Vehicle { // complete this class and delete this comment
    type: string
    constructor(carInfo: Car) { this.type = carInfo.type }
}
export class VehicleOperation {
    constructor() { }
    async createCar(carInfo: Car) {
        let response: Response = {
            error: true,
            data: null
        }
        
        const car = new Vehicle(carInfo)
        try {
            
            await addDoc(CarRef, {
                type: carInfo.type,
                licenseplate: carInfo.licenseplate,
                engineFuel: carInfo.enginefuel,
                height: carInfo.height,
                length: carInfo.length,
                mass: carInfo.mass,
                status: carInfo.status,
                price: carInfo.price
            });
        }
        catch {
            return response
        }
        if (car) {
            response.error = false
            response.data = car
            return response
        }
        else return response
    }
    async viewAllCar() {
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        try {
            const carArray = await (getDocs(CarRef))
            carArray.docs.forEach((doc) => {
                result.push({ ...doc.data(), id: doc.id })
            })

        }
        catch {
            return response
        }
        if (result) {
            response.error =false
            response.data = result
            return response             // this will return Object array NOT a single Object

        }
        else return response
    }
      async viewAllDriver() {
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        try {

            const driverArray = await (getDocs(DriverRef))

            driverArray.docs.forEach((doc) => {
                result.push({ 
                    driverName: doc.data().driverName,
                    driverNumber:doc.data().driverNumber,
                    driverAddress:JSON.parse(doc.data().driverAdress),
                })
            })

        }
        catch {
            return response
        }
        if (result) {
            response.data = result
            return response             // this will return Object array NOT a single Object

        }
        else return response
    }
};

