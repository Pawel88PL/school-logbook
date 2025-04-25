export interface User {
    id: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    email?: string;
    phoneNumber?: string;
    dateAdded?: string;
    lastUpdated?: string;
    lastSuccessfulLogin?: string;
    lastFailedLogin?: string;
    lastPasswordChange?: string;
    isActive?: boolean;
}

export interface Role {
    id: number;
    name: string;
    displayName?: string;
}

export interface RegisterModel {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phoneNumber?: string;
    pesel?: string;
    nip?: string;
    regon?: string;
}

export interface UpdateUserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    pesel?: string;
    nip?: string;
    regon?: string;
    isActive: boolean;
}