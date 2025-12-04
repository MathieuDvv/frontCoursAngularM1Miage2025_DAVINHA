# Documentation de l'Application de Gestion des Devoirs

Ce document fournit une explication détaillée du fonctionnement de l'application Angular de gestion des devoirs, en mettant en évidence les concepts clés d'Angular et l'utilisation des composants Material Design.

## 1. Introduction

Cette application est une interface simple permettant de gérer des devoirs. Elle permet aux utilisateurs d'ajouter de nouveaux devoirs, de visualiser la liste des devoirs existants sous forme de panneaux extensibles regroupés par date, de marquer les devoirs comme "rendu" ou non, et de supprimer des devoirs. L'interface utilisateur est construite avec Angular Material pour une expérience moderne et réactive.

## 2. Structure du Projet

Voici les fichiers et dossiers clés de l'application :

```
assignment-app/
├───src/
│   ├───app/
│   │   ├───app.ts               # Composant racine de l'application
│   │   ├───app.html             # Template HTML du composant racine
│   │   ├───app.routes.ts        # Configuration du routage
│   │   ├───assignments/         # Dossier pour les fonctionnalités des devoirs
│   │   │   ├───assignment.model.ts    # Interface pour un devoir
│   │   │   ├───assignments.ts         # Composant d'affichage des devoirs
│   │   │   ├───assignments.html       # Template HTML du composant d'affichage
│   │   │   ├───assignments.css        # Styles CSS du composant d'affichage
│   │   │   ├───assignments.service.ts # Service de gestion des données des devoirs
│   │   │   └───add-assignment/        # Dossier pour le composant d'ajout de devoir
│   │   │       ├───add-assignment.ts      # Composant d'ajout de devoir
│   │   │       ├───add-assignment.html    # Template HTML du composant d'ajout
│   │   │       └───add-assignment.css     # Styles CSS du composant d'ajout
│   ├───custom-theme.scss    # Thème Angular Material personnalisé
│   └───styles.css           # Styles globaux de l'application
```

## 3. Concepts Clés d'Angular Utilisés

