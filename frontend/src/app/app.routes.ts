import { authGuard } from './auth-guard';
import { adminGuard } from './admin.guard';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail';
import { Routes } from '@angular/router';
import { Assignments } from './assignments/assignments';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'assignments', pathMatch: 'full' },
  { path: 'assignments', component: Assignments },
  { path: 'add-assignment', component: AddAssignmentComponent, canActivate: [adminGuard] },
  { path: 'assignment/:id', component: AssignmentDetailComponent },
  { path: 'login', component: Login },
];
