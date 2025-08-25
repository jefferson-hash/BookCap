import { Author } from "./authors.model";

export interface Book {
  ID?: string;
  title: string;
  descr: string;
  genre: Genre;
  author: Author ;
  stock: number;
  price: number;
  imageUrl: string;
  currency_code: string;
}

export interface Genre {
  ID?: string;
  name?: string;
}

export interface BookUpdate {
  idBook?: string;
  title: string;
  descr: string;
  genre: string;
  author: string | { name: string };
  stock: number;
  price: number;
  imageUrl: string;
  currency_code: string;
} 