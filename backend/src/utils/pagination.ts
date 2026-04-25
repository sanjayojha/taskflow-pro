import { Request } from "express";
export interface PaginationOptions {
    limit: number;
    offset: number;
    page: number;
}

export interface PaginatedResult<T> {
    items: T[];
    meta: {
        total: number;
        limit: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export const getPagination = (req: Request): PaginationOptions => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;
    return { limit, offset, page };
};

export const paginate = <T>(rows: T[], count: number, options: PaginationOptions): PaginatedResult<T> => {
    const totalPages = Math.ceil(count / options.limit);
    return {
        items: rows,
        meta: {
            total: count,
            limit: options.limit,
            page: options.page,
            totalPages,
            hasNext: options.page < totalPages,
            hasPrev: options.page > 1,
        },
    };
};
