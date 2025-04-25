import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  sessionIndex: string;
  nameid: string;
  unique_name: string;
  surname: string;
  role: string | string[];
  exp: number;
}

@Injectable({
  providedIn: 'root'
})

export class JwtService {

  clearToken(): void {
    localStorage.removeItem('token');
  }

  decodeToken(token: string): JwtPayload {
    const decoded: any = jwtDecode(token);
    return {
      sub: decoded.sub,
      sessionIndex: decoded.SessionIndex,
      nameid: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      unique_name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      surname: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      exp: decoded.exp,
    };
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken = this.decodeToken(token);
    return decodedToken.unique_name + ' ' + decodedToken.surname;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken = this.decodeToken(token);
    return decodedToken.sub;
  }

  getUserRole(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const decodedToken = this.decodeToken(token);
    return Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isAdmin(): boolean {
    const roles = this.getUserRole();
    return roles.includes('Administrator');
  }

  isEmployee(): boolean {
    const roles = this.getUserRole();
    return roles.includes('Employee');
  }

  isTaxpayer(): boolean {
    const roles = this.getUserRole();
    return roles.includes('Taxpayer');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const date = this.getTokenExpirationDate();
    if (date === null) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
}