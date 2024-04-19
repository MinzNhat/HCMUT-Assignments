// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc,
    setDoc , writeBatch
} from 'firebase/firestore';
import { Vehicle, Response } from './libraryType/type';
import { app, db } from './account'
import { constants } from 'buffer';
import { data } from 'autoprefixer';
import { Result } from 'postcss';


// Initialize Firebase
const VehicleRef = collection(db, 'Vehicle');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

class vehicle { // complete this class and delete this comment
    type:string
    licenseplate: string
    enginefuel: string
    height: string
    length: string
    mass: string
    status: string
    price: number
    velocity:number
    constructor(vehicleInfo: Vehicle) { 
        this.type="vehicle"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel?vehicleInfo.enginefuel:"vehicleInfo.enginefuel"
        this.height= vehicleInfo.height?vehicleInfo.height:"vehicleInfo.heightl",
        this.length= vehicleInfo.length? vehicleInfo.length:" vehicleInfo.length",
        this.mass= vehicleInfo.mass? vehicleInfo.mass:" vehicleInfo.mass",
        this.status= vehicleInfo.status?vehicleInfo.status:"vehicleInfo.status",
        this.price= vehicleInfo.price?vehicleInfo.price:0
        this.velocity= vehicleInfo.velocity?vehicleInfo.velocity:0
    }
}
class Car extends vehicle{                                                                  //inheritance
    constructor(vehicleInfo: Vehicle) { 
        super(vehicleInfo)
        this.type = "car"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel?vehicleInfo.enginefuel:"Gasoline"
        this.height= vehicleInfo. height?vehicleInfo. height :"1,5 m"
        this.length= vehicleInfo.length?vehicleInfo. length :"4,6 m"
        this.mass= vehicleInfo.mass?vehicleInfo.mass:"500 kg"
        this.status= vehicleInfo.status?vehicleInfo.status:"unvailable"
        this.price= vehicleInfo.price?vehicleInfo.price:2500
        this.velocity= vehicleInfo.velocity?vehicleInfo.velocity:60
    }
}
class Bus extends vehicle{
    constructor(vehicleInfo: Vehicle) { 
        super(vehicleInfo)
        this.type = "bus"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel?vehicleInfo.enginefuel:"Diesel"
        this.height= vehicleInfo. height?vehicleInfo. height :"3.81 m"
        this.length= vehicleInfo.length?vehicleInfo. length :"12 m"
        this.mass= vehicleInfo.mass?vehicleInfo.mass:"700 kg"
        this.status= vehicleInfo.status?vehicleInfo.status:"unvailable"
        this.price= vehicleInfo.price?vehicleInfo.price:4500
        this.velocity= vehicleInfo.velocity?vehicleInfo.velocity:47
    }
}
class Truck extends vehicle{
    constructor(vehicleInfo: Vehicle) { 
        super(vehicleInfo)
        this.type = "container"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel?vehicleInfo.enginefuel:"Gasoline"
        this.height= vehicleInfo. height?vehicleInfo. height :"1,9 m"
        this.length= vehicleInfo.length?vehicleInfo. length :"3,1 m"
        this.mass= vehicleInfo.mass?vehicleInfo.mass:"500 kg"
        this.status= vehicleInfo.status?vehicleInfo.status:"unvailable"
        this.price= vehicleInfo.price?vehicleInfo.price:3000
        this.velocity= vehicleInfo.velocity?vehicleInfo.velocity:60
    }
}
class motorbike extends vehicle{
    constructor(vehicleInfo: Vehicle) { 
        super(vehicleInfo)
        this.type = "motorbike"
        this.licenseplate = vehicleInfo.licenseplate
        this.enginefuel = vehicleInfo.enginefuel?vehicleInfo.enginefuel:"Gasoline"
        this.height= vehicleInfo. height?vehicleInfo. height :"1 m"
        this.length= vehicleInfo.length?vehicleInfo. length :"1,2 m"
        this.mass= vehicleInfo.mass?vehicleInfo.mass:"115 kg"
        this.status= vehicleInfo.status?vehicleInfo.status:"unvailable"
        this.price= vehicleInfo.price?vehicleInfo.price:1000
        this.velocity= vehicleInfo.velocity?vehicleInfo.velocity:40
    }
}


export class VehicleOperation {
    constructor() { }
    async createVehicle(vehicleInfo: Vehicle) {
        let response: Response = {
            error: true,
            data: null
        }
        var veh:vehicle
        switch(vehicleInfo.type.toUpperCase() ){                    //factory design pattern
            case "BUS":
            veh= new Bus(vehicleInfo)
            break;
            case "MOTORBIKE":
             veh= new motorbike(vehicleInfo)
            break;
            case "TRUCK":
             veh= new Truck(vehicleInfo)
            break;
            case "CAR":
             veh= new Car(vehicleInfo)
            break;
            default:
                veh = new vehicle(vehicleInfo)
                break;
        }
         
        try {
            
            await addDoc(VehicleRef, {
                type: veh.type,
                licenseplate: veh.licenseplate,
                engineFuel: veh.enginefuel,
                height: veh.height,
                length: veh.length,
                mass: veh.mass,
                status: veh.status,
                price: veh.price
            });
        }
        catch {
            return response
        }
        if (veh) {
            response.error = false
            response.data = veh
            return response
        }
        else return response
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
                result.push({ ...doc.data()})
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
    async viewAvailableVehicle() {      // use this when create route
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        const q= query(VehicleRef,where("status","==","available"))
        try {

            const vehicleArray = await (getDocs(q))

            vehicleArray.docs.forEach((doc) => {
                result.push({ ...doc.data()})
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
    async deleteAllVehicle() {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            const batch = writeBatch(db);
            const querySnapshot = await getDocs(query(VehicleRef));

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
    async deleteVehicleByLicensePlate(vehicleLicensePlate: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            // 1. Build the query to find the vehicle by number
            const q= query(VehicleRef,where("licenseplate", "==", vehicleLicensePlate)) 
            // 2. Get a query snapshot to check if the vehicle exists
            const querySnapshot = await getDocs(q);
        
            // 3. Check if any document was found
            if (querySnapshot.size === 0) {
              response.error = true;
              response.data = "Vehicle not found";
              return response; // Return error if not found
            }
        
            // 4. If found, get the document reference and delete it
            const docToDelete = querySnapshot.docs[0].ref;
            await deleteDoc(docToDelete);
        
            response.error = false;
            response.data = "Vehicle deleted successfully";
          } catch (error) {
            // console.error("Error deleting vehicle:", error);
            response.error = true;
            // response.data = "Error deleting vehicle";
          }
            return response; // Always return the response
          
        

    }

};

