import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../assignments.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './add-assignment.html',
  styleUrls: ['./add-assignment.css'],
})
export class AddAssignmentComponent {
  // Champs du formulaire
  nomDevoir: string = '';
  dateDeRendu!: Date;
  descriptionDevoir: string = '';

  constructor(private assignmentsService: AssignmentsService, private router: Router) { }

  onSubmit() {
    if (this.nomDevoir && this.dateDeRendu) {
      const assignment: Assignment = {
        nom: this.nomDevoir,
        dateDeRendu: this.dateDeRendu,
        rendu: false,
        description: this.descriptionDevoir,
      };
      this.assignmentsService.addAssignment(assignment).subscribe(() => {
        console.log('New assignment submitted:', assignment);
        this.router.navigate(['/assignments']);
      });
    }
  }
}
