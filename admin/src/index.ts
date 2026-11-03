import type { StrapiApp } from '@strapi/strapi/admin';
import { PLUGIN_ID } from './pluginId';
import ClearCacheButton from './components/ClearCacheButton';
import en from './translations/en.json';
import pl from './translations/pl.json';

export default {
  register(app: StrapiApp) {
    app.registerPlugin({ id: PLUGIN_ID, name: PLUGIN_ID });
    // Strapi 5.55.1 renders this experimental namespace with the new Media Library.
    app.addComponents({
      name: `future-global::${PLUGIN_ID}`,
      Component: ClearCacheButton,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return locales.map((locale) => ({
      locale,
      data: Object.fromEntries(
        Object.entries(locale === 'pl' ? pl : en).map(([key, value]) => [
          `${PLUGIN_ID}.${key}`,
          value,
        ])
      ),
    }));
  },
};
