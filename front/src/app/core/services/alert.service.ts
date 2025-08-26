import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  showSuccess(message: string, title: string = 'Éxito') {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: '#3085d6',
    });
  }

  showError(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#d33',
    });
  }

  showWarning(message: string, title: string = 'Atención') {
    Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonColor: '#f39c12',
    });
  }

  showInfo(message: string, title: string = 'Información') {
    Swal.fire({
      icon: 'info',
      title,
      text: message,
      confirmButtonColor: '#17a2b8',
    });
  }

  showConfirmation(
    message: string,
    title: string = '¿Estás seguro?',
    confirmText: string = 'Sí',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#f44336',
    }).then((result) => result.isConfirmed);
  }

  showLoading(message: string = 'Cargando...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  close() {
    Swal.close();
  }
}
