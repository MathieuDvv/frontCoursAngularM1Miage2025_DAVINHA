import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Assignment } from './assignment.model';
import { AssignmentsService } from './assignments.service';
import { FormsModule } from '@angular/forms';

interface GroupedAssignments {
  date: Date;
  assignments: Assignment[];
}

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule,
    FormsModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css'],
})
export class Assignments implements OnInit {
  groupedAssignments: GroupedAssignments[] = [];
  allAssignments: Assignment[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  hideCompleted = false;
  searchTerm = '';

  // Pagination properties
  totalDocs = 0;
  limit = 10;
  page = 1;
  totalPages = 0;
  hasPrevPage = false;
  hasNextPage = false;

  constructor(private assignmentsService: AssignmentsService, private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.assignmentsService.getAssignments(this.page, this.limit, this.sortOrder, this.searchTerm, this.hideCompleted).subscribe(data => {
      if (!data || !data.docs) {
        this.allAssignments = [];
        this.totalDocs = 0;
        this.groupedAssignments = [];
        return;
      }
      // Data comes as { docs: [], totalDocs: ..., ... }
      this.allAssignments = data.docs;
      this.totalDocs = data.totalDocs;
      this.page = data.page;
      this.totalPages = data.totalPages;
      this.limit = data.limit;
      this.hasPrevPage = data.hasPrevPage;
      this.hasNextPage = data.hasNextPage;

      this.allAssignments.forEach(a => a.dateDeRendu = new Date(a.dateDeRendu));
      
      // No need to filter locally anymore, just group
      this.groupAssignmentsByDate(this.allAssignments);
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadAssignments();
  }

  applyFilters(): void {
    // Reset to first page when filtering/sorting changes
    this.page = 1;
    this.loadAssignments();
  }

  groupAssignmentsByDate(assignments: Assignment[]): void {
    const groups: { [key: string]: Assignment[] } = {};
    assignments.forEach(assignment => {
      const dateKey = assignment.dateDeRendu.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(assignment);
    });

    this.groupedAssignments = Object.keys(groups).map(dateKey => ({
      date: new Date(dateKey),
      assignments: groups[dateKey],
    }));
    
    // Sort the groups themselves by date
    this.groupedAssignments.sort((a, b) => {
       if (this.sortOrder === 'asc') {
        return a.date.getTime() - b.date.getTime();
      } else {
        return b.date.getTime() - a.date.getTime();
      }
    });
  }

  onDelete(assignment: Assignment) {
    this.assignmentsService.deleteAssignment(assignment).subscribe(() => {
      this.loadAssignments(); // Refresh the grouped list after deletion
    });
  }

  onRenduChange(assignment: Assignment): void {
    this.assignmentsService.updateAssignment(assignment).subscribe({
      next: () => {
        console.log(`Assignment '${assignment.nom}' rendu status changed to ${assignment.rendu}`);
        // We do not strictly need to reload from server if we just want to update the view state,
        // but if 'hideCompleted' is active, we might want to remove it from view.
        // However, calling applyFilters() immediately reloads everything.
        // Let's just keep the current list consistent or reload if necessary.
        if (this.hideCompleted) {
             this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Error updating assignment', err);
        // Revert the change in UI if update failed
        assignment.rendu = !assignment.rendu;
        alert('Failed to update assignment status.');
      }
    });
  }
}
