import { TodoComponent } from './../../shared/todo/todo.component';
import { TodoService } from './../../todo.service';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { TodoDto } from '../../model/TodoSto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TodoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  private todoService = inject(TodoService);
  todos$ = this.todoService.getTodos$();

  constructor() {}

  getTodos(todos: TodoDto[]) {
    this.todos$ = this.todoService.getTodos$();
  }
}
