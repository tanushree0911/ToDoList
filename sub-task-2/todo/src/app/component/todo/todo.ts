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
  displayedColumns: string[] = ['select', 'title', 'completed', 'delete'];
  dataSource = new MatTableDataSource<TodoItem>([]);
  selection = new SelectionModel<Todo>(true, []);
  selectedTodo: TodoItem | null = null;
  originalData: TodoItem[] = [];

  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.originalData = data; // Keep a backup for "Cancel"
      },
      error: (err) => console.error('Store error:', err)
    });
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
    // Update the local data source
    const index = this.dataSource.data.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      const newData = [...this.dataSource.data];
      newData[index] = { ...newData[index], ...updatedTask };
      this.dataSource.data = newData;
    }
    drawer.close();
  }

  applyTitleFilter(searchTerm: string) {
    const cleanTerm = searchTerm.toLowerCase().trim();
  
    if (!cleanTerm) {
      this.dataSource.data = [...this.originalData];
      return;
    }
  
    this.dataSource.data = this.originalData.filter(todo => 
      todo.title.toLowerCase().includes(cleanTerm)
    );
  }
  
  resetFilter(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.dataSource.data = [...this.originalData];
  }

}
