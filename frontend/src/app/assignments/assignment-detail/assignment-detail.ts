import { AuthService } from '../../auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AssignmentsService } from '../assignments.service';
import { Assignment } from '../assignment.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterModule, 
    MatCardModule, 
    MatCheckboxModule, 
    FormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './assignment-detail.html',
  styleUrls: ['./assignment-detail.css']
})
export class AssignmentDetailComponent implements OnInit {
  assignment: Assignment | undefined;
  originalAssignment: Assignment | undefined;
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentsService: AssignmentsService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignmentsService.getAssignment(id).subscribe(assignment => {
        if (assignment) {
          assignment.dateDeRendu = new Date(assignment.dateDeRendu);
          this.assignment = assignment;
          this.originalAssignment = { ...assignment };
        }
      });
    }
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        this.editMode = true;
      }
    });
  }

  onRenduChange() {
    if (this.assignment) {
      const userId = this.authService.currentUser?._id;
      this.assignmentsService.updateAssignment(this.assignment, userId).subscribe(() => {
        console.log('Assignment updated');
      });
    }
  }

  onDelete() {
    if (this.assignment) {
      this.assignmentsService.deleteAssignment(this.assignment).subscribe(() => {
        this.router.navigate(['/assignments']);
      });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode && this.originalAssignment) {
      this.assignment = { ...this.originalAssignment };
    }
  }

  onSave() {
    if (this.assignment) {
      const userId = this.authService.currentUser?._id;
      this.assignmentsService.updateAssignment(this.assignment, userId).subscribe(() => {
        this.originalAssignment = { ...this.assignment! };
        this.editMode = false;
      });
    }
  }
}
