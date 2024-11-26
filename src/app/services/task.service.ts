import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private firestore: Firestore) {}

  async addTask(task: Task) {
    const tasksCollection = collection(this.firestore, 'tasks');
    const docRef = await addDoc(tasksCollection, task);
    task.id = docRef.id;
    return task;
  }
}