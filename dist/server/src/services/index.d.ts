declare const _default: {
    service: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getWelcomeMessage(): string;
    };
    trigger: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        trigger(): void;
    };
};
export default _default;
