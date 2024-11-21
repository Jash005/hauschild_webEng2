import { Injectable } from '@angular/core';
import { CreateEchoInput, Echo } from "../types/echo.type";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = 'http://localhost:3000/api';

  private createAuthHeader(username: string, password: string): string {
    const creds = `${username}:${password}`;
    const encoded = btoa(creds);
    return `Basic ${encoded}`;
  }

  private async getApiData<T>(authHeader: string, apiUrl: string, method: string, requestBody?: any): Promise<T> {
    const fetchOptions: RequestInit = {
      method: method,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    };

    if (requestBody && method !== 'GET') {
      fetchOptions.body = JSON.stringify(requestBody);
    }

    const response = await fetch(apiUrl, fetchOptions);
    if (!response.ok) {
      const errorText = await response.json();

      console.error('Fehler beim API Aufruf:', response.status, errorText);
      throw new Error(errorText.error);
    }
    return response.json();
  }

  async registerUser(user: any): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/user/register`, 'POST', user);
  }

  async loginUser(user: any): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/user/login`, 'POST', user);
  }

  async doError(): Promise<Echo> {
    return this.getApiData('', `${this.BASE_URL}/echo`, 'POST');
  }

  async getEchos(contains?: string): Promise<Echo[]> {
    let url = `${this.BASE_URL}/echo`;
    if (contains) {
      url += `?contains=${encodeURIComponent(contains)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fehler beim API Aufruf:', response.status, errorText);
      throw new Error(errorText);
    }
    return response.json();
  }

  async createEcho(echo: CreateEchoInput): Promise<Echo> {
    //return this.post<Echo>(`${this.BASE_URL}/echo`, echo);
    return this.getApiData('', `${this.BASE_URL}/echo`, 'POST', echo);
  }

}
