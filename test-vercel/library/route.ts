// Import the functions you need from the SDKs you need
import { response } from 'express';
import { QuerySnapshot } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc,
    query, where, getDocs, GeoPoint, updateDoc, getDoc
} from 'firebase/firestore';
import { Route, Response, Address, Vehicle, Driver, Observer, CreateRoute } from './libraryType/type';
import { db } from './account';
import { DriverRegister } from './driver';

// Initialize Firebase
const CarRef = collection(db, 'Vehicle');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

export class RouteOperation {
    constructor() { }
    async CreateRoute(routeInfo: CreateRoute) {
        let response: Response = {
            error: false,
            data: null
        };
        try {
            const car = await this.GetCar(routeInfo.typeCar);
            if (!car) {
                response.data = "Không có xe phù hợp, vui lòng tạo mới."
                return response;
            }

            routeInfo.car = car;
            const endDate = await this.CaculateEndDate(routeInfo.beginDate, routeInfo.distance, routeInfo.car);
            const RouteCost = await this.CalculatePricebyType(routeInfo.distance, routeInfo.typeCar);
            const Income = await this.calculateIncome(RouteCost);
            await this.DriverStatusUpdate(routeInfo.driver, 1);
            await this.CarStatusUpdate(routeInfo.car, "Active");
            await this.CalculatePrice(routeInfo.distance);
            const progress = await this.calculateRouteProgress(routeInfo.beginDate, endDate);

            // Change the maintance date of the car if necessary
            await this.delayMaintenanceDate(routeInfo.car, endDate);

            // Create route object
            const route: Route = {
                id: '', // This will be auto-generate by Firebase
                begin: routeInfo.begin,
                end: routeInfo.end,
                beginDate: routeInfo.beginDate,
                distance: routeInfo.distance,
                endDate: endDate,
                carID: routeInfo.car.id,
                carType: routeInfo.car.type,
                carLicensePlate: routeInfo.car.licenseplate,
                driverID: routeInfo.driver.id,
                driverName: routeInfo.driver.driverName,
                price: RouteCost,
                task: routeInfo.task,
                status: 'Active',
                income: Income,
                routeProgress: progress
            };
            const docRef = await addDoc(RouteRef, route);
            route.id = docRef.id
            response.data = route

            //Get id of created route from firebase and update driver history
            await this.UpdateHistoryDriver(routeInfo.driver, route.id);
        }
        catch (error) {
            response.error = true
        }
        finally {
            return response
        }
    }

