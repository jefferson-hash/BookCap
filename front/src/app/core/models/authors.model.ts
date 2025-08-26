export interface Author {
  ID: string;
  name: string;
  imageUrl?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  placeOfBirth?: string;
  placeOfDeath?: string;
  biography?: string;
}

export interface AuthorUpdate {
  idAuthor: string;
  nameAuthor: string;
  dateOfBirth: string;
  dateOfDeath: string;
  placeOfBirth: string;
  placeOfDeath: string;
  imageUrl: string;
  biography: string;
}
