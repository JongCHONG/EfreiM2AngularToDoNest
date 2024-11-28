import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['jong@test.com', [Validators.required, Validators.email]],
      password: ['azerty', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.displayValidationErrors();
      return;
    }

    try {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      const { email, password } = this.loginForm.value;
      await this.authService.signIn(email, password);
      this.toastr.success('Connexion réussie', 'Succès');
    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.message, 'Erreur');
    }
  }

  private displayValidationErrors() {
    const controls = this.loginForm.controls;
    if (controls['email'].invalid) {
      if (controls['email'].errors?.['required']) {
        this.toastr.error('L\'email est requis.', 'Erreur');
      } else if (controls['email'].errors?.['email']) {
        this.toastr.error('L\'email n\'est pas valide.', 'Erreur');
      }
    }
    if (controls['password'].invalid) {
      if (controls['password'].errors?.['required']) {
        this.toastr.error('Le mot de passe est requis.', 'Erreur');
      } else if (controls['password'].errors?.['minlength']) {
        this.toastr.error('Le mot de passe doit comporter au moins 6 caractères.', 'Erreur');
      }
    }
  }
}