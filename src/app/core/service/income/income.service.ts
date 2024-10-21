import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Income {
  month: string;
  source: string; 
  amount: number;
  investments: string;
}


@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private apiUrl = 'http://localhost:3000/api/incomes';

  constructor(private http: HttpClient) {}
  saveIncome(incomes: Income[], month: string): Observable<Income[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    
    return this.http.post<{ message: string; incomes: Income[] }>(
      `${this.apiUrl}/income`, 
      { month, incomes }, 
      { headers }
    ).pipe(map(response => response.incomes));
  }

  // Fetch incomes for a specific month from the API
  getIncomes(month?: string): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.apiUrl}?month=${month}`);
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
