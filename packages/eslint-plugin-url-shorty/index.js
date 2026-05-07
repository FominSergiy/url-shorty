'use strict';

const path = require('path');

/**
 * Rule: no-direct-db-in-routes
 * DB queries must go through the service layer — not called from route files.
 */
const noDirectDbInRoutes = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct db.query() or pool.query() calls in route files',
      url: 'docs/code-design.md',
    },
    messages: {
      noDirectDb:
        'Direct DB call in a route file. Move this to a service in apps/backend/src/services/ and call the service from here instead. See docs/code-design.md.',
    },
  },
  create(context) {
    const filePath = context.getFilename();
    const isRouteFile = filePath.includes(`${path.sep}routes${path.sep}`);
    if (!isRouteFile) return {};

    return {
      CallExpression(node) {
        const { callee } = node;
        // db.query(...) or pool.query(...)
        if (
          callee.type === 'MemberExpression' &&
          callee.property.name === 'query' &&
          callee.object.type === 'Identifier' &&
          ['db', 'pool', 'client'].includes(callee.object.name)
        ) {
          context.report({ node, messageId: 'noDirectDb' });
        }
      },
    };
  },
};

/**
 * Rule: require-error-handling-in-async
 * Async Express route handlers must wrap their body in try/catch and call next(err).
 */
const requireErrorHandlingInAsync = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require try/catch in async Express route handlers',
      url: 'docs/code-design.md',
    },
    messages: {
      missingTryCatch:
        'Async route handler is missing a try/catch block. Unhandled rejections will crash the server. Wrap the body in try { ... } catch (err) { next(err); }. See docs/code-design.md.',
    },
  },
  create(context) {
    const ROUTE_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'use', 'all']);

    function isRouteCall(node) {
      return (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        ROUTE_METHODS.has(node.callee.property.name)
      );
    }

    function isAsyncFunction(node) {
      return (
        (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') &&
        node.async === true
      );
    }

    function hasTryCatch(fnNode) {
      const body = fnNode.body;
      if (body.type !== 'BlockStatement') return false;
      return body.body.some((stmt) => stmt.type === 'TryStatement');
    }

    return {
      CallExpression(node) {
        if (!isRouteCall(node)) return;
        // Last argument that is async — the handler
        const args = node.arguments;
        const handler = args[args.length - 1];
        if (!handler || !isAsyncFunction(handler)) return;
        if (!hasTryCatch(handler)) {
          context.report({ node: handler, messageId: 'missingTryCatch' });
        }
      },
    };
  },
};

/**
 * Rule: no-hardcoded-urls
 * No http:// or https:// string literals outside of config/env files.
 */
const noHardcodedUrls = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded http/https URLs — read from process.env or import.meta.env',
      url: 'docs/code-design.md',
    },
    messages: {
      hardcodedUrl:
        'Hardcoded URL "{{url}}" found. Use process.env.BASE_URL (backend) or import.meta.env.VITE_API_BASE_URL (frontend) instead. See docs/code-design.md.',
    },
  },
  create(context) {
    const filePath = context.getFilename();
    // Allow in config files, .env loaders, and test fixtures
    const isAllowed =
      filePath.includes('config') ||
      filePath.endsWith('.env') ||
      filePath.includes('__fixtures__');
    if (isAllowed) return {};

    return {
      Literal(node) {
        if (
          typeof node.value === 'string' &&
          /^https?:\/\//.test(node.value) &&
          !node.value.includes('localhost') // allow localhost in dev scripts
        ) {
          context.report({
            node,
            messageId: 'hardcodedUrl',
            data: { url: node.value },
          });
        }
      },
    };
  },
};

/**
 * Rule: api-route-naming
 * All route paths in route files must start with /api/v1/ (redirect.js is excluded via .eslintrc override).
 */
const apiRouteNaming = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce /api/v1/ prefix on all route paths',
      url: 'docs/code-design.md',
    },
    messages: {
      badPrefix:
        'Route path "{{path}}" must start with "/api/v1/". See docs/architecture.md for the route table.',
    },
  },
  create(context) {
    const filePath = context.getFilename();
    const isRouteFile = filePath.includes(`${path.sep}routes${path.sep}`);
    if (!isRouteFile) return {};

    const ROUTE_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete']);

    return {
      CallExpression(node) {
        if (
          node.callee.type !== 'MemberExpression' ||
          !ROUTE_METHODS.has(node.callee.property.name)
        )
          return;

        const firstArg = node.arguments[0];
        if (!firstArg || firstArg.type !== 'Literal') return;
        const routePath = firstArg.value;
        if (typeof routePath !== 'string') return;

        if (!routePath.startsWith('/api/v1/')) {
          context.report({
            node: firstArg,
            messageId: 'badPrefix',
            data: { path: routePath },
          });
        }
      },
    };
  },
};

module.exports = {
  rules: {
    'no-direct-db-in-routes': noDirectDbInRoutes,
    'require-error-handling-in-async': requireErrorHandlingInAsync,
    'no-hardcoded-urls': noHardcodedUrls,
    'api-route-naming': apiRouteNaming,
  },
};
