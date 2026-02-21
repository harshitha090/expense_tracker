import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  private baseUrl = 'http://localhost:8080/expenses';
  private expenseSubject = new BehaviorSubject<any[]>([]);
  expenses$ = this.expenseSubject.asObservable();

  constructor(private http: HttpClient,
              private auth: AuthService) {}

  loadExpenses() {
    const user = this.auth.getUser();
    if (!user) return;

    this.http.get<any[]>(`${this.baseUrl}/${user.username}`)
      .subscribe(data => this.expenseSubject.next(data));
  }

  add(expense: any) {
  const user = this.auth.getUser();

  // Optimistic update (instant UI update)
  const current = this.expenseSubject.value;
  const tempExpense = { ...expense, id: Date.now() };
  this.expenseSubject.next([...current, tempExpense]);

  this.http.post(`${this.baseUrl}/${user.username}`, expense)
    .subscribe(() => this.loadExpenses());
}

  delete(id: number) {
    this.http.delete(`${this.baseUrl}/${id}`)
      .subscribe(() => this.loadExpenses());
  }
}