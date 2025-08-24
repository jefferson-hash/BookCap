import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  templateUrl: './author-list.html',
  styleUrl: './author-list.scss',
  imports: [CommonModule],
  standalone: true,
})
export class AuthorListComponent {}
