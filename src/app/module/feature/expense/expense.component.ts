import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Expense } from '../../../core/model/expense.model';
import { ExpenseService } from '../../../core/service/expense/expense.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
[x: string]: any;
  expenseForm!: FormGroup; // Form group for managing expense input
  selectedMonth: string; // Currently selected month
  monthSelected: boolean = false; // Flag to check if a month is selected
  currentExpenseIndex: number | null = null; // Track the index of the current expense for editing
  filteredExpenses: { month: string, expenseType: string, expenseAmount: number }[] = []; // Filtered expenses for display

  // Unified expenses array
  expense: Expense[] = [];
  // expenseService: any;

  constructor(private expenseService: ExpenseService, private fb: FormBuilder, private router: Router) {
    // Default selected month to the current month
    this.selectedMonth = new Date().toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    // Initialize the expense form with validators
    this.expenseForm = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmitExpense() {
    // Handle form submission
    if (this.expenseForm.valid) {
      const newExpense = {
        ...this.expenseForm.value,
        expenseAmount: Number(this.expenseForm.value.expenseAmount) // Ensure it's a number
      };

      if (this.currentExpenseIndex !== null) {
        // Update existing expense
        this.expense[this.currentExpenseIndex] = newExpense;
        this.currentExpenseIndex = null; // Reset index
      } else {
        // Add new expense
        this.expense.push(newExpense);
      }

      this.expenseForm.reset(); // Reset the form after submission
      this.filterExpenses(); // Refresh filtered expenses after adding/updating
    }
  }

  // Calculate total expenses across all months
  calculateTotalExpense(): number {
    return this.expense.reduce((acc, curr) => acc + curr.expenseAmount, 0);
  }

  // Remove an expense from the list
  removeExpense(expenseToRemove: any) {
    this.expense = this.expense.filter(expense => expense !== expenseToRemove);
    this.filterExpenses(); // Refresh filtered expenses after removal
  }

  // Edit an expense
  editExpense(expense: any, index: number) {
    this.currentExpenseIndex = index; // Set current index for updating
    this.expenseForm.patchValue({
      month: expense.month,
      expenseType: expense.expenseType,
      expenseAmount: expense.expenseAmount
    });
    this.selectedMonth = expense.month; // Update selected month
    this.monthSelected = true; // Enable the month dropdown
  }

  onBack() {
    // Navigate back to the dashboard
    this.router.navigate(['/budget-planner/dashboard']);
  }
  
  onChangeExpense(event: any) {
    // Handle month selection change
    this.selectedMonth = event.target.value;
    this.monthSelected = true; // Set month as selected
    this.filterExpenses(); // Filter the expenses based on the selected month
  }

  filterExpenses() {
    // Filter expenses based on the selected month
    this.filteredExpenses = this.expense.filter(
      (expense) => expense.month === this.selectedMonth
    );
  }

  
  // saveExpense(expense: any): void {
  //   console.log("Saving expense:", expense);
  //   this.expenseService.saveExpense(expense).subscribe(
  //     (savedExpense: Expense) => {
  //       console.log("Expense saved:", savedExpense);
  //       this.expense.push(savedExpense); // Push saved expense to local array
  //       this.filterExpenses(); // Refresh filtered expenses after adding/updating
  //     },
  //     (error: any) => {
  //       console.error('Error saving expense:', error);
  //       // Optionally handle error UI here
  //     }
  //   );
  // }

  // saveExpense(expense: Expense): void {
  //   console.log("Saving expense:", expense);
    
  //   // Call the expense service to save the expense
  //   this.expenseService.saveExpense(expense).subscribe(
  //     (savedExpense: Expense) => {
  //       console.log("Expense saved:", savedExpense);
  //       this.expense.push(savedExpense); // Add saved expense to local array
  //       this.filterExpenses(); // Refresh filtered expenses after adding/updating
  //     },
  //     (error: any) => {
  //       console.error('Error saving expense:', error);
  //       // Optionally handle error UI here, e.g., show error message to the user
  //     }
  //   );
  // }
  // saveExpense(): void {
  //   console.log("Saving expense:", this.expense);

  //   this.expenseService.saveExpense([]).subscribe(
  //     (savedExpenses: Expense[]) => {
  //       console.log("Expenses saved:", savedExpenses);
  //     },
  //     (error: any) => {
  //       console.error('Error saving expense:', error);
  //       // Optionally handle error UI here
  //     }
  //   );
  // }


//   saveExpense(): void {
//     console.log("Saving expense:", this.expense);

//     // Make sure to provide the month value here
//     this.expenseService.saveExpense(this.expense, this.selectedMonth).subscribe(
//       (savedExpenses: Expense[]) => {
//         console.log("Expenses saved:", savedExpenses);
//         // Optionally reset the form or update the UI
//       },
//       (error: any) => {
//         console.error('Error saving expense:', error);
//         // Optionally handle error UI here
//       }
//     );
// }

saveExpense(): void {
  console.log("Saving expense:", this.expense);

  // Make sure to provide the month value here
  this.expenseService.saveExpense(this.expense, this.selectedMonth).subscribe(
    (savedExpenses: Expense[]) => {
      console.log("Expenses saved:", savedExpenses);

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Expense Saved',
        text: 'Your expense has been saved successfully!',
        confirmButtonText: 'OK'
      });

      // Optionally reset the form or update the UI
      //this.resetForm();  // Assuming you have a form reset method
    },
    (error: any) => {
      console.error('Error saving expense:', error);

      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Failed to Save',
        text: 'There was an error saving the expense. Please try again.',
        confirmButtonText: 'OK'
      });

      // Optionally handle error UI here
    }
  );
}

getExpensesByMonth(month: string): void {
  if (month) {
    this.expenseService.getExpensesByMonth(month).subscribe(
      (response:any) => {
        if (response.expenses.length === 0) {
          console.log('No expenses found for this month');
          this.filteredExpenses = [];  // Reset if no expenses are found
        } else {
          this.filteredExpenses = response.expenses;  // Store fetched expenses
        }
      },
      (error:any) => {
        if (error.status === 404) {
          console.error(`No expenses found for the month: ${month}`);
        } else {
          console.error('Error fetching expenses:', error);
        }
        this.filteredExpenses = [];  // Reset if there’s an error
      }
    );
  }
}
  
}
