const assert = require('node:assert/strict');
const { test } = require('node:test');
const plugin = require('../dist/server/index.js');

function setup(
  config = { url: 'https://website.example/api/clear-entire-cache', token: 'test-secret' }
) {
  const logs = [];
  const strapi = {
    config: { get: () => config },
    log: { error: (message) => logs.push(message) },
    plugin: (name) => {
      assert.equal(name, 'strapi-endpoint-trigger');
      return {
        service: (serviceName) => {
          assert.equal(serviceName, 'trigger');
          return service;
        },
      };
    },
  };
  const service = plugin.services.trigger({ strapi });
  const controller = plugin.controllers.controller({ strapi });
  const ctx = {
    throw(status, message, options) {
      assert.equal(options.expose, true);
      throw Object.assign(new Error(message), { status });
    },
  };
  return { service, controller, ctx, logs };
}

test('the controller confirms success only after the authenticated frontend POST completes', async (t) => {
  let complete;
  let settled = false;
  const { controller, ctx } = setup();
  t.mock.method(globalThis, 'fetch', (url, options) => {
    assert.equal(url, 'https://website.example/api/clear-entire-cache');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer test-secret');
    assert.equal(options.redirect, 'error');
    assert.ok(options.signal instanceof AbortSignal);
    return new Promise((resolve) => {
      complete = resolve;
    });
  });
  const request = controller.trigger(ctx).then(() => {
    settled = true;
  });
  await Promise.resolve();
  assert.equal(settled, false);
  assert.equal(ctx.body, undefined);
  complete(new Response(null, { status: 204 }));
  await request;
  assert.deepEqual(ctx.body, { success: true });
});

for (const status of [403, 500, 302]) {
  test(`frontend HTTP ${status} becomes a controlled failure, without success`, async (t) => {
    const { controller, ctx, logs } = setup();
    t.mock.method(globalThis, 'fetch', async () => new Response(null, { status }));
    await assert.rejects(controller.trigger(ctx), {
      status: 502,
      message: 'Website cache clearing failed.',
    });
    assert.equal(ctx.body, undefined);
    assert.match(logs[0], new RegExp(`HTTP ${status}`));
    assert.doesNotMatch(logs.join(' '), /test-secret/);
  });
}

test('network failure is controlled and a later retry can succeed', async (t) => {
  const { controller, ctx } = setup();
  const fetch = t.mock.method(globalThis, 'fetch', async () => {
    throw new TypeError('fetch failed');
  });
  await assert.rejects(controller.trigger(ctx), { status: 502 });
  fetch.mock.mockImplementation(async () => new Response(null, { status: 200 }));
  await controller.trigger(ctx);
  assert.deepEqual(ctx.body, { success: true });
});

test('the request has a 15-second deadline and reports timeout as HTTP 504', async (t) => {
  const { controller, ctx, logs } = setup();
  t.mock.method(AbortSignal, 'timeout', (milliseconds) => {
    assert.equal(milliseconds, 15_000);
    return AbortSignal.abort(new DOMException('Deadline reached', 'TimeoutError'));
  });
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => {
    signal.throwIfAborted();
  });
  await assert.rejects(controller.trigger(ctx), {
    status: 504,
    message: 'Website cache clearing timed out.',
  });
  assert.match(logs[0], /TimeoutError/);
  assert.equal(ctx.body, undefined);
});

for (const config of [
  null,
  {},
  { url: ' ', token: 'secret' },
  { url: 'https://website.example' },
]) {
  test(`missing configuration ${JSON.stringify(config)} prevents the outgoing request`, async (t) => {
    const { controller, ctx, logs } = setup(config);
    const fetch = t.mock.method(globalThis, 'fetch', async () =>
      assert.fail('must not send a request')
    );
    await assert.rejects(controller.trigger(ctx), {
      status: 503,
      message: 'Website cache clearing is not configured.',
    });
    assert.equal(fetch.mock.callCount(), 0);
    assert.equal(ctx.body, undefined);
    assert.equal(logs.length, 1);
  });
}

test('the existing endpoint remains an authenticated admin route', () => {
  const routes = plugin.routes.admin;
  assert.equal(routes.type, 'admin');
  assert.equal(routes.routes.length, 1);
  assert.equal(routes.routes[0].method, 'POST');
  assert.equal(routes.routes[0].path, '/trigger');
  assert.notEqual(routes.routes[0].config.auth, false);
});
