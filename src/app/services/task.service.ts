import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async addTask(task: Task) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const tasksCollection = collection(this.firestore, 'tasks');
    const taskId = uuidv4();
    const taskDoc = doc(tasksCollection, taskId);
    const timestamp = new Date();

    task.id = taskId;
    task.createdAt = timestamp;
    task.updatedAt = timestamp;
    task.userId = user.uid;

    await setDoc(taskDoc, task);
    return task;
  }

  async getUserTasks() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const tasksCollection = collection(this.firestore, 'tasks');
    const q = query(tasksCollection, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push(doc.data() as Task);
    });
    return tasks;
  }

  async deleteTask(taskId: string) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const taskDoc = doc(this.firestore, 'tasks', taskId);
    await deleteDoc(taskDoc);
  }

  async updateTask(task: Task) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const taskDoc = doc(this.firestore, 'tasks', task.id!);
    task.updatedAt = new Date();
    await updateDoc(taskDoc, { ...task });
  }
}
