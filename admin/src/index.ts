import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import ClearCacheButton from './components/ClearCacheButton';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  bootstrap(app: any) {
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'endpoint-trigger-clear-cache',
      Component: ClearCacheButton,
    })
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
