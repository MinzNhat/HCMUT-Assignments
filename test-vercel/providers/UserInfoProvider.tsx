'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';

export interface UserContextInterface {
    user: any,
    setUser: (user: any) => any
}

export const UserContext = createContext({} as UserContextInterface);

type Props = {
    children: ReactNode
};

export default function UserProvider({ children }: Props) {
    const [user, setUser] = useState<any>({});

    return (
        <UserContext.Provider
            value={{
                user, setUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    return useContext(UserContext)
}  