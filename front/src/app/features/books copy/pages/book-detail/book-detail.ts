import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from '../../../../core/models/book.model';
import { BookService } from '../../../../core/services/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetailComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private bookService: BookService) {}

  ngOnInit() {
    const id = this.book?.ID;
    if (id) {
      this.bookService.getBookDetail(id.toString()).subscribe((res) => {
        this.book = res;
      });
    }
  }

  close() {
    this.closeModal.emit();
  }
}
