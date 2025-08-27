namespace my.chat;

using {my.user as user} from './user-schema';

entity Chats {
    key ID        : UUID      @default: uuid;
        user1     : Association to user.Users; 
        user2     : Association to user.Users; 
        createdAt : Timestamp @default: current_timestamp;
        updatedAt : Timestamp @updatedAt;
        messages  : Composition of many Messages
                        on messages.chat = $self;
}

entity Messages {
    key ID        : UUID      @default: uuid;
        chat      : Association to Chats;
        sender    : Association to user.Users; 
        content   : String(1000);
        isRead    : Boolean   @default: false; 
        createdAt : Timestamp @default: current_timestamp;
}
