using {
  Currency,
  managed,
  sap
} from '@sap/cds/common';

namespace sap.capire.bookshop;

entity Books : managed {
  key ID       : UUID;
      title    : localized String(111)  @mandatory;
      descr    : localized String(1111);
      author   : Association to Authors @mandatory;
      genre    : Association to Genres;
      stock    : Integer;
      price    : Price;
      imageUrl : String(1111);
      currency : Currency;
}

entity Authors : managed {
  key ID           : UUID;
      name         : String(111) @mandatory;
      imageUrl     : String(1111);
      dateOfBirth  : Date;
      dateOfDeath  : Date;
      placeOfBirth : String;
      placeOfDeath : String;
      biography    : String(4000);
      books        : Association to many Books
                       on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID   : UUID;
      name : String(255)
}

type Price : Decimal(9, 2);


// ------------------------------------------------------------------
// temporary workaround for reuse in fiori sample and hana deployment
annotate Books with @fiori.draft.enabled;
