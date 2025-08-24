import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.getUserInfo().subscribe((userInfo: any) => {
          if ('value' in userInfo) {
            this.user = userInfo.value;
          } else {
            console.error('User info does not have a value property:', userInfo);
          }
        });
        this.router.navigate(['/books']);
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}
