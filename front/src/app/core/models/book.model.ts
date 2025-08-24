export interface Book {
  ID?: number;
  idBook?: string;
  title: string;
  descr: string;
  genre: Genre;
  author: string | { name: string };
  stock: number;
  price: number;
  image: string;
  currency_code: string;
}

export interface Genre {
  ID: string;
  name: string;
}
