import type { Core } from '@strapi/strapi';
export declare class CacheTriggerError extends Error {
    readonly status: number;
    constructor(status: number, message: string);
}
declare const service: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    trigger(): Promise<{
        success: boolean;
    }>;
};
export default service;