    async GetRoute(routeId: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            
            const routeDoc = await getDoc(doc(db, "Route", routeId));

            if (routeDoc.exists()) {
                const routeData = routeDoc.data();
                const beginDate = new Date(routeData.beginDate.seconds * 1000);
                const endDate = new Date(routeData.endDate.seconds * 1000);
                const progress = await this.calculateRouteProgress(beginDate, endDate);

                response.data = {
                    id: routeId,
                    distance: routeData.distance,
                    car: routeData.car,
                    driver: routeData.driver,
                    price: routeData.price,
                    task: routeData.task,
                    status: routeData.status,
                    begin: routeData.begin,
                    end: routeData.end,
                    beginDate: beginDate,
                    endDate: endDate,
                    carID: routeData.carID,
                    carLicensePlate: routeData.carLicensePlate,
                    carType: routeData.carType,
                    driverID: routeData.driverID,
                    driverName: routeData.driverName,
                    income: routeData.income,
                    routeProgress: progress
                };
                response.error =false
            }
            else {
                throw "Route not found";
            }
        }
        catch (error) {
            console.error("Error retrieving route:", error);
            
        }
        finally{
            return response
        }
    }

    async viewAllRoute() {
        let response: Response = {
            error: true,
            data: null
        }
        let result: any[] = []
        try {
            await DriverRegister.ScanForRouteEnd();
            const routeArray = await (getDocs(RouteRef));
            const currentTime = new Date();
            routeArray.docs.forEach(async (doc) => {
                const beginDate = new Date(doc.data().beginDate.seconds * 1000);
                const endDate = new Date(doc.data().endDate.seconds * 1000);
                const progress = await this.calculateRouteProgress(beginDate, endDate);

                result.push({
                    begin: doc.data().begin,
                    end: doc.data().end,
                    beginDate: new Date(doc.data().beginDate.seconds * 1000),
                    endDate: new Date(doc.data().endDate.seconds * 1000),
                    carID: doc.data().carID,
                    carLicensePlate: doc.data().carLicensePlate,
                    carType: doc.data().carType,
                    driverID: doc.data().driverID,
                    driverName: doc.data().driverName,
                    price: doc.data().price,
                    id: doc.id,
                    status: doc.data().status,
                    routeProgress: progress,
                    income: doc.data().income,
                    distance: doc.data().distance
                })
            })
            if (result) {
                response.data = result
                response.error = false
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            return response
        }
    }

    async UpdateRouteStatus(RouteID: string, Status: string) {
        let response: Response = {
            error: true,
            data: null
        }
        try {
            const routeDocRef = doc(RouteRef, RouteID);
            await updateDoc(routeDocRef, {
                status: Status
            });
            response.error =false
            response.data =("Route status updated successfully");
        }
        catch (error) {
            console.error("Error updating route status:", error);
        }
        finally{
            return response
        }
    }


    async deleteRouteByID(routeID: string) {
        try {
            const routeDoc = await getDoc(doc(db, 'Route', routeID));
            if (!routeDoc.exists()) {
                return { error: true, data: "Route not found" };
            }

            //    update the route's status into "Deleted"
            const routeRef = doc(db, 'Route', routeID);
            await updateDoc(routeRef, {
                status: "Deleted"
            });

            return { error: false, data: "Route deleted successfully" };
        }
        catch (error) {
            console.error("Error deleting route:", error);
            return { error: true, data: error };
        }
    }

    async RecommendDriver() {
        let response: Response = {
            error: false,
            data: []
        };
        try {
            const querySnapshot = await getDocs(DriverRef);
            const drivers: Driver[] = [];
            querySnapshot.forEach((doc) => {
                const driverData = doc.data() as Driver;
                driverData.id = doc.id
                // Filter drivers that have driverStatus available
                if (driverData.driverStatus === 0) {
                    drivers.push(driverData);
                }
            });
            // Sort drivers based on the number of routes in driveHistory
            drivers.sort((a, b) => (a.driveHistory?.length || 0) - (b.driveHistory?.length || 0));

            console.log(drivers)
            if (drivers.length === 0) {
                return response;
            } else {
                response.data = drivers.slice(0, 3);
            }
        } catch (error) {
            response.error = true;
        }
        finally {
            return response;
        }
    }
    async GetCar(typeCar: string) {
        try {
            const carsSnapshot = await getDocs(collection(db, 'Vehicle'));

            for (const doc of carsSnapshot.docs) {
                const car = doc.data() as Vehicle;
                if (car.type === typeCar && car.status === 'Inactive') {
                    car.id = doc.id
                    return car;
                }
            }
            // If no suitable car found, return null
            return null;
        } catch (error) {
            console.error('Error getting car:', error);
            throw error; // Propagate the error
        }
    }

    async delayMaintenanceDate(vehicle: Vehicle, endDate: Date) {
       
       try{ // Check if maintenance day is before the end date
        if (vehicle.maintenanceDay && vehicle.maintenanceDay < endDate) {
            // Set maintenance day to the day after the end date
            const nextDay = new Date(endDate);
            nextDay.setDate(nextDay.getDate() + 1);
            vehicle.maintenanceDay = nextDay;
        }}
        catch(error){
            throw error
        }
    }

    async CaculateEndDate(beginDate: Date, distance: number, car: Vehicle) {
        const carVelocity = car.velocity ? car.velocity : 1
        const time = distance / carVelocity;
        const endDate = new Date(beginDate.getTime() + (time * 3600000)); // Convert hours to milliseconds
        return endDate;
    }

    async CalculatePricebyType(distance: number, type: string) {
        const prices: { [key: string]: number } = {
            Truck: 2500,
            Bus: 4500,
            ContainerTruck: 3000
        };

        try {
            if (prices[type]) {
                const totalPrice = distance * prices[type];
                return totalPrice;
            } else {
                throw new Error(`Invalid vehicle type: ${type}`);
            }
        } catch (error) {
            console.error("Error calculating price by type:", error);
            throw error;
        }
    }

    async CalculatePrice(distance: number) {
        const prices: { [key: string]: number } = {
            Truck: 2500,
            Bus: 4500,
            ContainerTruck: 3000
        };

        let response: Response = {
            error: false,
            data: {}
        };
        try {
            for (const vehicleType in prices) {
                if (Object.prototype.hasOwnProperty.call(prices, vehicleType)) {
                    const price = distance * (prices[vehicleType as keyof typeof prices] || 1);
                    response.data[vehicleType] = price;
                }
            }
        } catch (error) {
            console.error("Error calculating fees:", error);
            response.error = true;
        }
        finally {
            return response;
        }
    }

    async calculateIncome(RoutePrice: number) {
        // Assuming income is 5% of the route price
        const incomePercentage = 0.05;
        const income = RoutePrice * incomePercentage;
        return income;
    }

    async calculateRouteProgress(beginDate: Date, endDate: Date) {
        const currentDate = new Date();
        const beginTime = beginDate.getTime();
        const endTime = endDate.getTime();
        const currentTime = currentDate.getTime();
        const totalTime = endTime - beginTime;
        const elapsedTime = currentTime - beginTime;
        // console.log(beginDate)
        // console.log(endDate)
        
        const progressPercentage = (elapsedTime / totalTime) * 100;
        return Math.min(100, Math.max(0, progressPercentage));
    }

    async DriverStatusUpdate(driver: Driver, status: number) {
        try {
            await updateDoc(doc(DriverRef, driver.id), {
                driverStatus: status
            });
            console.log("Driver status updated successfully");
        }
        catch (error) {
            console.error("Error updating driver status:", error);
        }
    }

    async CarStatusUpdate(car: Vehicle, status: string) {
        try {
            await updateDoc(doc(CarRef, car.id), {
                status: status
            });
            console.log("Car status updated successfully");
        }
        catch (error) {
            console.error("Error updating car status:", error);
        }
    }

    async UpdateHistoryDriver(driver: Driver, RouteId: string) {
        try {
            // Get the document reference of the driver
            const driverDocRef = doc(DriverRef, driver.id);
            // Get the current driver data
            const driverDoc = await getDoc(driverDocRef);
            if (!driverDoc.exists()) {
                throw new Error("Driver not found");
            }

            // Update the driveHistory with the new RouteId
            const currentDriveHistory = driverDoc.data().driveHistory || [];
            const updatedDriveHistory = [...currentDriveHistory, RouteId];

            // Update the driver document with the updated driveHistory
            await updateDoc(driverDocRef, {
                driveHistory: updatedDriveHistory
            });

            console.log("Driver history updated successfully");
        }
        catch (error) {
            console.error("Error updating driver history:", error);
            throw error;
        }
    }

};