import responseCodes from "../constants/responseCodes";
import { operators } from "../constants/queries";

export interface Request {
    originalUrl?: string;
    params: {
        [key: string]: string;
    };
    query: {
        [key: string]: string;
    };
    body: {
        [key: string]: any;
    };
    headers: {
        origin?: string;
        [key: string]: string | string[] | undefined;
    };
}

export interface Response {
    set(headerProp: string, value: string): void;
    attachment(filename: string): void;
    status(code: number): Response;
    send(body: any): void;
}

export type Controller<RouteParams extends Request = Request> = (
    req: RouteParams,
    res: Response
) => Promise<void>;

export interface Api {
    use: (route: string, middleware: Middleware) => void;
    get: (route: string, controller: Controller<any>) => void;
    patch: (route: string, controller: Controller<any>) => void;
    delete: (route: string, controller: Controller<any>) => void;
    put: (route: string, controller: Controller<any>) => void;
    post: (route: string, controller: Controller<any>) => void;
}

export type Router = (api: Api) => void;

export type Middleware = (
    req: Request,
    res: Response,
    next: (...args: any[]) => void
) => void;

export type ResponseCode = (typeof responseCodes)[keyof typeof responseCodes];

export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>> &
    Omit<T, K>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Operator = (typeof operators)[number];

export type Direction = "asc" | "desc";

export type IDDocumentType = "cnpj" | "cpf";
