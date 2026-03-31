import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoItem } from '../../../model/Todo-model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-task',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.scss',
})
export class EditTask {

  private fb = inject(FormBuilder);
  
  editForm = this.fb.group({
    id: [0],
    title: ['', Validators.required]
  });

  @Input() set task(value: TodoItem | null) {
    if (value) this.editForm.patchValue(value);
  }

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  submit() {
    this.save.emit(this.editForm.value);
  }
  
}
