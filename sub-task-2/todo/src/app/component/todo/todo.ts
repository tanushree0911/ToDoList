import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../../service/todo-service';
import { TodoItem } from '../../../model/Todo-model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EditTask } from '../edit-task/edit-task';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-todo',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    EditTask,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './todo.html',
  styleUrl: './todo.scss',
})
export class Todo {

  private todoService = inject(TodoService);
  displayedColumns: string[] = ['select', 'title', 'createdAt', 'completed', 'delete'];
  dataSource = new MatTableDataSource<TodoItem>([]);
  selection = new SelectionModel<Todo>(true, []);
  selectedTodo: TodoItem | null = null;
  originalData: TodoItem[] = [];

  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => {
        const start = new Date('2025-01-01').getTime();
        const end = new Date('2025-07-01').getTime();
  
        const dataWithDates = data.map(item => ({
          ...item,
          createdAt: new Date(Math.floor(Math.random() * (end - start + 1) + start))
        }));
  
        this.originalData = [...dataWithDates];
        this.dataSource.data = this.originalData;
        this.setupFilter();
      }
    });
  }

  setupFilter() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;
  
      const search = JSON.parse(filter);
      
      const todoTime = new Date(data.createdAt).getTime();
      const matchesStart = !search.start || todoTime >= new Date(search.start).getTime();
      const matchesEnd = !search.end || todoTime <= new Date(search.end).getTime();
  
      return matchesStart && matchesEnd;
    };
  }

  editTodo(todo: TodoItem) {
    console.log('Editing:', todo.title);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  deleteSelected() {
    const selectedIds = this.selection.selected.map((s: any) => s.id);
    this.dataSource.data = this.dataSource.data.filter(
      todo => !selectedIds.includes(todo.id)
    );
    this.selection.clear();
  }
  
  deleteSingle(todo: TodoItem) {
    this.dataSource.data = this.dataSource.data.filter((t: any) => t.id !== todo.id);
  }

  onEditClick(todo: TodoItem, drawer: any) {
    this.selectedTodo = { ...todo };
    drawer.open();
  }

  handleSave(updatedTask: any, drawer: any) {
    const index = this.dataSource.data.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      const newData = [...this.dataSource.data];
      newData[index] = { ...newData[index], ...updatedTask };
      this.dataSource.data = newData;
    }
    drawer.close();
  }

  applyFilters(start?: string, end?: string) {
    const filterValue = {
      start: start || null,
      end: end || null
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  resetAllFilters(startInput: HTMLInputElement, endInput: HTMLInputElement) {
    startInput.value = '';
    endInput.value = '';
    this.dataSource.filter = JSON.stringify({ title: '', start: null, end: null });
  }

}
