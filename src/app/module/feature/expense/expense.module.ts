import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseRoutingModule } from './expense-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ExpenseRoutingModule 
  ]
})
export class ExpenseModule { }
