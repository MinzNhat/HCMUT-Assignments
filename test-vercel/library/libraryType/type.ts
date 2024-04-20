

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
    car: Vehicle,                // get velocity and price from this
    driver: Driver          // check status if u want , we need to access driveHistory to assign our route(response.data)to that His
}
export interface Driver {
    id?: string
    // type: string,
    //change here when we have updateIMG func
    driveHistory?: Route[],               // we can cal experience by check the length of this
    driverName: string,
    driverNumber: string,
    driverAddress: Address,
    driverStatus?: number,
    driverLicense: Blob[]
}

export interface Vehicle {
    type: string
    licenseplate: string,
    enginefuel?: string,
    height: string,
    length: string,
    width: string,
    mass: string,
    status?: string,
    price?: number,
    velocity?: number,
    id?: string,
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