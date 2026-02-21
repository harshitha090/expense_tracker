import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  name: string = '';
  expenses: any[] = [];

  totalExpense = 0;
  monthlyExpense = 0;
  weeklyExpense = 0;
  savingsPoints = 0;

  // 🔥 FILTER VARIABLES
  selectedFilter: string = 'month';
  allExpenses: any[] = [];

  pieChartData: any;
  barChartData: any;

  // CHART OPTIONS
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333'
        }
      }
    }
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#333' },
        grid: { display: false }
      },
      y: {
        ticks: { color: '#333' },
        grid: { color: '#e0e0e0' }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333'
        }
      }
    }
  };

  constructor(
    private service: ExpenseService,
    private auth: AuthService
  ) {}

  ngOnInit() {

    const user = this.auth.getUser();
    if (user) {
      this.name = user.name;
    }

    this.service.expenses$.subscribe(data => {
      this.allExpenses = data || [];
      this.applyFilter();
    });
  }

  // 🔥 FILTER FUNCTION
  applyFilter() {

    const now = new Date();
    let filtered: any[] = [];

    if (this.selectedFilter === 'week') {

      const weekStart = new Date();
      weekStart.setDate(now.getDate() - 7);

      filtered = this.allExpenses.filter(e =>
        new Date(e.date) >= weekStart
      );
    }

    if (this.selectedFilter === 'month') {

      filtered = this.allExpenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear();
      });
    }

    if (this.selectedFilter === 'year') {

      filtered = this.allExpenses.filter(e =>
        new Date(e.date).getFullYear() === now.getFullYear()
      );
    }

    this.expenses = filtered;
    this.calculateStats();
    this.updateCharts(filtered);
  }

  // 🔥 STATS CALCULATION
  calculateStats() {

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    this.totalExpense =
      this.expenses.reduce((sum, e) => sum + e.amount, 0);

    this.monthlyExpense =
      this.expenses
        .filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === currentMonth &&
                 d.getFullYear() === currentYear;
        })
        .reduce((sum, e) => sum + e.amount, 0);

    const previousMonthExpense =
      this.allExpenses
        .filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === previousMonth &&
                 d.getFullYear() === previousYear;
        })
        .reduce((sum, e) => sum + e.amount, 0);

    if (this.monthlyExpense > previousMonthExpense) {
      this.savingsPoints = -10;
    } else {
      this.savingsPoints = 10;
    }
  }

  // 🔥 UPDATE CHARTS
  updateCharts(expenses: any[]) {

    if (!expenses.length) {

      this.pieChartData = {
        labels: ['No Data'],
        datasets: [{ data: [1], backgroundColor: ['#ccc'] }]
      };

      this.barChartData = {
        labels: ['No Data'],
        datasets: [{ data: [0], backgroundColor: ['#ccc'] }]
      };

      return;
    }

    const categoryMap: any = {};
    const monthMap: any = {};

    expenses.forEach(e => {

      categoryMap[e.category] =
        (categoryMap[e.category] || 0) + e.amount;

      const month =
        new Date(e.date)
          .toLocaleString('default', { month: 'short' });

      monthMap[month] =
        (monthMap[month] || 0) + e.amount;
    });

    this.pieChartData = {
      labels: Object.keys(categoryMap),
      datasets: [{
        data: Object.values(categoryMap),
        backgroundColor: [
          '#2563eb',
          '#16a34a',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#0ea5e9'
        ]
      }]
    };

    this.barChartData = {
      labels: Object.keys(monthMap),
      datasets: [{
        data: Object.values(monthMap),
        backgroundColor: [
          '#2563eb',
          '#16a34a',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#0ea5e9'
        ]
      }]
    };
  }
}