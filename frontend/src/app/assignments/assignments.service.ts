import { Injectable } from '@angular/core';
import { Assignment } from './assignment.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService {
  private apiUrl = config.apiUrl + '/assignments';

  constructor(private http: HttpClient) { }

  getAssignments(page: number = 1, limit: number = 10, sort: string = 'asc', search: string = '', hideCompleted: boolean = false, userId: string = ''): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}&sort=${sort}&search=${search}&hideCompleted=${hideCompleted}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    return this.http.get<any>(url);
  }

  addAssignment(assignment: Assignment): Observable<any> {
    return this.http.post(this.apiUrl, assignment);
  }

  deleteAssignment(assignment: Assignment): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${assignment._id}`);
  }

  getAssignment(id: string): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/${id}`);
  }

  updateAssignment(assignment: Assignment, userId?: string): Observable<any> {
    const body: any = { ...assignment };
    if (userId) {
      body.userId = userId;
    }
    return this.http.put(`${this.apiUrl}/${assignment._id}`, body);
  }
}