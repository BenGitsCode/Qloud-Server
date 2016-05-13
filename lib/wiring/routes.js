'use strict';

const express = require('express');
const router = express.Router();

const controllers = require('app/controllers');

const route = function (method, path, controllerAction) {
  let split = controllerAction.split('#');
  let apply = [path].concat(controllers[split[0]][split[1]]);
  router[method].apply(router, apply);
  return this;
};

const root = function (controllerAction) {
  return this.route('get', '/', controllerAction);
};

const normalizeOption = (options, name) =>
  options && options[name] &&
  (!Array.isArray(options[name]) ? [options[name]] : options[name]);

const resources = function (controller, options) {
  let only = normalizeOption(options, 'only');
  let except = normalizeOption(options, 'except');

  const actions = [
    { path: `/${controller}`,     method: 'get',    name: 'index', },
    { path: `/${controller}/:id`, method: 'get',    name: 'show', },
    { path: `/${controller}`,     method: 'post',   name: 'create', },
    { path: `/${controller}/:id`, method: 'patch',  name: 'update', },
    { path: `/${controller}/:id`, method: 'delete', name: 'destroy', },
  ];
  actions.forEach(action => {
    if (only && only.indexOf(action.name) < 0 ||
        except && except.indexOf(action.name) >= 0) {
      return;
    }

    route(action.method, action.path, `${controller}#${action.name}`);
  });
  return this;
};

const routes = {
  route,
  root,
  resources,
  router,
};

'get post patch delete'.split(' ').forEach(method =>
  routes[method] = function (path, controllerAction) {
    return this.route(method, path, controllerAction);
  });

module.exports = routes;
