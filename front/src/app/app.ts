import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { MenuComponent } from './shared/components/menu-component/menu-component';
import { ChatComponent } from './shared/components/chat-component/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MenuComponent, HttpClientModule, RouterModule, ChatComponent],
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
