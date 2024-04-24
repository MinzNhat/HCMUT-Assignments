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

// Initialize Firebase
const colRef = collection(db, 'books');
const CarRef = collection(db, 'Vehicle');
const DriverRef = collection(db, 'Driver');
const RouteRef = collection(db, 'Route');

export class RouteOperation {
    constructor() { }
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
        return response;
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

            await this.DriverStatusUpdate(routeInfo.driver, 1);
            await this.CarStatusUpdate(routeInfo.car, 'Active');
            const RouteCost = await this.CalculatePricebyType(routeInfo.distance,routeInfo.typeCar);
            // Create route object
            const route: Route = {
                id: '', // Generate or set your ID here
                begin: routeInfo.begin,
                end: routeInfo.end,
                beginDate: routeInfo.beginDate,
                distance: routeInfo.distance,
                endDate: endDate,
                status:"active",
                car: routeInfo.car,
                driver: routeInfo.driver,
                price: RouteCost,
                task: routeInfo.task
            };
            const docRef = await addDoc(RouteRef, route);
            route.id = docRef.id
            response.data = route
        }
        catch (error) {
            response.error = true
        }
        return response
    }


    async CaculateEndDate(beginDate: Date, distance: number, car: Vehicle) {
        const carVelocity = car.velocity ? car.velocity : 1
        const time = distance / carVelocity;
        const endDate = new Date(beginDate.getTime() + (time * 3600000)); // Convert hours to milliseconds
        return endDate;
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
        return response;
    }

    async calculateRouteProgress(beginDate: Date, endDate: Date) {
        const currentDate = new Date();

        const beginTime = beginDate.getTime();
        const endTime = endDate.getTime();
        const currentTime = currentDate.getTime();

        const totalTime = endTime - beginTime;
        const elapsedTime = currentTime - beginTime;

        const progressPercentage = (elapsedTime / totalTime) * 100;
        return progressPercentage;
    }

    async viewAllRoute() {
        let response: Response = {
            error: true,
            data: []
        }
        let result: any[] = []
        try {
            const routeArray = await getDocs(RouteRef);
            const currentTime = new Date();
            for (const doc of routeArray.docs) {
                console.log(doc.data())
                const beginDate = new Date(doc.data().beginDate);
                const endDate = new Date(doc.data().endDate);
                let status = "active";
                if (endDate < currentTime) {
                    status = "expired";
                    // Update Status in database
                    await updateDoc(doc.ref, { status: status });
                }
                await this.CarStatusUpdate(doc.data().car, status === "active" ? "Active" : "Inactive");
                await this.DriverStatusUpdate(doc.data().driver, status === "active" ? 1 : 0);
                // Calculating Route Progress
                const progress = await this.calculateRouteProgress(beginDate, endDate);
                result.push({
                    begin: doc.data().begin,
                    end: doc.data().begin,
                    beginDate: new Date(doc.data().beginDate),
                    endDate: new Date(doc.data().beginDate),
                    carNumber: doc.data().carNumber,
                    driverNumber: doc.data().driverNumber,
                    price: doc.data().price,
                    id: doc.id,
                    status: status,
                    routeProgress: progress
                })
            }
        }
        catch {
            return response
        }
        if (result) {
            response.error = false
            response.data = result
            return response
        }
        else return response
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

    async deleteRouteByID(routeID: string){
        try {
            // Check if the route exists
            const routeDoc = await getDoc(doc(db, 'routes', routeID));
            if (!routeDoc.exists()) {
                return { error: true, data: "Route not found" };
            }
    
            // Delete the route
            await deleteDoc(doc(db, 'routes', routeID));
    
            return { error: false, data: "Route deleted successfully" };
        } catch (error) {
            console.error("Error deleting route:", error);
            return { error: true, data: error };
        }
    }

    async CalculatePricebyType(distance: number, type: string): Promise<number> {
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

    //_________________For Dang Tran Minh Nhat needs_______________
    async getEndDateOfRoute(routeId: string) {
        try {
            const routeDocSnapshot = await getDoc(doc(RouteRef, routeId));
            if (routeDocSnapshot.exists()) {
                const routeData = routeDocSnapshot.data();
                const endDate = new Date(routeData.endDate);
                return endDate;
            } else {
                console.error("Route does not exist");
                return null; // Return null if route does not exist
            }
        } catch (error) {
            console.error("Error fetching end date of route:", error);
            return null; // Return null if there's an error
        }
    }

};