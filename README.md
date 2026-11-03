# strapi-endpoint-trigger

Clear the website cache from any authenticated Strapi admin page with one click.
The floating button appears 24px from the bottom and inline end of the viewport,
uses the admin theme, and supports English and Polish. It stays below dialogs and
the upload progress drawer. Requests stay in progress across admin navigation;
repeated clicks are blocked until the response arrives. Errors can be retried.

## Requirements

- Strapi **5.55.1 or later within version 5**, React 18 and the **new Media Library**.
- Do not enable the `useLegacyMediaLibrary` feature flag: Strapi does not render
  global components when that flag is enabled.
- The button uses `app.addComponents` with the **internal, experimental**
  `future-global::` namespace. Verify it when upgrading Strapi; this mechanism may
  change or disappear. See the [Admin Panel API documentation](https://docs.strapi.io/cms/plugins-development/admin-panel-api)
  for standard extension points.

## Configuration

Configure `strapi-endpoint-trigger` in the application's `config/plugins.ts`:

```ts
'strapi-endpoint-trigger': {
  enabled: true,
  config: {
    url: `${env('FRONTEND_URL', '').replace(/\/$/, '')}/api/clear-entire-cache`,
    token: env('REVALIDATE_TOKEN'),
  },
},
```

The authenticated admin endpoint `POST /strapi-endpoint-trigger/trigger` forwards
a POST request with the configured bearer token. Credentials stay on the CMS server.
All authenticated admin users retain access; no additional role action is required.
The frontend determines which cache entries are invalidated.

The admin endpoint returns `{ "success": true }` only after the frontend responds
with HTTP 2xx. It returns 503 for missing configuration, 502 for network failures or
non-2xx responses, and 504 after a 15-second timeout. Redirects are rejected.
Success means invalidation finished; it does not pre-render or warm every page.
Errors show a dismissible notification; the button becomes available for retry.

## Development

```sh
npm ci
npm run test:ts:front
npm run test:ts:back
npm test
npm run verify
```

`npm test` rebuilds the plugin and checks its packaged backend. Commit the generated
`dist/` together with source changes: Git tarball consumers load those built files.
After publishing the commit, consumers must update their pinned Git SHA and lockfile
and rebuild their CMS admin panel.
