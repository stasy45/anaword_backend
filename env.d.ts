export declare const APP_PORT = 8000;
export declare const APP_HOST = "http://localhost";
export declare const DB: {
    HOST: string;
    PORT: number;
    NAME: string;
    USER: string;
    PASSWORD: string;
};
export declare const VALIDATION_ERROR = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
export declare const FORM_VALIDATION: {
    INT: string;
    STRING: string;
    NOTEMPTY: string;
    MAXLENGTH: (value: any) => string;
};
export declare const VALIDATION: {
    TOKEN: string;
    USERNOTFOUND: string;
    PARENTNOTFOUND: string;
    PARENTNOACCESS: string;
    FOLDERNOACCESS: string;
    FOLDERNOTFOUND: string;
    PROJECTNOTFOUND: string;
    PROJECTNOACCESS: string;
};
export declare const COOKIE_SECRET = "a1b2c3d4e5f67890123456789012345678901234567890123456789012345678";
