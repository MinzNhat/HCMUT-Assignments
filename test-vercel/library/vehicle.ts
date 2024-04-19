// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc,
    setDoc, writeBatch
} from 'firebase/firestore';
import { Vehicle, Response,updateVehicle } from './libraryType/type';
import { app, db } from './account'
import { constants } from 'buffer';
import { data } from 'autoprefixer';
import { Result } from 'postcss';
import { error } from 'console';
import { BsTruck } from 'react-icons/bs';


// Initialize Firebase
const VehicleRef = collection(db, 'Vehicle');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

class vehicle { // complete this class and delete this comment
    type: string
    licenseplate: string
    enginefuel: string
    height: string
    length: string
    width: string
    mass: string
    status: string
    price: number
    velocity: number
    constructor(vehicleInfo: Vehicle) {
        this.type = "vehicle"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel ? vehicleInfo.enginefuel : "vehicleInfo.enginefuel"
        this.height = vehicleInfo.height ? vehicleInfo.height : "vehicleInfo.height",
            this.width = vehicleInfo.width ? vehicleInfo.width : "vehicleInfo.width",
            this.length = vehicleInfo.length ? vehicleInfo.length : " vehicleInfo.length",
            this.mass = vehicleInfo.mass ? vehicleInfo.mass : " vehicleInfo.mass",
            this.status = vehicleInfo.status ? vehicleInfo.status : "vehicleInfo.status",
            this.price = vehicleInfo.price ? vehicleInfo.price : 0
        this.velocity = vehicleInfo.velocity ? vehicleInfo.velocity : 0
    }
    async storeToFB() {
        try {
            await addDoc(VehicleRef, {
                type: this.type,
                licenseplate: this.licenseplate,
                enginefuel: this.enginefuel,
                height: this.height,
                length: this.length,
                width: this.width,
                mass: this.mass,
                status: this.status,
                price: this.price,
                velocity: this.velocity
            })
        }
        catch (error) {
            console.log(error)
            throw error
        }
    }
    static async deleteVehicle(id: string) {
        const docRef = doc(db, 'Vehicle', id)
        const data = await getDoc(docRef)
        if (!data.exists) throw "id not exist when call delete vehicle by ID"
        const result = { ...data.data(), id: data.id }
        await deleteDoc(docRef)
        return result
    }
    static async updateVehicle(id: string , updateField:updateVehicle){
        const docRef = doc(db, 'Vehicle', id)
        const data = await getDoc(docRef)
        if (!data.exists) throw "id not exist when call update vehicle by ID"
        const updateData = {...data.data()};
        for (const [fieldName, fieldValue] of Object.entries(updateField)) {
            updateData[fieldName] = fieldValue; // Update only provided fields
          } 
        await updateDoc(docRef,
            updateData
        )
        return updateData
    }
}
class Truck extends vehicle {                                                                  //inheritance
    constructor(vehicleInfo: Vehicle) {
        super(vehicleInfo)
        this.type = "Truck"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel ? vehicleInfo.enginefuel : "Gasoline"
        this.height = vehicleInfo.height ? vehicleInfo.height : "1,5"
        this.length = vehicleInfo.length ? vehicleInfo.length : "4,6"
        this.mass = vehicleInfo.mass ? vehicleInfo.mass : "500 "
        this.status = vehicleInfo.status ? vehicleInfo.status : "active"
        this.price = vehicleInfo.price ? vehicleInfo.price : 2500
        this.velocity = vehicleInfo.velocity ? vehicleInfo.velocity : 60
    }
}
class Bus extends vehicle {
    constructor(vehicleInfo: Vehicle) {
        super(vehicleInfo)
        this.type = "Bus"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel ? vehicleInfo.enginefuel : "Diesel"
        this.height = vehicleInfo.height ? vehicleInfo.height : "3.81 "
        this.length = vehicleInfo.length ? vehicleInfo.length : "12 "
        this.width = vehicleInfo.width ? vehicleInfo.width : "3"
        this.mass = vehicleInfo.mass ? vehicleInfo.mass : "700 "
        this.status = vehicleInfo.status ? vehicleInfo.status : "active"
        this.price = vehicleInfo.price ? vehicleInfo.price : 4500
        this.velocity = vehicleInfo.velocity ? vehicleInfo.velocity : 47
    }
}
class ContainerTruck extends vehicle {
    constructor(vehicleInfo: Vehicle) {
        super(vehicleInfo)
        this.type = "Container Truck"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel ? vehicleInfo.enginefuel : "Gasoline"
        this.height = vehicleInfo.height ? vehicleInfo.height : "1,9 "
        this.width = vehicleInfo.width ? vehicleInfo.width : "3"
        this.length = vehicleInfo.length ? vehicleInfo.length : "3,1 "
        this.mass = vehicleInfo.mass ? vehicleInfo.mass : "500 "
        this.status = vehicleInfo.status ? vehicleInfo.status : "active"
        this.price = vehicleInfo.price ? vehicleInfo.price : 3000
        this.velocity = vehicleInfo.velocity ? vehicleInfo.velocity : 60
    }
}



export class VehicleOperation {
    constructor() { }
    async createVehicle(vehicleInfo: Vehicle) {
        let response: Response = {
            error: true,
            data: null
        }

        var veh: vehicle

        switch (vehicleInfo.type.toUpperCase()) {                    //factory design pattern
            case "BUS":
                veh = new Bus(vehicleInfo)
                break;
            case "CONTAINERTRUCK":
                veh = new ContainerTruck(vehicleInfo)
                break;
            case "TRUCK":
                veh = new Truck(vehicleInfo)
                break;
            default:
                console.log("wrong type when calling vehicle")
                veh = new vehicle(vehicleInfo)
                break;
        }

        try {
            if (veh) {
                response.data = veh
                response.error = false
                await veh.storeToFB()
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }
    }
    async viewAllVehicle() {
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        try {

            const vehicleArray = await (getDocs(VehicleRef))

            vehicleArray.docs.forEach((doc) => {
                result.push({ ...doc.data(), id: doc.id })
            })
            if (result) {
                response.data = result
                response.error = false
            }

        }
        catch (error) {
            console.log(error)
        }
        finally {
            return response
        }
    }
    async viewAvailableVehicle() {
        let response: Response = {
            error: true,
            data: null
        }

        let result: any[] = []

        const q = query(VehicleRef, where("status", "==", "available"))
        try {

            const vehicleArray = await (getDocs(q))

            vehicleArray.docs.forEach((doc) => {
                result.push({ ...doc.data(), id: doc.id })
            })
            if (result) {
                response.data = result
                response.error = false
            }

        }
        catch (error) {
            return response
        }
        finally {
            return response
        }
    }
    async deleteAllVehicle() {
        let response: Response = {
            error: true,
            data: null
        }

        try {
            const batch = writeBatch(db);
            const querySnapshot = await getDocs(query(VehicleRef));

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
    async deleteVehicleByID(vehicleID: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            response.data = await vehicle.deleteVehicle(vehicleID)
            response.error = false
        } catch (error) {
            console.log(error)
        } finally {

            return response;
        }
    }
    async updateVehicleByID(vehicleID:string, updateField:updateVehicle ){
        let response: Response = {
            error: true,
            data: null
        }
        try {
            response.data = await vehicle.updateVehicle(vehicleID,updateField)
            response.data.id=vehicleID
            response.error = false
        } catch (error) {
            console.log(error)
        } finally {

            return response;
        }
    }
    

};

