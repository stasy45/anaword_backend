export const APP_PORT = 8000;

export const DB = {
  HOST: 'localhost',
  PORT: 5432,
  NAME: 'anaword',
  USER: 'postgres',
  PASSWORD: 'asd321dsa',
}

export const VALIDATION_ERROR = 'Невалидные данные'

export const FORM_VALIDATION = {
  INT: "Поле должно быть числом",
  STRING: "Поле должно быть строкой",
  NOTEMPTY: "Поле должно быть заполнено",
  MAXLENGTH: (value) => `Длина поля не должна превышать ${value} символов`,
}

export const VALIDATION = {
  TOKEN: "Токен сессии невалидный",
  USERNOTFOUND: "Такого пользователя не существует",
  PARENTNOTFOUND: "Родительская папка не найдена",
  PARENTNOACCESS: "У вас нет прав доступа к этой родительской папке",
  FOLDERNOACCESS: "У вас нет прав доступа к этой папке",
  FOLDERNOTFOUND: "Папка не найдена",
  PROJECTNOTFOUND: "Проект не найден",
  PROJECTNOACCESS: "У вас нет прав доступа к этому проекту",
  NOTENOTFOUND: "Такой заметки не существует",
  PINNOTFOUND: "Пин не найден",
  FILENOTFOUND: "Файл не был отправлен",
}

export const COOKIE_SECRET = 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678'

export const DEFAULT_IMAGE_DEST = '../images';