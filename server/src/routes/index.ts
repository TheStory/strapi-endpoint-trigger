import contentAPIRoutes from './content-api';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'POST',
        path: '/trigger',
        handler: 'controller.trigger',
        config: {
          policies: [],
        },
      },
    ],
  },
};

export default routes;
