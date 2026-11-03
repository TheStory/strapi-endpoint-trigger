declare const _default: {
    service: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getWelcomeMessage(): string;
    };
    trigger: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        trigger(): Promise<{
            success: boolean;
        }>;
    };
};
export default _default;
