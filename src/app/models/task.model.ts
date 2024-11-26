export interface Task {
  id?: string;
  title: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string; // Ajouter le champ userId
}