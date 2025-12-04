import { provideNativeDateAdapter } from '@angular/material/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from '../assignments.service';
import { Assignment } from '../assignment.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './edit-assignment.html',
  styleUrls: ['./edit-assignment.css']
})
export class EditAssignmentComponent implements OnInit {
  assignment: Assignment | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentsService: AssignmentsService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignmentsService.getAssignment(id).subscribe(assignment => {
        if (assignment) {
          this.assignment = assignment;
        }
      });
    }
  }

  onUpdate() {
    if (this.assignment) {
      this.assignmentsService.updateAssignment(this.assignment)
        .subscribe(() => {
          this.router.navigate(['/assignment', this.assignment?._id]);
        });
    }
  }
}
