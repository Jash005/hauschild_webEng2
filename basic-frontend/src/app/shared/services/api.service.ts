import {Injectable} from '@angular/core';
import {CreateEchoInput, Echo} from "../types/echo.type";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = 'http://localhost:3000/api';

  async post<T>(url: string, body?: object): Promise<T> {
    const options: RequestInit = {method: 'POST'};
    if (body) {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (response.ok) {
      return response.json();
    }

    const errorText = await response.text();
    console.log('Error in ApiService:', response.status, errorText);
    throw new Error(errorText);
  }

  async getEchos(contains?: string): Promise<Echo[]> {
    let url = `${this.BASE_URL}/echo`;
    if (contains) {
      url += `?${new URLSearchParams({contains})}`;
    }
    const response = await fetch(url);
    return response.json();
  }

  async createEcho(echo: CreateEchoInput): Promise<Echo> {
    return this.post<Echo>(`${this.BASE_URL}/echo`, echo);
  }

  async doError(): Promise<Echo> {
    return this.post<Echo>(`${this.BASE_URL}/echo`, {});
  }

  async registerUser(user: any): Promise<any> {
    const response = await fetch('http://localhost:3000/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      throw new Error('Failed to register user');
    }

    return response.json();
  }

}
