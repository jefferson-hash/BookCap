import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { NewUser } from '../../../../core/models/user.model';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        nameUser: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const newUser: NewUser = {
        nameUser: this.registerForm.value.nameUser,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
      };

      this.authService.registerUser(newUser).subscribe({
        next: (res) => {
          console.log('✅ Usuario registrado:', res);
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('❌ Error al registrar:', err);
        },
      });
    } else {
      console.log('❌ Formulario inválido');
      this.registerForm.markAllAsTouched();
    }
  }
}
