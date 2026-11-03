import type { Core } from '@strapi/strapi';

export class CacheTriggerError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'CacheTriggerError';
  }
}

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async trigger() {
    const config = strapi.config.get('plugin::strapi-endpoint-trigger') as
      | { url?: string; token?: string }
      | undefined;

    if (!config?.url?.trim() || !config?.token?.trim()) {
      strapi.log.error('[strapi-endpoint-trigger] Missing cache endpoint URL or token.');
      throw new CacheTriggerError(503, 'Website cache clearing is not configured.');
    }

    let response: Response;
    try {
      response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.token}`,
        },
        signal: AbortSignal.timeout(15_000),
        redirect: 'error',
      });
    } catch (error) {
      const name = error instanceof Error ? error.name : 'UnknownError';
      const timedOut = name === 'TimeoutError' || name === 'AbortError';
      // Do not log the URL, headers or response body: these can contain secrets.
      strapi.log.error(`[strapi-endpoint-trigger] Cache endpoint request failed (${name}).`);
      throw new CacheTriggerError(
        timedOut ? 504 : 502,
        timedOut ? 'Website cache clearing timed out.' : 'Website cache clearing failed.'
      );
    }

    if (!response.ok) {
      strapi.log.error(
        `[strapi-endpoint-trigger] Cache endpoint returned HTTP ${response.status}.`
      );
      throw new CacheTriggerError(502, 'Website cache clearing failed.');
    }

    return { success: true };
  },
});

export default service;