*   **Composants:** Blocs de construction de l'interface utilisateur (ex: `App`, `Assignments`, `AddAssignmentComponent`).
*   **Services:** Classes pour la logique métier et le partage de données entre composants (ex: `AssignmentsService`).
*   **Routage:** Gestion de la navigation entre les différentes vues de l'application.
*   **Data Binding:** Liaison des données entre le modèle et la vue (`[(ngModel)]` pour le two-way binding, `{{ }}` pour l'interpolation).
*   **Pipes:** Transformation des données affichées dans les templates (ex: `date` pipe).
*   **Angular Material:** Bibliothèque de composants UI pré-construits et stylisés, y compris `mat-accordion`, `mat-expansion-panel`, `mat-checkbox`.

## 4. Explication Détaillée avec Extraits de Code

### 4.1. Modèle de Données (assignment.model.ts)

Définit la structure d'un objet `Assignment`, incluant maintenant une description.

```typescript
// src/app/assignments/assignment.model.ts
export interface Assignment {
  nom: string;
  dateDeRendu: Date;
  rendu: boolean;
  description?: string; // Nouvelle propriété optionnelle
}
```

### 4.2. Service de Gestion des Devoirs (assignments.service.ts)

Ce service est responsable de la gestion de la liste des devoirs. Il fournit des méthodes pour récupérer, ajouter et supprimer des devoirs. Il est injecté dans les composants qui en ont besoin. Les données initiales incluent désormais des descriptions.

```typescript
// src/app/assignments/assignments.service.ts
import { Injectable } from '@angular/core';
import { Assignment } from './assignment.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentsService {
  assignments: Assignment[] = [
    {
      nom: 'Devoir de Maths',
      dateDeRendu: new Date('2023-11-20'),
      rendu: false,
      description: 'Faire les exercices 1 à 5 du chapitre 3 sur les intégrales.',
    },
    {
      nom: 'Devoir de Français',
      dateDeRendu: new Date('2023-12-15'),
      rendu: true,
      description: 'Rédiger une dissertation sur le thème du romantisme.',
    },
    {
      nom: "Devoir d'Histoire",
      dateDeRendu: new Date('2023-11-20'),
      rendu: false,
      description: "Préparer un exposé sur la Révolution Française.",
    },
    {
      nom: "Devoir d'Anglais",
      dateDeRendu: new Date('2023-12-15'),
      rendu: false,
      description: "Écrire un essai sur l'impact de la technologie.",
    },
  ];

  constructor() { }

  getAssignments(): Assignment[] {
    return this.assignments;
  }

  addAssignment(assignment: Assignment) {
    this.assignments.push(assignment);
  }

  deleteAssignment(assignment: Assignment) {
    const index = this.assignments.indexOf(assignment);
    if (index > -1) {
      this.assignments.splice(index, 1);
    }
  }
}
```

### 4.3. Composant Racine (app.ts et app.html)

Le composant `App` est le conteneur principal de l'application. Il gère la navigation via la barre latérale (sidenav) et affiche les composants routés via `<router-outlet>`. Il n'est plus responsable de la gestion directe des données des devoirs, cette tâche étant déléguée à `AssignmentsService`.

**`app.ts`**
```typescript
// src/app/app.ts
import { Component, signal } from '@angular/core';
// ... autres imports ...
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    // ... modules Material ...
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './app.html',
  styleUrl: '../styles.css',
})
export class App {
  protected readonly title = signal('assignment-app');
}
```

**`app.html`**
```html
<!-- src/app/app.html -->
<body>
  <mat-sidenav-container class="example-container">
    <mat-sidenav #sidenav mode="push">
      <mat-list>
        <a mat-list-item routerLink="/assignments" (click)="sidenav.toggle()">
          <mat-icon matListItemIcon>list</mat-icon>
          <span matListItemTitle>Liste des devoirs</span>
        </a>
        <a mat-list-item routerLink="/add-assignment" (click)="sidenav.toggle()">
          <mat-icon matListItemIcon>add</mat-icon>
          <span matListItemTitle>Ajout d'un devoir</span>
        </a>
        <!-- ... autres éléments de la barre latérale ... -->
      </mat-list>
    </mat-sidenav>

    <mat-sidenav-content>
      <mat-toolbar>
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>Gestion des devoirs</span>
        <span style="flex: 1 1 auto;"></span>
        <button mat-button matButton="filled" color="primary" routerLink="/add-assignment">
          Ajouter un devoir
        </button>
      </mat-toolbar>
      <div class="main-content">
        <router-outlet></router-outlet> <!-- Ici sont affichés les composants routés -->
      </div>
    </mat-sidenav-content>
  </mat-sidenav-container>
</body>
```

### 4.4. Composant d'Affichage des Devoirs (assignments.ts et assignments.html)

Ce composant affiche la liste des devoirs sous forme de panneaux extensibles, regroupés par date de rendu. Chaque panneau affiche le titre du devoir et un indicateur de statut (rendu ou non). Lorsqu'il est étendu, il révèle la description, une case à cocher pour marquer le devoir comme rendu, et un bouton de suppression.

**`assignments.ts`**
```typescript
// src/app/assignments/assignments.ts
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
  ],
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css'],
})
export class Assignments implements OnInit {
  groupedAssignments: GroupedAssignments[] = [];

  constructor(private assignmentsService: AssignmentsService) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    const assignments = this.assignmentsService.getAssignments();
    this.groupAssignmentsByDate(assignments);
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

    this.groupedAssignments.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  onDelete(assignment: Assignment) {
    this.assignmentsService.deleteAssignment(assignment);
    this.loadAssignments(); // Refresh the grouped list after deletion
  }

  onRenduChange(assignment: Assignment): void {
    // Mettre à jour l'état 'rendu' de l'affectation
    // Dans un vrai projet, vous appelleriez un service pour persister ce changement
    console.log(`Assignment '${assignment.nom}' rendu status changed to ${assignment.rendu}`);
  }
}
```

**`assignments.html`**
```html
<!-- src/app/assignments/assignments.html -->
<div class="assignments-container">
  <mat-accordion multi="true">
    <div *ngFor="let group of groupedAssignments">
      <h2>{{ group.date | date:'fullDate' }}</h2>
      <mat-expansion-panel *ngFor="let assignment of group.assignments">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <span class="status-dot" [class.rendu]="assignment.rendu" [class.non-rendu]="!assignment.rendu"></span>
            {{ assignment.nom }}
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="panel-content">
          <p>{{ assignment.description }}</p>
          <div class="actions">
            <mat-checkbox [(ngModel)]="assignment.rendu" (change)="onRenduChange(assignment)">
              Rendu
            </mat-checkbox>
            <span class="spacer"></span>
            <button mat-raised-button color="warn" (click)="onDelete(assignment)">
              Supprimer
            </button>
          </div>
        </div>
      </mat-expansion-panel>
    </div>
  </mat-accordion>
</div>
```

### 4.5. Composant d'Ajout de Devoir (add-assignment.ts et add-assignment.html)

Ce composant fournit un formulaire pour ajouter un nouveau devoir. Il utilise `AssignmentsService` pour ajouter le devoir et navigue ensuite vers la liste des devoirs.

**`add-assignment.ts`**
```typescript
// src/app/assignments/add-assignment/add-assignment.ts
import { Component } from '@angular/core';
// ... autres imports ...
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
  nomDevoir: string = '';
  dateDeRendu!: Date;

  constructor(private assignmentsService: AssignmentsService, private router: Router) { }

  onSubmit() {
    if (this.nomDevoir && this.dateDeRendu) {
      const assignment: Assignment = {
        nom: this.nomDevoir,
        dateDeRendu: this.dateDeRendu,
        rendu: false,
      };
      this.assignmentsService.addAssignment(assignment);
      console.log('New assignment submitted:', assignment);
      this.router.navigate(['/assignments']);
    }
  }
}
```

**`add-assignment.html`**
```html
<!-- src/app/assignments/add-assignment/add-assignment.html -->
<form (ngSubmit)="onSubmit()">
  <mat-form-field>
    <mat-label>Nom du devoir</mat-label>
    <input matInput [(ngModel)]="nomDevoir" name="nom" required>
  </mat-form-field>

  <mat-form-field>
    <mat-label>Date de rendu</mat-label>
    <input matInput [matDatepicker]="picker" [(ngModel)]="dateDeRendu" name="date" required>
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>

  <button mat-raised-button color="primary" type="submit">Ajouter un devoir</button>
</form>
```

### 4.6. Routage (app.routes.ts)

Le fichier `app.routes.ts` configure les chemins de navigation de l'application.

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Assignments } from './assignments/assignments';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment';

