import { AuthService } from '@abp/ng.core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { TodoItemDto, TodoService } from '@proxy';

@Component({
  selector: 'app-home',
  template: `
  <div class="container">
  <div class="card">
    <div class="card-header">
      <div class="card-title">TODO LIST</div>
    </div>
    <div class="card-body">
      <!-- FORM FOR NEW TODO ITEMS -->
      <form class="form-inline" (ngSubmit)="create()">
        <input
          name="NewTodoText"
          type="text"
          [(ngModel)]="newTodoText"
          class="form-control mr-2"
          placeholder="enter text..."
        /> 
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
      <!-- TODO ITEMS LIST -->
      <ul id="TodoList">
        <li *ngFor="let todoItem of todoItems">
          <i class="fa fa-trash-o" (click)="delete(todoItem.id,todoItem.text)"></i> {{ todoItem.text }}
          <input type="text" (change)="update( todoItem.id , todoItem.text )"   [(ngModel)]="todoItem.text" />
        </li>
      </ul>
    </div>
  </div>
</div>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  todoItems: TodoItemDto[];
  newTodoText: string;

  constructor(
    private todoService: TodoService,
    private toasterService: ToasterService) {
  }
  ngOnInit(): void {
    this.todoService.getList().subscribe(response => {
      this.todoItems = response;
    });
  }
  update(id:string,value:string):void{
    this.todoService.update(value,id).subscribe(()=>{
      this.toasterService.info(`changed value to ${value}`)
    })
  }

  create(): void {
    this.todoService.create(this.newTodoText).subscribe((result) => {
      this.todoItems = this.todoItems.concat(result);
      this.newTodoText = null;
    });
  }

  delete(id: string, text: string): void {
    this.todoService.delete(id).subscribe(() => {
      this.todoItems = this.todoItems.filter(item => item.id !== id);
      this.toasterService.info(`Deleted the todo item ${text}.`);
    });
  }
}
