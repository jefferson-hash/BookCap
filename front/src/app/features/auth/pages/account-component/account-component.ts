import { Component } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-account-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-component.html',
  styleUrl: './account-component.scss',
})
export class AccountComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  user: User | null = null;

  ngOnInit(): void {
    this.authService.getMe().then((user) => {
      this.user = user;
    });
  }

  async logout() {
    const confirmed = await this.alertService.showConfirmation(
      '¿Quieres cerrar sesión?',
      'Cerrar Sesión',
      'Sí, salir',
      'Cancelar'
    );

    if (confirmed) {
      this.authService.logout().subscribe({
        next: () => {
          this.alertService.showSuccess('Sesión cerrada correctamente');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.alertService.showError('Error al cerrar sesión');
        },
      });
    }
  }
}
