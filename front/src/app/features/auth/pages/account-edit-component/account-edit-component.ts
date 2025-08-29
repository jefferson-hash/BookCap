import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-account-edit-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-edit-component.html',
  styleUrl: './account-edit-component.scss',
})
export class AccountEditComponent {
  constructor(private authService: AuthService, private sweetAlertService:AlertService) {}

  user: User | null = null;
  @Output() cancel = new EventEmitter<void>();

  ngOnInit(): void {
    this.authService.getMe().then((user) => {
      this.user = user;
    });
  }

  saveChanges() {
    const payload = {
      nameUser: this.user?.name,
      email: this.user?.email,
      phone: this.user?.phone,
    };

    this.sweetAlertService
      .showConfirmation(
        '¿Guardar cambios?',
        'Se actualizará la información de tu cuenta',
        'Sí, guardar',
        'Cancelar'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.authService.updateUser(payload).subscribe({
            next: () => {
              this.sweetAlertService.showSuccess('Datos actualizados correctamente ✅');
              this.cancel.emit();
            },
            error: () => {
              this.sweetAlertService.showError('Error al actualizar los datos ❌');
            },
          });
        }
      });
  }

  cancelEdit() {
    this.cancel.emit();
  }
}
