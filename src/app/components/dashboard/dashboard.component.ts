import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  taskForm: FormGroup;
  userName: string | null = null;
  tasks: Task[] = [];
  currentTaskId: string | null = null;
  editingTaskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(() => {
      this.authService.getCurrentUserName().subscribe((name) => {
        this.userName = name;
      });
      this.loadTasks();
    });
  }

  get titleControl(): FormControl {
    return this.taskForm.get('title') as FormControl;
  }

  async loadTasks() {
    try {
      this.tasks = await this.taskService.getUserTasks();
      this.sortTasks();
    } catch (error) {
      console.error('Erreur lors du chargement des tâches :', error);
    }
  }

  onTaskAdded() {
    this.loadTasks();
  }

  async deleteTask(taskId: string) {
    try {
      await this.taskService.deleteTask(taskId);
      this.loadTasks();
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche :', error);
    }
  }

  editTask(task: Task) {
    this.editingTaskId = task.id!;
    this.taskForm.patchValue({
      title: task.title,
    });
  }

  async saveTask(task: Task) {
    if (this.taskForm.valid) {
      task.title = this.taskForm.value.title;
      try {
        await this.taskService.updateTask(task);
        this.editingTaskId = null;
        this.loadTasks();
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche :', error);
      }
    }
  }

  cancelEdit() {
    this.editingTaskId = null;
  }

  async toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
    try {
      await this.taskService.updateTask(task);
      this.loadTasks();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche :', error);
    }
  }

  sortTasks() {
    this.tasks.sort((a, b) => {
      if (a.completed === b.completed) {
        return 0;
      }
      return a.completed ? 1 : -1;
    });
  }

  logout() {
    this.authService
      .signOut()
      .then(() => {
        console.log('Déconnexion réussie');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion :', error);
      });
  }
}
