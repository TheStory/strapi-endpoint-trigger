"use strict";
const react = require("react");
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const designSystem = require("@strapi/design-system");
const styled = require("styled-components");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const styled__default = /* @__PURE__ */ _interopDefault(styled);
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "strapi-endpoint-trigger";
const Initializer = ({ setPlugin }) => {
  const ref = react.useRef(setPlugin);
  react.useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const Container = styled__default.default("div")`
  padding-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
`;
const ClearCacheButton = () => {
  const [isLoading, setIsLoading] = react.useState(false);
  const client = admin.useFetchClient();
  async function trigger() {
    setIsLoading(true);
    await client.post("/strapi-endpoint-trigger/trigger");
    setIsLoading(false);
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(Container, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "danger-light", onClick: trigger, disabled: isLoading, children: "Clear website cache" })
  ] });
};
const index = {
  register(app) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  bootstrap(app) {
    app.getPlugin("content-manager").injectComponent("editView", "right-links", {
      name: "endpoint-trigger-clear-cache",
      Component: ClearCacheButton
    });
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("../_chunks/en-B4KWt_jN.js")) }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
module.exports = index;
