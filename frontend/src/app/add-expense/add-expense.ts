import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-expense.html',
  styleUrls: ['./add-expense.css']
})
export class AddExpenseComponent {

  expense = {
    title: '',
    amount: 0,
    category: '',
    date: ''
  };

  constructor(private service: ExpenseService) {}

  addExpense() {
    this.service.add(this.expense);

    alert('Expense Added!');

    this.expense = {
      title: '',
      amount: 0,
      category: '',
      date: ''
    };
  }
}