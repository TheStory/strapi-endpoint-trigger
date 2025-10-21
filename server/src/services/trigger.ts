import type { Core } from '@strapi/strapi';

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  trigger() {
    const config = strapi.config.get('plugin::strapi-endpoint-trigger') as {
      url: string;
      token: string;
    };

    fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token}`
      }
    }).catch(error => {
      console.error('Error:', error);
    })
  },
});

export default service;
