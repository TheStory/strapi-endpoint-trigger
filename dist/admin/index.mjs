import { useRef, useEffect, useState } from "react";
import { jsxs, jsx } from "react/jsx-runtime";
import { useFetchClient } from "@strapi/strapi/admin";
import { Divider, Button } from "@strapi/design-system";
import styled from "styled-components";
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
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const Container = styled("div")`
  padding-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
`;
const ClearCacheButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const client = useFetchClient();
  async function trigger() {
    setIsLoading(true);
    await client.post("/strapi-endpoint-trigger/trigger");
    setIsLoading(false);
  }
  return /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(Button, { variant: "danger-light", onClick: trigger, disabled: isLoading, children: "Clear website cache" })
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
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("../_chunks/en-Byx4XI2L.mjs") }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
export {
  index as default
};
