"use strict";
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
class CacheTriggerError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "CacheTriggerError";
  }
}
const service$1 = ({ strapi }) => ({
  async trigger() {
    const config2 = strapi.config.get("plugin::strapi-endpoint-trigger");
    if (!config2?.url?.trim() || !config2?.token?.trim()) {
      strapi.log.error("[strapi-endpoint-trigger] Missing cache endpoint URL or token.");
      throw new CacheTriggerError(503, "Website cache clearing is not configured.");
    }
    let response;
    try {
      response = await fetch(config2.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config2.token}`
        },
        signal: AbortSignal.timeout(15e3),
        redirect: "error"
      });
    } catch (error) {
      const name = error instanceof Error ? error.name : "UnknownError";
      const timedOut = name === "TimeoutError" || name === "AbortError";
      strapi.log.error(`[strapi-endpoint-trigger] Cache endpoint request failed (${name}).`);
      throw new CacheTriggerError(
        timedOut ? 504 : 502,
        timedOut ? "Website cache clearing timed out." : "Website cache clearing failed."
      );
    }
    if (!response.ok) {
      strapi.log.error(
        `[strapi-endpoint-trigger] Cache endpoint returned HTTP ${response.status}.`
      );
      throw new CacheTriggerError(502, "Website cache clearing failed.");
    }
    return { success: true };
  }
});
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin("strapi-endpoint-trigger").service("service").getWelcomeMessage();
  },
  async trigger(ctx) {
    try {
      ctx.body = await strapi.plugin("strapi-endpoint-trigger").service("trigger").trigger();
    } catch (error) {
      if (!(error instanceof CacheTriggerError)) throw error;
      ctx.throw(error.status, error.message, { expose: true });
    }
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
const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  }
});
const services = {
  service,
  trigger: service$1
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
module.exports = index;
