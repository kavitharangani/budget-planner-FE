import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IncomeService } from '../../../core/service/income/income.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Income } from '../../../core/model/income.model';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})

export class IncomeComponent implements OnInit {
  incomeForm!: FormGroup; // Form group for managing income input
  selectedMonth: string; // Currently selected month
  monthSelected: boolean = false; // Flag to check if a month is selected
  currentIncomeIndex: number | null = null; // Track the index of the current income for editing
  filteredIncomes: Income[] = []; // Filtered incomes for display

  // Unified incomes array
  income: Income[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  constructor(
    private incomeService: IncomeService, 
    private fb: FormBuilder, 
    private router: Router
  ) {
    // Default selected month to the current month
    this.selectedMonth = new Date().toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    // Initialize the income form with validators
    this.incomeForm = this.fb.group({
      month: ['', Validators.required],
      incomeSource: ['', Validators.required],
      incomeAmount: ['', [Validators.required, Validators.min(0)]],
      investments: [''] // Add investments field to the form
    });
  }

  onSubmitIncome() {
    // Handle form submission
    if (this.incomeForm.valid) {
      const newIncome: Income = {
        month: this.incomeForm.value.month,
        source: this.incomeForm.value.incomeSource, // Changed to 'source' for consistency
        amount: Number(this.incomeForm.value.incomeAmount), // Ensure it's a number
        investments: this.incomeForm.value.investments || '' // Ensure investments is populated
        ,
        incomeSource: '',
        incomeAmount: 0
      };
  
      if (this.currentIncomeIndex !== null) {
        // Update existing income
        this.income[this.currentIncomeIndex] = newIncome;
        this.currentIncomeIndex = null; // Reset index
      } else {
        // Add new income
        this.income.push(newIncome);
      }
  
      this.incomeForm.reset(); // Reset the form after submission
      this.filterIncomes(); // Refresh filtered incomes after adding/updating
    }
  }
  
  calculateTotalIncome(): number {
    // Calculate total incomes across all months
    return this.income.reduce((acc, curr) => acc + curr.amount, 0); // Changed 'incomeAmount' to 'amount'
  }

  removeIncome(incomeToRemove: Income) {
    // Remove an income from the list
    this.income = this.income.filter(income => income !== incomeToRemove);
    this.filterIncomes(); // Refresh filtered incomes after removal
  }

  editIncome(income: Income, index: number) {
    // Edit an income
    this.currentIncomeIndex = index; // Set current index for updating
    this.incomeForm.patchValue({
      month: income.month,
      incomeSource: income.source, // Changed to 'source' for consistency
      incomeAmount: income.amount, // Changed to 'amount' for consistency
      investments: income.investments // Add investments to the form patch
    });
    this.selectedMonth = income.month; // Update selected month
    this.monthSelected = true; // Enable the month dropdown
  }

  onBack() {
    // Navigate back to the dashboard
    this.router.navigate(['/budget-planner/dashboard']);
  }
  
  onChangeIncome(event: any) {
    // Handle month selection change
    this.selectedMonth = event.target.value;
    this.monthSelected = true; // Set month as selected
    this.filterIncomes(); // Filter the incomes based on the selected month
  }

  resetForm() {
    this.incomeForm.reset();
    this.currentIncomeIndex = null;
    this.selectedMonth = new Date().toLocaleString('default', { month: 'long' });
    this.monthSelected = false;
  }

  filterIncomes() {
    // Filter incomes based on the selected month
    this.filteredIncomes = this.income.filter(
      (income) => income.month === this.selectedMonth
    );
  }

  saveIncome(): void {
    console.log("Saving income:", this.income);

    const incomeToSave = this.income.map(item => ({
        month: item.month, // Ensure this matches your Income model
        source: item.source, // Updated to 'source'
        amount: item.amount, // Updated to 'amount'
        investments: item.investments || ''
    }));

    this.incomeService.saveIncome(incomeToSave, this.selectedMonth).subscribe(
        (savedResponse: any) => {
            console.log("Incomes saved:", savedResponse);
            Swal.fire({
                icon: 'success',
                title: 'Income Saved',
                text: 'Your income has been saved successfully!',
                confirmButtonText: 'OK'
            });
            this.resetForm(); // Reset the form
        },
        (error: HttpErrorResponse) => {
            console.error('Error saving income:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Save',
                text: 'There was an error saving the income. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    );
}



}
