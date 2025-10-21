import type { Core } from '@strapi/strapi';
declare const service: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    trigger(): void;
};
export default service;
