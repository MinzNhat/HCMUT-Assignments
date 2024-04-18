export interface Address {
    latitude: number,
    longitude: number,
    address: string
}

export interface Driver {
    driverName: string,
    driverNumber: string,
    driverAddress: Address,
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