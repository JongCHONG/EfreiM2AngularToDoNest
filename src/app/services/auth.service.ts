import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Inscription
  async signUp(
    surname: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user information in Firestore
      await setDoc(doc(this.firestore, 'users', user.uid), {
        surname,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });

      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      throw error;
    }
  }

  // Connexion
  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      throw error;
    }
  }

  // Déconnexion
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Déconnexion réussie');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  }

  // Vérifier l'utilisateur connecté
  getCurrentUser() {
    return this.currentUserSubject.asObservable();
  }
}
