const bootstrap = ({ strapi }) => {
};
const destroy = ({ strapi }) => {
};
const register = ({ strapi }) => {
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin("strapi-endpoint-trigger").service("service").getWelcomeMessage();
  },
  trigger(ctx) {
    ctx.body = strapi.plugin("strapi-endpoint-trigger").service("trigger").trigger();
  }
});
const controllers = {
  controller
};
const middlewares = {};
const policies = {};
const contentAPIRoutes = [
  {
    method: "GET",
    path: "/",
    // name of the controller file & the method.
    handler: "controller.index",
    config: {
      policies: []
    }
  }
];
const routes = {
  "content-api": {
    type: "content-api",
    routes: contentAPIRoutes
  },
  admin: {
    type: "admin",
    routes: [
      {
        method: "POST",
        path: "/trigger",
        handler: "controller.trigger",
        config: {
          policies: []
        }
      }
    ]
  }
};
const service$1 = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  }
});
const service = ({ strapi }) => ({
  trigger() {
    const config2 = strapi.config.get("plugin::strapi-endpoint-trigger");
    fetch(config2.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config2.token}`
      }
    }).catch((error) => {
      console.error("Error:", error);
    });
  }
});
const services = {
  service: service$1,
  trigger: service
};
const index = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares
};
export {
  index as default
};
