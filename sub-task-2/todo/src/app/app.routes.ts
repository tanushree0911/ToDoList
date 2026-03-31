import { Routes } from '@angular/router';
import { Todo } from './component/todo/todo';

export const routes: Routes = [
    { path: 'todos', component: Todo },
    { path: '', redirectTo: '/todos', pathMatch: 'full' }
];
