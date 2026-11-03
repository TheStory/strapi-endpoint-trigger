import type { Core } from '@strapi/strapi';
import { CacheTriggerError } from '../services/trigger';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin('strapi-endpoint-trigger').service('service').getWelcomeMessage();
  },
  async trigger(ctx) {
    try {
      ctx.body = await strapi.plugin('strapi-endpoint-trigger').service('trigger').trigger();
    } catch (error) {
      if (!(error instanceof CacheTriggerError)) throw error;
      ctx.throw(error.status, error.message, { expose: true });
    }
  },
});

export default controller;
