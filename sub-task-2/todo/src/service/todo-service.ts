import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoItem } from '../model/Todo-model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {

  private http = inject(HttpClient); // Modern functional injection
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/todos?_limit=20';

  /**
   * Fetches a limited list of 20 To-Dos
   */
  getTodos(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl);
  }
  
}
