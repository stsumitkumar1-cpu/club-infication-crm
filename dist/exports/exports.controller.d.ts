import type { Response } from 'express';
import { ExportsService } from './exports.service.js';
import type { AuthUser } from '../common/types/index.js';
export declare class ExportsController {
    private exportsService;
    constructor(exportsService: ExportsService);
    customers(user: AuthUser, res: Response): Promise<void>;
}
