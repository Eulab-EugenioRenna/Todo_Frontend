import { TodoService } from './../../todo.service';
import { NotificationService } from './../../notification.service';
import { PrimeNGConfig } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../auth.service';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Observable } from 'rxjs';
import { TodoDto } from '../../model/TodoSto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, CommonModule, ReactiveFormsModule, DialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() todos = new EventEmitter();

  private primeNgConfig = inject(PrimeNGConfig);
  private notificationService = inject(NotificationService);
  private todo!: TodoDto;
  ngOnInit() {
    this.primeNgConfig.ripple = true;
  }

  createTodo() {
    this.todoService.createTodo$(this.createForm.value).subscribe(
      (data) => {
        this.todo = data;
        this.notificationService.addMessage({
          severity: 'success',
          summary: `Todo ${data.title} Creato`,
        });
        this.visibleCreateTodo = false;
      },
      (error) => console.error(error),
      () => {
        this.todos.emit();
        this.notificationService.addMessage({
          severity: 'success',
          summary: `Todo ${this.todo.title} deleted`,
        });
        this.createForm.reset();
      }
    );
  }
  visibleCreateTodo: boolean;
  showCreateTodoModal() {
    this.visibleCreateTodo = true;
  }
  private authService = inject(AuthService);
  private todoService = inject(TodoService);

  logout() {
    this.authService.logout();
  }

  createForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    link: new FormControl<string>(''),
  });
}
