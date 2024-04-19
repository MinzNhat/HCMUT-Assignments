// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc, writeBatch
} from 'firebase/firestore';
import { Driver, Response } from './libraryType/type';
import { app } from './account'
import { constants } from 'buffer';
import { data } from 'autoprefixer';
import { Result } from 'postcss';
import { stringify } from 'querystring';


// Initialize Firebase

const db = getFirestore();
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

class DriverRegister {
    number: string
    constructor(driverInfo: Driver) { this.number = driverInfo.driverNumber }
}
export class DriverOperation {
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
                    driverNumber: doc.data().driverNumber,
                    driverAddress: JSON.parse(doc.data().driverAdress),
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
    async viewAvailableDriver() {      // use this when create route
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        const q = query(DriverRef, where("status", "==", "available"))
        try {

            const driverArray = await (getDocs(q))

            driverArray.docs.forEach((doc) => {
                result.push({ ...doc.data() })
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
    async deleteAllDriver() {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            const batch = writeBatch(db);
            const querySnapshot = await getDocs(query(DriverRef));

            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
        }
        catch{
            return response
        }
        response.error=false
        return response


    }
    async deleteDriverByName(driverNumber: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            // 1. Build the query to find the driver by number
            const q= query(DriverRef,where("driverNumber", "==", driverNumber)) 
            // 2. Get a query snapshot to check if the driver exists
            const querySnapshot = await getDocs(q);
        
            // 3. Check if any document was found
            if (querySnapshot.size === 0) {
              response.error = true;
              response.data = "Driver not found";
              return response; // Return error if not found
            }
        
            // 4. If found, get the document reference and delete it
            const docToDelete = querySnapshot.docs[0].ref;
            await deleteDoc(docToDelete);
        
            response.error = false;
            response.data = "Driver deleted successfully";
          } catch (error) {
            // console.error("Error deleting driver:", error);
            response.error = true;
            // response.data = "Error deleting driver";
          }
            return response; // Always return the response
          
        

    }


};


