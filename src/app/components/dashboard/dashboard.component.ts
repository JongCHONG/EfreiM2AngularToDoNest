import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from 'src/app/models/task.model';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class DashboardComponent {
  taskForm: FormGroup;
  userName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.authService.getCurrentUserName().subscribe(name => {
      this.userName = name;
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      const task: Task = { title: this.taskForm.value.title, completed: false };
      this.taskService
        .addTask(task)
        .then(() => {
          console.log('Tâche ajoutée avec succès');
          this.taskForm.reset();
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout de la tâche :", error);
        });
    }
  }

  logout() {
    this.authService.signOut().then(() => {
      console.log('Déconnexion réussie');
    }).catch((error) => {
      console.error('Erreur lors de la déconnexion :', error);
    });
  }
}
