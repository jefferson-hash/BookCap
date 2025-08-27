using my.user as my from '../../../db/user-schema';

service UserService @(path: '/user') {
    entity Users as projection on my.Users;

    entity me @(readonly) {
        ID    : UUID;
        name  : String;
        email : String;
        phone : String;
        role  : String
    }

    action login(email: String(100),
                 password: String(100),
                 confirmPasswor: String(100), ) returns String;

    action logout()                             returns String;

    action refreshToken()                       returns String;

    action register(nameUser: String(50),
                    email: String(100),
                    phone: String(20),
                    password: String(100),
                    confirmPassword: String(100),
                    userRole: String(50),
                    isActive: Boolean)          returns String;

    action updateUser(IdUser: String(100),
                      nameUser: String(50),
                      email: String(100),
                      phone: String(20),
                      password: String(100),
                      userRole: String(50),
                      isActive: Boolean)        returns String;

}
