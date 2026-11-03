import { jsx } from "react/jsx-runtime";
import { useAuth, useFetchClient, useNotification } from "@strapi/strapi/admin";
import { Button } from "@strapi/design-system";
import { ArrowClockwise } from "@strapi/icons";
import { useState, useRef, useEffect } from "react";
import { useIntl } from "react-intl";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
const PLUGIN_ID = "strapi-endpoint-trigger";
const getTranslation = (id) => `${PLUGIN_ID}.${id}`;
const button$1 = "Clear website cache";
const loading$1 = "Clearing cache…";
const success$1 = "Website cache cleared.";
const error$1 = "Could not clear the website cache. Please try again.";
const en = {
  button: button$1,
  loading: loading$1,
  success: success$1,
  error: error$1
};
const Container = styled.div`
  position: fixed;
  inset-inline-end: 24px;
  bottom: 24px;
  max-width: calc(100vw - 48px);
  /* Below the upload drawer (200), overlays (300) and notifications. */
  z-index: 10;

  button {
    max-width: 100%;
    white-space: normal;
    box-shadow: ${({ theme }) => theme.shadows.filterShadow};
  }
`;
const CacheAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(false);
  const client = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const message = (key) => formatMessage({ id: getTranslation(key), defaultMessage: en[key] });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function trigger() {
    if (pending.current) return;
    pending.current = true;
    setIsLoading(true);
    try {
      const { data } = await client.post("/strapi-endpoint-trigger/trigger");
      if (data?.success !== true) throw new Error("Cache clearing was not confirmed");
      if (mounted.current) {
        toggleNotification({ type: "success", message: message("success"), timeout: 5e3 });
      }
    } catch {
      if (mounted.current) {
        toggleNotification({ type: "danger", message: message("error"), blockTransition: true });
      }
    } finally {
      pending.current = false;
      if (mounted.current) setIsLoading(false);
    }
  }
  return /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsx(
    Button,
    {
      type: "button",
      variant: "secondary",
      startIcon: /* @__PURE__ */ jsx(ArrowClockwise, {}),
      onClick: trigger,
      disabled: isLoading,
      loading: isLoading,
      "aria-busy": isLoading,
      children: message(isLoading ? "loading" : "button")
    }
  ) });
};
const ClearCacheButton = () => {
  const user = useAuth("ClearCacheButton", (state) => state.user);
  const token = useAuth("ClearCacheButton", (state) => state.token);
  const isLoading = useAuth("ClearCacheButton", (state) => state.isLoading);
  const isAuthPage = useMatch("/auth/*");
  const isOnboarding = useMatch("/usecase");
  if (!token || !user || isLoading || isAuthPage || isOnboarding) return null;
  return /* @__PURE__ */ jsx(CacheAction, {}, user.id);
};
const button = "Wyczyść cache strony";
const loading = "Czyszczenie…";
const success = "Cache strony został wyczyszczony.";
const error = "Nie udało się wyczyścić cache strony. Spróbuj ponownie.";
const pl = {
  button,
  loading,
  success,
  error
};
const index = {
  register(app) {
    app.registerPlugin({ id: PLUGIN_ID, name: PLUGIN_ID });
    app.addComponents({
      name: `future-global::${PLUGIN_ID}`,
      Component: ClearCacheButton
    });
  },
  async registerTrads({ locales }) {
    return locales.map((locale) => ({
      locale,
      data: Object.fromEntries(
        Object.entries(locale === "pl" ? pl : en).map(([key, value]) => [
          `${PLUGIN_ID}.${key}`,
          value
        ])
      )
    }));
  }
};
export {
  index as default
};
