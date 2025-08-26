import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  user: User | null = null;
  showPassword: boolean = false; // 👈 ahora tienes ver/ocultar contraseña

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.alertService.showError('Debes completar todos los campos ❌');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.getUserInfo().subscribe({
          next: (userInfo: any) => {
            if (userInfo && 'value' in userInfo) {
              this.user = userInfo.value;
              this.alertService.showSuccess('Inicio de sesión exitoso ✅');
              this.router.navigate(['/books']);
            } else {
              this.alertService.showError('No se pudo obtener la información del usuario ❌');
            }
          },
          error: () => {
            this.alertService.showError('Usuario no existe, regístrate primero ⚠️');
          },
        });
      },
      error: () => {
        this.alertService.showError('Credenciales inválidas. Inténtalo de nuevo ⚠️');
      },
    });
  }

  registerLoad() {
    this.router.navigate(['/auth/register']);
  }
}
