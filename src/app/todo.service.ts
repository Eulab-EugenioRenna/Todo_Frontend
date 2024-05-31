import { UserDto } from './model/UserDto';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { TodoDto } from './model/TodoSto';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);

  createTodo$(todoDto: Partial<TodoDto>) {
    return this.httpClient.post<TodoDto>(
      `${environment.BASE_URL}/todo/`,
      todoDto
    );
  }
  deleteTodo$(todoDto: TodoDto) {
    return this.httpClient.delete(`${environment.BASE_URL}/todo/${todoDto.id}`);
  }
  getTodoId$(todoDto: TodoDto) {
    return this.httpClient.get(`${environment.BASE_URL}/todo/${todoDto.id}`);
  }
  editTodoId$(todoDto: Partial<TodoDto>) {
    return this.httpClient.patch<TodoDto>(
      `${environment.BASE_URL}/todo/${todoDto.id}`,
      todoDto
    );
  }
  getTodos$() {
    return this.httpClient.get<TodoDto[]>(`${environment.BASE_URL}/todo`);
  }
}
