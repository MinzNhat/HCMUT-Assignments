// Import the functions you need from the SDKs you need
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc, writeBatch,
    arrayUnion,
    setDoc
} from 'firebase/firestore';

import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Driver, Response, Address, Route, updateDriver } from './libraryType/type';
import { app, storage } from './account'
import { RouteOperation } from './route';
import { vehicle } from './vehicle'


// Initialize Firebase

const db = getFirestore();
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

export class DriverRegister {

    id?: string
    // type: string
    //change here when we have updateIMG func
    driveHistory?: Route[]               // we can cal experience by check the length of this
    driverName: string
    driverNumber: string
    driverAddress: Address
    driverStatus: number
    driverLicense: Blob[]
    constructor(driverInfo: Driver) {

        this.driverNumber = driverInfo.driverNumber
        this.driverName = driverInfo.driverName
        this.driverAddress = driverInfo.driverAddress
        this.driverStatus = driverInfo.driverStatus ? driverInfo.driverStatus : 0
        this.driverLicense = driverInfo.driverLicense

    }
    async storeToFB() {
        try {
            const docRef = await addDoc(DriverRef, {
                driverName: this.driverName,
                driverNumber: this.driverNumber,
                driverAddress: JSON.stringify(this.driverAddress),
                driverStatus: this.driverStatus
            });

            const downloadURLs = await Promise.all(
                this.driverLicense.map(async (image: Blob) => {
                    const fileName = `Driver_license_${Date.now()}`;
                    const imageRef = ref(storage, `Driver/${docRef.id}/${fileName}`);
                    //@ts-ignore
                    await uploadBytes(imageRef, image, "data_url");
                    return getDownloadURL(imageRef);
                })
            );

            await updateDoc(doc(db, "Driver", docRef.id), {
                driverLicense: arrayUnion(...downloadURLs)
            });
        } catch (error) {
            throw error;
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
    static async updateDriver(id: string, updateField: updateDriver) {
        const docRef = doc(db, 'Driver', id);
        const data = await getDoc(docRef);

        if (!data.exists) {
            throw "ID does not exist when calling update driver by ID";
        }

        const updateData = { ...data.data() };

        for (const [fieldName, fieldValue] of Object.entries(updateField)) {
            if (fieldName === 'driverLicense') {
                const downloadURLs = await Promise.all(
                    fieldValue.map(async (image: Blob) => {
                        const fileName = `Driver_license_${Date.now()}`;
                        const imageRef = ref(storage, `Driver/${id}/${fileName}`);
                        //@ts-ignore
                        await uploadBytes(imageRef, image, "data_url");
                        return getDownloadURL(imageRef);
                    })
                );
                updateData[fieldName] = [];
                await setDoc(docRef, updateData, { merge: true });
                updateData[fieldName] = arrayUnion(...downloadURLs);
            } else if (fieldName === 'driverAddress') {
                updateData[fieldName] = JSON.stringify(fieldValue);
            }
            else {
                updateData[fieldName] = fieldValue;
            }
        }

        await setDoc(docRef, updateData, { merge: true });
        return updateData;
    }
    static async ScanForRouteEnd() { // this func check the last element of his arr and then update status of vehicle and driver depened on reoute's endDate
        /* call when :
                + create route ( must call to refresh avaible driver and vehicle) 
                + viewAllDriver
                + viewAvailableDriver
                + viewAllVehicle
                + viewAvailableVehicle
        */
        const driverArray = await (getDocs(DriverRef))
        driverArray.docs.forEach(async (doc) => {
            let tempUser1 = new DriverOperation()
            const driver = await tempUser1.GetDriver(doc.id)
            if (driver && driver.driveHistory) {
                // console.log(driver)
                // console.log(driver.driveHistory.length-1)
                if (!driver.driveHistory[driver.driveHistory.length - 1]) throw `invalid ref in history of Driver ${driver}, may be u try to delete route invalidly `
                const lastRouteID = driver.driveHistory[driver.driveHistory.length - 1]
                // console.log(driver)
                // console.log(`this is the last element of his, index is ${driver.driveHistory.length -1}} \n 
                //                  and this is the id of that route (it should be string ) :${lastRouteID} ` )
                let tempUser2 = new RouteOperation()
                const routeObj = await tempUser2.GetRoute(lastRouteID)
                const today = new Date()
                // console.log(doc.data().maintenanceDay.toDate().getDate())
                // console.log(checkmaintenanceDay.getDate())
                // console.log(realStatus)
                // console.log(checkmaintenanceDay.getDate() == doc.data().maintenanceDay.toDate().getDate())
                if (routeObj) {
                    const endDate = routeObj.endDate
                    // console.log(endDate < today)
                    // console.log(driver.driverStatus == 1)
                    // console.log(routeObj.status != "Deleted")
                    if (endDate < today && driver.driverStatus == 1 && routeObj.status == "Active") {
                        const vehicleID = routeObj.carID
                        const driverID = routeObj.driverID
                        await vehicle.updateVehicle(vehicleID, { status: "Inactive" })
                        await DriverRegister.updateDriver(driverID, { driverStatus: 0 })
                        // call some function to update status for route is expired
                        await tempUser2.UpdateRouteStatus(lastRouteID, "Expired")
                        //    console.log("test success")  
                    }
                    else if (routeObj.status == "Deleted" && driver.driverStatus == 1) {
                        const vehicleID = routeObj.carID
                        const driverID = routeObj.driverID
                        await vehicle.updateVehicle(vehicleID, { status: "Inactive" })
                        await DriverRegister.updateDriver(driverID, { driverStatus: 0 })
                    }
                    // console.log(today)
                    // console.log(endDate)
                }
                else
                    throw `  route ${lastRouteID} is null when scan to update status `

            }
        })

    }
}
export class DriverOperation {
    constructor() { }
    async createDriver(driverInfo: Driver) {
        let response: Response = {
            error: true,
            data: null
        }
        const driver = new DriverRegister(driverInfo)
        try {
            if (driver) {
                await driver.storeToFB()
                response.error = false
                response.data = driver
            }
        }
        catch (error) {
            console.log(error)
        } finally {
            return response
        }
    }
    async viewAllDriver() {
        await DriverRegister.ScanForRouteEnd()
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
                    driverLicense: doc.data().driverLicense,
                })
            })
            if (result) {
                response.error = false
                response.data = result
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }
    }
    async viewAvailableDriver() {
        await DriverRegister.ScanForRouteEnd()
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        const q = query(DriverRef, where("driverStatus", "==", 0))
        try {

            const driverArray = await (getDocs(q))

            driverArray.docs.forEach((doc) => {
                result.push({ ...doc.data(), id: doc.id })
            })
            if (result) {
                response.error = false
                response.data = result
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
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
            console.log(error)
        }
        finally {
            return response;
        }
    }
    async updateDriverByID(driverID: string, updateField: updateDriver) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            response.data = await DriverRegister.updateDriver(driverID, updateField)
            response.data.id = driverID
            response.error = false
        } catch (error) {
            console.log(error)
        } finally {

            return response;
        }
    }
    async GetDriver(driverId: string) { // if driver dont have his the driveHistory will be undefined
        try {
            const driverDoc = await getDoc(doc(db, "Driver", driverId));

            if (driverDoc.exists()) {
                const driverData = driverDoc.data();
                return {
                    driverAddress: JSON.parse(driverData.driverAddress),
                    driverLicense: driverData.driverLicense,
                    driverName: driverData.driverName,
                    driverNumber: driverData.driverNumber,
                    driverStatus: driverData.driverStatus,
                    driveHistory: driverData.driveHistory,
                    id: driverId
                };
            }
            else {
                // If ID does not exist
                console.log("Driver not found");
                return null;
            }
        }
        catch (error) {
            console.error("Error retrieving driver:", error);
            throw error;
        }
    }

};


