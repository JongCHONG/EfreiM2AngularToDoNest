import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentUserNameSubject = new BehaviorSubject<string | null>(null);
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.user$ = authState(this.auth) as Observable<User | null>;

    onAuthStateChanged(this.auth, async (user) => {
      this.currentUserSubject.next(user);
      if (user) {
        const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.currentUserNameSubject.next(userData['surname']);
        }
      } else {
        this.currentUserNameSubject.next(null);
      }
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

      await setDoc(doc(this.firestore, 'users', user.uid), {
        surname,
        email: user.email,
        uid: user.uid,
        loginAttempts: 0,
        isBlocked: false,
        blockUntil: null,
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
    const errorMessage =
      "Votre compte est bloqué après trois tentatives infructueuses. Veuillez réessayer plus tard.'";
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('email', '==', email));
    let userData: {
      loginAttempts?: number;
      isBlocked?: boolean;
      blockUntil?: Date;
    } = {};

    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    if (!querySnapshot.empty) {
      userData = userDoc.data();
    }

    if (userData.isBlocked && userData.blockUntil) {
      const blockUntil = userData.blockUntil;
      if (blockUntil > new Date()) {
        this.toastr.error(errorMessage);
        throw new Error(errorMessage);
      } else {
        await updateDoc(userDoc.ref, {
          isBlocked: false,
          blockUntil: null,
          loginAttempts: 0,
        });
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.currentUserNameSubject.next(userData['surname']);
      }

      this.router.navigate(['/dashboard']);
    } catch (error) {
      if ((error as any).code === 'auth/invalid-login-credentials') {
        const loginAttempts = userData['loginAttempts'] || 0;
        await updateDoc(userDoc.ref, {
          loginAttempts: loginAttempts + 1,
        });

        if (loginAttempts + 1 >= 3) {
          const blockUntil = new Date();
          if (loginAttempts < 3) {
            blockUntil.setMinutes(blockUntil.getMinutes() + 1);
          }
          await updateDoc(userDoc.ref, {
            isBlocked: true,
            blockUntil,
          });
          this.toastr.error(errorMessage);
        }
      }
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

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  getCurrentUserName() {
    return this.currentUserNameSubject.asObservable();
  }
}
