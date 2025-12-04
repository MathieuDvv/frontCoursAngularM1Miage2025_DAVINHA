export interface Assignment {
  _id?: string;
  nom: string;
  dateDeRendu: Date;
  rendu: boolean;
  description?: string; // Nouvelle propriété optionnelle
}
