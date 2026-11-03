import type { StrapiApp } from '@strapi/strapi/admin';
declare const _default: {
    register(app: StrapiApp): void;
    registerTrads({ locales }: {
        locales: string[];
    }): Promise<{
        locale: string;
        data: {
            [k: string]: string;
        };
    }[]>;
};
export default _default;
