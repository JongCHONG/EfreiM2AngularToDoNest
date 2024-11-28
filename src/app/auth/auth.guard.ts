import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getCurrentUser().pipe(
      take(1), // Prend la première valeur
      map((user) => {
        if (user) {
          return true; // L'utilisateur est connecté
        } else {
          this.toastr.error("Vous n'avez pas accès, veuillez vous connecter.");
          this.router.navigate(['/home']); // Redirection si non connecté
          return false;
        }
      })
    );
  }
}
