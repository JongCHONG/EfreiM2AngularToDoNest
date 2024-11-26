import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  standalone: false,

})
export class AddTaskComponent implements OnInit {
  @Output() taskAdded = new EventEmitter<void>();
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {}

  addTask() {
    if (this.taskForm.valid) {
      const task: Task = { title: this.taskForm.value.title, completed: false };
      this.taskService
        .addTask(task)
        .then(() => {
          console.log('Tâche ajoutée avec succès');
          this.taskForm.reset();
          this.taskAdded.emit();
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout de la tâche :", error);
        });
    }
  }
}
