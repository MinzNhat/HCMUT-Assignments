

export interface Address {
    latitude: number,
    longitude: number,
    address: string
}
export interface Route {
    id: string
    begin: Address,
    end: Address,
    beginDate: Date,
    endDate?: Date,         //no need to pass bc it will be calculated in trip's constructor
    licenplate?: string,     //no need to pass bc we'll get it from car
    DriverNumber?: string, //no need to pass bc we'll get it from driver
    price: number
    owner?: string, //email address of the owner
    status: string,
    car: Vehicle,                // get velocity and price from this
    driver: Driver          // check status if u want , we need to access driveHistory to assign our route(response.data)to that His
}
export interface Driver {
    // type: string,
    //change here when we have updateIMG func
    driveHistory?: string[],               // Json string of route id
    driverName: string,
    driverNumber: string,
    driverAddress: Address,
    driverStatus?: number,
    driverLicense: Blob[]
    id?: string,
}

export interface Vehicle {
    id?: string,
    type: string
    licenseplate: string,
    enginefuel?: string,
    height?: string,
    length?: string,
    width?: string,
    mass?: string,
    status?: string,
    price?: number,
    velocity?: number,
    maintenanceDay?: Date,
    // maintenanceID:number  //use to cancel when Day being changed by updating ( this field can be seen only when use view function)
}

export interface Response {
    error: boolean,
    data?: any
}

export interface SignUp {
    email: string,
    password: string
}

export interface ForgotPass {
    email: string,
}
export interface updateVehicle {
    type?: string
    licenseplate?: string,
    enginefuel?: string,
    height?: string,
    length?: string,
    width?: string,
    mass?: string,
    status?: string,
    price?: number,
    velocity?: number,
    maintenanceDay?: Date,
}
export interface updateDriver {
    // type: string,
    //change here when we have updateIMG func
    driveHistory?: Route[],               // we can cal experience by check the length of this
    driverName?: string,
    driverNumber?: string,
    driverAddress?: Address,
    driverStatus?: number,
    driverLicense?: Blob[]
}
export interface Route {
    id: string
    begin: Address,
    end: Address,
    beginDate: Date,
    distance: number,
    endDate?: Date,
    licenplate?: string,
    DriverNumber?: string,
    price: number,
    owner?: string,
    car: Vehicle,
    driver: Driver
    task: string
}
export interface CreateRoute {
    begin: Address,
    end: Address,
    distance: number,
    beginDate: Date,
    driver: Driver,
    task: string,
    typeCar: string,
    car?: Vehicle
}
export interface Observer {
    update(route: Route): void;
}
