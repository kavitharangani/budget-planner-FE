import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./module/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./module/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'budget-planner/dashboard', // Ensure this path is defined
    loadChildren: () => import('./module/feature/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'budget-planner/expense', // Ensure this path is defined
    loadChildren: () => import('./module/feature/expense/expense.module').then(m => m.ExpenseModule)
  },
  {
    path: 'budget-planner/history', // Ensure this path is defined
    loadChildren: () => import('./module/feature/history/history.module').then(m => m.HistoryModule)
  },
  {
    path: 'budget-planner/income', // Ensure this path is defined
    loadChildren: () => import('./module/feature/income/income.module').then(m => m.IncomeModule)
  },
  {
    path: 'budget-planner/profile', // Ensure this path is defined
    loadChildren: () => import('./module/feature/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'budget-planner/todo', // Ensure this path is defined
    loadChildren: () => import('./module/feature/todo/todo.module').then(m => m.TodoModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
