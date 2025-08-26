import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from '../../../../core/models/book.model';
import { BookService } from '../../../../core/services/book.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../core/services/order.service';
import { AlertService } from '../../../../core/services/alert.service';
import { AuthService } from '../../../../core/services/auth.service';

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
  isLoged: boolean = false;

  constructor(
    private bookService: BookService,
    private orderService: OrderService,
    private alertService: AlertService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.isLoged = !!user;
    });
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
    this.bookService.getBookDetail(bookI).subscribe({
      next: (bookStock) => {
        if (quantity > bookStock.stock) {
          this.alertService.showError('La orden supera el stock en bodega. Valida tu orden');
        } else {
          this.orderService.submitOrder(bookI, quantity).subscribe({
            next: () => {
              this.ngOnInit();
              this.alertService.showSuccess('Orden realizada con éxito');
            },
            error: (err) => {
              console.error('Error placing order', err);
              this.alertService.showError('Hubo un error al realizar la orden');
            },
          });
        }
      },
      error: (err) => {
        console.error('Error fetching book details', err);
        this.alertService.showError('No se pudo obtener la información del libro');
      },
    });
  }
}
