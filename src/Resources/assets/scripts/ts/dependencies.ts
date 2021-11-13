/**
 * This file includes everything that should be globally available in the app.
 */
import "essentials/dependencies";

/**
 * This section defines all modules used by the app.
 *
 * It's particularly important to import modules here because there may be no other reference
 * in the typescript code base if they are only used using html data attributes.
 *
 * Each module MUST declare itself to the container when imported, so you have nothing else to do
 * than import the module here.
 *
 * Import example:
 *
 *   import "webeak-native/services/example-service";
 */
import "essentials/vuejs/directives/perfect-scrollbar";
import "essentials/vuejs/directives/tooltip/tooltip";

import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import "essentials/dialog/alertify/alertify.service";

import "./vuejs/components/manager/manager.component";
