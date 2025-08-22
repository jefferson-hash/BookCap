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
      currency : Currency;
}

entity Authors : managed {
  key ID           : UUID;
      name         : String(111) @mandatory;
      dateOfBirth  : Date;
      dateOfDeath  : Date;
      placeOfBirth : String;
      placeOfDeath : String;
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