export const routes: Routes = [
  { path: '', redirectTo: 'assignments', pathMatch: 'full' },
  { path: 'assignments', component: Assignments },
  { path: 'add-assignment', component: AddAssignmentComponent },
];
```

### 4.7. Styles (custom-theme.scss et styles.css)

L'application utilise Angular Material pour le style. `custom-theme.scss` définit le thème Material, et `styles.css` contient des styles globaux et des ajustements.

**`custom-theme.scss`**
```scss
// src/custom-theme.scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$blue-palette,
    ),
    typography: Roboto,
    density: 0,
  ));
}

body {
  color-scheme: light;
  background-color: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface);
  font: var(--mat-sys-body-medium);
  margin: 0;
}
```

**`styles.css`**
```css
/* src/styles.css */
html, body {
  height: 100%;
}
body {
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
}

.mat-sidenav-container {
  height: 100%;
}

.mat-sidenav {
  width: 250px;
  padding: 20px;
}

.main-content {
  padding: 20px;
}
```

## 5. Comment Exécuter l'Application

Pour exécuter l'application :

1.  Assurez-vous d'avoir Node.js et Angular CLI installés.
2.  Naviguez jusqu'au répertoire racine du projet (`assignment-app`).
3.  Installez les dépendances :
    ```bash
    npm install
    ```
4.  Démarrez le serveur de développement :
    ```bash
    ng serve --open
    ```
    Si le port 4200 est déjà utilisé, vous pouvez spécifier un autre port :
    ```bash
    ng serve --port 4201 --open
    ```

L'application sera alors disponible dans votre navigateur à l'adresse `http://localhost:4200` (ou le port spécifié).