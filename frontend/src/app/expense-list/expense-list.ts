import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.css']
})
export class ExpenseListComponent implements OnInit {

  expenses: any[] = [];

  constructor(private service: ExpenseService) {}

  ngOnInit() {
    this.service.loadExpenses();

    this.service.expenses$.subscribe(data => {
      this.expenses = data || [];
    });
  }

  deleteExpense(id: number) {
    this.service.delete(id);
  }
}