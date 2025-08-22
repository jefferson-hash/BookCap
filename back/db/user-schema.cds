namespace my.user;

entity UserRoles {
    key ID          : UUID      @default: uuid;
    name            : String(50) @mandatory @unique;
    createdAt       : Timestamp @default: current_timestamp;
    updatedAt       : Timestamp @updatedAt;
}

entity Users {
    key ID          : UUID      @default: uuid;
    name            : String(50) not null;
    email           : String(100) @mandatory @unique;
    phone           : String(20);
    password        : String(100) @mandatory;
    refreshToken    : String(255);
    role            : Association to UserRoles;
    isActive        : Boolean   @default: true;
    createdAt       : Timestamp @default: current_timestamp;
    updatedAt       : Timestamp @updatedAt;
}