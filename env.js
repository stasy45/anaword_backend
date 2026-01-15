"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_SECRET = exports.VALIDATION = exports.FORM_VALIDATION = exports.VALIDATION_ERROR = exports.DB = exports.APP_HOST = exports.APP_PORT = void 0;
exports.APP_PORT = 8000;
exports.APP_HOST = 'http://localhost';
exports.DB = {
    HOST: 'localhost',
    PORT: 5432,
    NAME: 'anaword',
    USER: 'postgres',
    PASSWORD: 'asd321dsa',
};
exports.VALIDATION_ERROR = 'Невалидные данные';
exports.FORM_VALIDATION = {
    INT: "Поле должно быть числом",
    STRING: "Поле должно быть строкой",
    NOTEMPTY: "Поле должно быть заполнено",
    MAXLENGTH: (value) => `Длина поля не должна превышать ${value} символов`,
};
exports.VALIDATION = {
    TOKEN: "Токен сессии невалидный",
    USERNOTFOUND: "Такого пользователя не существует",
    PARENTNOTFOUND: "Родительская папка не найдена",
    PARENTNOACCESS: "У вас нет прав доступа к этой родительской папке",
    FOLDERNOACCESS: "У вас нет прав доступа к этой папке",
    FOLDERNOTFOUND: "Папка не найдена",
    PROJECTNOTFOUND: "Проект не найден",
    PROJECTNOACCESS: "У вас нет прав доступа к этому проекту"
};
exports.COOKIE_SECRET = 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678';
//# sourceMappingURL=env.js.map