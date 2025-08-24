import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { MenuComponent } from './shared/components/menu-component/menu-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MenuComponent, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  title = signal('Librery');

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // 🔑 Esto asegura que si hay cookie valida, se setea el usuario al cargar
    this.authService.refreshToken().subscribe();
    this.authService.getUserInfo().subscribe();
  }
}
