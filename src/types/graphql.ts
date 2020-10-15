import {Request} from "express";

export interface User {
    id: number;
    name: string;
    roles: string[];
}

export interface Context {
    req: Request,
    user?: User,
}
