// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc
} from 'firebase/firestore';
import { Route, Response,Address, Vehicle, Driver, Observer } from './libraryType/type';
import { app } from './account'
import { constants } from 'buffer';
import { data } from 'autoprefixer';
import { Result } from 'postcss';
import { stringify } from 'querystring';




// Initialize Firebase

const db = getFirestore();
const colRef = collection(db, 'books');
const CarRef = collection(db, '');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');
 async function updateStatus(objectType :string, number :string, status: string) { // dont touch this 
  let response :Response= {
    error: false,
    data: null
  }
  if (objectType.toUpperCase() =="CAR" ) {
    const q = query(CarRef, where("licenseplate", "==", number))
    const result =await getDocs(q)
    if ( result.empty) {
        response.error = true
        return response
      } else {
      try {
         const a= await  updateDoc( result.docs[0].ref, {
          status: status
        })
        console.log(a)
      }
      catch{
          response.error=true
          return response
      }
        
        
  return response
  }}
  else if (objectType.toUpperCase() =="DRIVER") {
    const q = query(DriverRef, where(" driverNumber", "==", number))
     const result =await getDocs(q)             //find car exist or not
     
        if ( result.empty) {
          response.error = true
          return response
        } else {
        try {
           const a= await  updateDoc( result.docs[0].ref, {
            status: status
          })
          console.log(a)
        }
        catch{
            response.error=true
            return response
        }
          
          
    return response

  }}else{
    console.log("invalid Object need to update when call updateStatus")
    return response
  }
}
class trip {
    begin: Address
    end: Address
    beginDate: Date
    endDate?: Date
    carLicenseplate: string
    DriverNumber: string
    price?: number
    vehiclePrice:number
    vehicleVelocity:number
    constructor(routeInfo: Route) {
        this.begin=routeInfo.begin,
        this.end=routeInfo.end,
        this.beginDate=routeInfo.beginDate,
        this.carLicenseplate=routeInfo.car.licenseplate,
        this.DriverNumber=routeInfo.driver.driverNumber,
        this.vehiclePrice=routeInfo.car.price?routeInfo.car.price:0,
        this.vehicleVelocity=routeInfo.car.velocity?routeInfo.car.velocity:0,
        // set endDate and price to some value bc if not the err occur

        // cal and assign real val
        this.calculateEndDateAndPrice(this.vehiclePrice,this.vehicleVelocity)


    }
    calculateEndDateAndPrice(vehiclePrice:number,vehicleVelocity:number) {
        //depend on lat and long of begin and end-> distance

        //this code'll be replaced
        const angle1 = (this.end.latitude * Math.PI / 180) - (this.begin.latitude * Math.PI / 180)
        const angle2 = (this.end.longitude * Math.PI / 180) - (this.begin.longitude * Math.PI / 180)
        const angle3 = Math.sqrt(Math.pow(angle1, 2) + Math.pow(angle2, 2));



        // use distance calculate time ( use t = s/v )
        //this code'll be replaced
        const t = angle3 / vehicleVelocity;                              //i think t shoud be hour and v should be km/h
        //price = t . car's price ( get from car) and endDate = beginDate+t   
      
        //store endDate  and price to variable
        this.endDate = new Date(2024, 2, 21 ,0+ t);       //use some exact time
        this.price = t * vehiclePrice;

    }
}
export class RouteOperation {
    constructor() { }
    async createRoute(routeInfo: Route) {
        
        let response: Response =  {
            error: false,
            data: null
        }
        const route = new trip(routeInfo,)
        var b = JSON.stringify(route.begin)
        var e = JSON.stringify(route.end)
        if(!route){
            response.error=true
            return response
        }
        else response.data = route

   
        try {
            await addDoc(RouteRef, {
                begin: b,
                end: e,
                beginDate: route.beginDate.toString(),   // convert to timestamp or sth      
                endDate: route.endDate?route.endDate.toString():"error",
                Carlicenseplate: route.carLicenseplate,
                DriverNumber: routeInfo.DriverNumber,
                price: route.price
            })
        }
        catch {
            response.error=true
            return response
        }
        
        // assign response to driver 's history arr 


        
        // update status for car and driver
        // updateStatus("car",routeInfo.car.licenseplate,"busy")
        // updateStatus("driver",routeInfo.car.licenseplate,"busy")
        //return
        return response
    }
    async viewAllRoute() {
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        try {

            const routeArray = await (getDocs(RouteRef))

            routeArray.docs.forEach((doc) => {
                result.push({
                    begin: JSON.parse(doc.data().begin),
                    end: JSON.parse(doc.data().begin),
                    beginDate: new Date(doc.data().beginDate),               
                    endDate: new Date(doc.data().beginDate),
                    carNumber: doc.data().carNumber,
                    DriverNumber: doc.data().DriverNumber,
                    price: doc.data().price
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

export class Subject {
    private observers: Observer[] = [];

    public attach(observer: Observer): void {
        this.observers.push(observer);
    }

    public detach(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    public notify(route: Route): void {
        for (const observer of this.observers) {
            observer.update(route);
        }
    }
}