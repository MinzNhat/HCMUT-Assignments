export interface Address {
    latitude: number,
    longitude: number,
    address: string
}
export interface Route {
    begin: Address,
    end: Address,
    beginDate: Date,
    endDate?: Date,         //no need to pass bc it will be calculated in trip's constructor
    licenplate?: string,     //no need to pass bc we'll get it from car
    DriverNumber?: string, //no need to pass bc we'll get it from driver
    price: number
    car:Car,                // get velocity and price from this
    driver: Driver          // check status if u want , we need to access driveHistory to assign our route(response.data)to that His
}
export interface Driver {
    type:string,   
    //change here when we have updateIMG func
    driveHistory:Route[],               // we can cal experience by check the length of this
    driverName: string,
    driverNumber: string,
    driverAddress: Address,
    driverStatus:string,
}

export interface Car {
    type: string,
    licenseplate: string,
    enginefuel: string,
    height: string,
    length: string,
    mass: string,
    status: string,
    price: number,
    velocity:number     // add this bc we need to calculate time depend on distance
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