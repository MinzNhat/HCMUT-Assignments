// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc
} from 'firebase/firestore';
import { Driver, Response } from './libraryType/type';
import { app } from './account'
import { constants } from 'buffer';
import { data } from 'autoprefixer';
import { Result } from 'postcss';
import { stringify } from 'querystring';


// Initialize Firebase

const db = getFirestore();
const colRef = collection(db, 'books');
const CarRef = collection(db, 'Car');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

class DriverRegister {
    number : string
    constructor(driverInfo: Driver) { this.number = driverInfo.driverNumber }
}
export class VehicleOperation {
    constructor() { }
    async createDriver(driverInfo: Driver) {
        let response: Response = {
            error: true,
            data: null
        }
        var a = new GeoPoint(driverInfo.driverAddress.latitude, driverInfo.driverAddress.longitude)
        const driver = new DriverRegister(driverInfo)
        try {
            await addDoc(DriverRef, {

                driverName: driverInfo.driverName,
                driverNumber: driverInfo.driverNumber,
                driverAddress: JSON.stringify(driverInfo.driverAddress)
              })
        }
        catch {
            return response
        }
        if (driver) {
            response.error = false
            response.data = driver
            return response
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

