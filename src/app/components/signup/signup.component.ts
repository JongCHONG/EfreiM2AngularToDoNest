import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: false,
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.signupForm = this.formBuilder.group({
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  async onSignUp() {
    if (this.signupForm.invalid) {
      this.displayValidationErrors();
      return;
    }

    const { surname, email, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.toastr.error('Les mots de passe ne correspondent pas.', 'Erreur');
      return;
    }

    try {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      await this.authService.signUp(surname, email, password);
      this.toastr.success('Inscription réussie', 'Succès');
    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.message, 'Erreur');
    }
  }

  private displayValidationErrors() {
    const controls = this.signupForm.controls;
    if (controls['surname'].invalid) {
      this.toastr.error('Le nom est requis.', 'Erreur');
    }
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
    if (controls['confirmPassword'].invalid) {
      this.toastr.error('La confirmation du mot de passe est requise.', 'Erreur');
    }
  }
}