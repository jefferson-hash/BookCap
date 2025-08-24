import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFrom } from './book-from';

describe('BookFrom', () => {
  let component: BookFrom;
  let fixture: ComponentFixture<BookFrom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFrom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookFrom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
