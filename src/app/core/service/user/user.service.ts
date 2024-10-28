import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../../model/userDTO.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api'; // Base URL for your API

  constructor(private http: HttpClient) {}

  // Register a new user
  register(userData: UserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData); // Send userData directly
  }

  // Login a user
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
