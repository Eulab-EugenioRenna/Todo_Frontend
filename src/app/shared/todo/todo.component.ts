import { NotificationService } from './../../notification.service';
import { Observable } from 'rxjs';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TodoDto } from '../../model/TodoSto';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { TodoService } from '../../todo.service';
import { PrimeNGConfig } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DatePipe,
    MessagesModule,
    AsyncPipe,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TodoComponent {
  @Input() todos$!: Observable<TodoDto[]>;
  private todoService = inject(TodoService);
  private primengConfig = inject(PrimeNGConfig);
  private notificationService = inject(NotificationService);
  visibleEditTodo!: boolean;

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  constructor() {}

  deleteTodo(todo: TodoDto) {
    this.todoService.deleteTodo$(todo).subscribe(
      (data) => {},
      (error) => console.error(error),
      () => {
        this.todos$ = this.todoService.getTodos$();
        this.notificationService.addMessage({
          severity: 'success',
          summary: `Todo ${todo.title} deleted`,
        });
      }
    );
  }
  editForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    link: new FormControl<string>(''),
  });

  showEditTodo() {
    this.visibleEditTodo = true;
  }
  editTodo(todo: TodoDto) {
    const filteredValues = Object.keys(this.editForm.value)
      .filter((key) => this.editForm.value[key] !== '')
      .reduce((obj, key) => {
        obj[key] = this.editForm.value[key];
        return obj;
      }, {});
    const editedTodo = Object.assign(todo, filteredValues);
    this.todoService.editTodoId$(editedTodo).subscribe(
      (data) => {},
      (error) => {
        console.log(error);
      },
      () => {
        this.todos$ = this.todoService.getTodos$();
        this.notificationService.addMessage({
          severity: 'success',
          summary: `Todo ${this.editForm.value.title} edited`,
        });
        this.editForm.reset();
        this.visibleEditTodo = false;
      }
    );
  }
}
