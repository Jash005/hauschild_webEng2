import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
/* ====================================
        API
==================================== */
  private readonly BASE_URL = 'http://localhost:3000/api';

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


/* ====================================
        User
==================================== */
  async registerUser(user: any): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/user/register`, 'POST', user);
  }

  async loginUser(user: any): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/user/login`, 'POST', user);
  }

  async getAllUser(): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/user`, 'GET');
  }

  async getUserById(id: string): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/user/${id}`, 'GET');
  }

  async deleteUser(id: string): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/user/${id}`, 'DELETE');
  }

/* ====================================
        zwischen User und Rezept
==================================== */
  async getRecipesByUserId(id: string): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/recipe/user/${id}`, 'GET');
  }

  async getCommentsByUserId(id: string): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/recipe/comment/${id}`, 'GET');
  }

/* ====================================
        Rezept
==================================== */
  async createRecipe(recipe: any): Promise<any> {
    let authHeader = localStorage.getItem('authToken') || '';
    return this.getApiData(authHeader, `${this.BASE_URL}/recipe`, 'POST', recipe);
  }

  async editRecipe(id:string, recipe: any): Promise<any> {
    let authHeader = localStorage.getItem('authToken') || '';
    return this.getApiData(authHeader, `${this.BASE_URL}/recipe/${id}`, 'PUT', recipe);
  }

  async getAllRecipes(): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/recipe`, 'GET');
  }

  async getTopRecipes(): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/recipe/top`, 'GET');
  }

  async getRecipeById(id: string): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/recipe/${id}`, 'GET');
  }

  // async updateRecipe(id: string, recipe: any): Promise<any> {
  //   return this.getApiData('', `${this.BASE_URL}/recipe/${id}`, 'PUT', recipe);
  // }

  async updateRecipeRating(id: string, rating: number): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/recipe/${id}`, 'PUT', {rating: rating});
  }

  async addCommentToRecipe(id: string, comment: string, author: string, authorId: string): Promise<any> {
    let bodyToSend = {content: comment, author: author, authorId: authorId};
    let authHeader = localStorage.getItem('authToken') || '';
    return this.getApiData(authHeader, `${this.BASE_URL}/recipe/${id}/comments`, 'PUT', bodyToSend);
  }

  async deleteRecipe(id: string): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/recipe/${id}`, 'DELETE');
  }









//TODO - löschen vor der Abgabe
  async deleteAllUserData(): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/user/ALL/ALL`, 'DELETE');
  }
  async deleteAllRecipeData(): Promise<any> {
    return this.getApiData('', `${this.BASE_URL}/recipe/ALL/ALL`, 'DELETE');
  }
}




