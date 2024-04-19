// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc, writeBatch
} from 'firebase/firestore';
import { Driver, Response, Address, Route } from './libraryType/type';
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

    id?: string
    // type: string
    //change here when we have updateIMG func
    driveHistory?: Route[]               // we can cal experience by check the length of this
    driverName: string
    driverNumber: string
    driverAddress: Address
    driverStatus: number
    constructor(driverInfo: Driver) {

        this.driverNumber = driverInfo.driverNumber
        this.driverName = driverInfo.driverName
        this.driverAddress = driverInfo.driverAddress
        this.driverStatus = driverInfo.driverStatus ? driverInfo.driverStatus : 0

    }
    async storeToFB() {
        try {
            await addDoc(DriverRef, {

                driverName: this.driverName,
                driverNumber: this.driverNumber,
                driverAddress: JSON.stringify(this.driverAddress),
                driverStatus: this.driverStatus
            })
        }
        catch (error) {
            throw error
        }
    }
    static async deleteDriver(id: string) {
        const docRef = doc(db, 'Driver', id)
        const data = await getDoc(docRef)
        if (!data.exists) throw "id not exist when call delete driver by ID"
        const result = { ...data.data(), id: data.id }
        await deleteDoc(docRef)
        return result


    }
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
            if (driver) {
                await driver.storeToFB()
                response.error = false
                response.data = driver
            }


        }
        catch(error) {
            console.log(error)
        } finally {
            return response
        }
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
                    id: doc.id,
                    driverName: doc.data().driverName,
                    driverNumber: doc.data().driverNumber,
                    driverAddress: JSON.parse(doc.data().driverAddress),
                    driverStatus: doc.data().driverStatus,
                })
            })
            if (result) {
                response.error=false
                response.data = result

            }
            else throw "empty when call viewAllDriver"

        }
        catch (error) {
            console.log(error)
        }

        finally {
            return response             // this will return Object array NOT a single Object
        }
    }
    async viewAvailableDriver() {      // use this when create route
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        const q = query(DriverRef, where("driverStatus", "==", "available"))
        try {

            const driverArray = await (getDocs(q))

            driverArray.docs.forEach((doc) => {
                result.push({ ...doc.data(), id: doc.id })
            })
            if (result) {
                response.error=false
                response.data = result
            }

        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response             // this will return Object array NOT a single Object
        }
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
                deleteDoc(doc.ref);
            });
            response.error = false
        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }

    }
    async deleteDriverByID(driverID: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            response.data = await DriverRegister.deleteDriver(driverID)
            response.error = false
        } catch (error) {
            // console.log(error)
        }
        finally {
            return response;
        }


    }


};


