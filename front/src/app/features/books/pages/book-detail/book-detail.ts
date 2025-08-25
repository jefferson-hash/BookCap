import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from '../../../../core/models/book.model';
import { BookService } from '../../../../core/services/book.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../core/services/order.service';

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
  @Output() order = new EventEmitter<{ bookId: string; quantity: number }>();

  constructor(private bookService: BookService, private orderService: OrderService) {}

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
  orderBook(bookI: string, quantity: number = 1) {
    this.orderService.submitOrder(bookI, quantity).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error placing order', err);
        alert('Failed to place order. Please try again.');
      },
    });
  }
}
