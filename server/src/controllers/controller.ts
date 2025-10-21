import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-endpoint-trigger')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  trigger(ctx) {
    ctx.body = strapi
      .plugin('strapi-endpoint-trigger')
      // the name of the service file & the method.
      .service('trigger')
      .trigger();
  }
});

export default controller;
