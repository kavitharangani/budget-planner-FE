import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Expense {
  month: string;
  expenseType: string;
  expenseAmount: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/api/expenses';
  selectedMonth: any;
  
  constructor(private http: HttpClient) {}

  // Save an array of expenses to the API
  // saveExpense(expenses: Expense[]): Observable<Expense[]> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    
  //   return this.http.post<{ message: string; expenses: Expense[] }>(`${this.apiUrl}/add`, { month: expenses[0]?.month, expenses }, { headers }).pipe(
  //     map((response) => response.expenses) // Assuming the response contains the saved expenses
  //   );
  // }

  // saveExpense(expenses: Expense[]): Observable<Expense[]> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    
  //   return this.http.post<{ message: string; expenses: Expense[] }>(`${this.apiUrl}/add`, { expenses }, { headers })
  //     .pipe(map((response) => response.expenses));
  // }
  saveExpense(expenses: Expense[], month: string): Observable<Expense[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    
    return this.http.post<{ message: string; expenses: Expense[] }>(`${this.apiUrl}/add`, { month, expenses }, { headers })
      .pipe(map((response) => response.expenses));
}

  

  // Fetch expenses for a specific month from the API
  getExpenses(month: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}?month=${month}`);
  }
  
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Expense } from '../../model/expense.model';
// // Your Expense model

// @Injectable({
//   providedIn: 'root'
// })
// export class ExpenseService {
//   private apiUrl = 'http://localhost:3000/api/expenses'; // Adjust API URL as necessary

//   constructor(private http: HttpClient) {}

//   // Method to save expense to the backend
//   saveExpense(expense: any): Observable<Expense> {
//     return this.http.post<Expense>(`${this.apiUrl}/add`, expense);
//   }
  

//   // You can also add other methods like getting, updating, and deleting expenses
// }
