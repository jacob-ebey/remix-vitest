let { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/*"],
  routes: (defineRoutes) => flatRoutes("routes", defineRoutes),
};
