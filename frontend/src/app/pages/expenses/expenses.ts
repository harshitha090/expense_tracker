import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.html',
  styleUrls: ['./expenses.css']
})
export class ExpensesComponent implements OnInit {

  expenses: any[] = [];

  newExpense = {
    title: '',
    amount: 0,
    category: '',
    date: ''
  };

  constructor(private service: ExpenseService) {}

  ngOnInit() {

    this.service.loadExpenses();

    this.service.expenses$.subscribe(data => {

      this.expenses = (data || []).sort((a: any, b: any) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
      );

    });
  }

  addExpense() {

    if (!this.newExpense.title || !this.newExpense.amount || !this.newExpense.category || !this.newExpense.date) {
      return;
    }

    this.service.add(this.newExpense);

    this.newExpense = {
      title: '',
      amount: 0,
      category: '',
      date: ''
    };
  }

  deleteExpense(id: number) {
    this.service.delete(id);
  }
}