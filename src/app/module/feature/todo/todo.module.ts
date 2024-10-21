import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoRoutingModule } from './todo-routing.module';


@NgModule({
  imports: [
    CommonModule,
    TodoRoutingModule 
  ]
})
export class TodoModule { }
