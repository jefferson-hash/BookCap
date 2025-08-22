export interface Book {
  ID?: number;
  idBook?: string;
  title: string;
  descr: string;
  genre: Genre;
  author: string | { name: string };
  stock: number;
  price: number;
  currency_code: string;
}

export interface Genre {
  ID: string;
  name: string;
}
