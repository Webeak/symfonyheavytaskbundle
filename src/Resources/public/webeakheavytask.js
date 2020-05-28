(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["webeakheavytask"],{

/***/ "./assets/essentials/core/scripts/ts/app.ts":
/*!**************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/app.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.function.bind */ "./node_modules/core-js/modules/es.function.bind.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppSymbol = exports.App = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var event_1 = __webpack_require__(/*! essentials/event */ "./assets/essentials/core/scripts/ts/event/index.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var jquery_modules_manager_1 = __webpack_require__(/*! essentials/jquery/jquery-modules-manager */ "./assets/essentials/core/scripts/ts/jquery/jquery-modules-manager.ts");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var App =
/** @class */
function () {
  /**
   * @inject() not used to facilitate overriding.
   */
  function App() {
    this.jqueryModulesManager = container_1.Container.getContainer().get(jquery_modules_manager_1.JqueryModulesManagerSymbol);
    this.eventDispatcher = container_1.Container.getContainer().get(event_1.EventDispatcherServiceSymbol);
    this.initializers = [];
    this.isStarted = false;
  }

  App.prototype.start = function () {
    for (var _i = 0, _a = this.initializers; _i < _a.length; _i++) {
      var initializer = _a[_i];
      initializer.apply(null);
    }

    this.initializers = [];
    this.jqueryModulesManager.scan();
    this.isStarted = true;
  };
  /**
   * Register a function that will be called when the app starts.
   */


  App.prototype.registerInitializer = function (callback) {
    if (!this.isStarted) {
      this.initializers.push(callback);
    } else {
      window.setTimeout(function () {
        callback.apply(null);
      });
    }
  };
  /**
   * Dispatch a global event into the app.
   */


  App.prototype.trigger = function (name, arg) {
    this.eventDispatcher.dispatch(name, arg);
  };

  App = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__metadata("design:paramtypes", [])], App);
  return App;
}();

exports.App = App;
exports.AppSymbol = Symbol("App");
container_1.Container.getContainer().bind(exports.AppSymbol).to(App).inSingletonScope();

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/config/shared-configuration.ts":
/*!**************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/config/shared-configuration.ts ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.function.bind */ "./node_modules/core-js/modules/es.function.bind.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedConfigurationSymbol = exports.SharedConfiguration = exports.ENV = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var constants_1 = __webpack_require__(/*! essentials/log/constants */ "./assets/essentials/core/scripts/ts/log/constants.ts");

var var_holder_1 = __webpack_require__(/*! essentials/storage/var-holder */ "./assets/essentials/core/scripts/ts/storage/var-holder.ts");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");
/**
 * Current environment.
 */


exports.ENV = 'prod';

var SharedConfiguration =
/** @class */
function (_super) {
  tslib_1.__extends(SharedConfiguration, _super);

  function SharedConfiguration() {
    var _this = _super.call(this) || this;
    /**
     * Current environment.
     */


    _this.env = exports.ENV;
    /**
     * Version number.
     */

    _this.version = '0.0.1';
    /**
     * Current timezone in use in the app.
     */

    _this.timezone = 'Europe/Paris';
    /**
     * Debug configuration.
     */

    _this.debug = {
      logs: {
        level: constants_1.LogLevel.INFO,
        storageKey: 'debug:logs',
        storageWriteInterval: 10000,
        maximumCount: 50
      }
    };
    _this.network = {
      connectionErrorRetryDelay: 15000,
      reloadOnAuthenticationError: true
    };
    _this.storage = _this;
    return _this;
  }
  /**
   * SharedConfiguration must be registered twice in the container:
   *   - with a symbol identifier like any service
   *   - with a string constant identifier to be injectable anywhere in the app without risking a circular dependency.
   *
   * It must also be overridable so the last registration overrides the previous ones.
   *
   * For these reasons, the Register method has been created, to ensure it is registered properly.
   *
   * @param {object} obj a reference to the class to register
   */


  SharedConfiguration.Register = function (obj) {
    var container = container_1.Container.getContainer();

    try {
      container.get(exports.SharedConfigurationSymbol);
      container.unbind('SharedConfiguration');
      container.unbind(exports.SharedConfigurationSymbol);
    } catch (e) {}

    container.bind(exports.SharedConfigurationSymbol).to(obj).inSingletonScope();
    container.bind('SharedConfiguration').toConstantValue(container.get(exports.SharedConfigurationSymbol));
  };

  SharedConfiguration = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__metadata("design:paramtypes", [])], SharedConfiguration);
  return SharedConfiguration;
}(var_holder_1.VarHolder);

exports.SharedConfiguration = SharedConfiguration;
exports.SharedConfigurationSymbol = Symbol("SharedConfiguration");
SharedConfiguration.Register(SharedConfiguration);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/constants.ts":
/*!********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/constants.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Constants = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var var_holder_1 = __webpack_require__(/*! essentials/storage/var-holder */ "./assets/essentials/core/scripts/ts/storage/var-holder.ts");

var error_1 = __webpack_require__(/*! essentials/error */ "./assets/essentials/core/scripts/ts/error/index.ts");

var Constants =
/** @class */
function (_super) {
  tslib_1.__extends(Constants, _super);

  function Constants() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Get the value of a constant.
   */


  Constants.Get = function (name) {
    return Constants.GetInstance().get(name);
  };
  /**
   * Register a constant.
   */


  Constants.Register = function (name, value) {
    if (Constants.GetInstance().has(name)) {
      throw new error_1.AppError("A constant named " + name + " is already defined. Choose another name of use the shared configuration if the value must be overridden.");
    }

    Constants.GetInstance().set(name, value);
  };
  /**
   * Get (and create if necessary) the singleton instance.
   */


  Constants.GetInstance = function () {
    if (Constants.Instance === null) {
      Constants.Instance = new Constants();
      /**
       * Register some global constants.
       */
      // Custom VueJS delimiters so they do not conflict with Twig.

      Constants.Register('DELIMITERS', ['${', '}']);
    }

    return Constants.Instance;
  };
  /**
   * Singleton.
   */


  Constants.Instance = null;
  return Constants;
}(var_holder_1.VarHolder);

exports.Constants = Constants;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/dependencies.ts":
/*!***********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/dependencies.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This file includes base dependencies always required no matter the project.
 * This should be the first thing to include in the project.
 */

__webpack_require__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");

__webpack_require__(/*! essentials/utils/extensions/all */ "./assets/essentials/core/scripts/ts/utils/extensions/all.ts");

__webpack_require__(/*! essentials/jquery/strip-xssi */ "./assets/essentials/core/scripts/ts/jquery/strip-xssi.ts");

__webpack_require__(/*! essentials/storage/storage.factory */ "./assets/essentials/core/scripts/ts/storage/storage.factory.ts");

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/dialog/alertify/alertify.service.ts":
/*!*******************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/dialog/alertify/alertify.service.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertifyServiceSymbol = exports.AlertifyService = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js"); // @ts-ignore


var alertify = __webpack_require__(/*! alertifyjs */ "./node_modules/alertifyjs/build/alertify.js");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var jquery_modules_manager_1 = __webpack_require__(/*! essentials/jquery/jquery-modules-manager */ "./assets/essentials/core/scripts/ts/jquery/jquery-modules-manager.ts");

var utils_1 = __webpack_require__(/*! essentials/network/utils */ "./assets/essentials/core/scripts/ts/network/utils.ts");

var base64_1 = __webpack_require__(/*! essentials/utils/base64 */ "./assets/essentials/core/scripts/ts/utils/base64.ts");

var object_1 = __webpack_require__(/*! essentials/utils/object */ "./assets/essentials/core/scripts/ts/utils/object.ts");

var utils_2 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var AlertifyService =
/** @class */
function () {
  function AlertifyService() {
    this.jqueryModulesManager = container_1.Container.getContainer().get(jquery_modules_manager_1.JqueryModulesManagerSymbol);
  }

  AlertifyService_1 = AlertifyService;
  /**
   * Show a generic dialog from an HTML source code or a dom element (supports jquery).
   */

  AlertifyService.prototype.dialog = function (options) {
    var that = this;
    var id = this.generateUniqueId();
    var el = this.resolveDialogSource(id, options.source);

    var wrapCallback = function wrapCallback(callback, previous) {
      if (!utils_2.isFunction(previous)) {
        return callback;
      }

      return function () {
        callback.apply(this, arguments);
        previous.apply(this, arguments);
      };
    };

    if (utils_2.isNullOrUndefined(options.buttons)) {
      options.buttons = [{
        text: 'Ok',
        key: 27,
        invokeOnClose: true,
        className: alertify.defaults.theme.ok,
        attrs: {
          attribute: 'value'
        },
        scope: 'auxiliary'
      }];
    }

    $('body').append(el);
    alertify.dialog(id, function () {
      var dialogConfig = {};
      var hooksConfig = {
        onshow: wrapCallback(function () {
          window.setTimeout(function () {
            that.jqueryModulesManager.scan();
          });
        }, object_1.getObjectValue(options, ['hooks', 'onshow'], utils_2.noop))
      };
      object_1.addToObjectIfDefined(hooksConfig, 'onclose', object_1.getObjectValue(options, ['hooks', 'onclose'], undefined));
      object_1.addToObjectIfDefined(hooksConfig, 'onupdate', object_1.getObjectValue(options, ['hooks', 'onupdate'], undefined));
      object_1.addToObjectIfDefined(dialogConfig, 'callback', options.onCallback);
      object_1.addToObjectIfDefined(dialogConfig, 'settings', options.settings);
      dialogConfig.hooks = hooksConfig;

      dialogConfig.setup = function () {
        var setupConfig = {
          options: object_1.extend({
            modal: true,
            basic: false,
            maximizable: true,
            resizable: true,
            padding: true
          }, options.options)
        };
        object_1.addToObjectIfDefined(setupConfig, 'buttons', options.buttons);
        object_1.addToObjectIfDefined(setupConfig, 'focus', options.focus);
        return setupConfig;
      };

      dialogConfig.main = wrapCallback(function (content) {
        this.setContent(content);
      }, options.onMain);
      dialogConfig.build = wrapCallback(utils_2.noop, options.onBuild);
      dialogConfig.prepare = wrapCallback(utils_2.noop, options.onPrepare);
      dialogConfig.settingUpdated = wrapCallback(utils_2.noop, options.onSettingUpdated);
      return dialogConfig;
    });
    return alertify[id](el);
  };
  /**
   * Show a flash notification of type "info".
   */


  AlertifyService.prototype.notifyInfo = function (message, durationInSeconds) {
    alertify.notify(message, 'info', durationInSeconds);
  };
  /**
   * Show a flash notification of type "success".
   */


  AlertifyService.prototype.notifySuccess = function (message, durationInSeconds) {
    alertify.notify(message, 'success', durationInSeconds);
  };
  /**
   * Show a flash notification of type "warning".
   */


  AlertifyService.prototype.notifyWarning = function (message, durationInSeconds) {
    if (durationInSeconds === void 0) {
      durationInSeconds = 30;
    }

    alertify.notify(message, 'warning', durationInSeconds);
  };
  /**
   * Show a flash notification of type "error".
   */


  AlertifyService.prototype.notifyError = function (message, durationInSeconds) {
    if (durationInSeconds === void 0) {
      durationInSeconds = 30;
    }

    alertify.notify(message, 'error', durationInSeconds);
  };
  /**
   * Show a flash notification after a redirection to another url (of the same project..).
   */


  AlertifyService.prototype.notifyAfterRedirect = function (type, message, url) {
    document.location.href = '/_wb_essential/misc/redirect-and-notify' + utils_1.buildQueryParameters({
      p: base64_1.base64encodeUrlSafe(JSON.stringify({
        type: type,
        message: message,
        url: url
      }))
    });
  };
  /**
   * Generates an id guaranteed to be unique for the current DOM.
   */


  AlertifyService.prototype.generateUniqueId = function () {
    return 'al_gd_' + ++AlertifyService_1.MAX_ID;
  };
  /**
   * Convert a variable input into an HTMLElement instance ready to be used by the dialog system.
   */


  AlertifyService.prototype.resolveDialogSource = function (id, source) {
    if (utils_2.isObject(source)) {
      if (source instanceof HTMLElement) {
        return source;
      }

      if (!utils_2.isUndefined(source.jquery) || source instanceof $) {
        return source.get(0);
      }
    }

    if (utils_2.isString(source) && source[0] !== '<') {
      source = '<div>' + source + '</div>';
    }

    return $(source).prop('id', id).get(0);
  };

  var AlertifyService_1;
  AlertifyService.MAX_ID = 0;
  AlertifyService = AlertifyService_1 = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__metadata("design:paramtypes", [])], AlertifyService);
  return AlertifyService;
}();

exports.AlertifyService = AlertifyService;
exports.AlertifyServiceSymbol = Symbol("AlertifyService");
container_1.Container.registerService(exports.AlertifyServiceSymbol, AlertifyService);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/error/app.error.ts":
/*!**************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/error/app.error.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppError = void 0;

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");
/**
 * Base error class.
 * All errors of the application MUST inherit from this class.
 *
 * Do NOT use the default Error class because of:
 * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
 *
 * And more particularly because of:
 *
 * "Unfortunately, these workarounds will not work on Internet Explorer 10 and prior.
 * One can manually copy methods from the prototype onto the instance itself (i.e. FooError.prototype onto this), but the prototype chain itself cannot be fixed."
 *
 * To keep IE 10 compatibility, the most reliable way is to have our own base class.
 */


var AppError =
/** @class */
function () {
  /**
   * Creates an AppError instance.
   */
  function AppError(message, previous, extra) {
    if (message === void 0) {
      message = '';
    }

    this.message = message;
    this.previous = previous;
    this.extra = extra;

    if (!utils_1.isNullOrUndefined(previous) && !(previous instanceof AppError)) {
      this.previous = AppError.create(previous);
    }

    if (AppError.IsDev()) {
      if (utils_1.isObject(extra) && !utils_1.isNullOrUndefined(extra.stack)) {
        console.log(extra.stack);
      } else {// console.trace(this);
      }
    }
  }
  /**
   * Offers and easy way to test if the current env is dev.
   */


  AppError.IsDev = function () {
    if (AppError._isDev === null) {
      // SharedConfiguration has the particularity to be also registered as a string constant so it can
      // be imported anywhere without circular dependency error.
      var conf = container_1.Container.getContainer().get('SharedConfiguration');
      AppError._isDev = conf.env === 'dev';
    }

    return AppError._isDev;
  };
  /**
   * Create a AppError instance from a mixed input.
   * Input can be:
   *   - a string
   *   - an Error object
   *   - a AppError object
   *   - a plain object containing a "message" key
   */


  AppError.create = function (input, defaultMessage) {
    if (defaultMessage === void 0) {
      defaultMessage = 'Unknown error';
    }

    if (input instanceof AppError) {
      return input;
    }

    if (utils_1.isString(input)) {
      return new AppError(input);
    }

    if (input instanceof Error) {
      return new AppError(input.toString(), null, {
        originalError: input,
        stack: input.stack
      });
    }

    if (utils_1.isObject(input) && utils_1.isString(input.message)) {
      return new AppError(input.message, null, {
        originalError: input
      });
    }

    return new AppError(defaultMessage);
  };
  /**
   * Will try to find the first PublicAppError instance in the stack and will return its message if found.
   * If no public error is found the default message will be returned.
   */


  AppError.prototype.getPublicMessage = function (defaultMessage) {
    if (defaultMessage === void 0) {
      defaultMessage = 'Unknown error';
    }

    var publicError = this.getPublicError();

    if (publicError) {
      return publicError.message;
    }

    return AppError.IsDev() ? this.getRealError().message : defaultMessage;
  };
  /**
   * Returns the first PublicAppError instance in the stack.
   * If none is found, returns null.
   */


  AppError.prototype.getPublicError = function () {
    if (this.previous && this.previous.isPublicError()) {
      return this.previous;
    }

    if (!utils_1.isNullOrUndefined(this.previous)) {
      return this.previous.getPublicError();
    }

    return null;
  };
  /**
   * Ensure the "real" error is returned.
   *
   * That's useful in case you don't know if the error you receive has been wrapped inside a PublicAppError.
   */


  AppError.prototype.getRealError = function () {
    return this;
  };
  /**
   * Get the first error of a certain type in the stack of errors.
   */


  AppError.prototype.getFirstErrorOfType = function (type) {
    if (type === this.constructor) {
      return this;
    }

    if (this.previous) {
      return this.previous.getFirstErrorOfType(type);
    }

    return null;
  };
  /**
   * Gets the string representation of the error.
   */


  AppError.prototype.toString = function () {
    var realError = this.getRealError();
    return realError ? realError.message : this.message;
  };
  /**
   * Returns if the current instance is a public error.
   * Public error must override this method to return "true" instead.
   */


  AppError.prototype.isPublicError = function () {
    return false;
  };

  AppError._isDev = null;
  return AppError;
}();

exports.AppError = AppError;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/error/index.ts":
/*!**********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/error/index.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

tslib_1.__exportStar(__webpack_require__(/*! ./app.error */ "./assets/essentials/core/scripts/ts/error/app.error.ts"), exports);

tslib_1.__exportStar(__webpack_require__(/*! ./public-app.error */ "./assets/essentials/core/scripts/ts/error/public-app.error.ts"), exports);

tslib_1.__exportStar(__webpack_require__(/*! ./stop.error */ "./assets/essentials/core/scripts/ts/error/stop.error.ts"), exports);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/error/public-app.error.ts":
/*!*********************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/error/public-app.error.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublicAppError = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var app_error_1 = __webpack_require__(/*! ./app.error */ "./assets/essentials/core/scripts/ts/error/app.error.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");
/**
 * Error that can be displayed to the user.
 *
 * Creating an error of this type doesn't mean it will be shown, but if a part of the application wants to display an error the user
 * it will search for the first PublicAppError instance in the error stack (starting at the bottom of the stack).
 *
 * It's important that for every critical error at least one part of the app creates an PublicAppError to ensure
 * a clear message can be delivered to the user.
 */


var PublicAppError =
/** @class */
function (_super) {
  tslib_1.__extends(PublicAppError, _super);
  /**
   * Creates a PublicAppError instance.
   */


  function PublicAppError(message, realError, previous) {
    var _this = _super.call(this, message, previous) || this;

    _this.message = message;
    _this.realError = realError;
    _this.previous = previous;

    if (!utils_1.isNullOrUndefined(realError) && !(realError instanceof app_error_1.AppError)) {
      _this.realError = app_error_1.AppError.create(realError);
    }

    if (!_this.previous && _this.realError) {
      _this.previous = _this.realError;
    }

    return _this;
  }
  /**
   * Returns the highest PublicAppError instance in the stack.
   * If none is found, returns null.
   */


  PublicAppError.prototype.getPublicError = function () {
    var parent = this.previous ? this.previous.getPublicError() : null;
    return parent ? parent : this;
  };
  /**
   * Get the first error of a certain type in the stack of errors.
   */


  PublicAppError.prototype.getFirstErrorOfType = function (type) {
    if (this.realError && type === this.realError.constructor) {
      return this.realError;
    }

    return _super.prototype.getFirstErrorOfType.call(this, type);
  };
  /**
   * Returns the real error behind the public error wrapper.
   */


  PublicAppError.prototype.getRealError = function () {
    return this.realError;
  };
  /**
   * Returns if the current instance is a public error.
   */


  PublicAppError.prototype.isPublicError = function () {
    return true;
  };

  return PublicAppError;
}(app_error_1.AppError);

exports.PublicAppError = PublicAppError;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/error/stop.error.ts":
/*!***************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/error/stop.error.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StopError = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var app_error_1 = __webpack_require__(/*! ./app.error */ "./assets/essentials/core/scripts/ts/error/app.error.ts");
/**
 * Error used to stop a promise chain without applying the normal error behavior.
 */


var StopError =
/** @class */
function (_super) {
  tslib_1.__extends(StopError, _super);

  function StopError() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return StopError;
}(app_error_1.AppError);

exports.StopError = StopError;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/event/event-arg.ts":
/*!**************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/event/event-arg.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventArg = void 0;
/**
 * Base class of all events.
 */

var EventArg =
/** @class */
function () {
  function EventArg() {
    /**
     * Holds if the propagation is stopped.
     */
    this.propagationStopped = false;
  }
  /**
   * Stop the event propagation so no other listener is called.
   */


  EventArg.prototype.stopPropagation = function () {
    this.propagationStopped = true;
  };
  /**
   * Test if the propagation has been stopped for this event.
   */


  EventArg.prototype.isPropagationStopped = function () {
    return this.propagationStopped === true;
  };

  return EventArg;
}();

exports.EventArg = EventArg;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/event/event-dispatcher.service.ts":
/*!*****************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/event/event-dispatcher.service.ts ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventDispatcherServiceSymbol = exports.EventDispatcherService = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var log_1 = __webpack_require__(/*! essentials/log */ "./assets/essentials/core/scripts/ts/log/index.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var event_dispatcher_1 = __webpack_require__(/*! essentials/event/event-dispatcher */ "./assets/essentials/core/scripts/ts/event/event-dispatcher.ts");

var EventDispatcherService =
/** @class */
function (_super) {
  tslib_1.__extends(EventDispatcherService, _super);

  function EventDispatcherService(logger) {
    var _this = _super.call(this) || this;

    _this.logger = logger;
    return _this;
  }
  /**
   * Trigger an event.
   */


  EventDispatcherService.prototype.dispatch = function (eventName, arg) {
    this.logger.debug('Dispatch "' + eventName + '" event.');

    _super.prototype.dispatch.call(this, eventName, arg);
  };
  /**
   * Trigger an event and return responses of callbacks.
   * This method will wait for promises to resolve.
   */


  EventDispatcherService.prototype.dispatchForResponse = function (eventName, arg) {
    this.logger.debug('Dispatch "' + eventName + '" event.');
    return _super.prototype.dispatchForResponse.call(this, eventName, arg);
  };

  EventDispatcherService = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__param(0, inversify_1.inject(log_1.LoggerServiceSymbol)), tslib_1.__metadata("design:paramtypes", [log_1.LoggerService])], EventDispatcherService);
  return EventDispatcherService;
}(event_dispatcher_1.EventDispatcher);

exports.EventDispatcherService = EventDispatcherService;
exports.EventDispatcherServiceSymbol = Symbol("EventDispatcherService");
container_1.Container.registerService(exports.EventDispatcherServiceSymbol, EventDispatcherService);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/event/event-dispatcher.ts":
/*!*********************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/event/event-dispatcher.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.splice */ "./node_modules/core-js/modules/es.array.splice.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventDispatcher = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var event_arg_1 = __webpack_require__(/*! ./event-arg */ "./assets/essentials/core/scripts/ts/event/event-arg.ts");

var EventDispatcher =
/** @class */
function () {
  function EventDispatcher() {
    this.listeners = {};
  }
  /**
   * Subscribe to an event.
   */


  EventDispatcher.prototype.subscribe = function (eventName, callback) {
    var _this = this;

    if (utils_1.isUndefined(this.listeners[eventName])) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);
    return function () {
      if (!utils_1.isUndefined(_this.listeners[eventName])) {
        for (var i = 0; i < _this.listeners[eventName].length; ++i) {
          if (_this.listeners[eventName][i] === callback) {
            _this.listeners[eventName].splice(i, 1);

            return;
          }
        }
      }
    };
  };
  /**
   * Trigger an event.
   */


  EventDispatcher.prototype.dispatch = function (eventName, arg) {
    if (utils_1.isUndefined(this.listeners[eventName])) {
      return;
    }

    if (!arg) {
      arg = new event_arg_1.EventArg();
    }

    for (var _i = 0, _a = this.listeners[eventName]; _i < _a.length; _i++) {
      var callback = _a[_i];
      callback(arg);

      if (arg.isPropagationStopped()) {
        return;
      }
    }
  };
  /**
   * Trigger an event and return responses of callbacks.
   * This method will wait for promises to resolve.
   */


  EventDispatcher.prototype.dispatchForResponse = function (eventName, arg) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      if (utils_1.isUndefined(_this.listeners[eventName])) {
        resolve([]);
        return;
      }

      if (!arg) {
        arg = new event_arg_1.EventArg();
      }

      var responses = null;
      var pipeline = Promise.resolve();
      var propagationStopped = false;

      for (var _i = 0, _a = _this.listeners[eventName]; _i < _a.length; _i++) {
        var callback = _a[_i];
        pipeline = pipeline.then(function (innerCallback) {
          return function (previousResponse) {
            if (propagationStopped) {
              return null;
            }

            if (responses === null) {
              responses = [];
            } else {
              responses.push(previousResponse);
            }

            var response = innerCallback(arg);

            if (arg.isPropagationStopped()) {
              propagationStopped = true;
            }

            return response;
          };
        }(callback));
      }

      pipeline.then(function (previousResponse) {
        responses.push(previousResponse);
        resolve(responses);
      }, reject);
    });
  };
  /**
   * Trigger an event and return responses of callbacks.
   * This method will wait for promises to resolve.
   */


  EventDispatcher.prototype.dispatchForSingleResponse = function (eventName, arg, strategy) {
    if (strategy === void 0) {
      strategy = 'last';
    }

    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var responses;
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , this.dispatchForResponse(eventName, arg)];

          case 1:
            responses = _a.sent();

            if (responses.length > 0) {
              if (strategy === 'last') {
                return [2
                /*return*/
                , responses.pop];
              }

              return [2
              /*return*/
              , responses.shift()];
            }

            return [2
            /*return*/
            , null];
        }
      });
    });
  };
  /**
   * Remove all registered listeners.
   */


  EventDispatcher.prototype.clear = function () {
    this.listeners = {};
  };

  EventDispatcher = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__metadata("design:paramtypes", [])], EventDispatcher);
  return EventDispatcher;
}();

exports.EventDispatcher = EventDispatcher;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/event/index.ts":
/*!**********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/event/index.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

tslib_1.__exportStar(__webpack_require__(/*! ./event-arg */ "./assets/essentials/core/scripts/ts/event/event-arg.ts"), exports);

tslib_1.__exportStar(__webpack_require__(/*! ./event-dispatcher.service */ "./assets/essentials/core/scripts/ts/event/event-dispatcher.service.ts"), exports);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/inversify/container.ts":
/*!******************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/inversify/container.ts ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");

__webpack_require__(/*! core-js/modules/es.function.bind */ "./node_modules/core-js/modules/es.function.bind.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Container = void 0;

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var Container =
/** @class */
function () {
  function Container() {}
  /**
   * Gets the Inversify's container and create it if necessary.
   *
   * @returns {InversifyContainer}
   */


  Container.getContainer = function () {
    if (Container.container === null) {
      Container.container = new inversify_1.Container();
    }

    return Container.container;
  };
  /**
   * Register an object as a module into the container.
   * Modules are transient, a new instance will be created each time they are imported as a dependency.
   *
   * @param {Symbol} symbol
   * @param {object} type
   */


  Container.registerModule = function (symbol, type) {
    Container.getContainer().bind(symbol).to(type).inTransientScope();
    Container.symbols.modules.push(symbol);
  };
  /**
   * Register an object as a service into the container.
   * Services are singleton, only one instance will be created and will be shared each time it is imported as a dependency.
   *
   * @param {Symbol} symbol
   * @param {object} type
   */


  Container.registerService = function (symbol, type) {
    Container.getContainer().bind(symbol).to(type).inSingletonScope();
    Container.symbols.services.push(symbol);
  };
  /**
   * Register a service factory.
   *
   * @param {Symbol}   symbol
   * @param {function} callback
   */


  Container.registerFactory = function (symbol, callback) {
    Container.getContainer().bind(symbol).toDynamicValue(callback);
  };
  /**
   * Gets the whole list of registered symbols for modules.
   *
   * @returns {symbol[]}
   */


  Container.getModulesSymbols = function () {
    return [].concat(Container.symbols.modules);
  };
  /**
   * Gets the whole list of registered symbols for services.
   *
   * @returns {symbol[]}
   */


  Container.getServicesSymbols = function () {
    return [].concat(Container.symbols.services);
  };
  /**
   * Inversify container instance.
   */


  Container.container = null;
  /**
   * Symbols of registered modules.
   */

  Container.symbols = {
    modules: [],
    services: []
  };
  return Container;
}();

exports.Container = Container;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/jquery/jquery-module.ts":
/*!*******************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/jquery/jquery-module.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");

__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.function.bind */ "./node_modules/core-js/modules/es.function.bind.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JqueryModule = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var event_1 = __webpack_require__(/*! essentials/event */ "./assets/essentials/core/scripts/ts/event/index.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var JqueryModule =
/** @class */
function () {
  function JqueryModule() {
    /**
     * Queue of deferred objects waiting for the component to be ready.
     */
    this.onReadyPromise = null;
    this.onReadyPromiseResolve = null;
    this.eventDispatcher = container_1.Container.getContainer().get(event_1.EventDispatcherServiceSymbol);
    this.options = this.getDefaultOptions();
    this.statesHolder = {
      current: {},
      tags: {}
    };
    this.registerStateTags(JqueryModule_1.STATES.INITIALIZING, JqueryModule_1.STATES.BUZY);
    this.registerStateTags(JqueryModule_1.STATES.INITIALIZING, JqueryModule_1.STATES.CONSTRUCTED);
    this.registerStateTags(JqueryModule_1.STATES.INITIALIZED, JqueryModule_1.STATES.CONSTRUCTED);
  }

  JqueryModule_1 = JqueryModule;
  /**
   * Gets the jQuery element associated with the module.
   *
   * @returns jQuery
   */

  JqueryModule.prototype.getElement = function () {
    return this.$element;
  };
  /**
   * Sets the jQuery element associated with the module.
   */


  JqueryModule.prototype.setElement = function ($element) {
    this.$element = $element;
  };
  /**
   * Initialize the module.
   */

  /* final */


  JqueryModule.prototype.initialize = function (options) {
    var _this = this;

    this.enterState(JqueryModule_1.STATES.INITIALIZING);
    this.setOptions(options || {});
    Promise.all([this.doInit()]).then(function () {
      _this.enterState(JqueryModule_1.STATES.INITIALIZED);

      _this.leaveState(JqueryModule_1.STATES.INITIALIZING);

      if (_this.onReadyPromiseResolve !== null) {
        _this.onReadyPromiseResolve();

        _this.onReadyPromiseResolve = null;
      }

      _this.afterInit();
    });
  };
  /**
   * Call the promise when the component has been initialized.
   */


  JqueryModule.prototype.onReady = function () {
    var _this = this;

    if (this.onReadyPromise === null) {
      this.onReadyPromise = new Promise(function (resolve) {
        _this.onReadyPromiseResolve = resolve;
      });

      if (this.isReady()) {
        this.onReadyPromiseResolve();
      }
    }

    return this.onReadyPromise;
  };
  /**
   * Test if the module is ready to be used.
   *
   * @returns {boolean}
   */


  JqueryModule.prototype.isReady = function () {
    return this.isInState(JqueryModule_1.STATES.INITIALIZED);
  };
  /**
   * Gets an option by name.
   */


  JqueryModule.prototype.getOption = function (name, defaultValue) {
    if (defaultValue === void 0) {
      defaultValue = null;
    }

    if (this.hasOption(name)) {
      return this.options[name];
    }

    return defaultValue;
  };
  /**
   * Sets an option by name.
   */


  JqueryModule.prototype.setOption = function (name, value) {
    var hasOption = this.hasOption(name);
    var oldValue = hasOption ? this.options[name] : null;
    this.options[name] = value;

    if (this.isReady() && hasOption && !utils_1.areEqual(oldValue, value)) {
      this.onOptionChange(name, oldValue, value);
    }
  };
  /**
   * Merge an object of options into the internal one.
   *
   * @param {object}  options
   * @param {boolean} clearOther (optional, default: false) if true, the internal object is cleared before setting new options.
   *                  By default, new options are merged with existing ones.
   */


  JqueryModule.prototype.setOptions = function (options, clearOther) {
    if (clearOther === void 0) {
      clearOther = false;
    }

    if (clearOther) {
      this.options = {};
    }

    for (var name_1 in options) {
      if (options.hasOwnProperty(name_1)) {
        this.setOption(name_1, options[name_1]);
      }
    }
  };
  /**
   * Tests if an option is defined.
   */


  JqueryModule.prototype.hasOption = function (name) {
    return this.options[name] !== void 0;
  };
  /**
   * Get the name of the option to use when a scalar value is passed
   * to the html attribute, like: jqm-my-module="2".
   */


  JqueryModule.prototype.getDefaultOptionName = function () {
    return null;
  };
  /**
   * Initialization method.
   */


  JqueryModule.prototype.doInit = function () {
    if (!this.$element || utils_1.isUndefined(this.$element.jquery)) {
      console.error("You must set the root DOM element of a JQuery plugin by calling setElement(JQuery) with a JQuery object.");
      return;
    }
  };
  /**
   * Create DOM bindings.
   */


  JqueryModule.prototype.bind = function () {// Override me
  };
  /**
   * Remove DOM bindings.
   */


  JqueryModule.prototype.unbind = function () {// Override me
  };
  /**
   * Method called after the initialization is done.
   */


  JqueryModule.prototype.afterInit = function () {
    this.bind();
  };
  /**
   * Gets the whole object of options.
   */


  JqueryModule.prototype.getOptions = function () {
    return this.options;
  };
  /**
   * Called when the value of an option changes.
   * Note, this method is not called while the initialization is not finished.
   */


  JqueryModule.prototype.onOptionChange = function (optionName, oldValue, newValue) {// Override me
  };
  /**
   * Gets the default options object.
   * Override this to add custom options.
   */


  JqueryModule.prototype.getDefaultOptions = function () {
    return {};
  };
  /**
   * Checks whether if the component is in a specific state or not.
   */


  JqueryModule.prototype.isInState = function (name) {
    return this.statesHolder.current[name] && this.statesHolder.current[name] > 0;
  };
  /**
   * Enters a state.
   */


  JqueryModule.prototype.enterState = function (name) {
    var tags = [name].concat(this.statesHolder.tags[name] || []);

    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
      var tag = tags_1[_i];

      if (typeof this.statesHolder.current[tag] === "undefined") {
        this.statesHolder.current[tag] = 0;
      }

      this.statesHolder.current[tag]++;
    }
  };
  /**
   * Leaves a state.
   *
   * @param {string}  name
   * @param {boolean} absolute (optional, default: false) if true, the state counter is set to 0, no matter is value
   */


  JqueryModule.prototype.leaveState = function (name, absolute) {
    if (absolute === void 0) {
      absolute = false;
    }

    var tags = [name].concat(this.statesHolder.tags[name] || []);

    for (var _i = 0, tags_2 = tags; _i < tags_2.length; _i++) {
      var tag = tags_2[_i];

      if (typeof this.statesHolder.current[tag] !== "undefined") {
        if (absolute) {
          this.statesHolder.current[tag] = 0;
        } else {
          this.statesHolder.current[tag]--;
        }
      }
    }
  };
  /**
   * Registers an event or state.
   *
   * @param {string} name name of the state
   * @param {object} tags tags associated with it. If tags are already defined, new ones will be added to the list.
   */


  JqueryModule.prototype.registerStateTags = function (name, tags) {
    tags = utils_1.ensureArray(tags);

    if (typeof this.statesHolder.tags[name] === "undefined") {
      this.statesHolder.tags[name] = [];
    }

    for (var _i = 0, tags_3 = tags; _i < tags_3.length; _i++) {
      var candidate = tags_3[_i];

      if (this.statesHolder.tags[name].indexOf(candidate) < 0) {
        this.statesHolder.tags[name].push(candidate);
      }
    }
  };

  var JqueryModule_1;
  /**
   * Basic list of states.
   */

  JqueryModule.STATES = {
    /**
     * Means the object is created and the initialization has been called.
     */
    CONSTRUCTED: "constructed",

    /**
     * The object is currently on initialization, not yet finished.
     */
    INITIALIZING: "initializing",

    /**
     * The object is initialized, ready to be used.
     */
    INITIALIZED: "initialized",

    /**
     * The object is busy doing some processing.
     */
    BUZY: "buzy"
  };
  JqueryModule = JqueryModule_1 = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__metadata("design:paramtypes", [])], JqueryModule);
  return JqueryModule;
}();

exports.JqueryModule = JqueryModule;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/jquery/jquery-modules-manager.ts":
/*!****************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/jquery/jquery-modules-manager.ts ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JqueryModulesManagerSymbol = exports.JqueryModulesManager = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var object_1 = __webpack_require__(/*! essentials/utils/object */ "./assets/essentials/core/scripts/ts/utils/object.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var camelCase = __webpack_require__(/*! lodash/camelCase */ "./node_modules/lodash/camelCase.js");

var kebabCase = __webpack_require__(/*! lodash/kebabCase */ "./node_modules/lodash/kebabCase.js");

var trim = __webpack_require__(/*! lodash/trim */ "./node_modules/lodash/trim.js");
/**
 * Manages modules created using [jqm-*] attributes in the DOM.
 */


var JqueryModulesManager =
/** @class */
function () {
  function JqueryModulesManager() {
    /**
     * List of attributes selectors with the symbol of their associated module.
     */
    this.modulesAttributeSelectors = null;
    /**
     * List of instantiated modules.
     */

    this.modules = [];
    /**
     * Holds if a scan is running.
     */

    this.scanning = false;
    /**
     * True if a scan was asked while is scan was running.
     */

    this.scanInQueue = false;
  }

  JqueryModulesManager_1 = JqueryModulesManager;
  /**
   * Scan the DOM in the search of [jqm-*] attributes and create the VueJS components associated.
   */

  JqueryModulesManager.prototype.scan = function () {
    if (this.scanning) {
      this.scanInQueue = true;
      return;
    }

    this.scanning = true;
    this.doScan();
    this.scanning = false;

    if (this.scanInQueue) {
      this.scanInQueue = false;
      window.setTimeout(utils_1.proxy(this.scan, this));
    }
  };
  /**
   * Do the actual scanning thing.
   */


  JqueryModulesManager.prototype.doScan = function () {
    var that = this;

    if (this.modulesAttributeSelectors === null) {
      this.modulesAttributeSelectors = this.computeModulesAttributeSelectors();
    }

    for (var selector in this.modulesAttributeSelectors) {
      if (!this.modulesAttributeSelectors.hasOwnProperty(selector)) {
        continue;
      }

      $("[" + selector + "]").each(function (attrName, moduleSymbol) {
        return function () {
          var $el = $(this);
          var attrValue = trim($el.attr(attrName));
          var dataName = camelCase(attrName);
          var moduleInstance = container_1.Container.getContainer().get(moduleSymbol);
          var options = {};

          if (!utils_1.isUndefined($el.data(attrName))) {
            console.error("Multiple initialization of the jQuery module \"" + object_1.getSymbolDescription(moduleSymbol) + "\".");
            return;
          }

          if (attrValue) {
            if (attrValue[0] === "{") {
              try {
                options = JSON.parse(attrValue);

                if (_typeof(options) !== "object") {
                  options = {};
                }
              } catch (e) {
                console.error("Failed to decode options of the jQuery module \"" + object_1.getSymbolDescription(moduleSymbol) + "\". Please provide a valid JSON object.");
                return;
              }
            } else {
              var defaultOptionName = moduleInstance.getDefaultOptionName();

              if (utils_1.isString(defaultOptionName)) {
                options[defaultOptionName] = attrValue;
              } else {
                console.error("No default option name has been defined for the jQuery module \"" + object_1.getSymbolDescription(moduleSymbol) + "\".");
              }
            }
          }

          $el.removeAttr(attrName);
          moduleInstance.setElement($el);
          moduleInstance.initialize(options);
          $el.data(dataName, moduleInstance);
          that.modules.push({
            $element: $el,
            dataName: dataName,
            instance: moduleInstance,
            selector: attrName,
            symbol: moduleSymbol
          });
        };
      }(selector, this.modulesAttributeSelectors[selector]));
    }
  };
  /**
   * Create an object containing:
   *   - as key: an HTML attribute
   *   - as value: the symbol corresponding to the module that should be created if the HTML attribute is found.
   *
   * @returns {object}
   */


  JqueryModulesManager.prototype.computeModulesAttributeSelectors = function () {
    var output = {};
    var symbols = container_1.Container.getModulesSymbols();

    for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
      var item = symbols_1[_i];
      var attrName = JqueryModulesManager_1.MODULES_HTML_ATTRIBUTES_PREFIX + kebabCase(object_1.getSymbolDescription(item));
      output[attrName] = item;
    }

    return output;
  };

  var JqueryModulesManager_1;
  JqueryModulesManager.MODULES_HTML_ATTRIBUTES_PREFIX = "jqm-";
  JqueryModulesManager = JqueryModulesManager_1 = tslib_1.__decorate([inversify_1.injectable()], JqueryModulesManager);
  return JqueryModulesManager;
}();

exports.JqueryModulesManager = JqueryModulesManager;
exports.JqueryModulesManagerSymbol = Symbol("JqueryModulesManager");
container_1.Container.registerService(exports.JqueryModulesManagerSymbol, JqueryModulesManager);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/jquery/modules/vue-app.ts":
/*!*********************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/jquery/modules/vue-app.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VueAppSymbol = exports.VueApp = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var constants_1 = __webpack_require__(/*! essentials/constants */ "./assets/essentials/core/scripts/ts/constants.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var jquery_module_1 = __webpack_require__(/*! essentials/jquery/jquery-module */ "./assets/essentials/core/scripts/ts/jquery/jquery-module.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var vue_1 = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

var VueApp =
/** @class */
function (_super) {
  tslib_1.__extends(VueApp, _super);

  function VueApp() {
    var _this = _super.call(this) || this;

    _this.vue = null;
    return _this;
  }

  VueApp_1 = VueApp;
  /**
   * Gets the object holding global components.
   */

  VueApp.GetGlobalComponents = function () {
    return VueApp_1.COMPONENTS._global;
  };
  /**
   * Register a VueJS component.
   */


  VueApp.RegisterComponent = function (name, component, group) {
    if (group === void 0) {
      group = VueApp_1.DEFAULT_GROUP;
    }

    if (utils_1.isUndefined(VueApp_1.COMPONENTS[group])) {
      VueApp_1.COMPONENTS[group] = {};
    }

    VueApp_1.COMPONENTS[group][name] = component;
  };
  /**
   * Register a VueJS component that must be available in all apps.
   */


  VueApp.RegisterGlobalComponent = function (name, component) {
    VueApp_1.COMPONENTS._global[name] = component;
  };
  /**
   * Gets the object holding global directives.
   */


  VueApp.GetGlobalDirectives = function () {
    return VueApp_1.DIRECTIVES._global;
  };
  /**
   * Register a VueJS directive.
   */


  VueApp.RegisterDirective = function (name, directive, group) {
    if (group === void 0) {
      group = VueApp_1.DEFAULT_GROUP;
    }

    if (utils_1.isUndefined(VueApp_1.DIRECTIVES[group])) {
      VueApp_1.DIRECTIVES[group] = {};
    }

    VueApp_1.DIRECTIVES[group][name] = directive;
  };
  /**
   * Register a VueJS directive that must be available in all apps.
   */


  VueApp.RegisterGlobalDirective = function (name, directive) {
    VueApp_1.DIRECTIVES._global[name] = directive;
    vue_1["default"].directive(name, directive);
  };
  /**
   * Register a global VueJS option that will be passed to every Vue instance.
   */


  VueApp.SetVueOption = function (name, value) {
    VueApp_1.OPTIONS[name] = value;
  };
  /**
   * @inheritDoc
   */


  VueApp.prototype.getDefaultOptionName = function () {
    return 'group';
  };
  /**
   * @inheritDoc
   */


  VueApp.prototype.getDefaultOptions = function () {
    return {
      // Name of the group of components to include.
      group: VueApp_1.DEFAULT_GROUP
    };
  };
  /**
   * @inheritDoc
   */


  VueApp.prototype.doInit = function () {
    if (this.vue !== null) {
      throw new Error('You cannot call setElement() twice on a vue module.');
    }

    var options = this.mergeVueOptions({
      beforeCreate: utils_1.proxy(this.beforeCreate, this),
      created: utils_1.proxy(this.created, this)
    }, this.getVueOptions(), {
      el: this.$element.get(0),
      delimiters: constants_1.Constants.Get('DELIMITERS')
    });
    this.vue = new vue_1["default"](options);
  };
  /**
   * **VueJS lifecycle event**
   *
   * Called synchronously immediately after the instance has been initialized,
   * before data observation and event/watcher setup.
   */


  VueApp.prototype.beforeCreate = function () {};
  /**
   * **VueJS lifecycle event**
   *
   * Called synchronously after the instance is created.
   * At this stage, the instance has finished processing the options which means the following have been set up:
   * data observation, computed properties, methods, watch/event callbacks.
   *
   * However, the mounting phase has not been started, and the $el property will not be available yet.
   */


  VueApp.prototype.created = function () {};
  /**
   * Build an object containing user defined options.
   */


  VueApp.prototype.getVueOptions = function () {
    var options = {};
    var group = this.getOption('group');
    var groupComponents = !utils_1.isUndefined(VueApp_1.COMPONENTS[group]) ? VueApp_1.COMPONENTS[group] : {};
    var groupDirectives = !utils_1.isUndefined(VueApp_1.DIRECTIVES[group]) ? VueApp_1.DIRECTIVES[group] : {};
    options.components = Object.assign(VueApp_1.COMPONENTS._global, groupComponents);
    options.directives = Object.assign(VueApp_1.DIRECTIVES._global, groupDirectives);
    options = Object.assign(options, VueApp_1.OPTIONS);
    return options;
  };
  /**
   * Merge multiple arrays of vue options together.
   *
   * @param args
   */


  VueApp.prototype.mergeVueOptions = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var output = {};

    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
      var arg = args_1[_a];

      for (var key in arg) {
        if (!arg.hasOwnProperty(key)) {
          continue;
        }

        if (key === 'components') {
          if (!utils_1.isObject(output.components)) {
            output.components = {};
          }

          for (var componentName in arg[key]) {
            if (arg[key].hasOwnProperty(componentName)) {
              output.components[componentName] = arg[key][componentName];
            }
          }
        } else {
          output[key] = arg[key];
        }
      }
    }

    return output;
  };

  var VueApp_1; // Static vars

  VueApp.DEFAULT_GROUP = 'default';
  VueApp.COMPONENTS = {
    _global: {},
    "default": {}
  };
  VueApp.DIRECTIVES = {
    _global: {},
    "default": {}
  };
  VueApp.OPTIONS = {};
  VueApp = VueApp_1 = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__metadata("design:paramtypes", [])], VueApp);
  return VueApp;
}(jquery_module_1.JqueryModule);

exports.VueApp = VueApp;
exports.VueAppSymbol = Symbol("VueApp");
container_1.Container.registerModule(exports.VueAppSymbol, VueApp);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/jquery/strip-xssi.ts":
/*!****************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/jquery/strip-xssi.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utils_1 = __webpack_require__(/*! essentials/network/utils */ "./assets/essentials/core/scripts/ts/network/utils.ts");
/**
 * When the API respond with an array, a prefix is added to prevent XSSI attacks.
 * This filter is here to take it off or jQuery will crash when parsing the payload.
 */


jQuery.ajaxSetup({
  dataFilter: function dataFilter(input) {
    return utils_1.stripXssiPrefix(input);
  }
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/log/constants.ts":
/*!************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/log/constants.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogLevel = void 0;
/**
 * Defines the logs levels.
 */

var LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["NONE"] = 0] = "NONE";
  LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
  LogLevel[LogLevel["INFO"] = 2] = "INFO";
  LogLevel[LogLevel["SUCCESS"] = 3] = "SUCCESS";
  LogLevel[LogLevel["WARNING"] = 4] = "WARNING";
  LogLevel[LogLevel["ERROR"] = 5] = "ERROR";
  LogLevel[LogLevel["ALL"] = 6] = "ALL";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/log/index.ts":
/*!********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/log/index.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

tslib_1.__exportStar(__webpack_require__(/*! ./constants */ "./assets/essentials/core/scripts/ts/log/constants.ts"), exports);

tslib_1.__exportStar(__webpack_require__(/*! ./logger.service */ "./assets/essentials/core/scripts/ts/log/logger.service.ts"), exports);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/log/logger.service.ts":
/*!*****************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/log/logger.service.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");

__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");

__webpack_require__(/*! core-js/modules/es.array.join */ "./node_modules/core-js/modules/es.array.join.js");

__webpack_require__(/*! core-js/modules/es.array.splice */ "./node_modules/core-js/modules/es.array.splice.js");

__webpack_require__(/*! core-js/modules/es.date.now */ "./node_modules/core-js/modules/es.date.now.js");

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerServiceSymbol = exports.LoggerService = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var trim = __webpack_require__(/*! lodash/trim */ "./node_modules/lodash/trim.js");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var object_1 = __webpack_require__(/*! essentials/utils/object */ "./assets/essentials/core/scripts/ts/utils/object.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var shared_configuration_1 = __webpack_require__(/*! ../config/shared-configuration */ "./assets/essentials/core/scripts/ts/config/shared-configuration.ts");

var storage_1 = __webpack_require__(/*! ../storage */ "./assets/essentials/core/scripts/ts/storage/index.ts");

var constants_1 = __webpack_require__(/*! ./constants */ "./assets/essentials/core/scripts/ts/log/constants.ts");

var LoggerService =
/** @class */
function () {
  function LoggerService(storage, config) {
    this.storage = storage;
    this.config = config;
    this.logs = [];
    this.persistQueue = [];
    this.isLoaded = false;
    this.isFlushing = false;
    this.loadingPromise = null;
    this.lastFlushTime = null;
    this.nextFlushTimerId = null;
    this.isProd = this.config.env === 'prod';
  }
  /**
   * Add an deubg log.
   */


  LoggerService.prototype.debug = function (message, extra) {
    if (this.isProd) {
      return;
    }

    this.add(constants_1.LogLevel.DEBUG, message, object_1.extend(extra || {}, {
      trace: this.getCallerName(3)
    }));
  };
  /**
   * Add an info log.
   */


  LoggerService.prototype.info = function (message, extra) {
    this.add(constants_1.LogLevel.INFO, message, extra || null);
  };
  /**
   * Add a log indicating the success of an operation.
   */


  LoggerService.prototype.success = function (message, extra) {
    this.add(constants_1.LogLevel.SUCCESS, message, extra || null);
  };
  /**
   * Add a warning log.
   */


  LoggerService.prototype.warning = function (message, extra) {
    this.add(constants_1.LogLevel.WARNING, message, extra || null);
  };
  /**
   * Add an error log.
   */


  LoggerService.prototype.error = function (message, extra) {
    this.add(constants_1.LogLevel.ERROR, message, extra || null);
  };
  /**
   * Clear the logs.
   */


  LoggerService.prototype.clear = function () {
    this.logs = [];
    this.persistQueue = [];
    this.storage.remove(this.config.debug.logs.storageKey).then(function () {// Don't care about the result.
    }, function () {// Don't care about the result.
    });
  };
  /**
   * Load existing logs from the storage.
   *
   * The loading can never fail.
   * If an error occurs when trying to fetch the logs or to decode the result, the error is ignored and
   * an empty array will be sent as a result.
   *
   * Logs are an optional feature, a debug feature.
   * No matter what happens, the logger service must NEVER prevent the application to run or notify the user of any problem.
   */


  LoggerService.prototype.load = function () {
    var _this = this;

    if (this.loadingPromise !== null) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise(function (resolve, reject) {
      var onFinish = function onFinish() {
        _this.isLoaded = true;
        _this.loadingPromise = null;
        resolve(_this.logs);
      };

      _this.storage.get(_this.config.debug.logs.storageKey).then(function (result) {
        try {
          var decoded = JSON.parse(result);
          _this.logs = utils_1.ensureArray(decoded);
        } catch (e) {
          _this.logs = [];
        }

        onFinish();
      }, function () {
        _this.logs = [];
        onFinish();
      });
    });
    return this.loadingPromise;
  };
  /**
   * Get all logs including non yet persisted ones.
   */


  LoggerService.prototype.getAll = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this.load().then(function (items) {
        for (var _i = 0, _a = _this.persistQueue; _i < _a.length; _i++) {
          var log = _a[_i];
          items.push(log);
        }

        resolve(items);
      })["catch"](function (error) {
        resolve(_this.persistQueue.concat([{
          l: constants_1.LogLevel.ERROR,
          e: {
            error: error
          },
          m: 'Failed to get logs, storage may not be ready yet.'
        }]));
      });
    });
  };
  /**
   * Add a new log.
   */


  LoggerService.prototype.add = function (level, message, extra) {
    var _this = this;

    if (level < this.config.debug.logs.level) {
      return;
    }

    if (level === constants_1.LogLevel.ERROR) {
      console.error(message);
    } else if (level === constants_1.LogLevel.WARNING) {
      console.warn(message);
    } else {
      console.log(message);
    }

    this.persistQueue.push({
      l: level,
      m: utils_1.isString(message) ? message.substring(0, 255) : null,
      e: extra ? object_1.prepareObjectForDump(extra, 5) : null
    });

    if (this.lastFlushTime === null || Date.now() - this.lastFlushTime >= this.config.debug.logs.storageWriteInterval) {
      this.flush();
    } else if (this.nextFlushTimerId === null) {
      var delay = Math.max(0, this.config.debug.logs.storageWriteInterval - (Date.now() - this.lastFlushTime));
      this.nextFlushTimerId = setTimeout(function () {
        _this.nextFlushTimerId = null;

        _this.flush();
      }, delay);
    }
  };
  /**
   * Flush logs in the persist queue into the storage.
   */


  LoggerService.prototype.flush = function () {
    var _this = this;

    if (this.isFlushing) {
      return;
    }

    if (!this.isLoaded) {
      this.load();
    }

    this.isFlushing = true;

    if (this.loadingPromise !== null) {
      this.loadingPromise.then(function () {
        _this.isFlushing = false;

        _this.flush();
      });
      return;
    }

    for (var _i = 0, _a = this.persistQueue; _i < _a.length; _i++) {
      var log = _a[_i];

      if (this.logs.length >= this.config.debug.logs.maximumCount) {
        this.logs.shift();
      }

      this.logs.push(log);
    }

    this.persistQueue = [];
    this.storage.set(this.config.debug.logs.storageKey, JSON.stringify(this.logs)).then(function () {
      _this.isFlushing = false;
      _this.lastFlushTime = Date.now();
    }, function () {
      // Ignore the error.
      _this.isFlushing = false;
    });
  };
  /**
   * Try to get the function and class name that called the logger.
   */


  LoggerService.prototype.getCallerName = function (index) {
    var e = new Error();

    if (!e.stack) {
      try {
        // IE requires the Error to actually be thrown or else the
        // Error's 'stack' property is undefined.
        throw e;
      } catch (e) {
        if (!e.stack) {
          return null; // IE < 10, likely
        }
      }
    }

    var stack = e.stack.toString().split(/\r\n|\n/);

    if (utils_1.isArray(stack) && !utils_1.isUndefined(stack[index])) {
      var str = stack[index];
      var parenthesisPos = str.indexOf('(');

      if (parenthesisPos > 0 && utils_1.isString(str)) {
        str = str.substring(0, parenthesisPos);
      }

      var parts = str.split('.');

      if (parts.length >= 2) {
        parts = parts.splice(parts.length - 2, 2);
      }

      return trim(parts.join(':').replace(/\s*at\s+/, ''));
    }

    return null;
  };

  LoggerService = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__param(0, inversify_1.inject(storage_1.StorageServiceSymbol)), tslib_1.__param(1, inversify_1.inject(shared_configuration_1.SharedConfigurationSymbol)), tslib_1.__metadata("design:paramtypes", [storage_1.StorageService, shared_configuration_1.SharedConfiguration])], LoggerService);
  return LoggerService;
}();

exports.LoggerService = LoggerService;
exports.LoggerServiceSymbol = Symbol("LoggerService");
container_1.Container.registerService(exports.LoggerServiceSymbol, LoggerService);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/constants.ts":
/*!****************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/constants.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpResponseStatus = exports.HttpMethods = void 0;
/**
 * Basic HTTP methods.
 * The list is not meant to be exhaustive, it only contains what's being used.
 */

var HttpMethods;

(function (HttpMethods) {
  HttpMethods["GET"] = "GET";
  HttpMethods["POST"] = "POST";
  HttpMethods["PUT"] = "PUT";
  HttpMethods["DELETE"] = "DELETE";
  HttpMethods["OPTIONS"] = "OPTIONS";
})(HttpMethods = exports.HttpMethods || (exports.HttpMethods = {}));
/**
 * Different status of the response.
 */


var HttpResponseStatus;

(function (HttpResponseStatus) {
  HttpResponseStatus[HttpResponseStatus["Pending"] = 0] = "Pending";
  HttpResponseStatus[HttpResponseStatus["Success"] = 1] = "Success";
  HttpResponseStatus[HttpResponseStatus["Error"] = 2] = "Error";
  HttpResponseStatus[HttpResponseStatus["Canceled"] = 3] = "Canceled";
})(HttpResponseStatus = exports.HttpResponseStatus || (exports.HttpResponseStatus = {}));

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/error/authentication.error.ts":
/*!*********************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/error/authentication.error.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticationError = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var http_error_1 = __webpack_require__(/*! ./http.error */ "./assets/essentials/core/scripts/ts/network/error/http.error.ts");
/**
 * Error indicating the request cannot be performed by the current user,
 * either because he's not authenticated at all or because he has insufficient access rights.
 */


var AuthenticationError =
/** @class */
function (_super) {
  tslib_1.__extends(AuthenticationError, _super);

  function AuthenticationError() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return AuthenticationError;
}(http_error_1.HttpError);

exports.AuthenticationError = AuthenticationError;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/error/cancel.error.ts":
/*!*************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/error/cancel.error.ts ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancelError = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var http_error_1 = __webpack_require__(/*! ./http.error */ "./assets/essentials/core/scripts/ts/network/error/http.error.ts");
/**
 * Error thrown when rejecting a promise associated with a canceled request.
 */


var CancelError =
/** @class */
function (_super) {
  tslib_1.__extends(CancelError, _super);

  function CancelError() {
    return _super.call(this, 0) || this;
  }

  return CancelError;
}(http_error_1.HttpError);

exports.CancelError = CancelError;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/error/http.error.ts":
/*!***********************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/error/http.error.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpError = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var error_1 = __webpack_require__(/*! essentials/error */ "./assets/essentials/core/scripts/ts/error/index.ts");
/**
 * Error relative to an http request.
 */


var HttpError =
/** @class */
function (_super) {
  tslib_1.__extends(HttpError, _super);

  function HttpError(status, error, message, payload, previous) {
    var _this = _super.call(this, message, previous) || this;

    _this.status = status;
    _this.error = error;
    _this.payload = payload;
    return _this;
  }
  /**
   * Create an HttpError instance from a mixed input.
   * Input can be:
   *   - a string
   *   - an Error object
   *   - an AppError object
   *   - a plain object containing a "message" key
   *   - an HttpErrorResponse
   */


  HttpError.create = function (input, defaultMessage, payload) {
    if (defaultMessage === void 0) {
      defaultMessage = 'Unknown error';
    }

    if (payload === void 0) {
      payload = null;
    }

    if (input instanceof HttpError) {
      return input;
    }

    if (input instanceof error_1.AppError) {
      return new HttpError(0, null, input.message, payload, input);
    } // if (input instanceof HttpErrorResponse) {
    //     let message: any = input.error;
    //     if (isObject(message)) {
    //         message = isString(message.message) ? message.message : 'Unknown error.';
    //     }
    //     return new HttpError(input.status, input.error, ensureString(message));
    // }


    if (utils_1.isString(input)) {
      return new HttpError(0, null, input, payload);
    }

    if (utils_1.isObject(input) && utils_1.isString(input.message)) {
      return new HttpError(0, null, input.message, payload);
    }

    return new HttpError(0, null, defaultMessage, payload);
  };

  return HttpError;
}(error_1.AppError);

exports.HttpError = HttpError;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/error/network.error.ts":
/*!**************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/error/network.error.ts ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkError = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var error_1 = __webpack_require__(/*! essentials/error */ "./assets/essentials/core/scripts/ts/error/index.ts");
/**
 * Error indicating the server cannot be contacted.
 */


var NetworkError =
/** @class */
function (_super) {
  tslib_1.__extends(NetworkError, _super);

  function NetworkError() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return NetworkError;
}(error_1.AppError);

exports.NetworkError = NetworkError;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/http-request.ts":
/*!*******************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/http-request.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpRequest = void 0;

var HttpRequest =
/** @class */
function () {
  /**
   * Create a Request object.
   *
   * @param method        HTTP method.
   * @param url           Ready to use url.
   * @param payload       Body of the request (optional).
   * @param headers       Additional headers to send with the request.
   * @param maxRetryCount Maximum number of time the request can fail because of a network error or some other non definitive error
   */
  function HttpRequest(method, url, payload, headers, maxRetryCount) {
    if (payload === void 0) {
      payload = null;
    }

    if (headers === void 0) {
      headers = {};
    }

    if (maxRetryCount === void 0) {
      maxRetryCount = 3;
    }

    this.method = method;
    this.url = url;
    this.payload = payload;
    this.headers = headers;
    this.maxRetryCount = maxRetryCount;
  }

  return HttpRequest;
}();

exports.HttpRequest = HttpRequest;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/http-response.ts":
/*!********************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/http-response.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpResponse = void 0;

var constants_1 = __webpack_require__(/*! essentials/network/constants */ "./assets/essentials/core/scripts/ts/network/constants.ts");

var HttpResponse =
/** @class */
function () {
  function HttpResponse(status) {
    var _this = this;

    if (status === void 0) {
      status = constants_1.HttpResponseStatus.Pending;
    }

    this.id = ++HttpResponse.IdIncrement;
    this.httpStatusCode = 0;
    this.httpStatusText = '';
    this.error = null;
    this.result = null;
    this.rawResult = null;
    this.rawResultType = 'text';
    this.promise = null;
    this.setStatus(status);

    this.cancel = function () {
      // Simply mark the request as canceled is enough here because if the "cancel()" method
      // has not yet been overridden by the HttpService it means that the request has not started yet.
      // The HttpService will check the flag before doing the request.
      console.warn('CANCEL via original callback', _this.id);

      _this.setStatus(constants_1.HttpResponseStatus.Canceled);
    };
  }
  /**
   * Update the response's status.
   */


  HttpResponse.prototype.setStatus = function (status) {
    this.status = status;
    this.isPending = this.status === constants_1.HttpResponseStatus.Pending;
    this.isSuccess = this.status === constants_1.HttpResponseStatus.Success;
    this.isError = this.status === constants_1.HttpResponseStatus.Error;
    this.isCanceled = this.status === constants_1.HttpResponseStatus.Canceled;
  };
  /**
   * Copy the state of another response into this one, except the promise.
   */


  HttpResponse.prototype.syncWith = function (other) {
    this.setStatus(other.status);
    this.error = other.error;
    this.result = other.result;
    this.rawResult = other.rawResult;
    this.rawResultType = other.rawResultType;
    this.httpStatusText = other.httpStatusText;
    this.httpStatusCode = other.httpStatusCode;

    this.cancel = function () {
      other.cancel();
    };
  };
  /**
   * Wrap another response into this one, except the promise.
   */


  HttpResponse.prototype.decorate = function (decorated) {
    var _loop_1 = function _loop_1(key) {
      Object.defineProperty(this_1, key, {
        get: function get() {
          return decorated[key];
        },
        set: function set(value) {
          decorated[key] = value;
        }
      });
    };

    var this_1 = this;

    for (var _i = 0, _a = Object.keys(this); _i < _a.length; _i++) {
      var key = _a[_i];

      _loop_1(key);
    }
  };

  HttpResponse.IdIncrement = 0;
  return HttpResponse;
}();

exports.HttpResponse = HttpResponse;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/http.service.ts":
/*!*******************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/http.service.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");

__webpack_require__(/*! core-js/modules/es.array.splice */ "./node_modules/core-js/modules/es.array.splice.js");

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpServiceSymbol = exports.HttpService = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var network_error_1 = __webpack_require__(/*! ./error/network.error */ "./assets/essentials/core/scripts/ts/network/error/network.error.ts");

var authentication_error_1 = __webpack_require__(/*! ./error/authentication.error */ "./assets/essentials/core/scripts/ts/network/error/authentication.error.ts");

var http_error_1 = __webpack_require__(/*! ./error/http.error */ "./assets/essentials/core/scripts/ts/network/error/http.error.ts");

var network_watcher_service_1 = __webpack_require__(/*! ./network-watcher.service */ "./assets/essentials/core/scripts/ts/network/network-watcher.service.ts");

var log_1 = __webpack_require__(/*! ../log */ "./assets/essentials/core/scripts/ts/log/index.ts");

var error_1 = __webpack_require__(/*! ../error */ "./assets/essentials/core/scripts/ts/error/index.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var shared_configuration_1 = __webpack_require__(/*! essentials/config/shared-configuration */ "./assets/essentials/core/scripts/ts/config/shared-configuration.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var http_request_1 = __webpack_require__(/*! essentials/network/http-request */ "./assets/essentials/core/scripts/ts/network/http-request.ts");

var constants_1 = __webpack_require__(/*! essentials/network/constants */ "./assets/essentials/core/scripts/ts/network/constants.ts");

var http_response_1 = __webpack_require__(/*! essentials/network/http-response */ "./assets/essentials/core/scripts/ts/network/http-response.ts");

var utils_2 = __webpack_require__(/*! essentials/network/utils */ "./assets/essentials/core/scripts/ts/network/utils.ts");

var cancel_error_1 = __webpack_require__(/*! essentials/network/error/cancel.error */ "./assets/essentials/core/scripts/ts/network/error/cancel.error.ts");

var HttpService =
/** @class */
function () {
  function HttpService(config, networkWatcher, logger) {
    this.config = config;
    this.networkWatcher = networkWatcher;
    this.logger = logger;
    this.requestsQueue = [];
    this.queueProcessTimeout = null;
    this.networkWatcher.watch().subscribe(utils_1.proxy(this.onNetworkAvailabilityChange, this));
  }
  /**
   * Do a GET request.
   */


  HttpService.prototype.get = function (url, headers, retryCount) {
    if (retryCount === void 0) {
      retryCount = 3;
    }

    return this.request(new http_request_1.HttpRequest(constants_1.HttpMethods.GET, url, null, headers, retryCount));
  };
  /**
   * Do a POST request.
   */


  HttpService.prototype.post = function (url, body, headers, retryCount) {
    if (retryCount === void 0) {
      retryCount = 3;
    }

    return this.request(new http_request_1.HttpRequest(constants_1.HttpMethods.POST, url, body, headers, retryCount));
  };
  /**
   * Do a PUT request.
   */


  HttpService.prototype.put = function (url, body, headers, retryCount) {
    if (retryCount === void 0) {
      retryCount = 3;
    }

    return this.request(new http_request_1.HttpRequest(constants_1.HttpMethods.PUT, url, body, headers, retryCount));
  };
  /**
   * Do a DELETE request.
   */


  HttpService.prototype["delete"] = function (url, headers, retryCount) {
    if (retryCount === void 0) {
      retryCount = 3;
    }

    return this.request(new http_request_1.HttpRequest(constants_1.HttpMethods.DELETE, url, null, headers, retryCount));
  };
  /**
   * Do a request.
   */


  HttpService.prototype.request = function (request) {
    var _this = this;

    var response = new http_response_1.HttpResponse();
    response.setStatus(constants_1.HttpResponseStatus.Pending);
    response.promise = new Promise(function (resolve, reject) {
      // In case the request has been canceled right after the call to request()
      // and before the promise micro task have been executed.
      if (response.isCanceled) {
        reject(null);
        return;
      }

      response.cancel = function () {
        response.setStatus(constants_1.HttpResponseStatus.Canceled);
        reject(null);
      };

      _this.queueRequest(request, response, 0, resolve, reject);
    });
    return response;
  };
  /**
   * Do a request.
   */


  HttpService.prototype.executeQueuedRequest = function (request) {
    var _this = this; // The request may have been canceled while in queue, in such a case simply ignore it.
    // The promise has already been resolved by the default "cancel()" callback inside the HttpResponse.


    if (request.response.isCanceled) {
      this.removeFromQueue(request);
      return;
    }

    var jqueryAjaxOptions = {
      url: request.url,
      method: request.method,
      headers: request.headers || {},
      dataType: 'json',
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    };

    if (request.method === constants_1.HttpMethods.POST || request.method === constants_1.HttpMethods.PUT) {
      jqueryAjaxOptions.data = JSON.stringify(request.payload);
    }

    this.logger.debug('Execute request.', {
      request: request
    });
    request.jqXHR = $.ajax(jqueryAjaxOptions);
    request.isExecuting = true;
    request.jqXHR.then(function (response, statusText, jqXHR) {
      _this.logger.debug('Request success.', {
        request: request
      });

      _this.setRequestRawResult(jqXHR, request.response);

      request.response.result = response;
      request.response.setStatus(constants_1.HttpResponseStatus.Success);
      request.resolve(response);

      _this.removeFromQueue(request);
    })["catch"](function (jqXHR) {
      if (request.response.isCanceled) {
        return;
      }

      _this.setRequestRawResult(jqXHR, request.response);

      request.isExecuting = false;
      request.onError = true; // We may have a network issue, but we will have to be sure before choosing what to do.

      if (!_this.networkWatcher.isOnline()) {
        _this.logger.error('Request failed maybe because of a connection error.', {
          request: request,
          jqXHR: jqXHR
        });

        request.executeAt = new Date().getTime() + _this.config.network.connectionErrorRetryDelay;

        if (request.triesLeft > 0) {
          _this.logger.debug(request.triesLeft + ' tries left. Request will be queued again.');

          request.triesLeft--;
        } else {
          _this.logger.debug('Request has expired all its tries, rejecting its promise.');

          _this.removeFromQueue(request);

          _this.rejectRequest(request, new error_1.PublicAppError('Impossible de joindre le serveur.', new network_error_1.NetworkError(jqXHR.responseText)));

          return;
        }

        _this.scheduleQueueForProcess();

        return;
      }

      if (jqXHR.status === 401 && _this.config.network.reloadOnAuthenticationError) {
        window.location.reload();
        return;
      }

      if (jqXHR.status === 401 || jqXHR.status === 403) {
        _this.logger.error('Request failed because of an authentication error.', {
          request: request
        });

        _this.rejectRequest(request, new error_1.PublicAppError('Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.', new authentication_error_1.AuthenticationError(401)));
      } else if (jqXHR.status === 404) {
        _this.logger.error('Request failed because the url was not found.', {
          request: request,
          jqXHR: jqXHR
        });

        _this.rejectRequest(request, new error_1.PublicAppError('Resource non trouvée sur le serveur.', http_error_1.HttpError.create(jqXHR.statusText)));
      } else if (utils_1.isObject(jqXHR.responseJSON) && jqXHR.responseJSON.type.indexOf("PublicException", "Webeak\\Bundle\\EssentialBundle\\Exception\\PublicException") >= 0 && utils_1.isString(jqXHR.responseJSON.message)) {
        _this.rejectRequest(request, new error_1.PublicAppError(jqXHR.responseJSON.message, http_error_1.HttpError.create(jqXHR.statusText)));
      } else {
        _this.logger.error('Request failed for an unknown reason.', {
          request: request,
          jqXHR: jqXHR
        });

        _this.rejectRequest(request, new error_1.PublicAppError('Échec de la requête au serveur pour une erreur interne.', http_error_1.HttpError.create(jqXHR.statusText, 'Unknown reason', jqXHR.responseJSON)));
      }

      _this.removeFromQueue(request);
    }); // Setup the cancel callback.

    request.response.cancel = function () {
      request.jqXHR.abort();
      request.response.setStatus(constants_1.HttpResponseStatus.Canceled);
      request.reject(new cancel_error_1.CancelError());

      _this.removeFromQueue(request);
    };
  };
  /**
   * Mark the request as on error, reject its promise and set the error.
   */


  HttpService.prototype.rejectRequest = function (request, error) {
    request.response.setStatus(constants_1.HttpResponseStatus.Error);
    request.response.error = error;
    request.reject(error);
  };
  /**
   * Take the raw response form the server and assign it to the client response.
   */


  HttpService.prototype.setRequestRawResult = function (xhr, clientResponse) {
    clientResponse.httpStatusCode = xhr.status;
    clientResponse.httpStatusText = xhr.statusText;

    if (!utils_1.isNullOrUndefined(xhr.responseJSON)) {
      clientResponse.rawResult = utils_2.stripXssiPrefix(xhr.responseText);
      clientResponse.rawResultType = 'json';
      return;
    }

    var contentType = xhr.getResponseHeader("content-type") || '';
    clientResponse.rawResultType = contentType.indexOf('html') >= 0 ? 'html' : 'text';
    clientResponse.rawResult = xhr.responseText;
  };
  /**
   * Process available request and prepare the next process queue if the queue still contains request.
   */


  HttpService.prototype.processQueue = function () {
    this.logger.debug('Process queue.');
    var currentTime = new Date().getTime();

    for (var _i = 0, _a = this.requestsQueue; _i < _a.length; _i++) {
      var request = _a[_i];

      if (!request.isExecuting && request.executeAt <= currentTime) {
        this.executeQueuedRequest(request);
      }
    }

    this.scheduleQueueForProcess();
  };
  /**
   * Remove a request from the queue.
   */


  HttpService.prototype.removeFromQueue = function (request) {
    for (var i = 0; i < this.requestsQueue.length; ++i) {
      if (this.requestsQueue[i] === request) {
        this.logger.debug('Remove request from queue.', {
          request: request
        });
        this.requestsQueue.splice(i, 1);
        return;
      }
    }
  };
  /**
   * Queue a request for retry.
   */


  HttpService.prototype.queueRequest = function (request, response, executeAt, resolve, reject) {
    this.requestsQueue.push({
      method: request.method,
      url: request.url,
      payload: request.payload,
      headers: request.headers,
      triesLeft: request.maxRetryCount,
      executeAt: executeAt,
      resolve: resolve,
      reject: reject,
      isExecuting: false,
      onError: false,
      jqXHR: null,
      response: response
    });
    this.logger.debug('Queue http request', {
      request: this.requestsQueue[this.requestsQueue.length - 1]
    });
    this.scheduleQueueForProcess();
  };
  /**
   * Put a timeout to process the queue as soon as the less delayed request is available for retry.
   * A timeout will always be set even if no request ask for a delay.
   */


  HttpService.prototype.scheduleQueueForProcess = function () {
    var _this = this;

    if (this.queueProcessTimeout !== null || !this.requestsQueue.length) {
      return;
    }

    var currentTime = new Date().getTime();
    var delay = null;

    for (var _i = 0, _a = this.requestsQueue; _i < _a.length; _i++) {
      var request = _a[_i];

      if (request.isExecuting) {
        continue;
      }

      var delta = request.executeAt > 0 ? Math.max(0, request.executeAt - currentTime) : 0;

      if (delay === null || delay > delta) {
        delay = delta;
      }
    }

    if (delay !== null) {
      this.logger.debug('Waiting ' + delay + 'ms before processing http requests queue.');
      this.queueProcessTimeout = setTimeout(function () {
        _this.queueProcessTimeout = null;

        _this.processQueue();
      }, delay);
    }
  };
  /**
   * Called when the status on the internet connection changes.
   */


  HttpService.prototype.onNetworkAvailabilityChange = function (online) {
    if (online) {
      this.logger.info('Network retrieved, schedule the http requests queue for processing.');

      for (var _i = 0, _a = this.requestsQueue; _i < _a.length; _i++) {
        var queuedRequest = _a[_i];

        if (queuedRequest.onError) {
          queuedRequest.executeAt = 0;
        }
      }

      if (this.queueProcessTimeout !== null) {
        clearTimeout(this.queueProcessTimeout);
        this.queueProcessTimeout = null;
      }

      this.scheduleQueueForProcess();
    }
  };

  HttpService = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__param(0, inversify_1.inject(shared_configuration_1.SharedConfigurationSymbol)), tslib_1.__param(1, inversify_1.inject(network_watcher_service_1.NetworkWatcherServiceSymbol)), tslib_1.__param(2, inversify_1.inject(log_1.LoggerServiceSymbol)), tslib_1.__metadata("design:paramtypes", [shared_configuration_1.SharedConfiguration, network_watcher_service_1.NetworkWatcherService, log_1.LoggerService])], HttpService);
  return HttpService;
}();

exports.HttpService = HttpService;
exports.HttpServiceSymbol = Symbol("HttpService");
container_1.Container.registerService(exports.HttpServiceSymbol, HttpService);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/index.ts":
/*!************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/index.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

tslib_1.__exportStar(__webpack_require__(/*! ./http.service */ "./assets/essentials/core/scripts/ts/network/http.service.ts"), exports);

tslib_1.__exportStar(__webpack_require__(/*! ./network-watcher.service */ "./assets/essentials/core/scripts/ts/network/network-watcher.service.ts"), exports);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/network-watcher.service.ts":
/*!******************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/network-watcher.service.ts ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkWatcherServiceSymbol = exports.NetworkWatcherService = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var rxjs_1 = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var event_1 = __webpack_require__(/*! essentials/event */ "./assets/essentials/core/scripts/ts/event/index.ts");

var log_1 = __webpack_require__(/*! essentials/log */ "./assets/essentials/core/scripts/ts/log/index.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var NetworkWatcherService =
/** @class */
function () {
  function NetworkWatcherService(eventDispatcher, logger) {
    this.eventDispatcher = eventDispatcher;
    this.logger = logger;
    this.isSupported = utils_1.isObject(window.navigator);
    this.isOnlineAttr = this.isSupported ? window.navigator.onLine !== false : true;
    this.monitoringSubscription = null;
    this.onConnectionRetrievedFn = null;
    this.onConnectionLostFn = null;
    this.observers = [];
  }
  /**
   * Test if the current connection has access to the internet.
   */


  NetworkWatcherService.prototype.isOnline = function () {
    return this.isOnlineAttr;
  };
  /**
   * Start watching the network status.
   */


  NetworkWatcherService.prototype.watch = function () {
    var _this = this;

    this.logger.debug('Start watching the network...');

    if (this.onConnectionLostFn === null) {
      this.onConnectionRetrievedFn = utils_1.proxy(this.onConnectionRetrieved, this);
      this.onConnectionLostFn = utils_1.proxy(this.onConnectionLost, this);
      window.addEventListener('online', this.onConnectionRetrievedFn);
      window.addEventListener('offline', this.onConnectionLostFn);
    }

    return new rxjs_1.Observable(function (observer) {
      _this.observers.push(observer);
    });
  };
  /**
   * Stop watching the network.
   */


  NetworkWatcherService.prototype.unwatch = function () {
    if (this.onConnectionLostFn === null) {
      return;
    }

    this.logger.debug('Stop watching the network.');
    window.addEventListener('online', this.onConnectionRetrievedFn);
    window.addEventListener('offline', this.onConnectionLostFn);
  };
  /**
   * Called when the connection is lost.
   */


  NetworkWatcherService.prototype.onConnectionLost = function () {
    this.logger.info('Connection lost.');

    for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
      var observer = _a[_i];
      observer.next(false);
    }

    this.eventDispatcher.dispatch('network:offline');
    this.isOnlineAttr = false;
  };
  /**
   * Called when the connection becomes available again.
   */


  NetworkWatcherService.prototype.onConnectionRetrieved = function () {
    this.logger.info('Connection retrieved.');

    for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
      var observer = _a[_i];
      observer.next(true);
    }

    this.eventDispatcher.dispatch('network:online');
    this.isOnlineAttr = true;
  };

  NetworkWatcherService = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__param(0, inversify_1.inject(event_1.EventDispatcherServiceSymbol)), tslib_1.__param(1, inversify_1.inject(log_1.LoggerServiceSymbol)), tslib_1.__metadata("design:paramtypes", [event_1.EventDispatcherService, log_1.LoggerService])], NetworkWatcherService);
  return NetworkWatcherService;
}();

exports.NetworkWatcherService = NetworkWatcherService;
exports.NetworkWatcherServiceSymbol = Symbol("NetworkWatcherService");
container_1.Container.registerService(exports.NetworkWatcherServiceSymbol, NetworkWatcherService);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/network/utils.ts":
/*!************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/network/utils.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");

__webpack_require__(/*! core-js/modules/es.array.join */ "./node_modules/core-js/modules/es.array.join.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripXssiPrefix = exports.appendQueryParameters = exports.buildQueryParameters = void 0;
/**
 * Build the query parameters string for an url.
 *
 * For example:
 *   buildQueryParameters({
 *       param1: 'http://example.org/?a=12&b=55',
 *       param2: 99
 *   })
 *
 * will output:
 * ?param1=http%3A%2F%2Fexample.org%2F%Ffa%3D12%26b%3D55&param2=99
 */

function buildQueryParameters(obj) {
  var queryParametersArray = [];

  for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
    var key = _a[_i];
    queryParametersArray.push(key + '=' + encodeURIComponent(obj[key]));
  }

  if (queryParametersArray.length > 0) {
    return '?' + queryParametersArray.join('&');
  }

  return '';
}

exports.buildQueryParameters = buildQueryParameters;
/**
 * Construct a query parameter string from an key/value pair object and append it the an existing url.
 */

function appendQueryParameters(url, params) {
  var queryString = buildQueryParameters(params);
  var pos = url.indexOf('?');

  if (pos >= 0) {
    return url + '&' + queryString.substring(1);
  }

  return url + queryString;
}

exports.appendQueryParameters = appendQueryParameters;
/**
 * Remove the prefix set by the API when responding with an array to prevent XSSI attacks.
 */

function stripXssiPrefix(input) {
  var prefix = ")]}'\n";

  if (input.substring(0, prefix.length) === prefix) {
    return input.substring(prefix.length);
  }

  return input;
}

exports.stripXssiPrefix = stripXssiPrefix;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/storage/index.ts":
/*!************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/storage/index.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

tslib_1.__exportStar(__webpack_require__(/*! ./interface/storage.interface */ "./assets/essentials/core/scripts/ts/storage/interface/storage.interface.ts"), exports);

tslib_1.__exportStar(__webpack_require__(/*! ./service/storage.service */ "./assets/essentials/core/scripts/ts/storage/service/storage.service.ts"), exports);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/storage/interface/storage.interface.ts":
/*!**********************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/storage/interface/storage.interface.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/storage/service/cookies-driver.service.ts":
/*!*************************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/storage/service/cookies-driver.service.ts ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookiesDriverServiceSymbol = exports.CookiesDriverService = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var storage_service_1 = __webpack_require__(/*! ./storage.service */ "./assets/essentials/core/scripts/ts/storage/service/storage.service.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var CookiesDriverService =
/** @class */
function (_super) {
  tslib_1.__extends(CookiesDriverService, _super);

  function CookiesDriverService() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  CookiesDriverService_1 = CookiesDriverService;
  /**
   * Get the value associated with the given key.
   */

  CookiesDriverService.prototype.get = function (key) {
    return new Promise(function (resolve) {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + CookiesDriverService_1.PREFIX + key + '=');

      if (parts.length === 2) {
        resolve(parts.pop().split(';').shift());
      } else {
        resolve(null);
      }
    });
  };
  /**
   * Set the value for the given key.
   */


  CookiesDriverService.prototype.set = function (key, value) {
    return new Promise(function (resolve) {
      var date = new Date();
      date.setTime(date.getTime() + 4 * 365 * 24 * 60 * 60 * 1000);
      var expires = '; expires=' + date.toUTCString();
      document.cookie = CookiesDriverService_1.PREFIX + key + '=' + (value || '') + expires + '; path=/';
      resolve();
    });
  };
  /**
   * Remove any value associated with this key.
   */


  CookiesDriverService.prototype.remove = function (key) {
    return new Promise(function (resolve) {
      document.cookie = CookiesDriverService_1.PREFIX + key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      resolve();
    });
  };
  /**
   * Clear the entire key value store.
   */


  CookiesDriverService.prototype.clear = function () {
    var _this = this;

    return new Promise(function (resolve) {
      _this.keys().then(function (keys) {
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
          var key = keys_1[_i];

          _this.remove(key);
        }

        resolve();
      });
    });
  };
  /**
   * Gets how many keys are stored in the storage.
   */


  CookiesDriverService.prototype.length = function () {
    var _this = this;

    return new Promise(function (resolve) {
      _this.keys().then(function (keys) {
        resolve(keys.length);
      });
    });
  };
  /**
   * Gets the list of all keys stored in the storage.
   */


  CookiesDriverService.prototype.keys = function () {
    return new Promise(function (resolve) {
      var keys = [];
      var cookies = document.cookie.split(';'); // tslint:disable-next-line:prefer-for-of

      for (var i = 0; i < cookies.length; i++) {
        keys.push(cookies[i].split('=')[0]);
      }

      resolve(keys);
    });
  };
  /**
   * Gets the type of storage used.
   */


  CookiesDriverService.prototype.getDriverName = function () {
    return 'Browser (cookie storage)';
  };

  var CookiesDriverService_1;
  /**
   * Prefix to be able to differentiate between cookies managed by the storage and cookies who don't.
   */

  CookiesDriverService.PREFIX = '__scd_';
  CookiesDriverService = CookiesDriverService_1 = tslib_1.__decorate([inversify_1.injectable()], CookiesDriverService);
  return CookiesDriverService;
}(storage_service_1.StorageService);

exports.CookiesDriverService = CookiesDriverService;
exports.CookiesDriverServiceSymbol = Symbol("CookiesDriverService");
container_1.Container.registerService(exports.CookiesDriverServiceSymbol, CookiesDriverService);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/storage/service/local-storage-driver.service.ts":
/*!*******************************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/storage/service/local-storage-driver.service.ts ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalStorageDriverServiceSymbol = exports.LocalStorageDriverService = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var storage_1 = __webpack_require__(/*! essentials/storage */ "./assets/essentials/core/scripts/ts/storage/index.ts");

var LocalStorageDriverService =
/** @class */
function (_super) {
  tslib_1.__extends(LocalStorageDriverService, _super);

  function LocalStorageDriverService() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Get the value associated with the given key.
   */


  LocalStorageDriverService.prototype.get = function (key) {
    return new Promise(function (resolve) {
      resolve(window.localStorage.getItem(key));
    });
  };
  /**
   * Set the value for the given key.
   */


  LocalStorageDriverService.prototype.set = function (key, value) {
    return new Promise(function (resolve) {
      window.localStorage.setItem(key, value);
      resolve();
    });
  };
  /**
   * Remove any value associated with this key.
   */


  LocalStorageDriverService.prototype.remove = function (key) {
    return new Promise(function (resolve) {
      window.localStorage.removeItem(key);
      resolve();
    });
  };
  /**
   * Clear the entire key value store.
   */


  LocalStorageDriverService.prototype.clear = function () {
    return new Promise(function (resolve) {
      window.localStorage.clear();
      resolve();
    });
  };
  /**
   * Gets how many keys are stored in the storage.
   */


  LocalStorageDriverService.prototype.length = function () {
    return new Promise(function (resolve) {
      resolve(window.localStorage.length);
    });
  };
  /**
   * Gets the list of all keys stored in the storage.
   */


  LocalStorageDriverService.prototype.keys = function () {
    return new Promise(function (resolve) {
      var keys = [];

      for (var i = 0, c = localStorage.length; i < c; ++i) {
        keys.push(localStorage.key(i));
      }

      resolve(keys);
    });
  };
  /**
   * Gets the type of storage used.
   */


  LocalStorageDriverService.prototype.getDriverName = function () {
    return 'Browser (local storage)';
  };

  LocalStorageDriverService = tslib_1.__decorate([inversify_1.injectable()], LocalStorageDriverService);
  return LocalStorageDriverService;
}(storage_1.StorageService);

exports.LocalStorageDriverService = LocalStorageDriverService;
exports.LocalStorageDriverServiceSymbol = Symbol("LocalStorageDriverService");
container_1.Container.registerService(exports.LocalStorageDriverServiceSymbol, LocalStorageDriverService);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/storage/service/storage.service.ts":
/*!******************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/storage/service/storage.service.ts ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageServiceSymbol = exports.StorageService = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var StorageService =
/** @class */
function () {
  function StorageService() {}

  StorageService = tslib_1.__decorate([inversify_1.injectable()], StorageService);
  return StorageService;
}();

exports.StorageService = StorageService;
exports.StorageServiceSymbol = Symbol("StorageService");

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/storage/storage.factory.ts":
/*!**********************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/storage/storage.factory.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var local_storage_driver_service_1 = __webpack_require__(/*! ./service/local-storage-driver.service */ "./assets/essentials/core/scripts/ts/storage/service/local-storage-driver.service.ts");

var cookies_driver_service_1 = __webpack_require__(/*! ./service/cookies-driver.service */ "./assets/essentials/core/scripts/ts/storage/service/cookies-driver.service.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var storage_service_1 = __webpack_require__(/*! essentials/storage/service/storage.service */ "./assets/essentials/core/scripts/ts/storage/service/storage.service.ts");
/**
 * Factory creating the correct storage service instance depending on the platform.
 */


container_1.Container.registerFactory(storage_service_1.StorageServiceSymbol, function (context) {
  if (!utils_1.isUndefined(window.localStorage)) {
    return container_1.Container.getContainer().get(local_storage_driver_service_1.LocalStorageDriverServiceSymbol);
  }

  return container_1.Container.getContainer().get(cookies_driver_service_1.CookiesDriverServiceSymbol);
});

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/storage/var-holder.ts":
/*!*****************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/storage/var-holder.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VarHolder = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var error_1 = __webpack_require__(/*! essentials/error */ "./assets/essentials/core/scripts/ts/error/index.ts");

var inversify_1 = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");
/**
 * A generic key/value pair storage you can use to store data in memory.
 */


var VarHolder =
/** @class */
function () {
  function VarHolder() {
    this.storage = {};
  }
  /**
   * Returns the parameters.
   *
   * @return array An array of parameters
   */


  VarHolder.prototype.all = function () {
    return this.storage;
  };
  /**
   * Returns the parameter keys.
   *
   * @return array An array of parameter keys
   */


  VarHolder.prototype.keys = function () {
    return Object.keys(this.storage);
  };
  /**
   * Get a value stored in the storage.
   * You can give an array of keys to fetch in depth.
   */


  VarHolder.prototype.get = function (key, defaultValue) {
    if (defaultValue === void 0) {
      defaultValue = null;
    }

    var keys = utils_1.ensureArray(key);
    var storage = this.storage;

    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var k = keys_1[_i];

      if (!utils_1.isObject(storage[k]) || utils_1.isUndefined(storage[k])) {
        return defaultValue;
      }

      storage = storage[k];
    }

    return storage;
  };
  /**
   * Set a value in the storage.
   * You can give an array of keys to set a value deep in the object.
   */


  VarHolder.prototype.set = function (key, value) {
    var keys = utils_1.ensureArray(key);
    var storage = this.storage;

    for (var i = 0; i < keys.length - 1; ++i) {
      if (utils_1.isUndefined(storage[keys[i]])) {
        storage[keys[i]] = {};
      }

      if (!utils_1.isObject(storage[keys[i]])) {
        throw new error_1.AppError('The key "' + keys[i] + '" is already used by a non object value.');
      }

      storage = storage[keys[i]];
    }

    storage[keys[keys.length - 1]] = value;
  };
  /**
   * Replaces the current parameters by a new set.
   *
   * @param {object} parameters An array of parameters
   */


  VarHolder.prototype.replace = function (parameters) {
    this.storage = parameters;
  };
  /**
   * Adds parameters.
   *
   * @param {array} parameters An array of parameters
   */


  VarHolder.prototype.add = function (parameters) {
    for (var name_1 in parameters) {
      if (parameters.hasOwnProperty(name_1)) {
        this.storage[name_1] = parameters[name_1];
      }
    }
  };
  /**
   * Returns true if the parameter is defined.
   *
   * @param {string|string[]} key The key
   *
   * @return bool true if the parameter exists, false otherwise
   */


  VarHolder.prototype.has = function (key) {
    // We can't do:
    //   `this.get(key, undefined)`
    // because doing this will set the default value to `null` (the default value of the parameter).
    //
    // And I don't want to lose the ability to have the default value to null by default.
    // So the trick is to get the value once:
    var v = this.get(key); // If the value is null, it may not exist in the storage.

    if (v === null) {
      // But the value set by the user could be null, so do another get to be sure
      return this.get(key, '_') === null; // If the result is still null, the key was effectively set to null by the user.
    } // Otherwise the key exist.


    return true;
  };
  /**
   * Removes a parameter.
   *
   * @param {string} key The key
   */


  VarHolder.prototype.remove = function (key) {
    delete this.storage[key];
  };
  /**
   * Returns the number of parameters.
   *
   * @return {number}
   */


  VarHolder.prototype.count = function () {
    return Object.keys(this.storage).length;
  };

  VarHolder = tslib_1.__decorate([inversify_1.injectable(), tslib_1.__metadata("design:paramtypes", [])], VarHolder);
  return VarHolder;
}();

exports.VarHolder = VarHolder;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/base64.ts":
/*!***********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/base64.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.join */ "./node_modules/core-js/modules/es.array.join.js");

__webpack_require__(/*! core-js/modules/es.array-buffer.slice */ "./node_modules/core-js/modules/es.array-buffer.slice.js");

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/es.typed-array.uint8-array */ "./node_modules/core-js/modules/es.typed-array.uint8-array.js");

__webpack_require__(/*! core-js/modules/es.typed-array.copy-within */ "./node_modules/core-js/modules/es.typed-array.copy-within.js");

__webpack_require__(/*! core-js/modules/es.typed-array.every */ "./node_modules/core-js/modules/es.typed-array.every.js");

__webpack_require__(/*! core-js/modules/es.typed-array.fill */ "./node_modules/core-js/modules/es.typed-array.fill.js");

__webpack_require__(/*! core-js/modules/es.typed-array.filter */ "./node_modules/core-js/modules/es.typed-array.filter.js");

__webpack_require__(/*! core-js/modules/es.typed-array.find */ "./node_modules/core-js/modules/es.typed-array.find.js");

__webpack_require__(/*! core-js/modules/es.typed-array.find-index */ "./node_modules/core-js/modules/es.typed-array.find-index.js");

__webpack_require__(/*! core-js/modules/es.typed-array.for-each */ "./node_modules/core-js/modules/es.typed-array.for-each.js");

__webpack_require__(/*! core-js/modules/es.typed-array.from */ "./node_modules/core-js/modules/es.typed-array.from.js");

__webpack_require__(/*! core-js/modules/es.typed-array.includes */ "./node_modules/core-js/modules/es.typed-array.includes.js");

__webpack_require__(/*! core-js/modules/es.typed-array.index-of */ "./node_modules/core-js/modules/es.typed-array.index-of.js");

__webpack_require__(/*! core-js/modules/es.typed-array.iterator */ "./node_modules/core-js/modules/es.typed-array.iterator.js");

__webpack_require__(/*! core-js/modules/es.typed-array.join */ "./node_modules/core-js/modules/es.typed-array.join.js");

__webpack_require__(/*! core-js/modules/es.typed-array.last-index-of */ "./node_modules/core-js/modules/es.typed-array.last-index-of.js");

__webpack_require__(/*! core-js/modules/es.typed-array.map */ "./node_modules/core-js/modules/es.typed-array.map.js");

__webpack_require__(/*! core-js/modules/es.typed-array.reduce */ "./node_modules/core-js/modules/es.typed-array.reduce.js");

__webpack_require__(/*! core-js/modules/es.typed-array.reduce-right */ "./node_modules/core-js/modules/es.typed-array.reduce-right.js");

__webpack_require__(/*! core-js/modules/es.typed-array.reverse */ "./node_modules/core-js/modules/es.typed-array.reverse.js");

__webpack_require__(/*! core-js/modules/es.typed-array.set */ "./node_modules/core-js/modules/es.typed-array.set.js");

__webpack_require__(/*! core-js/modules/es.typed-array.slice */ "./node_modules/core-js/modules/es.typed-array.slice.js");

__webpack_require__(/*! core-js/modules/es.typed-array.some */ "./node_modules/core-js/modules/es.typed-array.some.js");

__webpack_require__(/*! core-js/modules/es.typed-array.sort */ "./node_modules/core-js/modules/es.typed-array.sort.js");

__webpack_require__(/*! core-js/modules/es.typed-array.subarray */ "./node_modules/core-js/modules/es.typed-array.subarray.js");

__webpack_require__(/*! core-js/modules/es.typed-array.to-locale-string */ "./node_modules/core-js/modules/es.typed-array.to-locale-string.js");

__webpack_require__(/*! core-js/modules/es.typed-array.to-string */ "./node_modules/core-js/modules/es.typed-array.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.base64decodeUrlSafe = exports.base64encodeUrlSafe = exports.base64decode = exports.base64encode = void 0;
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @see https://github.com/dankogai/js-base64/blob/master/base64.js
 */

var Base64 = function (global) {
  'use strict'; // existing version for noConflict()

  global = global || {};
  var _Base64 = global.Base64;
  var version = "2.5.2"; // if node.js and NOT React Native, we use Buffer

  var buffer;

  if ( true && module.exports) {
    try {
      buffer = eval("require('buffer').Buffer");
    } catch (err) {
      buffer = undefined;
    }
  } // constants


  var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  var b64tab = function (bin) {
    var t = {};

    for (var i = 0, l = bin.length; i < l; i++) {
      t[bin.charAt(i)] = i;
    }

    return t;
  }(b64chars);

  var fromCharCode = String.fromCharCode; // encoder stuff

  var cb_utob = function cb_utob(c) {
    var cc;

    if (c.length < 2) {
      cc = c.charCodeAt(0);
      return cc < 0x80 ? c : cc < 0x800 ? fromCharCode(0xc0 | cc >>> 6) + fromCharCode(0x80 | cc & 0x3f) : fromCharCode(0xe0 | cc >>> 12 & 0x0f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
    } else {
      cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
      return fromCharCode(0xf0 | cc >>> 18 & 0x07) + fromCharCode(0x80 | cc >>> 12 & 0x3f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
    }
  };

  var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;

  var utob = function utob(u) {
    return u.replace(re_utob, cb_utob);
  };

  var cb_encode = function cb_encode(ccc) {
    var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0),
        chars = [b64chars.charAt(ord >>> 18), b64chars.charAt(ord >>> 12 & 63), padlen >= 2 ? '=' : b64chars.charAt(ord >>> 6 & 63), padlen >= 1 ? '=' : b64chars.charAt(ord & 63)];
    return chars.join('');
  };

  var btoa = global.btoa ? function (b) {
    return global.btoa(b);
  } : function (b) {
    return b.replace(/[\s\S]{1,3}/g, cb_encode);
  };

  var _encode = function _encode(u) {
    var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
    return isUint8Array ? u.toString('base64') : btoa(utob(String(u)));
  };

  var encode = function encode(u, urisafe) {
    return !urisafe ? _encode(u) : _encode(String(u)).replace(/[+\/]/g, function (m0) {
      return m0 == '+' ? '-' : '_';
    }).replace(/=/g, '');
  };

  var encodeURI = function encodeURI(u) {
    return encode(u, true);
  }; // decoder stuff


  var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;

  var cb_btou = function cb_btou(cccc) {
    switch (cccc.length) {
      case 4:
        var cp = (0x07 & cccc.charCodeAt(0)) << 18 | (0x3f & cccc.charCodeAt(1)) << 12 | (0x3f & cccc.charCodeAt(2)) << 6 | 0x3f & cccc.charCodeAt(3),
            offset = cp - 0x10000;
        return fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00);

      case 3:
        return fromCharCode((0x0f & cccc.charCodeAt(0)) << 12 | (0x3f & cccc.charCodeAt(1)) << 6 | 0x3f & cccc.charCodeAt(2));

      default:
        return fromCharCode((0x1f & cccc.charCodeAt(0)) << 6 | 0x3f & cccc.charCodeAt(1));
    }
  };

  var btou = function btou(b) {
    return b.replace(re_btou, cb_btou);
  };

  var cb_decode = function cb_decode(cccc) {
    var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
        chars = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 0xff), fromCharCode(n & 0xff)];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
  };

  var _atob = global.atob ? function (a) {
    return global.atob(a);
  } : function (a) {
    return a.replace(/\S{1,4}/g, cb_decode);
  };

  var atob = function atob(a) {
    return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
  };

  var _decode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (a) {
    return (a.constructor === buffer.constructor ? a : buffer.from(a, 'base64')).toString();
  } : function (a) {
    return (a.constructor === buffer.constructor ? a : new buffer(a, 'base64')).toString();
  } : function (a) {
    return btou(_atob(a));
  };

  var decode = function decode(a) {
    return _decode(String(a).replace(/[-_]/g, function (m0) {
      return m0 == '-' ? '+' : '/';
    }).replace(/[^A-Za-z0-9\+\/]/g, ''));
  };

  var noConflict = function noConflict() {
    var Base64 = global.Base64;
    global.Base64 = _Base64;
    return Base64;
  }; // export Base64


  global.Base64 = {
    VERSION: version,
    atob: atob,
    btoa: btoa,
    fromBase64: decode,
    toBase64: encode,
    utob: utob,
    encode: encode,
    encodeURI: encodeURI,
    btou: btou,
    decode: decode,
    noConflict: noConflict,
    __buffer__: buffer
  }; // if ES5 is available, make Base64.extendString() available

  if (typeof Object.defineProperty === 'function') {
    var noEnum = function noEnum(v) {
      return {
        value: v,
        enumerable: false,
        writable: true,
        configurable: true
      };
    };

    global.Base64.extendString = function () {
      Object.defineProperty(String.prototype, 'fromBase64', noEnum(function () {
        return decode(this);
      }));
      Object.defineProperty(String.prototype, 'toBase64', noEnum(function (urisafe) {
        return encode(this, urisafe);
      }));
      Object.defineProperty(String.prototype, 'toBase64URI', noEnum(function () {
        return encode(this, true);
      }));
    };
  } // that's it!


  return global.Base64;
}();
/**
 * Convert a string into a base 64.
 */


function base64encode(str) {
  return Base64.encode(str);
}

exports.base64encode = base64encode;
/**
 * Decode a base 64 string.
 */

function base64decode(str) {
  return Base64.decode(str);
}

exports.base64decode = base64decode;
/**
 * Encode a string into base 64 and replace url unsafe characters.
 */

function base64encodeUrlSafe(str) {
  return Base64.encodeURI(str);
}

exports.base64encodeUrlSafe = base64encodeUrlSafe;
/**
 * Decode a string encoded with base64encodeUrlSafe.
 */

function base64decodeUrlSafe(str) {
  return Base64.decode(str);
}

exports.base64decodeUrlSafe = base64decodeUrlSafe;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/extensions/all.ts":
/*!*******************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/extensions/all.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(/*! ./date.extensions */ "./assets/essentials/core/scripts/ts/utils/extensions/date.extensions.ts");

__webpack_require__(/*! ./object.extensions */ "./assets/essentials/core/scripts/ts/utils/extensions/object.extensions.ts");

__webpack_require__(/*! ./string.extensions */ "./assets/essentials/core/scripts/ts/utils/extensions/string.extensions.ts");

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/extensions/date.extensions.ts":
/*!*******************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/extensions/date.extensions.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
  return d.toString();
}
/**
 * Add to capability to export a native JS date into a datetime string.
 */


Date.prototype.toUTCDateTime = function () {
  return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
/**
 * Add to capability to export a native JS date into a datetime string.
 */


Date.prototype.toDateTime = function () {
  return this.getFullYear() + "-" + twoDigits(1 + this.getMonth()) + "-" + twoDigits(this.getDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getMinutes()) + ":" + twoDigits(this.getSeconds());
};

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/extensions/object.extensions.ts":
/*!*********************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/extensions/object.extensions.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

/**
 * Extensions of the Object interface.
 * Here are regrouped all utilities directly integrated to the Object prototype.
 *
 * Do NOT put export function here.
 */
if (!Object.keys) {
  Object.keys = function (obj) {
    var keys = [];

    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        keys.push(k);
      }
    }

    return keys;
  };
}

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/extensions/string.extensions.ts":
/*!*********************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/extensions/string.extensions.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/es.string.trim */ "./node_modules/core-js/modules/es.string.trim.js");

/**
 * Extensions of the String interface.
 * Here are regrouped all string utilities directly integrated to the String prototype.
 *
 * Do NOT put export function here.
 */

/* tslint:disable:no-bitwise */

/**
 * Simple string format function.
 *
 * "{} {}".format("a", "b") => "a b"
 * "{1} {0}".format("a", "b") => "b a"
 * "{foo} {bar}".format({ foo: "a", bar: "b" }) => "a b"
 *
 * @param {...any} params
 *
 * @returns string
 */
String.prototype.format = function () {
  var params = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    params[_i] = arguments[_i];
  }

  var args = arguments;
  var argNum = 0;
  return this.replace(/\{(\w*)\}/gi, function (match) {
    var curArgNum;
    var prop = null;

    if (match === "{}") {
      curArgNum = argNum;
      argNum++;
    } else {
      curArgNum = match.substr(1, match.length - 2);
      var parsed = ~~curArgNum;

      if (parsed.toString() === curArgNum) {
        curArgNum = parsed;
      } else {
        prop = curArgNum;
        curArgNum = 0;
      }
    }

    return curArgNum >= args.length ? "" : prop ? args[curArgNum][prop] || "" : args[curArgNum];
  });
};
/* tslint:enable:no-bitwise */


if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/md5.ts":
/*!********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/md5.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Md5 javascript implementation.
 *
 * @author Joseph Myers
 *
 * @link http://www.myersdaily.org/joseph/javascript/md5.js1
 */

__webpack_require__(/*! core-js/modules/es.array.join */ "./node_modules/core-js/modules/es.array.join.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.md5 = void 0;
/* tslint:disable:no-bitwise */

function md5cycle(x, k) {
  var a = x[0];
  var b = x[1];
  var c = x[2];
  var d = x[3];
  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);
  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);
  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);
  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);
  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32(a << s | a >>> 32 - s, b);
}

function ff(a, b, c, d, x, s, t) {
  return cmn(b & c | ~b & d, a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
  return cmn(b & d | c & ~d, a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}

function md51(s) {
  var n = s.length;
  var state = [1732584193, -271733879, -1732584194, 271733878];
  var i;

  for (i = 64; i <= s.length; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }

  s = s.substring(i - 64);
  var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (i = 0; i < s.length; i++) {
    tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
  }

  tail[i >> 2] |= 0x80 << (i % 4 << 3);

  if (i > 55) {
    md5cycle(state, tail);

    for (i = 0; i < 16; i++) {
      tail[i] = 0;
    }
  }

  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}
/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */


function md5blk(s) {
  var md5blks = [];
  var i;
  /* Andy King said do it this way. */

  for (i = 0; i < 64; i += 4) {
    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
  }

  return md5blks;
}

var hex_chr = "0123456789abcdef".split("");

function rhex(n) {
  var s = "";
  var j = 0;

  for (; j < 4; j++) {
    s += hex_chr[n >> j * 8 + 4 & 0x0F] + hex_chr[n >> j * 8 & 0x0F];
  }

  return s;
}

function hex(x) {
  for (var i = 0; i < x.length; i++) {
    x[i] = rhex(x[i]);
  }

  return x.join("");
}
/**
 * The entry point.
 *
 * @param {string} input
 *
 * @returns {any}
 */


function md5(input) {
  return hex(md51(input));
}

exports.md5 = md5;
/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
  return a + b & 0xFFFFFFFF;
} //
// Disabled because typescript doesn't allow function declaration in a block.
//
// if (md5("hello") !== "5d41402abc4b2a76b9719d911017c592") {
//     function add32(x, y) {
//         const lsw = (x & 0xFFFF) + (y & 0xFFFF);
//         const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
//         return (msw << 16) | (lsw & 0xFFFF);
//     }
// }

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/object.ts":
/*!***********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/object.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.reduce */ "./node_modules/core-js/modules/es.array.reduce.js");

__webpack_require__(/*! core-js/modules/es.array.slice */ "./node_modules/core-js/modules/es.array.slice.js");

__webpack_require__(/*! core-js/modules/es.array.sort */ "./node_modules/core-js/modules/es.array.sort.js");

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.number.constructor */ "./node_modules/core-js/modules/es.number.constructor.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.regexp.constructor */ "./node_modules/core-js/modules/es.regexp.constructor.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = exports.prepareObjectForDump = exports.replaceStringVariables = exports.addToObjectIfDefined = exports.getValueInObject = exports.generateHashData = exports.generateObjectHash = exports.cloneObjectWithMask = exports.merge = exports.cloneDeep = exports.extend = exports.areSame = exports.areSameObjects = exports.compareObjects = exports.getSymbolDescription = exports.getObjectValue = exports.getObjectValueAsObject = exports.getObjectValueAsArray = exports.getObjectValueAsBoolean = exports.getObjectValueAsNumber = exports.getObjectValueAsString = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var lodashCloneDeep = __webpack_require__(/*! lodash/cloneDeep */ "./node_modules/lodash/cloneDeep.js");

var md5_1 = __webpack_require__(/*! ./md5 */ "./assets/essentials/core/scripts/ts/utils/md5.ts");

var string_1 = __webpack_require__(/*! ./string */ "./assets/essentials/core/scripts/ts/utils/string.ts");

var utils_1 = __webpack_require__(/*! ./utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var utils_2 = __webpack_require__(/*! ./utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");
/**
 * Extract a value from an object and ensure it is a string.
 * If the key is not found, the default value is returned.
 */


function getObjectValueAsString(data, key, defaultValue) {
  return utils_1.ensureString(getObjectValue(data, key, defaultValue));
}

exports.getObjectValueAsString = getObjectValueAsString;
/**
 * Extract a value from an object and ensure it is a valid number.
 * If the key is not found, the default value is returned.
 */

function getObjectValueAsNumber(data, key, defaultValue) {
  return utils_1.ensureNumber(getObjectValue(data, key, defaultValue));
}

exports.getObjectValueAsNumber = getObjectValueAsNumber;
/**
 * Extract a value from an object and ensure it is a boolean.
 * If the key is not found, the default value is returned.
 */

function getObjectValueAsBoolean(data, key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = false;
  }

  return utils_1.ensureBoolean(getObjectValue(data, key, defaultValue));
}

exports.getObjectValueAsBoolean = getObjectValueAsBoolean;
/**
 * Extract a value from an object and ensure it is an array.
 * If the key is not found, the default value is returned.
 */

function getObjectValueAsArray(data, key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = [];
  }

  return utils_1.ensureArray(getObjectValue(data, key, defaultValue));
}

exports.getObjectValueAsArray = getObjectValueAsArray;
/**
 * Extract a value from an object and ensure it is an object.
 * If the key is not found, the default value is returned.
 */

function getObjectValueAsObject(data, key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = null;
  }

  return utils_1.ensureObject(getObjectValue(data, key, defaultValue));
}

exports.getObjectValueAsObject = getObjectValueAsObject;
/**
 * Try to get a value from an object and returns a default value if not found.
 * The "key" parameter can be an array for multi-dimensional search.
 * You can also write it as a string separated with "->".
 */

function getObjectValue(data, key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = null;
  }

  if (!utils_1.isArray(key)) {
    key = key.split("->");
  }

  var container = data;

  for (var _i = 0, key_1 = key; _i < key_1.length; _i++) {
    var item = key_1[_i];

    if (!utils_2.isObject(container) || utils_2.isUndefined(container[item])) {
      return defaultValue;
    }

    container = container[item];
  }

  return container;
}

exports.getObjectValue = getObjectValue;
/**
 * Gets the description string of a symbol.
 */

function getSymbolDescription(symbol) {
  var regExp = /\(([^)]+)\)/;
  var names = regExp.exec(symbol.toString()) || [];
  return names[1];
}

exports.getSymbolDescription = getSymbolDescription;
/**
 * Compares two objects and returns the difference between them.
 *
 * @param {object}  a
 * @param {object}  b
 * @param {boolean} keepBothValues (optional, default: false) if true, for each difference the old
 *                                 value is stored as a "before" key and the new value as a "after" key.
 *                                 if false, only the new value is returned with no additional object.
 *
 * @return {object}
 */

function compareObjects(a, b, keepBothValues) {
  if (keepBothValues === void 0) {
    keepBothValues = false;
  }

  var output = {};

  if (!utils_2.isObject(a) || !utils_2.isObject(b)) {
    return output;
  }

  for (var key in a) {
    if (!a.hasOwnProperty(key)) {
      continue;
    }

    var value = a[key];

    if (!utils_2.isUndefined(b[key])) {
      if (utils_2.isObject(value) && utils_2.isObject(b[key])) {
        var subOutput = compareObjects(value, b[key], keepBothValues);

        if (Object.keys(subOutput).length > 0) {
          output[key] = subOutput;
        }
      } else if (value !== b[key]) {
        if (keepBothValues) {
          output[key] = {
            a: value,
            b: b[key]
          };
        } else {
          output[key] = b[key];
        }
      }
    } else if (utils_2.isUndefined(value)) {
      // In this case both a and b are "undefined", so there is no difference after all.
      continue;
    } else if (keepBothValues) {
      output[key] = {
        a: value,
        b: undefined
      };
    } else {
      output[key] = undefined;
    }
  }

  for (var key in b) {
    if (!b.hasOwnProperty(key) || !utils_2.isUndefined(a[key]) || utils_2.isUndefined(b[key])) {
      continue;
    }

    if (keepBothValues) {
      output[key] = {
        a: undefined,
        b: b[key]
      };
    } else {
      output[key] = b[key];
    }
  }

  return output;
}

exports.compareObjects = compareObjects;
/**
 * Make a deep comparison between two objects to see if they are the same.
 */

function areSameObjects(a, b) {
  return Object.keys(compareObjects(a, b)).length === 0;
}

exports.areSameObjects = areSameObjects;
/**
 * Compare two variables for equality.
 */

function areSame(a, b) {
  if (_typeof(a) !== _typeof(b)) {
    return false;
  }

  if (utils_2.isObject(a)) {
    return areSameObjects(a, b);
  }

  return a === b;
}

exports.areSame = areSame;
/**
 * Copy values from objs into dst, optionally recursively.
 * Promises are copied as is, so they will be shared between dst and objs.
 */

function extend(dst, objs, deep) {
  if (deep === void 0) {
    deep = true;
  }

  if (!utils_1.isArray(objs)) {
    objs = [objs];
  }

  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];

    if (!utils_2.isObject(obj) && !utils_2.isFunction(obj)) {
      continue;
    }

    var keys = Object.keys(obj);

    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && utils_2.isObject(src)) {
        if (utils_1.isDate(src)) {
          dst[key] = new Date(src.valueOf());
        } else if (utils_2.isRegExp(src)) {
          dst[key] = new RegExp(src);
        } else if (src.nodeName) {
          dst[key] = src.cloneNode(true);
        } else if (utils_2.isElement(src)) {
          dst[key] = src.clone();
        } else if (utils_2.isPromiseLike(src)) {
          // Do nothing in case it's a promise
          dst[key] = src;
        } else {
          var isar = utils_1.isArray(src);

          if (!utils_2.isObject(dst[key])) {
            dst[key] = isar ? [] : {};
          }

          if (isar) {
            dst[key] = dst[key].concat(src);
          } else {
            extend(dst[key], [src], true);
          }
        }
      } else {
        dst[key] = src;
      }
    }
  }

  return dst;
}

exports.extend = extend;
/**
 * Recursively clone a value.
 */

function cloneDeep(value) {
  return lodashCloneDeep(value);
}

exports.cloneDeep = cloneDeep;
/**
 * Same as extend, a copy paste from angular but calls `extend` instead of `baseExtend` (implementation internal to angular).
 */

function merge(dst) {
  var src = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    src[_i - 1] = arguments[_i];
  }

  return extend(dst, src, true);
}

exports.merge = merge;
/**
 * Make a clone of an object based on mask that describes what properties to clone or to ignore.
 *
 * The mask must follow the structure of the object to clone with few exceptions.
 * For example :
 *
 * ```
 * const source = {
 *     docks: {
 *         top: {
 *             visible: false,
 *             left: {
 *                 id: 1
 *                 tabs: [
 *                     {id: 1, label: 'First tab'},
 *                     {id: 2, label: 'Second tab'}
 *                 ]
 *             },
 *             right: {
 *                 id: 2,
 *                 tabs: [
 *                     {id: 3, label: 'Third tab'},
 *                     {id: 4, label: 'Fourth tab'}
 *                 ]
 *             }
 *         },
 *         left: {
 *             [...]
 *         }
 *     }
 * };
 *
 * const mask = {
 *     docks: {
 *         '*': {
 *             visible: true,
 *             left: {
 *                 tabs: {
 *                     '*': {
 *                         id: true
 *                     }
 *                 }
 *             },
 *             right: {
 *                 tabs: true
 *             }
 *         }
 *     }
 * };
 * ```
 *
 * For each level, you can define which property to copy by adding a key with their name.
 * Or you can put '*' to tell to iterate the object or array to copy all the keys.
 * Set "true" as value in the mask simply ask to copy everything from there.
 *
 * In the example above, the resulting clone will be:
 *
 * ```
 * {
 *     docks: {
 *         top: {
 *             visible: false,
 *             left: {
 *                 tabs: [
 *                     {id: 1},
 *                     {id: 2}
 *                 ]
 *             },
 *             right: {
 *                 tabs: [
 *                     {id: 3, label: 'Third tab'},
 *                     {id: 4, label: 'Fourth tab'}
 *                 ]
 *             }
 *         },
 *         left: {
 *             [...]
 *         }
 *     }
 * }
 * ```
 */

function cloneObjectWithMask(source, mask) {
  var sourceIsArray = utils_1.isArray(source);
  var clone = sourceIsArray ? [] : {};

  if (utils_2.isObject(source)) {
    if (utils_2.isObject(mask, true)) {
      var maskKeys = Object.keys(mask);

      if (maskKeys.length === 1 && maskKeys[0] === '*') {
        var keys = Object.keys(source);

        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
          var rawKey = keys_1[_i];
          var res = undefined;
          var key = sourceIsArray ? Number(rawKey) : rawKey;

          if (utils_2.isObject(source[key])) {
            res = cloneObjectWithMask(source[key], mask['*']);
          } else if (mask !== false) {
            res = source[key];
          } else {
            continue;
          }

          if (!sourceIsArray) {
            clone[key] = res;
          } else {
            clone.push(res);
          }
        }
      } else {
        for (var _a = 0, _b = Object.keys(mask); _a < _b.length; _a++) {
          var key = _b[_a];

          if (utils_2.isObject(source[key])) {
            clone[key] = cloneObjectWithMask(source[key], mask[key]);
          } else if (mask !== false && !utils_2.isUndefined(source[key])) {
            clone[key] = source[key];
          }
        }
      }
    } else if (mask === true) {
      return cloneDeep(source);
    }
  } else {
    return source;
  }

  return clone;
}

exports.cloneObjectWithMask = cloneObjectWithMask;
/**
 * Generates a unique hash for an object.
 */

function generateObjectHash(data) {
  return md5_1.md5(JSON.stringify(generateHashData(data)));
}

exports.generateObjectHash = generateObjectHash;
/**
 * Generates a copy of an object that will always product the same JSON when encoded.
 */

function generateHashData(data) {
  if (utils_1.isArray(data)) {
    var output = [];

    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
      var item = data_1[_i];
      output.push(generateHashData(item));
    }

    return output;
  } else if (utils_2.isObject(data)) {
    var output = [];
    var keys = Object.keys(data);
    keys.sort();

    for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
      var key = keys_2[_a];
      var obj = {};
      obj[key] = generateHashData(data[key]);
      output.push(obj);
    }

    return output;
  }

  if (utils_2.isString(data)) {
    return string_1.slugify(data);
  }

  return data;
}

exports.generateHashData = generateHashData;
/**
 * Try to find a value in an object.
 */

function getValueInObject(data, search, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = null;
  }

  if (!utils_2.isObject(data) || utils_2.isUndefined(data[search[0]])) {
    return defaultValue;
  }

  if (search.length > 1) {
    return getValueInObject(data[search[0]], search.slice(1));
  }

  return data[search[0]];
}

exports.getValueInObject = getValueInObject;
/**
 * Add a value to an object if it's not undefined.
 */

function addToObjectIfDefined(obj, key, value) {
  if (!utils_2.isUndefined(value)) {
    obj[key] = value;
  }
}

exports.addToObjectIfDefined = addToObjectIfDefined;
/**
 * Replace all variables corresponding to the syntax "%variableName% in the input with the corresponding
 * value in the replacements parameter.
 *
 * This works on any number of levels.
 *
 * For example the string:
 *   "Hello %config.who%!"
 *   with a replacement object of: {config: {who: "World"}}
 *   will output: "Hello World!".
 *
 * Variables names are limited to the following range of characters:
 *   [a-zA-Z0-9*_-]
 * (with the addition of the "." (dot) to separate levels in the hierarchy)
 *
 * You can also chose the starting and ending characters.
 */

function replaceStringVariables(input, replacements, startChar, endChar) {
  if (startChar === void 0) {
    startChar = '%';
  }

  if (endChar === void 0) {
    endChar = '%';
  }

  if (utils_2.isString(input)) {
    var reg = new RegExp(startChar + '([a-z0-9*._-]+)' + endChar, 'gi');
    var replacementsResults = {};
    var matches = void 0;
    /* tslint:disable:no-conditional-assignment */

    while ((matches = reg.exec(input)) !== null) {
      if (utils_1.isArray(matches) && matches.length > 1) {
        var parts = matches[1].split('.');
        var value = getValueInObject(replacements, parts);

        if (value !== null) {
          // Do not replace the value immediately because if you do so and the
          // string auto reference itself you have an infinite loop.
          replacementsResults[matches[0]] = value;
        }
      }
    } // Now we can safely replace the results.


    for (var toReplace in replacementsResults) {
      if (replacementsResults.hasOwnProperty(toReplace)) {
        input = input.replace(new RegExp(toReplace, 'g'), replacementsResults[toReplace]);
      }
    }
  }

  if (utils_1.isArray(input)) {
    for (var i = 0; i < input.length; ++i) {
      input[i] = replaceStringVariables(input[i], replacements);
    }
  }

  if (utils_2.isObject(input)) {
    for (var k in input) {
      if (input.hasOwnProperty(k)) {
        input[k] = replaceStringVariables(input[k], replacements);
      }
    }
  }

  return input;
}

exports.replaceStringVariables = replaceStringVariables;
/**
 * Take any input and prepare it so it can safely be encoded into a string so it can be transferred or dumped.
 *
 * This is a lossy operation, the resulting object is not intended to be used as the original one.
 *
 * The original object is not affected, a clone is made.
 */

function prepareObjectForDump(input, maxDepth, // tslint:disable-next-line:align

/* internal */
objectsStack, // tslint:disable-next-line:align

/* internal */
depth) {
  if (maxDepth === void 0) {
    maxDepth = 5;
  }

  if (objectsStack === void 0) {
    objectsStack = [];
  }

  if (depth === void 0) {
    depth = 0;
  }

  if (utils_2.isUndefined(input)) {
    return '[undefined]';
  }

  if (input === null) {
    return '[null]';
  }

  if (utils_2.isString(input)) {
    return input.substring(0, 512);
  }

  if (utils_2.isPromiseLike(input)) {
    return '[promise]';
  }

  if (utils_1.isArray(input)) {
    var clone = [];

    if (maxDepth <= 0 || depth < maxDepth) {
      var maxNumberOfItems = 50;
      var itemIndex = 0;

      for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
        var item = input_1[_i];
        clone.push(prepareObjectForDump(item, maxDepth, objectsStack, depth + 1));
        ++itemIndex;

        if (itemIndex >= maxNumberOfItems) {
          break;
        }
      }

      return clone;
    }

    return '[array of ' + input.length + ' element' + (input.length > 1 ? 's' : '') + ']';
  }

  if (utils_2.isObject(input)) {
    for (var _a = 0, objectsStack_1 = objectsStack; _a < objectsStack_1.length; _a++) {
      var candidate = objectsStack_1[_a];

      if (candidate === input) {
        return '[recursive object reference]';
      }
    }

    var clone = {};
    var keysCount = Object.keys(input).length;
    var maxNumberOfKeys = 30;

    if (maxDepth <= 0 || depth < maxDepth) {
      var keyIndex = 0;
      objectsStack.push(input); // tslint:disable-next-line:forin

      for (var key in input) {
        if (!utils_2.isUndefined(input.hasOwnProperty) && input.hasOwnProperty(key) && !utils_2.isFunction(input[key])) {
          clone[key] = prepareObjectForDump(input[key], maxDepth, objectsStack, depth + 1);
        }

        ++keyIndex;

        if (keyIndex >= maxNumberOfKeys) {
          break;
        }
      }

      objectsStack.pop();
    } else {
      return '[object of ' + keysCount + ' key' + (keysCount > 1 ? 's' : '') + ']';
    }

    return clone;
  }

  return input;
}

exports.prepareObjectForDump = prepareObjectForDump;
/**
 * Flatten a N dimension object into a single dimension one.
 */

function flatten(obj, concatenator) {
  if (concatenator === void 0) {
    concatenator = '.';
  }

  return Object.keys(obj).reduce(function (acc, key) {
    var _a;

    if (_typeof(obj[key]) !== 'object') {
      return tslib_1.__assign(tslib_1.__assign({}, acc), (_a = {}, _a[key] = obj[key], _a));
    }

    var flattenedChild = flatten(obj[key], concatenator);
    return tslib_1.__assign(tslib_1.__assign({}, acc), Object.keys(flattenedChild).reduce(function (childAcc, childKey) {
      var _a;

      return tslib_1.__assign(tslib_1.__assign({}, childAcc), (_a = {}, _a["" + key + concatenator + childKey] = flattenedChild[childKey], _a));
    }, {}));
  }, {});
}

exports.flatten = flatten;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/string.ts":
/*!***********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/string.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomString = exports.slugify = exports.removeAccents = exports.normalizeUrl = exports.isUrl = exports.isEmptyString = exports.ALPHABETS = void 0;

var trim = __webpack_require__(/*! lodash/trim */ "./node_modules/lodash/trim.js");

var utils_1 = __webpack_require__(/*! ./utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var utils_2 = __webpack_require__(/*! ./utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var DIACRITICS_MAP = {
  "A": "A",
  "Ⓐ": "A",
  "Ａ": "A",
  "À": "A",
  "Á": "A",
  "Â": "A",
  "Ầ": "A",
  "Ấ": "A",
  "Ẫ": "A",
  "Ẩ": "A",
  "Ã": "A",
  "Ā": "A",
  "Ă": "A",
  "Ằ": "A",
  "Ắ": "A",
  "Ẵ": "A",
  "Ẳ": "A",
  "Ȧ": "A",
  "Ǡ": "A",
  "Ä": "A",
  "Ǟ": "A",
  "Ả": "A",
  "Å": "A",
  "Ǻ": "A",
  "Ǎ": "A",
  "Ȁ": "A",
  "Ȃ": "A",
  "Ạ": "A",
  "Ậ": "A",
  "Ặ": "A",
  "Ḁ": "A",
  "Ą": "A",
  "Ⱥ": "A",
  "Ɐ": "A",
  "Ꜳ": "AA",
  "Æ": "AE",
  "Ǽ": "AE",
  "Ǣ": "AE",
  "Ꜵ": "AO",
  "Ꜷ": "AU",
  "Ꜹ": "AV",
  "Ꜻ": "AV",
  "Ꜽ": "AY",
  "B": "B",
  "Ⓑ": "B",
  "Ｂ": "B",
  "Ḃ": "B",
  "Ḅ": "B",
  "Ḇ": "B",
  "Ƀ": "B",
  "Ƃ": "B",
  "Ɓ": "B",
  "C": "C",
  "Ⓒ": "C",
  "Ｃ": "C",
  "Ć": "C",
  "Ĉ": "C",
  "Ċ": "C",
  "Č": "C",
  "Ç": "C",
  "Ḉ": "C",
  "Ƈ": "C",
  "Ȼ": "C",
  "Ꜿ": "C",
  "D": "D",
  "Ⓓ": "D",
  "Ｄ": "D",
  "Ḋ": "D",
  "Ď": "D",
  "Ḍ": "D",
  "Ḑ": "D",
  "Ḓ": "D",
  "Ḏ": "D",
  "Đ": "D",
  "Ƌ": "D",
  "Ɗ": "D",
  "Ɖ": "D",
  "Ꝺ": "D",
  "Ǳ": "DZ",
  "Ǆ": "DZ",
  "ǲ": "Dz",
  "ǅ": "Dz",
  "E": "E",
  "Ⓔ": "E",
  "Ｅ": "E",
  "È": "E",
  "É": "E",
  "Ê": "E",
  "Ề": "E",
  "Ế": "E",
  "Ễ": "E",
  "Ể": "E",
  "Ẽ": "E",
  "Ē": "E",
  "Ḕ": "E",
  "Ḗ": "E",
  "Ĕ": "E",
  "Ė": "E",
  "Ë": "E",
  "Ẻ": "E",
  "Ě": "E",
  "Ȅ": "E",
  "Ȇ": "E",
  "Ẹ": "E",
  "Ệ": "E",
  "Ȩ": "E",
  "Ḝ": "E",
  "Ę": "E",
  "Ḙ": "E",
  "Ḛ": "E",
  "Ɛ": "E",
  "Ǝ": "E",
  "F": "F",
  "Ⓕ": "F",
  "Ｆ": "F",
  "Ḟ": "F",
  "Ƒ": "F",
  "Ꝼ": "F",
  "G": "G",
  "Ⓖ": "G",
  "Ｇ": "G",
  "Ǵ": "G",
  "Ĝ": "G",
  "Ḡ": "G",
  "Ğ": "G",
  "Ġ": "G",
  "Ǧ": "G",
  "Ģ": "G",
  "Ǥ": "G",
  "Ɠ": "G",
  "Ꞡ": "G",
  "Ᵹ": "G",
  "Ꝿ": "G",
  "H": "H",
  "Ⓗ": "H",
  "Ｈ": "H",
  "Ĥ": "H",
  "Ḣ": "H",
  "Ḧ": "H",
  "Ȟ": "H",
  "Ḥ": "H",
  "Ḩ": "H",
  "Ḫ": "H",
  "Ħ": "H",
  "Ⱨ": "H",
  "Ⱶ": "H",
  "Ɥ": "H",
  "I": "I",
  "Ⓘ": "I",
  "Ｉ": "I",
  "Ì": "I",
  "Í": "I",
  "Î": "I",
  "Ĩ": "I",
  "Ī": "I",
  "Ĭ": "I",
  "İ": "I",
  "Ï": "I",
  "Ḯ": "I",
  "Ỉ": "I",
  "Ǐ": "I",
  "Ȉ": "I",
  "Ȋ": "I",
  "Ị": "I",
  "Į": "I",
  "Ḭ": "I",
  "Ɨ": "I",
  "J": "J",
  "Ⓙ": "J",
  "Ｊ": "J",
  "Ĵ": "J",
  "Ɉ": "J",
  "K": "K",
  "Ⓚ": "K",
  "Ｋ": "K",
  "Ḱ": "K",
  "Ǩ": "K",
  "Ḳ": "K",
  "Ķ": "K",
  "Ḵ": "K",
  "Ƙ": "K",
  "Ⱪ": "K",
  "Ꝁ": "K",
  "Ꝃ": "K",
  "Ꝅ": "K",
  "Ꞣ": "K",
  "L": "L",
  "Ⓛ": "L",
  "Ｌ": "L",
  "Ŀ": "L",
  "Ĺ": "L",
  "Ľ": "L",
  "Ḷ": "L",
  "Ḹ": "L",
  "Ļ": "L",
  "Ḽ": "L",
  "Ḻ": "L",
  "Ł": "L",
  "Ƚ": "L",
  "Ɫ": "L",
  "Ⱡ": "L",
  "Ꝉ": "L",
  "Ꝇ": "L",
  "Ꞁ": "L",
  "Ǉ": "LJ",
  "ǈ": "Lj",
  "M": "M",
  "Ⓜ": "M",
  "Ｍ": "M",
  "Ḿ": "M",
  "Ṁ": "M",
  "Ṃ": "M",
  "Ɱ": "M",
  "Ɯ": "M",
  "N": "N",
  "Ⓝ": "N",
  "Ｎ": "N",
  "Ǹ": "N",
  "Ń": "N",
  "Ñ": "N",
  "Ṅ": "N",
  "Ň": "N",
  "Ṇ": "N",
  "Ņ": "N",
  "Ṋ": "N",
  "Ṉ": "N",
  "Ƞ": "N",
  "Ɲ": "N",
  "Ꞑ": "N",
  "Ꞥ": "N",
  "Ǌ": "NJ",
  "ǋ": "Nj",
  "O": "O",
  "Ⓞ": "O",
  "Ｏ": "O",
  "Ò": "O",
  "Ó": "O",
  "Ô": "O",
  "Ồ": "O",
  "Ố": "O",
  "Ỗ": "O",
  "Ổ": "O",
  "Õ": "O",
  "Ṍ": "O",
  "Ȭ": "O",
  "Ṏ": "O",
  "Ō": "O",
  "Ṑ": "O",
  "Ṓ": "O",
  "Ŏ": "O",
  "Ȯ": "O",
  "Ȱ": "O",
  "Ö": "O",
  "Ȫ": "O",
  "Ỏ": "O",
  "Ő": "O",
  "Ǒ": "O",
  "Ȍ": "O",
  "Ȏ": "O",
  "Ơ": "O",
  "Ờ": "O",
  "Ớ": "O",
  "Ỡ": "O",
  "Ở": "O",
  "Ợ": "O",
  "Ọ": "O",
  "Ộ": "O",
  "Ǫ": "O",
  "Ǭ": "O",
  "Ø": "O",
  "Ǿ": "O",
  "Ɔ": "O",
  "Ɵ": "O",
  "Ꝋ": "O",
  "Ꝍ": "O",
  "Ƣ": "OI",
  "Ꝏ": "OO",
  "Ȣ": "OU",
  "P": "P",
  "Ⓟ": "P",
  "Ｐ": "P",
  "Ṕ": "P",
  "Ṗ": "P",
  "Ƥ": "P",
  "Ᵽ": "P",
  "Ꝑ": "P",
  "Ꝓ": "P",
  "Ꝕ": "P",
  "Q": "Q",
  "Ⓠ": "Q",
  "Ｑ": "Q",
  "Ꝗ": "Q",
  "Ꝙ": "Q",
  "Ɋ": "Q",
  "R": "R",
  "Ⓡ": "R",
  "Ｒ": "R",
  "Ŕ": "R",
  "Ṙ": "R",
  "Ř": "R",
  "Ȑ": "R",
  "Ȓ": "R",
  "Ṛ": "R",
  "Ṝ": "R",
  "Ŗ": "R",
  "Ṟ": "R",
  "Ɍ": "R",
  "Ɽ": "R",
  "Ꝛ": "R",
  "Ꞧ": "R",
  "Ꞃ": "R",
  "S": "S",
  "Ⓢ": "S",
  "Ｓ": "S",
  "ẞ": "S",
  "Ś": "S",
  "Ṥ": "S",
  "Ŝ": "S",
  "Ṡ": "S",
  "Š": "S",
  "Ṧ": "S",
  "Ṣ": "S",
  "Ṩ": "S",
  "Ș": "S",
  "Ş": "S",
  "Ȿ": "S",
  "Ꞩ": "S",
  "Ꞅ": "S",
  "T": "T",
  "Ⓣ": "T",
  "Ｔ": "T",
  "Ṫ": "T",
  "Ť": "T",
  "Ṭ": "T",
  "Ț": "T",
  "Ţ": "T",
  "Ṱ": "T",
  "Ṯ": "T",
  "Ŧ": "T",
  "Ƭ": "T",
  "Ʈ": "T",
  "Ⱦ": "T",
  "Ꞇ": "T",
  "Ꜩ": "TZ",
  "U": "U",
  "Ⓤ": "U",
  "Ｕ": "U",
  "Ù": "U",
  "Ú": "U",
  "Û": "U",
  "Ũ": "U",
  "Ṹ": "U",
  "Ū": "U",
  "Ṻ": "U",
  "Ŭ": "U",
  "Ü": "U",
  "Ǜ": "U",
  "Ǘ": "U",
  "Ǖ": "U",
  "Ǚ": "U",
  "Ủ": "U",
  "Ů": "U",
  "Ű": "U",
  "Ǔ": "U",
  "Ȕ": "U",
  "Ȗ": "U",
  "Ư": "U",
  "Ừ": "U",
  "Ứ": "U",
  "Ữ": "U",
  "Ử": "U",
  "Ự": "U",
  "Ụ": "U",
  "Ṳ": "U",
  "Ų": "U",
  "Ṷ": "U",
  "Ṵ": "U",
  "Ʉ": "U",
  "V": "V",
  "Ⓥ": "V",
  "Ｖ": "V",
  "Ṽ": "V",
  "Ṿ": "V",
  "Ʋ": "V",
  "Ꝟ": "V",
  "Ʌ": "V",
  "Ꝡ": "VY",
  "W": "W",
  "Ⓦ": "W",
  "Ｗ": "W",
  "Ẁ": "W",
  "Ẃ": "W",
  "Ŵ": "W",
  "Ẇ": "W",
  "Ẅ": "W",
  "Ẉ": "W",
  "Ⱳ": "W",
  "X": "X",
  "Ⓧ": "X",
  "Ｘ": "X",
  "Ẋ": "X",
  "Ẍ": "X",
  "Y": "Y",
  "Ⓨ": "Y",
  "Ｙ": "Y",
  "Ỳ": "Y",
  "Ý": "Y",
  "Ŷ": "Y",
  "Ỹ": "Y",
  "Ȳ": "Y",
  "Ẏ": "Y",
  "Ÿ": "Y",
  "Ỷ": "Y",
  "Ỵ": "Y",
  "Ƴ": "Y",
  "Ɏ": "Y",
  "Ỿ": "Y",
  "Z": "Z",
  "Ⓩ": "Z",
  "Ｚ": "Z",
  "Ź": "Z",
  "Ẑ": "Z",
  "Ż": "Z",
  "Ž": "Z",
  "Ẓ": "Z",
  "Ẕ": "Z",
  "Ƶ": "Z",
  "Ȥ": "Z",
  "Ɀ": "Z",
  "Ⱬ": "Z",
  "Ꝣ": "Z",
  "a": "a",
  "ⓐ": "a",
  "ａ": "a",
  "ẚ": "a",
  "à": "a",
  "á": "a",
  "â": "a",
  "ầ": "a",
  "ấ": "a",
  "ẫ": "a",
  "ẩ": "a",
  "ã": "a",
  "ā": "a",
  "ă": "a",
  "ằ": "a",
  "ắ": "a",
  "ẵ": "a",
  "ẳ": "a",
  "ȧ": "a",
  "ǡ": "a",
  "ä": "a",
  "ǟ": "a",
  "ả": "a",
  "å": "a",
  "ǻ": "a",
  "ǎ": "a",
  "ȁ": "a",
  "ȃ": "a",
  "ạ": "a",
  "ậ": "a",
  "ặ": "a",
  "ḁ": "a",
  "ą": "a",
  "ⱥ": "a",
  "ɐ": "a",
  "ꜳ": "aa",
  "æ": "ae",
  "ǽ": "ae",
  "ǣ": "ae",
  "ꜵ": "ao",
  "ꜷ": "au",
  "ꜹ": "av",
  "ꜻ": "av",
  "ꜽ": "ay",
  "b": "b",
  "ⓑ": "b",
  "ｂ": "b",
  "ḃ": "b",
  "ḅ": "b",
  "ḇ": "b",
  "ƀ": "b",
  "ƃ": "b",
  "ɓ": "b",
  "c": "c",
  "ⓒ": "c",
  "ｃ": "c",
  "ć": "c",
  "ĉ": "c",
  "ċ": "c",
  "č": "c",
  "ç": "c",
  "ḉ": "c",
  "ƈ": "c",
  "ȼ": "c",
  "ꜿ": "c",
  "ↄ": "c",
  "d": "d",
  "ⓓ": "d",
  "ｄ": "d",
  "ḋ": "d",
  "ď": "d",
  "ḍ": "d",
  "ḑ": "d",
  "ḓ": "d",
  "ḏ": "d",
  "đ": "d",
  "ƌ": "d",
  "ɖ": "d",
  "ɗ": "d",
  "ꝺ": "d",
  "ǳ": "dz",
  "ǆ": "dz",
  "e": "e",
  "ⓔ": "e",
  "ｅ": "e",
  "è": "e",
  "é": "e",
  "ê": "e",
  "ề": "e",
  "ế": "e",
  "ễ": "e",
  "ể": "e",
  "ẽ": "e",
  "ē": "e",
  "ḕ": "e",
  "ḗ": "e",
  "ĕ": "e",
  "ė": "e",
  "ë": "e",
  "ẻ": "e",
  "ě": "e",
  "ȅ": "e",
  "ȇ": "e",
  "ẹ": "e",
  "ệ": "e",
  "ȩ": "e",
  "ḝ": "e",
  "ę": "e",
  "ḙ": "e",
  "ḛ": "e",
  "ɇ": "e",
  "ɛ": "e",
  "ǝ": "e",
  "f": "f",
  "ⓕ": "f",
  "ｆ": "f",
  "ḟ": "f",
  "ƒ": "f",
  "ꝼ": "f",
  "g": "g",
  "ⓖ": "g",
  "ｇ": "g",
  "ǵ": "g",
  "ĝ": "g",
  "ḡ": "g",
  "ğ": "g",
  "ġ": "g",
  "ǧ": "g",
  "ģ": "g",
  "ǥ": "g",
  "ɠ": "g",
  "ꞡ": "g",
  "ᵹ": "g",
  "ꝿ": "g",
  "h": "h",
  "ⓗ": "h",
  "ｈ": "h",
  "ĥ": "h",
  "ḣ": "h",
  "ḧ": "h",
  "ȟ": "h",
  "ḥ": "h",
  "ḩ": "h",
  "ḫ": "h",
  "ẖ": "h",
  "ħ": "h",
  "ⱨ": "h",
  "ⱶ": "h",
  "ɥ": "h",
  "ƕ": "hv",
  "i": "i",
  "ⓘ": "i",
  "ｉ": "i",
  "ì": "i",
  "í": "i",
  "î": "i",
  "ĩ": "i",
  "ī": "i",
  "ĭ": "i",
  "ï": "i",
  "ḯ": "i",
  "ỉ": "i",
  "ǐ": "i",
  "ȉ": "i",
  "ȋ": "i",
  "ị": "i",
  "į": "i",
  "ḭ": "i",
  "ɨ": "i",
  "ı": "i",
  "j": "j",
  "ⓙ": "j",
  "ｊ": "j",
  "ĵ": "j",
  "ǰ": "j",
  "ɉ": "j",
  "k": "k",
  "ⓚ": "k",
  "ｋ": "k",
  "ḱ": "k",
  "ǩ": "k",
  "ḳ": "k",
  "ķ": "k",
  "ḵ": "k",
  "ƙ": "k",
  "ⱪ": "k",
  "ꝁ": "k",
  "ꝃ": "k",
  "ꝅ": "k",
  "ꞣ": "k",
  "l": "l",
  "ⓛ": "l",
  "ｌ": "l",
  "ŀ": "l",
  "ĺ": "l",
  "ľ": "l",
  "ḷ": "l",
  "ḹ": "l",
  "ļ": "l",
  "ḽ": "l",
  "ḻ": "l",
  "ſ": "l",
  "ł": "l",
  "ƚ": "l",
  "ɫ": "l",
  "ⱡ": "l",
  "ꝉ": "l",
  "ꞁ": "l",
  "ꝇ": "l",
  "ǉ": "lj",
  "m": "m",
  "ⓜ": "m",
  "ｍ": "m",
  "ḿ": "m",
  "ṁ": "m",
  "ṃ": "m",
  "ɱ": "m",
  "ɯ": "m",
  "n": "n",
  "ⓝ": "n",
  "ｎ": "n",
  "ǹ": "n",
  "ń": "n",
  "ñ": "n",
  "ṅ": "n",
  "ň": "n",
  "ṇ": "n",
  "ņ": "n",
  "ṋ": "n",
  "ṉ": "n",
  "ƞ": "n",
  "ɲ": "n",
  "ŉ": "n",
  "ꞑ": "n",
  "ꞥ": "n",
  "ǌ": "nj",
  "o": "o",
  "ⓞ": "o",
  "ｏ": "o",
  "ò": "o",
  "ó": "o",
  "ô": "o",
  "ồ": "o",
  "ố": "o",
  "ỗ": "o",
  "ổ": "o",
  "õ": "o",
  "ṍ": "o",
  "ȭ": "o",
  "ṏ": "o",
  "ō": "o",
  "ṑ": "o",
  "ṓ": "o",
  "ŏ": "o",
  "ȯ": "o",
  "ȱ": "o",
  "ö": "o",
  "ȫ": "o",
  "ỏ": "o",
  "ő": "o",
  "ǒ": "o",
  "ȍ": "o",
  "ȏ": "o",
  "ơ": "o",
  "ờ": "o",
  "ớ": "o",
  "ỡ": "o",
  "ở": "o",
  "ợ": "o",
  "ọ": "o",
  "ộ": "o",
  "ǫ": "o",
  "ǭ": "o",
  "ø": "o",
  "ǿ": "o",
  "ɔ": "o",
  "ꝋ": "o",
  "ꝍ": "o",
  "ɵ": "o",
  "ƣ": "oi",
  "ȣ": "ou",
  "ꝏ": "oo",
  "p": "p",
  "ⓟ": "p",
  "ｐ": "p",
  "ṕ": "p",
  "ṗ": "p",
  "ƥ": "p",
  "ᵽ": "p",
  "ꝑ": "p",
  "ꝓ": "p",
  "ꝕ": "p",
  "q": "q",
  "ⓠ": "q",
  "ｑ": "q",
  "ɋ": "q",
  "ꝗ": "q",
  "ꝙ": "q",
  "r": "r",
  "ⓡ": "r",
  "ｒ": "r",
  "ŕ": "r",
  "ṙ": "r",
  "ř": "r",
  "ȑ": "r",
  "ȓ": "r",
  "ṛ": "r",
  "ṝ": "r",
  "ŗ": "r",
  "ṟ": "r",
  "ɍ": "r",
  "ɽ": "r",
  "ꝛ": "r",
  "ꞧ": "r",
  "ꞃ": "r",
  "s": "s",
  "ⓢ": "s",
  "ｓ": "s",
  "ß": "s",
  "ś": "s",
  "ṥ": "s",
  "ŝ": "s",
  "ṡ": "s",
  "š": "s",
  "ṧ": "s",
  "ṣ": "s",
  "ṩ": "s",
  "ș": "s",
  "ş": "s",
  "ȿ": "s",
  "ꞩ": "s",
  "ꞅ": "s",
  "ẛ": "s",
  "t": "t",
  "ⓣ": "t",
  "ｔ": "t",
  "ṫ": "t",
  "ẗ": "t",
  "ť": "t",
  "ṭ": "t",
  "ț": "t",
  "ţ": "t",
  "ṱ": "t",
  "ṯ": "t",
  "ŧ": "t",
  "ƭ": "t",
  "ʈ": "t",
  "ⱦ": "t",
  "ꞇ": "t",
  "ꜩ": "tz",
  "u": "u",
  "ⓤ": "u",
  "ｕ": "u",
  "ù": "u",
  "ú": "u",
  "û": "u",
  "ũ": "u",
  "ṹ": "u",
  "ū": "u",
  "ṻ": "u",
  "ŭ": "u",
  "ü": "u",
  "ǜ": "u",
  "ǘ": "u",
  "ǖ": "u",
  "ǚ": "u",
  "ủ": "u",
  "ů": "u",
  "ű": "u",
  "ǔ": "u",
  "ȕ": "u",
  "ȗ": "u",
  "ư": "u",
  "ừ": "u",
  "ứ": "u",
  "ữ": "u",
  "ử": "u",
  "ự": "u",
  "ụ": "u",
  "ṳ": "u",
  "ų": "u",
  "ṷ": "u",
  "ṵ": "u",
  "ʉ": "u",
  "v": "v",
  "ⓥ": "v",
  "ｖ": "v",
  "ṽ": "v",
  "ṿ": "v",
  "ʋ": "v",
  "ꝟ": "v",
  "ʌ": "v",
  "ꝡ": "vy",
  "w": "w",
  "ⓦ": "w",
  "ｗ": "w",
  "ẁ": "w",
  "ẃ": "w",
  "ŵ": "w",
  "ẇ": "w",
  "ẅ": "w",
  "ẘ": "w",
  "ẉ": "w",
  "ⱳ": "w",
  "x": "x",
  "ⓧ": "x",
  "ｘ": "x",
  "ẋ": "x",
  "ẍ": "x",
  "y": "y",
  "ⓨ": "y",
  "ｙ": "y",
  "ỳ": "y",
  "ý": "y",
  "ŷ": "y",
  "ỹ": "y",
  "ȳ": "y",
  "ẏ": "y",
  "ÿ": "y",
  "ỷ": "y",
  "ẙ": "y",
  "ỵ": "y",
  "ƴ": "y",
  "ɏ": "y",
  "ỿ": "y",
  "z": "z",
  "ⓩ": "z",
  "ｚ": "z",
  "ź": "z",
  "ẑ": "z",
  "ż": "z",
  "ž": "z",
  "ẓ": "z",
  "ẕ": "z",
  "ƶ": "z",
  "ȥ": "z",
  "ɀ": "z",
  "ⱬ": "z",
  "ꝣ": "z"
};
exports.ALPHABETS = {
  ALPHA: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ALPHANUMERIC: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  ALPHANUMERIC_SIMPLIFIED: "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789",
  BASE_64: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/",
  COMPLEX: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/$^-_.(){}:<>?,;|[]*%#+!@~=",
  HEXADECIMAL: "abcdef0123456789",
  NUMERIC: "0123456789"
};
/**
 * Test if the input is an empty string.
 * This function makes a basic cast to string so you can give it numbers for example.
 *
 * @param {string} input
 *
 * @returns {boolean}
 */

function isEmptyString(input) {
  if (utils_2.isNullOrUndefined(input) || !utils_2.isString(input)) {
    return true;
  }

  return trim("" + input).length === 0;
}

exports.isEmptyString = isEmptyString;
/**
 * Test if the input looks like an URL string.
 */

function isUrl(input) {
  return utils_2.isString(input) && /^((((https?|ftp|rtsp|mms):)?\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6}|localhost))?(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/i.test(input);
}

exports.isUrl = isUrl;
/**
 * Normalize an URL by removing multiple slashes, backslashes, etc.
 */

function normalizeUrl(url) {
  return url.replace(/\\/g, "/").replace(/([^:])(\/\/+)/g, "$1/");
}

exports.normalizeUrl = normalizeUrl;
/**
 * Remove accents from a string.
 */

function removeAccents(input) {
  var output = "";

  for (var i = 0; i < input.length; i++) {
    var letter = input.charAt(i);
    output += letter in DIACRITICS_MAP ? DIACRITICS_MAP[letter] : letter;
  }

  return output;
}

exports.removeAccents = removeAccents;
/**
 * Basic slugify.
 *
 * @see https://gist.github.com/mathewbyrne/1280286
 */

function slugify(input) {
  return removeAccents(String(input)).toLowerCase().replace(/\s+/g, "-") // Replace spaces with -
  .replace(/[^\w\-]+/g, "-") // Remove all non-word chars
  .replace(/\-\-+/g, "-") // Replace multiple - with single -
  .replace(/^-+/, "") // Trim - from start of text
  .replace(/-+$/, ""); // Trim - from end of text
}

exports.slugify = slugify;
/**
 * Generates a random string.
 * Available alphabets are :
 *   - ALPHABETS.ALPHANUMERIC
 *   - ALPHABETS.ALPHA
 *   - ALPHABETS.ALPHANUMERIC
 *   - ALPHABETS.ALPHANUMERIC_SIMPLIFIED
 *   - ALPHABETS.BASE_64
 *   - ALPHABETS.COMPLEX
 *   - ALPHABETS.HEXADECIMAL
 *   - ALPHABETS.NUMERIC
 *
 * You can also provide your own.
 *
 * @param {number} length
 * @param {string} alphabet (optional, default: ALPHABETS.ALPHANUMERIC)
 *
 * @returns {string}
 */

function randomString(length, alphabet) {
  if (alphabet === void 0) {
    alphabet = exports.ALPHABETS.ALPHANUMERIC;
  }

  if (length < 1 || !utils_2.isString(alphabet)) {
    return null;
  }

  var output = "";

  for (var i = 0; i < length; i++) {
    output += alphabet[utils_1.randomInt(0, alphabet.length - 1)];
  }

  return output;
}

exports.randomString = randomString;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/utils/utils.ts":
/*!**********************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/utils/utils.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");

__webpack_require__(/*! core-js/modules/es.array.find */ "./node_modules/core-js/modules/es.array.find.js");

__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.join */ "./node_modules/core-js/modules/es.array.join.js");

__webpack_require__(/*! core-js/modules/es.array.reduce */ "./node_modules/core-js/modules/es.array.reduce.js");

__webpack_require__(/*! core-js/modules/es.array.slice */ "./node_modules/core-js/modules/es.array.slice.js");

__webpack_require__(/*! core-js/modules/es.array.splice */ "./node_modules/core-js/modules/es.array.splice.js");

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.number.to-fixed */ "./node_modules/core-js/modules/es.number.to-fixed.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.get-prototype-of */ "./node_modules/core-js/modules/es.object.get-prototype-of.js");

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.parse-float */ "./node_modules/core-js/modules/es.parse-float.js");

__webpack_require__(/*! core-js/modules/es.parse-int */ "./node_modules/core-js/modules/es.parse-int.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/es.string.match */ "./node_modules/core-js/modules/es.string.match.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");

__webpack_require__(/*! core-js/modules/es.string.trim */ "./node_modules/core-js/modules/es.string.trim.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUrlFragment = exports.parseUrlFragment = exports.waitForDelay = exports.onNextCycle = exports.areEqual = exports.removeFromArray = exports.getFirstOf = exports.getFunctionArguments = exports.humanFileSize = exports.throttle = exports.debounce = exports.proxy = exports.randomInArray = exports.randomInt = exports.hasPropertyNested = exports.trim = exports.trimArray = exports.ensureSameType = exports.ensureInteger = exports.ensureNumber = exports.ensureString = exports.ensureObject = exports.ensureBoolean = exports.ensureArray = exports.isConstructor = exports.isValidMomentDate = exports.isElement = exports.isPojo = exports.isScalar = exports.isPromiseLike = exports.isInteger = exports.isValidNumber = exports.isArray = exports.isBoolean = exports.isBlob = exports.isFile = exports.isRegExp = exports.isFunction = exports.isDate = exports.isNumeric = exports.isNumber = exports.isString = exports.isBlankObject = exports.isObject = exports.isDefined = exports.isUndefined = exports.isNullOrUndefined = exports.noop = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var object_1 = __webpack_require__(/*! essentials/utils/object */ "./assets/essentials/core/scripts/ts/utils/object.ts");

var lodashToString = __webpack_require__(/*! lodash/toString */ "./node_modules/lodash/toString.js");

var lodashTrim = __webpack_require__(/*! lodash/trim */ "./node_modules/lodash/trim.js");
/**
 * Dummy function doing nothing.
 */


function noop() {// Do nothing.
}

exports.noop = noop;
/**
 * Determines if a reference is null or undefined.
 */

function isNullOrUndefined(value) {
  return value === null || typeof value === "undefined";
}

exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Determines if a reference is undefined.
 */

function isUndefined(value) {
  return typeof value === "undefined";
}

exports.isUndefined = isUndefined;
/**
 * Determines if a reference is defined.
 */

function isDefined(value) {
  return typeof value !== "undefined";
}

exports.isDefined = isDefined;
/**
 * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
 * considered to be objects. Note that JavaScript arrays are objects.
 */

function isObject(value, strict) {
  if (strict === void 0) {
    strict = false;
  } // http://jsperf.com/isobject4


  return value !== null && _typeof(value) === "object" && (!strict || !isArray(value));
}

exports.isObject = isObject;
/**
 * Determine if a value is an object with a null prototype
 */

function isBlankObject(value) {
  return value !== null && _typeof(value) === "object" && !Object.getPrototypeOf(value);
}

exports.isBlankObject = isBlankObject;
/**
 * Determines if a reference is a string.
 */

function isString(value) {
  return typeof value === "string";
}

exports.isString = isString;
/**
 * Determines if a reference is a number.
 */

function isNumber(value) {
  return typeof value === "number";
}

exports.isNumber = isNumber;
/**
 * Test if a variable represent number or not.
 */

function isNumeric(value) {
  return !isObject(value) && !isNaN(parseFloat(value)) && isFinite(value);
}

exports.isNumeric = isNumeric;
/**
 * Determines if a value is a date.
 */

function isDate(value) {
  return Object.prototype.toString.call(value) === "[object Date]";
}

exports.isDate = isDate;
/**
 * Determines if the input is a function.
 */

function isFunction(value) {
  return typeof value === "function";
}

exports.isFunction = isFunction;
/**
 * Determines if a value is a regular expression object.
 * The input must be a RegExp object in order to return true, NOT a string.
 */

function isRegExp(value) {
  return Object.prototype.toString.call(value) === "[object RegExp]";
}

exports.isRegExp = isRegExp;
/**
 * Test if the input is a File object.
 */

function isFile(value) {
  return Object.prototype.toString.call(value) === "[object File]";
}

exports.isFile = isFile;
/**
 * Test if the input is a blob object.
 */

function isBlob(value) {
  return Object.prototype.toString.call(value) === "[object Blob]";
}

exports.isBlob = isBlob;
/**
 * Test if the input is a boolean.
 */

function isBoolean(input) {
  return typeof input === "boolean";
}

exports.isBoolean = isBoolean;
/**
 * Test if the input is a real array.
 * Objects will return false.
 */

function isArray(input) {
  return Object.prototype.toString.call(input) === "[object Array]";
}

exports.isArray = isArray;
/**
 * Test if the input is a number.
 * This function not only checks the type like the angular one, it aso check if it is an invalid number.
 */

function isValidNumber(input) {
  return typeof input === "number" && !isNaN(input);
}

exports.isValidNumber = isValidNumber;
/**
 * Test if the input is an integer.
 * Notice: "1" will return false because it's a string.
 */

function isInteger(input) {
  return isValidNumber(input) && input % 1 === 0;
}

exports.isInteger = isInteger;
/**
 * Test if the input looks like a promise.
 */

function isPromiseLike(input) {
  return input && isFunction(input.then);
}

exports.isPromiseLike = isPromiseLike;
/**
 * Test if the input is a scalar type.
 */

function isScalar(input) {
  return isString(input) || isNumber(input) || isBoolean(input) || isNullOrUndefined(input);
}

exports.isScalar = isScalar;
/**
 * Test if the input is a plain old javascript object.
 *
 * @param {any}     input
 * @param {boolean} deep  (optional, default: true) if true, the check will be done recursively on all properties of the object.
 *
 * @return {boolean}
 */

function isPojo(input, deep) {
  if (deep === void 0) {
    deep = true;
  }

  if (input === null || _typeof(input) !== "object") {
    return false;
  }

  if (Object.getPrototypeOf(input) !== Object.prototype) {
    return false;
  }

  if (!deep) {
    return true;
  }

  var testObjValue = function testObjValue(value) {
    if (isArray(value)) {
      for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
        var item = value_1[_i];

        if (!testObjValue(item)) {
          return false;
        }
      }

      return true;
    }

    if (!isScalar(value) && !isPojo(value, true)) {
      return false;
    }

    return true;
  };

  for (var _i = 0, _a = Object.keys(input); _i < _a.length; _i++) {
    var key = _a[_i];

    if (!testObjValue(input[key])) {
      return false;
    }
  }

  return true;
}

exports.isPojo = isPojo;
/**
 * Determines if a reference is a DOM element (or wrapped jQuery element).
 */

function isElement(node) {
  return !!(node && (node.nodeName // We are a direct element.
  || node.prop && node.attr && node.find)); // We have an on and find method part of jQuery API.
}

exports.isElement = isElement;
/**
 * Test if the input is a valid momentjs date.
 */

function isValidMomentDate(value) {
  return isObject(value) && (!isUndefined(value.isMoment) || !isUndefined(value._isAMomentObject)) && (isFunction(value.isValid) && value.isValid() || value._isValid === true);
}

exports.isValidMomentDate = isValidMomentDate;
/**
 * Test if the input value is an object constructor.
 */

function isConstructor(value) {
  try {
    new new Proxy(value, {
      construct: function construct() {
        return {};
      }
    })();
    return true;
  } catch (err) {
    return false;
  }
}

exports.isConstructor = isConstructor;
/**
 * Ensure the input is always a valid array.
 */

function ensureArray(input) {
  if (isNullOrUndefined(input)) {
    return [];
  }

  if (!isArray(input)) {
    return [input];
  }

  return input;
}

exports.ensureArray = ensureArray;
/**
 * Ensure the input is converted to a boolean.
 */

function ensureBoolean(input) {
  return input === true || input === "" || input === "true" || input === "on" || !!input;
}

exports.ensureBoolean = ensureBoolean;
/**
 * Ensure the input is converted to an object.
 */

function ensureObject(input, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = {};
  }

  return isObject(input) ? input : defaultValue;
}

exports.ensureObject = ensureObject;
/**
 * Ensure the input is converted to a string.
 */

function ensureString(input) {
  return !isNullOrUndefined(input) ? lodashToString(input) : "";
}

exports.ensureString = ensureString;
/**
 * Ensure the input is converted to a valid number.
 */

function ensureNumber(input, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = 0;
  }

  if (isString(input)) {
    if (input.indexOf(".") < 0) {
      input = parseInt(input, 10);
    } else {
      input = parseFloat(input);
    }
  }

  return isValidNumber(input) ? input : defaultValue;
}

exports.ensureNumber = ensureNumber;
/**
 * Ensure the input is converted to a valid number.
 */

function ensureInteger(input, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = 0;
  }

  if (isString(input)) {
    input = parseInt(input, 10);
  }

  return isValidNumber(input) ? input : defaultValue;
}

exports.ensureInteger = ensureInteger;
/**
 * Ensure the input is converted to a valid number.
 */

function ensureSameType(input, referenceValue) {
  var targetType = _typeof(referenceValue);

  switch (targetType) {
    case 'string':
      return ensureString(input);

    case 'number':
    case 'bigint':
      return ensureNumber(input);

    case 'boolean':
      return ensureBoolean(input);

    case 'object':
      {
        if (isArray(referenceValue)) {
          return ensureArray(input);
        }

        return ensureObject(input);
      }

    case 'undefined':
      return undefined;
  }

  return input;
}

exports.ensureSameType = ensureSameType;
/**
 * Trim each element of a string array.
 */

function trimArray(input) {
  for (var i = 0; i < input.length; ++i) {
    input[i] = lodashTrim(input[i]);
  }

  return input;
}

exports.trimArray = trimArray;
/**
 * Trim a string.
 */

function trim() {
  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }

  return lodashTrim.apply(null, args);
}

exports.trim = trim;
/**
 * Test if an object contains a nested set of properties.
 *
 * @param {object}    obj
 * @param {...string} keys any number of keys the check.
 *                         Checks are nested, meaning the second property will have to be in an object
 *                         pointed by the first one, and so on.
 *
 * @returns {boolean}
 */

function hasPropertyNested(obj) {
  var keys = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    keys[_i - 1] = arguments[_i];
  }

  if (!isObject(obj)) {
    return false;
  }

  for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
    var key = keys_1[_a];

    if (!obj.hasOwnProperty(key)) {
      return false;
    }

    obj = obj[key];
  }

  return true;
}

exports.hasPropertyNested = hasPropertyNested;
/**
 * Generates a random integer between two values.
 */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.randomInt = randomInt;
/**
 * Return a random element from an array.
 */

function randomInArray(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

exports.randomInArray = randomInArray;
/**
 * Bind a function to a context, optionally partially applying any arguments.
 * Extracted from jQuery 3.2.1 with minor modifications.
 */

function proxy(fn, context) {
  var tmp;
  var args;

  if (typeof context === "string") {
    tmp = fn[context];
    context = fn;
    fn = tmp;
  } // Quick check to determine if target is callable, in the spec
  // this throws a TypeError, but we will just return undefined.


  if (!isFunction(fn)) {
    return undefined;
  } // Simulated bind


  args = Array.prototype.slice.call(arguments, 2);
  return function () {
    return fn.apply(context || this, args.concat(Array.prototype.slice.call(arguments)));
  };
}

exports.proxy = proxy;
/**
 * Ensure a function is only called after not being called for a certain amount of time.
 *
 * @param {function} func      function to call
 * @param {number}   wait      time with no call to wait before calling the function
 * @param {boolean}  immediate (optional, default: true) call the function immediatly after the first call or not?
 *
 * @returns {function}
 */

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;

    var later = function later() {
      timeout = null;
      func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

exports.debounce = debounce;
/**
 * Throttle call to a function to ensure it is not called more frequently than a specified timing.
 *
 * @param {function} func      function to call
 * @param {number}   threshold minimum time between calls, in ms
 * @param {object}   scope     (optional, default: this)
 *
 * @returns {function}
 */

function throttle(func, threshold, scope) {
  if (scope === void 0) {
    scope = null;
  }

  var last;
  var deferTimer;
  return function () {
    var context = scope || this;
    var now = new Date().getTime();
    var args = arguments;

    if (last && now < last + threshold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        func.apply(context, args);
      }, threshold);
    } else {
      last = now;
      func.apply(context, args);
    }
  };
}

exports.throttle = throttle;
/**
 * Convert a size in bytes to a human friendly string.
 */

function humanFileSize(bytes, si) {
  if (si === void 0) {
    si = true;
  }

  var thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  var u = -1;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);

  return bytes.toFixed(1) + ' ' + units[u];
}

exports.humanFileSize = humanFileSize;
/**
 * Try to get arguments names of a function at runtime.
 * @source https://stackoverflow.com/a/9924463/1110635
 */

function getFunctionArguments(func) {
  if (!isFunction(func)) {
    return [];
  }

  var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;
  var str = func.toString().replace(STRIP_COMMENTS, '');
  var result = str.slice(str.indexOf('(') + 1, str.indexOf(')')).match(ARGUMENT_NAMES);
  return result !== null ? result : [];
}

exports.getFunctionArguments = getFunctionArguments;
/**
 * Gets the first defined value of the list or arg.
 * If all arguments are undefined, undefined is returned.
 */

function getFirstOf() {
  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }

  if (args.length === 0) {
    return undefined;
  }

  for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
    var arg = args_1[_a];

    if (!isUndefined(arg)) {
      return arg;
    }
  }

  return args[args.length - 1];
}

exports.getFirstOf = getFirstOf;
/**
 * Search the first match of an item in an array and removes it.
 */

function removeFromArray(ar, item) {
  var pos = ar.indexOf(item);

  if (pos >= 0) {
    ar.splice(pos, 1);
    return true;
  }

  return false;
}

exports.removeFromArray = removeFromArray;
/**
 * Test if two values are the same, no matter their type.
 */

function areEqual(a, b) {
  var ta = a !== null ? _typeof(a) : 'null';
  var tb = b !== null ? _typeof(b) : 'null';

  if (ta !== tb) {
    return false;
  }

  switch (ta) {
    case "undefined":
      return true;

    case "object":
      return object_1.areSameObjects(a, b);

    case "symbol":
      return true;
    // function, boolean, number, string, ...

    default:
      {
        return a === b;
      }
  }
}

exports.areEqual = areEqual;
/**
 * Return a promise that is resolved on the next the next render cycle.
 */

function onNextCycle() {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      return [2
      /*return*/
      , waitForDelay(0)];
    });
  });
}

exports.onNextCycle = onNextCycle;
/**
 * Return a promise that is resolved after a certain delay (in ms).
 */

function waitForDelay(duration) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      return [2
      /*return*/
      , new Promise(function (resolve) {
        window.setTimeout(resolve, duration);
      })];
    });
  });
}

exports.waitForDelay = waitForDelay;
/**
 * Convert the url fragment into a key/value pair object.
 */

function parseUrlFragment() {
  var hash = window.location.hash.substr(1);
  return hash.split('&').reduce(function (result, item) {
    var parts = item.split('=');

    if (parts.length === 2) {
      result[parts[0]] = parts[1];
    }

    return result;
  }, {});
}

exports.parseUrlFragment = parseUrlFragment;
/**
 * Update the fragment of the url with a key/value pair object.
 * Existing elements are overridden.
 */

function updateUrlFragment(obj) {
  var fragment = [];
  obj = object_1.merge({}, parseUrlFragment(), obj);

  for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
    var key = _a[_i];
    fragment.push(key + '=' + obj[key]);
  }

  window.location.hash = fragment.join('&');
}

exports.updateUrlFragment = updateUrlFragment;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/vuejs/directives/abstract-directive.ts":
/*!**********************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/vuejs/directives/abstract-directive.ts ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.function.bind */ "./node_modules/core-js/modules/es.function.bind.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/es.weak-map */ "./node_modules/core-js/modules/es.weak-map.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractDirective = void 0;

var object_1 = __webpack_require__(/*! essentials/utils/object */ "./assets/essentials/core/scripts/ts/utils/object.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var AbstractDirective =
/** @class */
function () {
  function AbstractDirective() {
    this.eventListeners = new WeakMap();
    this.bindingValuesWatchers = {};
    this.lastBindingValueSnapshot = {};
  }
  /**
   * @inheritDoc
   */


  AbstractDirective.prototype.bind = function (el, binding, vnode, oldVnode) {
    this.updateData(el, binding, vnode);
  };
  /**
   * @inheritDoc
   */


  AbstractDirective.prototype.inserted = function (el, binding, vnode, oldVnode) {
    this.updateData(el, binding, vnode);
  };
  /**
   * @inheritDoc
   */


  AbstractDirective.prototype.update = function (el, binding, vnode, oldVnode) {
    this.updateData(el, binding, vnode);
  };
  /**
   * @inheritDoc
   */


  AbstractDirective.prototype.componentUpdated = function (el, binding, vnode, oldVnode) {
    this.updateData(el, binding, vnode);
  };
  /**
   * @inheritDoc
   */


  AbstractDirective.prototype.unbind = function (el, binding, vnode, oldVnode) {
    this.updateData(el, binding, vnode);
  };
  /**
   * Try to get a value from the directive's binding.
   */


  AbstractDirective.prototype.fetchBindingValue = function (name, defaultValue) {
    if (defaultValue === void 0) {
      defaultValue = null;
    }

    if (this.binding && utils_1.isObject(this.binding.value) && !utils_1.isUndefined(this.binding.value[name])) {
      return this.binding.value[name];
    }

    return defaultValue;
  };

  AbstractDirective.prototype.watchBidingValue = function (name, callback) {
    if (utils_1.isUndefined(this.bindingValuesWatchers[name])) {
      this.bindingValuesWatchers[name] = {
        lastValue: undefined,
        callbacks: []
      };
    }

    this.bindingValuesWatchers[name].callbacks.push(callback);
  };
  /**
   * Bind an event to an HTML element and guarantee the context to be the directive's class instance.
   */


  AbstractDirective.prototype.addEventListener = function (el, name, callback, options) {
    if (!this.eventListeners.has(el)) {
      this.eventListeners.set(el, {});
    }

    var map = this.eventListeners.get(el);

    if (!utils_1.isUndefined(map[name])) {
      this.removeEventListener(el, name);
    }

    var wrappedCallback = utils_1.proxy(callback, this);
    el.addEventListener(name, wrappedCallback, options);
    map[name] = wrappedCallback;
    this.eventListeners.set(el, map);
  };
  /**
   * Unbind an event previously bound using the addEventListener() method.
   */


  AbstractDirective.prototype.removeEventListener = function (el, name) {
    if (!this.eventListeners.has(el)) {
      return;
    }

    var map = this.eventListeners.get(el);

    if (!utils_1.isUndefined(map[name])) {
      el.removeEventListener(name, map[name]);
    }

    delete map[name];
    this.eventListeners.set(el, map);
  };
  /**
   * Dispatch an event to the parent.
   */


  AbstractDirective.prototype.emit = function (eventName, eventData) {
    if (this.vnode.componentInstance) {
      this.vnode.componentInstance.$emit(eventName, eventData);
    } else {
      this.vnode.elm.dispatchEvent(new CustomEvent(eventName, {
        detail: eventData
      }));
    }
  };

  AbstractDirective.prototype.updateData = function (el, binding, vnode) {
    this.el = el;
    this.binding = binding;
    this.vnode = vnode;
    this.checkAndNotifyForBindingValueChanges();
  };
  /**
   * Check if changes are found between the current state of the binding and the latest saved.
   */


  AbstractDirective.prototype.checkAndNotifyForBindingValueChanges = function () {
    if (!utils_1.isObject(this.binding.value)) {
      return;
    }

    var differences = object_1.compareObjects(this.lastBindingValueSnapshot, this.binding.value);

    for (var _i = 0, _a = Object.keys(differences); _i < _a.length; _i++) {
      var propertyName = _a[_i];

      if (!utils_1.isUndefined(this.bindingValuesWatchers[propertyName])) {
        for (var _b = 0, _c = this.bindingValuesWatchers[propertyName].callbacks; _b < _c.length; _b++) {
          var callback = _c[_b];
          callback.apply(this, [this.binding.value[propertyName], this.lastBindingValueSnapshot[propertyName]]);
        }
      }
    }

    this.lastBindingValueSnapshot = object_1.extend({}, this.binding.value, true);
  };

  return AbstractDirective;
}();

exports.AbstractDirective = AbstractDirective;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/vuejs/directives/directive-factory.ts":
/*!*********************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/vuejs/directives/directive-factory.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.function.bind */ "./node_modules/core-js/modules/es.function.bind.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/es.weak-map */ "./node_modules/core-js/modules/es.weak-map.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DirectiveFactory = void 0;

var DirectiveFactory =
/** @class */
function () {
  function DirectiveFactory() {}

  DirectiveFactory.Create = function (ctor) {
    if (DirectiveFactory.Instances === null) {
      DirectiveFactory.Instances = new WeakMap();
    }

    return {
      bind: function bind(el, binding, vnode, oldVnode) {
        var instance = new ctor();
        DirectiveFactory.Instances.set(el, instance);
        instance.bind(el, binding, vnode, oldVnode);
      },
      inserted: function inserted(el, binding, vnode, oldVnode) {
        if (DirectiveFactory.Instances.has(el)) {
          DirectiveFactory.Instances.get(el).inserted(el, binding, vnode, oldVnode);
        }
      },
      update: function update(el, binding, vnode, oldVnode) {
        if (DirectiveFactory.Instances.has(el)) {
          DirectiveFactory.Instances.get(el).update(el, binding, vnode, oldVnode);
        }
      },
      componentUpdated: function componentUpdated(el, binding, vnode, oldVnode) {
        if (DirectiveFactory.Instances.has(el)) {
          DirectiveFactory.Instances.get(el).componentUpdated(el, binding, vnode, oldVnode);
        }
      },
      unbind: function unbind(el, binding, vnode, oldVnode) {
        if (DirectiveFactory.Instances.has(el)) {
          DirectiveFactory.Instances.get(el).unbind(el, binding, vnode, oldVnode);
        }
      }
    };
  };

  DirectiveFactory.Instances = null;
  return DirectiveFactory;
}();

exports.DirectiveFactory = DirectiveFactory;

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/vuejs/directives/perfect-scrollbar.ts":
/*!*********************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/vuejs/directives/perfect-scrollbar.ts ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.function.bind */ "./node_modules/core-js/modules/es.function.bind.js");

__webpack_require__(/*! core-js/modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/es.weak-map */ "./node_modules/core-js/modules/es.weak-map.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PerfectScrollbar = exports.PerfectScrollbarDirective = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var vue_app_1 = __webpack_require__(/*! essentials/jquery/modules/vue-app */ "./assets/essentials/core/scripts/ts/jquery/modules/vue-app.ts");

var abstract_directive_1 = __webpack_require__(/*! essentials/vuejs/directives/abstract-directive */ "./assets/essentials/core/scripts/ts/vuejs/directives/abstract-directive.ts");

var directive_factory_1 = __webpack_require__(/*! essentials/vuejs/directives/directive-factory */ "./assets/essentials/core/scripts/ts/vuejs/directives/directive-factory.ts");

var vue_1 = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");
/**
 * Require: https://github.com/mdbootstrap/perfect-scrollbar
 * npm i perfect-scrollbar --save
 */
// @ts-ignore


var perfect_scrollbar_1 = __webpack_require__(/*! perfect-scrollbar */ "./node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js");

__webpack_require__(/*! perfect-scrollbar/css/perfect-scrollbar.css */ "./node_modules/perfect-scrollbar/css/perfect-scrollbar.css");

var PerfectScrollbarDirective =
/** @class */
function (_super) {
  tslib_1.__extends(PerfectScrollbarDirective, _super);

  function PerfectScrollbarDirective() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Update perfect scrollbar for a given HTML element.
   */


  PerfectScrollbarDirective.UpdateForElement = function (el) {
    var ps = PerfectScrollbarDirective.Instances.get(el);

    if (ps) {
      ps.update();
    }
  };
  /**
   * @inheritDoc
   */


  PerfectScrollbarDirective.prototype.bind = function (el, binding, vnode, oldVnode) {
    _super.prototype.bind.call(this, el, binding, vnode, oldVnode);
    /**
     * Hack because of a perfect scrollbar bug.
     * @see https://github.com/mdbootstrap/perfect-scrollbar/issues/792
     */


    vue_1["default"].nextTick(function () {
      var ps = new perfect_scrollbar_1["default"](el, Object.assign(PerfectScrollbarDirective.Defaults, binding.value));
      PerfectScrollbarDirective.Instances.set(el, ps);
    });
  };
  /**
   * @inheritDoc
   */


  PerfectScrollbarDirective.prototype.update = function (el, binding, vnode, oldVnode) {
    _super.prototype.update.call(this, el, binding, vnode, oldVnode);

    PerfectScrollbarDirective.UpdateForElement(el);
  };

  PerfectScrollbarDirective.prototype.componentUpdated = function (el, binding, vnode, oldVnode) {
    _super.prototype.componentUpdated.call(this, el, binding, vnode, oldVnode);

    PerfectScrollbarDirective.UpdateForElement(el);
  };
  /**
   * @inheritDoc
   */


  PerfectScrollbarDirective.prototype.unbind = function (el, binding, vnode, oldVnode) {
    _super.prototype.componentUpdated.call(this, el, binding, vnode, oldVnode);

    var ps = PerfectScrollbarDirective.Instances.get(el);

    if (ps) {
      ps.destroy();
    }

    PerfectScrollbarDirective.Instances["delete"](el);
  };

  PerfectScrollbarDirective.Instances = new WeakMap();
  PerfectScrollbarDirective.Defaults = {
    wheelPropagation: true,
    suppressScrollX: false
  };
  return PerfectScrollbarDirective;
}(abstract_directive_1.AbstractDirective);

exports.PerfectScrollbarDirective = PerfectScrollbarDirective;
exports.PerfectScrollbar = directive_factory_1.DirectiveFactory.Create(PerfectScrollbarDirective);
vue_app_1.VueApp.RegisterGlobalDirective('perfect-scrollbar', exports.PerfectScrollbar);

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tippy-default-options.ts":
/*!*********************************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tippy-default-options.ts ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIPPY_DEFAULT_OPTIONS = void 0;
exports.TIPPY_DEFAULT_OPTIONS = {
  /**
   * Determines if content strings are parsed as HTML instead of text.
   * Make sure you are sanitizing any user data if rendering HTML to prevent XSS attacks.
   */
  allowHTML: false,

  /**
   * Determines if the tippy has an arrow.
   */
  arrow: true,

  /**
   * Delay in ms once a trigger event is fired before a tippy shows or hides.
   */
  delay: 0,

  /**
   * How far in pixels the tippy element is from the reference element.
   */
  distance: 4,

  /**
   * Determines if the tippy should hide if a mousedown event was fired outside of it
   * (i.e. clicking on the reference element or the body of the page).
   */
  hideOnClick: true,

  /**
   * Determines if the tippy is interactive, i.e. it can be hovered over or clicked without hiding.
   */
  interactive: true,

  /**
   * Determines the maximum width of the tippy.
   */
  maxWidth: 350,

  /**
   * Determines the offset of the tippy element.
   *
   * Unlike distance, it can work on both axes by using a string in the form "x, y", such as "50, 20".
   *
   * Avoid using an offset along the same axis as the placement prop if using interactive: true.
   * If using a number, there won't be any problems.
   */
  offset: 0,

  /**
   * Positions the tippy relative to its reference element.
   *
   * Use the suffix -start or -end to shift the tippy to the start or end of the reference element,
   * instead of centering it. For example, "top-start" or "left-end".
   */
  placement: "top",

  /**
   * The events (each separated by a space) which cause a tippy to show.
   *
   * Possible values: "mouseenter", "focus", "click", "manual".
   *
   * Use "manual" to only trigger the tippy programmatically.
   */
  trigger: "mouseenter focus",

  /**
   * The type of transition animation.
   *
   * Available animations are :
   *  - shift-away
   *  - shift-toward
   *  - scale
   *  - perspective
   */
  animation: 'shift-away',

  /**
   * Determines if the background fill color of the tippy should be animated.
   *
   * You must import the dist/backdrop.css & animations/shift-away.css stylesheets for styling to work.
   * You must also import the "animateFill" plugin.
   */
  animateFill: true,

  /**
   * Which element(s) the trigger event listeners are applied to instead of the reference element.
   *
   * Possible values: null, Element, or Element[].
   */
  triggerTarget: null,

  /**
   * Determines the z-index of the tippy.
   */
  zIndex: 9999,

  /**
   * Silences keyboard accessibility warning when used on an inline element.
   *
   * @see https://atomiks.github.io/tippyjs/accessibility/#interactivity
   */
  appendTo: document.body,

  /**
   * If true, force the tooltip to stay visible.
   * If false, force the tooltip to remain hidden.
   *
   * Only used if "trigger" is set to "manual".
   */
  visible: false
};

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tooltip.css":
/*!********************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tooltip.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tooltip.ts":
/*!*******************************************************************************!*\
  !*** ./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tooltip.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.assign */ "./node_modules/core-js/modules/es.object.assign.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tooltip = void 0;
/**
 * Require: https://github.com/atomiks/tippyjs
 * npm i tippy.js --save
 */

var vue_app_1 = __webpack_require__(/*! essentials/jquery/modules/vue-app */ "./assets/essentials/core/scripts/ts/jquery/modules/vue-app.ts"); // @ts-ignore


var tippy_js_1 = __webpack_require__(/*! tippy.js */ "./node_modules/tippy.js/dist/tippy.esm.js");

__webpack_require__(/*! tippy.js/dist/tippy.css */ "./node_modules/tippy.js/dist/tippy.css");

__webpack_require__(/*! tippy.js/dist/backdrop.css */ "./node_modules/tippy.js/dist/backdrop.css");

__webpack_require__(/*! tippy.js/themes/light.css */ "./node_modules/tippy.js/themes/light.css");

__webpack_require__(/*! tippy.js/animations/shift-away.css */ "./node_modules/tippy.js/animations/shift-away.css");

__webpack_require__(/*! ./tooltip.css */ "./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tooltip.css");

var vue_1 = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var object_1 = __webpack_require__(/*! essentials/utils/object */ "./assets/essentials/core/scripts/ts/utils/object.ts");

var tippy_default_options_1 = __webpack_require__(/*! essentials/vuejs/directives/tooltip/tippy-default-options */ "./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tippy-default-options.ts");

var currentTippyOptions = {};

function buildOptions(defaultOptions, el, binding) {
  var options = Object.assign({}, defaultOptions);

  if (utils_1.isString(binding.value)) {
    options.content = binding.value;
  } else if (utils_1.isObject(binding.value)) {
    options = object_1.extend(options, binding.value, true);
  }

  if (utils_1.isUndefined(options.content)) {
    if (el.getAttribute('title')) {
      options.content = el.getAttribute('title');
    }

    if (el.getAttribute('content')) {
      options.content = el.getAttribute('content');
    }
  }

  return options;
}

function filterOptions(options) {
  options = Object.assign({}, options);

  if (!utils_1.isUndefined(options.visible)) {
    delete options.visible;
  }

  return options;
}
/**
 * Create a tippy instance.
 */


function createTippy(el, binding, vnode) {
  var handlers = vnode.data && vnode.data.on || vnode.componentOptions && vnode.componentOptions.listeners;
  var opts = tippy_default_options_1.TIPPY_DEFAULT_OPTIONS;

  if (handlers && handlers['show']) {
    opts.onShow = function () {
      var _a;

      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return (_a = handlers['show']).fns.apply(_a, args);
    };
  }

  if (handlers && handlers['shown']) {
    opts.onShown = function () {
      var _a;

      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      (_a = handlers['shown']).fns.apply(_a, args);
    };
  }

  if (handlers && handlers['hidden']) {
    opts.onHidden = function () {
      var _a;

      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      (_a = handlers['hidden']).fns.apply(_a, args);
    };
  }

  if (handlers && handlers['hide']) {
    opts.onHide = function () {
      var _a;

      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return (_a = handlers['hide']).fns.apply(_a, args);
    };
  }

  if (handlers && handlers['mount']) {
    opts.onMount = function () {
      var _a;

      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      (_a = handlers['mount']).fns.apply(_a, args);
    };
  }

  currentTippyOptions = buildOptions(opts, el, binding);
  tippy_js_1["default"](el, object_1.extend(filterOptions(currentTippyOptions), {
    plugins: [tippy_js_1.followCursor, tippy_js_1.animateFill]
  }));

  if (opts.showOnLoad) {
    el._tippy.show();
  }

  vue_1["default"].nextTick(function () {
    if (handlers && handlers['init']) {
      handlers['init'].fns(el._tippy, el);
    }

    handleManualVisibility(el);
  });
}

function handleManualVisibility(el) {
  if (currentTippyOptions.trigger === 'manual') {
    if (currentTippyOptions.visible === true) {
      el._tippy.show();
    } else {
      el._tippy.hide();
    }
  }
}

exports.Tooltip = {
  inserted: function inserted(el, binding, vnode) {
    vue_1["default"].nextTick(function () {
      createTippy(el, binding, vnode);
    });
  },
  componentUpdated: function componentUpdated(el, binding, vnode) {
    if (!utils_1.isUndefined(el._tippy)) {
      currentTippyOptions = buildOptions(currentTippyOptions, el, binding);

      el._tippy.setProps(filterOptions(currentTippyOptions));

      vue_1["default"].nextTick(function () {
        handleManualVisibility(el);
      });
    }
  },
  unbind: function unbind(el) {
    if (utils_1.isObject(el._tippy)) {
      el._tippy.destroy();
    }
  }
};
vue_app_1.VueApp.RegisterGlobalDirective('tooltip', exports.Tooltip);

/***/ }),

/***/ "./assets/essentials/vendor/font-awesome-pro/font-awesome-pro-all.scss":
/*!*****************************************************************************!*\
  !*** ./assets/essentials/vendor/font-awesome-pro/font-awesome-pro-all.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/scripts/js/entry-point.js":
/*!******************************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/scripts/js/entry-point.js ***!
  \******************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var essentials_root_vendor_font_awesome_pro_font_awesome_pro_all_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! essentials-root/vendor/font-awesome-pro/font-awesome-pro-all.scss */ "./assets/essentials/vendor/font-awesome-pro/font-awesome-pro-all.scss");
/* harmony import */ var essentials_root_vendor_font_awesome_pro_font_awesome_pro_all_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(essentials_root_vendor_font_awesome_pro_font_awesome_pro_all_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_css_main_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../styles/css/main.css */ "./lib/heavy-task-bundle/src/Resources/assets/styles/css/main.css");
/* harmony import */ var _styles_css_main_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_css_main_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ts_main_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ts/main.ts */ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/main.ts");
/* harmony import */ var _ts_main_ts__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ts_main_ts__WEBPACK_IMPORTED_MODULE_2__);




/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/dependencies.ts":
/*!*******************************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/dependencies.ts ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This file includes everything that should be globally available in the app.
 */

__webpack_require__(/*! essentials/dependencies */ "./assets/essentials/core/scripts/ts/dependencies.ts");
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


__webpack_require__(/*! essentials/vuejs/directives/perfect-scrollbar */ "./assets/essentials/core/scripts/ts/vuejs/directives/perfect-scrollbar.ts");

__webpack_require__(/*! essentials/vuejs/directives/tooltip/tooltip */ "./assets/essentials/core/scripts/ts/vuejs/directives/tooltip/tooltip.ts");

__webpack_require__(/*! alertifyjs/build/css/alertify.css */ "./node_modules/alertifyjs/build/css/alertify.css");

__webpack_require__(/*! alertifyjs/build/css/themes/default.css */ "./node_modules/alertifyjs/build/css/themes/default.css");

__webpack_require__(/*! essentials/dialog/alertify/alertify.service */ "./assets/essentials/core/scripts/ts/dialog/alertify/alertify.service.ts");

__webpack_require__(/*! ./vuejs/components/manager/manager.component */ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.ts");

/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/main.ts":
/*!***********************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/main.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Client side entry point.
 * ------------------------
 *
 * Before anything else, import the dependencies file.
 * The role of this file is to import all modules in use in the app.
 */

__webpack_require__(/*! ./dependencies */ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/dependencies.ts");

var app_1 = __webpack_require__(/*! essentials/app */ "./assets/essentials/core/scripts/ts/app.ts");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

$(document).ready(function () {
  var app = container_1.Container.getContainer().get(app_1.AppSymbol);
  window.app = app;
  app.start();
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")))

/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.css":
/*!**************************************************************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.css ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.html":
/*!***************************************************************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.html ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Module
var code = "<div class=\"vc-heavy-task-manager flex flex-col overflow-hidden\"> <div class=\"flex justify-between items-center border-b border-primary-400 p-2 text-white\"> <h1>Background jobs viewer</h1> <div class=\"pr-2 text-green-500 font-bold\"> <i class=\"fas fa-circle blink\"></i> Listening </div> </div> <ul class=\"flex text-center\"> <li class=\"w-1/2 py-2 border-primary-500\" :class=\"activeTab === 'active' ? 'bg-primary-600 font-bold text-gray-300' : 'border-b bg-primary-700 text-gray-400 cursor-pointer'\" @click=\"activeTab = 'active'\">Active</li> <li class=\"w-1/2 py-2 border-primary-500\" :class=\"activeTab === 'history' ? 'bg-primary-600 font-bold text-gray-300' : 'border-b bg-primary-700 text-gray-400 cursor-pointer'\" @click=\"activeTab = 'history'\">History</li> </ul> <div ref=scrollContainer class=\"relative flex-1 text-gray-300\" v-perfect-scrollbar> <div v-if=!ready class=\"text-center pt-3\"><i class=\"fas fa-cog fa-spin\"></i> Loading...</div> <template v-else> <div v-if=\"activeTab === 'active'\"> <template v-if=\"activeTasks.length > 0\"> <task v-for=\"task in activeTasks\" :state=task></task> </template> <div class=\"text-center pt-3\" v-else> No background job currently running.<br/> The list will update automatically when a job is created. </div> </div> <div v-else> <template v-if=\"historyTasks.length > 0\"> <task v-for=\"task in historyTasks\" :state=task></task> </template> <div class=\"text-center pt-3\" v-else> No background job has been archived yet. </div> </div> </template> </div> </div> ";
// Exports
module.exports = code;

/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.ts":
/*!*************************************************************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.ts ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");

__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagerComponent = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");

var container_1 = __webpack_require__(/*! essentials/inversify/container */ "./assets/essentials/core/scripts/ts/inversify/container.ts");

var vue_app_1 = __webpack_require__(/*! essentials/jquery/modules/vue-app */ "./assets/essentials/core/scripts/ts/jquery/modules/vue-app.ts");

var network_1 = __webpack_require__(/*! essentials/network */ "./assets/essentials/core/scripts/ts/network/index.ts");

var utils_1 = __webpack_require__(/*! essentials/utils/utils */ "./assets/essentials/core/scripts/ts/utils/utils.ts");

var vue_1 = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

var vue_class_component_1 = __webpack_require__(/*! vue-class-component */ "./node_modules/vue-class-component/dist/vue-class-component.esm.js");

var task_component_1 = __webpack_require__(/*! ./task.component */ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/task.component.ts");

__webpack_require__(/*! ./manager.component.css */ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.css");

var ManagerComponent =
/** @class */
function (_super) {
  tslib_1.__extends(ManagerComponent, _super);

  function ManagerComponent() {
    var _this = _super !== null && _super.apply(this, arguments) || this; // Template vars


    _this.httpResponse = null;
    _this.activeTasks = [];
    _this.historyTasks = [];
    _this.activeTab = 'active';
    _this.ready = false; // Logic vars

    _this.http = container_1.Container.getContainer().get(network_1.HttpServiceSymbol);
    return _this;
  }

  ManagerComponent.prototype.mounted = function () {
    window.setInterval(utils_1.proxy(this.update, this), 2000);
  };

  ManagerComponent.prototype.update = function () {
    var _this = this;

    if (this.httpResponse && this.httpResponse.isPending) {
      return;
    }

    this.httpResponse = this.http.get('/heavy-task/ajax/supervisor-status');
    this.httpResponse.promise.then(function (result) {
      _this.activeTasks = result.active;
      _this.historyTasks = result.history;
      var merged = [].concat(_this.activeTasks, _this.historyTasks);

      for (var _i = 0, merged_1 = merged; _i < merged_1.length; _i++) {
        var item = merged_1[_i];
        item.startTime = moment.unix(item.startTime).format('MM/DD/YYYY HH:mm:ss');
        item.active = !utils_1.isUndefined(item.progress);
      }

      _this.ready = true;
    });
  };

  ManagerComponent = tslib_1.__decorate([vue_class_component_1["default"]({
    template: __webpack_require__(/*! ./manager.component.html */ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/manager.component.html"),
    components: {
      'task': task_component_1.TaskComponent
    }
  })], ManagerComponent);
  return ManagerComponent;
}(vue_1["default"]);

exports.ManagerComponent = ManagerComponent;
vue_app_1.VueApp.RegisterComponent('manager', ManagerComponent);

/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/task.component.html":
/*!************************************************************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/task.component.html ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Module
var code = "<div class=\"flex justify-between items-center border-b border-primary-500 text-primary-100 py-2 px-3 hover:bg-primary-500\"> <div class=\"flex items-center w-full\"> <div style=min-width:90px;width:90px class=\"text-center text-white text-sm font-medium mr-3\"> <div class=\"bg-teal-500 px-2 py-1 rounded-sm text-bold\" v-if=\"state.status === 'running'\"> <i class=\"fas fa-cog fa-spin\"></i> Running <span class=\"block text-xs\" v-if=state.progress> ({{ state.progress }})</span> </div> <div class=\"bg-orange-500 px-2 py-1 rounded-sm text-bold\" v-else-if=\"state.status === 'waiting'\">Waiting</div> <div class=\"bg-purple-400 px-2 py-1 rounded-sm text-bold\" v-else-if=\"state.status === 'scheduled'\">Scheduled</div> <div class=\"bg-red-700 px-2 py-1 rounded-sm\" v-else-if=\"state.status === 'crashed'\">Crashed</div> <div class=\"bg-green-500 px-2 py-1 rounded-sm\" v-else-if=\"state.status === 'finished'\">Finished</div> </div> <div class=flex-1> {{ state.name }} <div class=\"text-sm font-italic text-primary-400\">{{ state.description }}</div> <div v-if=\"state.status === 'crashed'\" class=\"px-2 py-1 bg-red-700 text-white rounded-sm text-xs\"> <span v-if=state.lastError>{{ state.lastError }}</span> <span v-else>Unknown error</span> </div> </div> </div> <div class=\"text-sm text-italic text-primary-400 ml-2 whitespace-no-wrap\"> {{ state.startTime }} | <span class=\"bg-primary-700 px-2 py-1 text-xs rounded-sm\">{{ state.id }}</span> </div> </div> ";
// Exports
module.exports = code;

/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/task.component.ts":
/*!**********************************************************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/task.component.ts ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskComponent = void 0;

var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var vue_app_1 = __webpack_require__(/*! essentials/jquery/modules/vue-app */ "./assets/essentials/core/scripts/ts/jquery/modules/vue-app.ts");

var vue_1 = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.esm.js");

var vue_class_component_1 = __webpack_require__(/*! vue-class-component */ "./node_modules/vue-class-component/dist/vue-class-component.esm.js");

var vue_property_decorator_1 = __webpack_require__(/*! vue-property-decorator */ "./node_modules/vue-property-decorator/lib/vue-property-decorator.js");

var TaskComponent =
/** @class */
function (_super) {
  tslib_1.__extends(TaskComponent, _super);

  function TaskComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  tslib_1.__decorate([vue_property_decorator_1.Prop({
    type: Object,
    required: true
  }), tslib_1.__metadata("design:type", Object)], TaskComponent.prototype, "state", void 0);

  TaskComponent = tslib_1.__decorate([vue_class_component_1["default"]({
    template: __webpack_require__(/*! ./task.component.html */ "./lib/heavy-task-bundle/src/Resources/assets/scripts/ts/vuejs/components/manager/task.component.html")
  })], TaskComponent);
  return TaskComponent;
}(vue_1["default"]);

exports.TaskComponent = TaskComponent;
vue_app_1.VueApp.RegisterComponent('manager-task', TaskComponent);

/***/ }),

/***/ "./lib/heavy-task-bundle/src/Resources/assets/styles/css/main.css":
/*!************************************************************************!*\
  !*** ./lib/heavy-task-bundle/src/Resources/assets/styles/css/main.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/moment/locale sync recursive [/\\\\](fr(\\.js)?)$":
/*!***********************************************************!*\
  !*** ./node_modules/moment/locale sync [/\\](fr(\.js)?)$ ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./fr": "./node_modules/moment/locale/fr.js",
	"./fr.js": "./node_modules/moment/locale/fr.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/moment/locale sync recursive [/\\\\](fr(\\.js)?)$";

/***/ })

},[["./lib/heavy-task-bundle/src/Resources/assets/scripts/js/entry-point.js","runtime","vendors~webeakheavytask"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvYXBwLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9jb25maWcvc2hhcmVkLWNvbmZpZ3VyYXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvZGVwZW5kZW5jaWVzLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9kaWFsb2cvYWxlcnRpZnkvYWxlcnRpZnkuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvZXJyb3IvYXBwLmVycm9yLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9lcnJvci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvZXJyb3IvcHVibGljLWFwcC5lcnJvci50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvZXJyb3Ivc3RvcC5lcnJvci50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvZXZlbnQvZXZlbnQtYXJnLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9ldmVudC9ldmVudC1kaXNwYXRjaGVyLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL2V2ZW50L2V2ZW50LWRpc3BhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL2V2ZW50L2luZGV4LnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9pbnZlcnNpZnkvY29udGFpbmVyLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9qcXVlcnkvanF1ZXJ5LW1vZHVsZS50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvanF1ZXJ5L2pxdWVyeS1tb2R1bGVzLW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL2pxdWVyeS9tb2R1bGVzL3Z1ZS1hcHAudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL2pxdWVyeS9zdHJpcC14c3NpLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9sb2cvY29uc3RhbnRzLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9sb2cvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL2xvZy9sb2dnZXIuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvbmV0d29yay9jb25zdGFudHMudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL25ldHdvcmsvZXJyb3IvYXV0aGVudGljYXRpb24uZXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL25ldHdvcmsvZXJyb3IvY2FuY2VsLmVycm9yLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9uZXR3b3JrL2Vycm9yL2h0dHAuZXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL25ldHdvcmsvZXJyb3IvbmV0d29yay5lcnJvci50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvbmV0d29yay9odHRwLXJlcXVlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL25ldHdvcmsvaHR0cC1yZXNwb25zZS50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvbmV0d29yay9odHRwLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL25ldHdvcmsvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL25ldHdvcmsvbmV0d29yay13YXRjaGVyLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL25ldHdvcmsvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3N0b3JhZ2UvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3N0b3JhZ2UvaW50ZXJmYWNlL3N0b3JhZ2UuaW50ZXJmYWNlLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9zdG9yYWdlL3NlcnZpY2UvY29va2llcy1kcml2ZXIuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvc3RvcmFnZS9zZXJ2aWNlL2xvY2FsLXN0b3JhZ2UtZHJpdmVyLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3N0b3JhZ2Uvc2VydmljZS9zdG9yYWdlLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3N0b3JhZ2Uvc3RvcmFnZS5mYWN0b3J5LnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy9zdG9yYWdlL3Zhci1ob2xkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3V0aWxzL2Jhc2U2NC50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvdXRpbHMvZXh0ZW5zaW9ucy9hbGwudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3V0aWxzL2V4dGVuc2lvbnMvZGF0ZS5leHRlbnNpb25zLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy91dGlscy9leHRlbnNpb25zL29iamVjdC5leHRlbnNpb25zLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy91dGlscy9leHRlbnNpb25zL3N0cmluZy5leHRlbnNpb25zLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy91dGlscy9tZDUudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3V0aWxzL29iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvdXRpbHMvc3RyaW5nLnRzIiwid2VicGFjazovLy8uL2Fzc2V0cy9lc3NlbnRpYWxzL2NvcmUvc2NyaXB0cy90cy91dGlscy91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvdnVlanMvZGlyZWN0aXZlcy9hYnN0cmFjdC1kaXJlY3RpdmUudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3Z1ZWpzL2RpcmVjdGl2ZXMvZGlyZWN0aXZlLWZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3Z1ZWpzL2RpcmVjdGl2ZXMvcGVyZmVjdC1zY3JvbGxiYXIudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3Z1ZWpzL2RpcmVjdGl2ZXMvdG9vbHRpcC90aXBweS1kZWZhdWx0LW9wdGlvbnMudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvY29yZS9zY3JpcHRzL3RzL3Z1ZWpzL2RpcmVjdGl2ZXMvdG9vbHRpcC90b29sdGlwLmNzcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZXNzZW50aWFscy9jb3JlL3NjcmlwdHMvdHMvdnVlanMvZGlyZWN0aXZlcy90b29sdGlwL3Rvb2x0aXAudHMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Vzc2VudGlhbHMvdmVuZG9yL2ZvbnQtYXdlc29tZS1wcm8vZm9udC1hd2Vzb21lLXByby1hbGwuc2NzcyIsIndlYnBhY2s6Ly8vLi9saWIvaGVhdnktdGFzay1idW5kbGUvc3JjL1Jlc291cmNlcy9hc3NldHMvc2NyaXB0cy9qcy9lbnRyeS1wb2ludC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvaGVhdnktdGFzay1idW5kbGUvc3JjL1Jlc291cmNlcy9hc3NldHMvc2NyaXB0cy90cy9kZXBlbmRlbmNpZXMudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL2hlYXZ5LXRhc2stYnVuZGxlL3NyYy9SZXNvdXJjZXMvYXNzZXRzL3NjcmlwdHMvdHMvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9saWIvaGVhdnktdGFzay1idW5kbGUvc3JjL1Jlc291cmNlcy9hc3NldHMvc2NyaXB0cy90cy92dWVqcy9jb21wb25lbnRzL21hbmFnZXIvbWFuYWdlci5jb21wb25lbnQuY3NzIiwid2VicGFjazovLy8uL2xpYi9oZWF2eS10YXNrLWJ1bmRsZS9zcmMvUmVzb3VyY2VzL2Fzc2V0cy9zY3JpcHRzL3RzL3Z1ZWpzL2NvbXBvbmVudHMvbWFuYWdlci9tYW5hZ2VyLmNvbXBvbmVudC5odG1sIiwid2VicGFjazovLy8uL2xpYi9oZWF2eS10YXNrLWJ1bmRsZS9zcmMvUmVzb3VyY2VzL2Fzc2V0cy9zY3JpcHRzL3RzL3Z1ZWpzL2NvbXBvbmVudHMvbWFuYWdlci9tYW5hZ2VyLmNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9saWIvaGVhdnktdGFzay1idW5kbGUvc3JjL1Jlc291cmNlcy9hc3NldHMvc2NyaXB0cy90cy92dWVqcy9jb21wb25lbnRzL21hbmFnZXIvdGFzay5jb21wb25lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9saWIvaGVhdnktdGFzay1idW5kbGUvc3JjL1Jlc291cmNlcy9hc3NldHMvc2NyaXB0cy90cy92dWVqcy9jb21wb25lbnRzL21hbmFnZXIvdGFzay5jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vbGliL2hlYXZ5LXRhc2stYnVuZGxlL3NyYy9SZXNvdXJjZXMvYXNzZXRzL3N0eWxlcy9jc3MvbWFpbi5jc3MiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL21vbWVudC9sb2NhbGUgc3luYyBbL1xcXFxdKGZyKFxcLmpzKSJdLCJuYW1lcyI6WyJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImV4cG9ydHMiLCJ2YWx1ZSIsIkFwcFN5bWJvbCIsIkFwcCIsInRzbGliXzEiLCJyZXF1aXJlIiwiZXZlbnRfMSIsImNvbnRhaW5lcl8xIiwianF1ZXJ5X21vZHVsZXNfbWFuYWdlcl8xIiwiaW52ZXJzaWZ5XzEiLCJqcXVlcnlNb2R1bGVzTWFuYWdlciIsIkNvbnRhaW5lciIsImdldENvbnRhaW5lciIsImdldCIsIkpxdWVyeU1vZHVsZXNNYW5hZ2VyU3ltYm9sIiwiZXZlbnREaXNwYXRjaGVyIiwiRXZlbnREaXNwYXRjaGVyU2VydmljZVN5bWJvbCIsImluaXRpYWxpemVycyIsImlzU3RhcnRlZCIsInByb3RvdHlwZSIsInN0YXJ0IiwiX2kiLCJfYSIsImxlbmd0aCIsImluaXRpYWxpemVyIiwiYXBwbHkiLCJzY2FuIiwicmVnaXN0ZXJJbml0aWFsaXplciIsImNhbGxiYWNrIiwicHVzaCIsIndpbmRvdyIsInNldFRpbWVvdXQiLCJ0cmlnZ2VyIiwibmFtZSIsImFyZyIsImRpc3BhdGNoIiwiX19kZWNvcmF0ZSIsImluamVjdGFibGUiLCJfX21ldGFkYXRhIiwiU3ltYm9sIiwiYmluZCIsInRvIiwiaW5TaW5nbGV0b25TY29wZSIsIlNoYXJlZENvbmZpZ3VyYXRpb25TeW1ib2wiLCJTaGFyZWRDb25maWd1cmF0aW9uIiwiRU5WIiwiY29uc3RhbnRzXzEiLCJ2YXJfaG9sZGVyXzEiLCJfc3VwZXIiLCJfX2V4dGVuZHMiLCJfdGhpcyIsImNhbGwiLCJlbnYiLCJ2ZXJzaW9uIiwidGltZXpvbmUiLCJkZWJ1ZyIsImxvZ3MiLCJsZXZlbCIsIkxvZ0xldmVsIiwiSU5GTyIsInN0b3JhZ2VLZXkiLCJzdG9yYWdlV3JpdGVJbnRlcnZhbCIsIm1heGltdW1Db3VudCIsIm5ldHdvcmsiLCJjb25uZWN0aW9uRXJyb3JSZXRyeURlbGF5IiwicmVsb2FkT25BdXRoZW50aWNhdGlvbkVycm9yIiwic3RvcmFnZSIsIlJlZ2lzdGVyIiwib2JqIiwiY29udGFpbmVyIiwidW5iaW5kIiwiZSIsInRvQ29uc3RhbnRWYWx1ZSIsIlZhckhvbGRlciIsIkNvbnN0YW50cyIsImVycm9yXzEiLCJhcmd1bWVudHMiLCJHZXQiLCJHZXRJbnN0YW5jZSIsImhhcyIsIkFwcEVycm9yIiwic2V0IiwiSW5zdGFuY2UiLCJBbGVydGlmeVNlcnZpY2VTeW1ib2wiLCJBbGVydGlmeVNlcnZpY2UiLCJhbGVydGlmeSIsInV0aWxzXzEiLCJiYXNlNjRfMSIsIm9iamVjdF8xIiwidXRpbHNfMiIsIkFsZXJ0aWZ5U2VydmljZV8xIiwiZGlhbG9nIiwib3B0aW9ucyIsInRoYXQiLCJpZCIsImdlbmVyYXRlVW5pcXVlSWQiLCJlbCIsInJlc29sdmVEaWFsb2dTb3VyY2UiLCJzb3VyY2UiLCJ3cmFwQ2FsbGJhY2siLCJwcmV2aW91cyIsImlzRnVuY3Rpb24iLCJpc051bGxPclVuZGVmaW5lZCIsImJ1dHRvbnMiLCJ0ZXh0Iiwia2V5IiwiaW52b2tlT25DbG9zZSIsImNsYXNzTmFtZSIsImRlZmF1bHRzIiwidGhlbWUiLCJvayIsImF0dHJzIiwiYXR0cmlidXRlIiwic2NvcGUiLCIkIiwiYXBwZW5kIiwiZGlhbG9nQ29uZmlnIiwiaG9va3NDb25maWciLCJvbnNob3ciLCJnZXRPYmplY3RWYWx1ZSIsIm5vb3AiLCJhZGRUb09iamVjdElmRGVmaW5lZCIsInVuZGVmaW5lZCIsIm9uQ2FsbGJhY2siLCJzZXR0aW5ncyIsImhvb2tzIiwic2V0dXAiLCJzZXR1cENvbmZpZyIsImV4dGVuZCIsIm1vZGFsIiwiYmFzaWMiLCJtYXhpbWl6YWJsZSIsInJlc2l6YWJsZSIsInBhZGRpbmciLCJmb2N1cyIsIm1haW4iLCJjb250ZW50Iiwic2V0Q29udGVudCIsIm9uTWFpbiIsImJ1aWxkIiwib25CdWlsZCIsInByZXBhcmUiLCJvblByZXBhcmUiLCJzZXR0aW5nVXBkYXRlZCIsIm9uU2V0dGluZ1VwZGF0ZWQiLCJub3RpZnlJbmZvIiwibWVzc2FnZSIsImR1cmF0aW9uSW5TZWNvbmRzIiwibm90aWZ5Iiwibm90aWZ5U3VjY2VzcyIsIm5vdGlmeVdhcm5pbmciLCJub3RpZnlFcnJvciIsIm5vdGlmeUFmdGVyUmVkaXJlY3QiLCJ0eXBlIiwidXJsIiwiZG9jdW1lbnQiLCJsb2NhdGlvbiIsImhyZWYiLCJidWlsZFF1ZXJ5UGFyYW1ldGVycyIsInAiLCJiYXNlNjRlbmNvZGVVcmxTYWZlIiwiSlNPTiIsInN0cmluZ2lmeSIsIk1BWF9JRCIsImlzT2JqZWN0IiwiSFRNTEVsZW1lbnQiLCJpc1VuZGVmaW5lZCIsImpxdWVyeSIsImlzU3RyaW5nIiwicHJvcCIsInJlZ2lzdGVyU2VydmljZSIsImV4dHJhIiwiY3JlYXRlIiwiSXNEZXYiLCJzdGFjayIsImNvbnNvbGUiLCJsb2ciLCJfaXNEZXYiLCJjb25mIiwiaW5wdXQiLCJkZWZhdWx0TWVzc2FnZSIsIkVycm9yIiwidG9TdHJpbmciLCJvcmlnaW5hbEVycm9yIiwiZ2V0UHVibGljTWVzc2FnZSIsInB1YmxpY0Vycm9yIiwiZ2V0UHVibGljRXJyb3IiLCJnZXRSZWFsRXJyb3IiLCJpc1B1YmxpY0Vycm9yIiwiZ2V0Rmlyc3RFcnJvck9mVHlwZSIsImNvbnN0cnVjdG9yIiwicmVhbEVycm9yIiwiX19leHBvcnRTdGFyIiwiUHVibGljQXBwRXJyb3IiLCJhcHBfZXJyb3JfMSIsInBhcmVudCIsIlN0b3BFcnJvciIsIkV2ZW50QXJnIiwicHJvcGFnYXRpb25TdG9wcGVkIiwic3RvcFByb3BhZ2F0aW9uIiwiaXNQcm9wYWdhdGlvblN0b3BwZWQiLCJFdmVudERpc3BhdGNoZXJTZXJ2aWNlIiwibG9nXzEiLCJldmVudF9kaXNwYXRjaGVyXzEiLCJsb2dnZXIiLCJldmVudE5hbWUiLCJkaXNwYXRjaEZvclJlc3BvbnNlIiwiX19wYXJhbSIsImluamVjdCIsIkxvZ2dlclNlcnZpY2VTeW1ib2wiLCJMb2dnZXJTZXJ2aWNlIiwiRXZlbnREaXNwYXRjaGVyIiwiZXZlbnRfYXJnXzEiLCJsaXN0ZW5lcnMiLCJzdWJzY3JpYmUiLCJpIiwic3BsaWNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXNwb25zZXMiLCJwaXBlbGluZSIsInRoZW4iLCJpbm5lckNhbGxiYWNrIiwicHJldmlvdXNSZXNwb25zZSIsInJlc3BvbnNlIiwiZGlzcGF0Y2hGb3JTaW5nbGVSZXNwb25zZSIsInN0cmF0ZWd5IiwiX19hd2FpdGVyIiwiX19nZW5lcmF0b3IiLCJsYWJlbCIsInNlbnQiLCJwb3AiLCJzaGlmdCIsImNsZWFyIiwicmVnaXN0ZXJNb2R1bGUiLCJzeW1ib2wiLCJpblRyYW5zaWVudFNjb3BlIiwic3ltYm9scyIsIm1vZHVsZXMiLCJzZXJ2aWNlcyIsInJlZ2lzdGVyRmFjdG9yeSIsInRvRHluYW1pY1ZhbHVlIiwiZ2V0TW9kdWxlc1N5bWJvbHMiLCJjb25jYXQiLCJnZXRTZXJ2aWNlc1N5bWJvbHMiLCJKcXVlcnlNb2R1bGUiLCJvblJlYWR5UHJvbWlzZSIsIm9uUmVhZHlQcm9taXNlUmVzb2x2ZSIsImdldERlZmF1bHRPcHRpb25zIiwic3RhdGVzSG9sZGVyIiwiY3VycmVudCIsInRhZ3MiLCJyZWdpc3RlclN0YXRlVGFncyIsIkpxdWVyeU1vZHVsZV8xIiwiU1RBVEVTIiwiSU5JVElBTElaSU5HIiwiQlVaWSIsIkNPTlNUUlVDVEVEIiwiSU5JVElBTElaRUQiLCJnZXRFbGVtZW50IiwiJGVsZW1lbnQiLCJzZXRFbGVtZW50IiwiaW5pdGlhbGl6ZSIsImVudGVyU3RhdGUiLCJzZXRPcHRpb25zIiwiYWxsIiwiZG9Jbml0IiwibGVhdmVTdGF0ZSIsImFmdGVySW5pdCIsIm9uUmVhZHkiLCJpc1JlYWR5IiwiaXNJblN0YXRlIiwiZ2V0T3B0aW9uIiwiZGVmYXVsdFZhbHVlIiwiaGFzT3B0aW9uIiwic2V0T3B0aW9uIiwib2xkVmFsdWUiLCJhcmVFcXVhbCIsIm9uT3B0aW9uQ2hhbmdlIiwiY2xlYXJPdGhlciIsIm5hbWVfMSIsImhhc093blByb3BlcnR5IiwiZ2V0RGVmYXVsdE9wdGlvbk5hbWUiLCJlcnJvciIsImdldE9wdGlvbnMiLCJvcHRpb25OYW1lIiwibmV3VmFsdWUiLCJ0YWdzXzEiLCJ0YWciLCJhYnNvbHV0ZSIsInRhZ3NfMiIsImVuc3VyZUFycmF5IiwidGFnc18zIiwiY2FuZGlkYXRlIiwiaW5kZXhPZiIsIkpxdWVyeU1vZHVsZXNNYW5hZ2VyIiwiY2FtZWxDYXNlIiwia2ViYWJDYXNlIiwidHJpbSIsIm1vZHVsZXNBdHRyaWJ1dGVTZWxlY3RvcnMiLCJzY2FubmluZyIsInNjYW5JblF1ZXVlIiwiSnF1ZXJ5TW9kdWxlc01hbmFnZXJfMSIsImRvU2NhbiIsInByb3h5IiwiY29tcHV0ZU1vZHVsZXNBdHRyaWJ1dGVTZWxlY3RvcnMiLCJzZWxlY3RvciIsImVhY2giLCJhdHRyTmFtZSIsIm1vZHVsZVN5bWJvbCIsIiRlbCIsImF0dHJWYWx1ZSIsImF0dHIiLCJkYXRhTmFtZSIsIm1vZHVsZUluc3RhbmNlIiwiZGF0YSIsImdldFN5bWJvbERlc2NyaXB0aW9uIiwicGFyc2UiLCJkZWZhdWx0T3B0aW9uTmFtZSIsInJlbW92ZUF0dHIiLCJpbnN0YW5jZSIsIm91dHB1dCIsInN5bWJvbHNfMSIsIml0ZW0iLCJNT0RVTEVTX0hUTUxfQVRUUklCVVRFU19QUkVGSVgiLCJWdWVBcHBTeW1ib2wiLCJWdWVBcHAiLCJqcXVlcnlfbW9kdWxlXzEiLCJ2dWVfMSIsInZ1ZSIsIlZ1ZUFwcF8xIiwiR2V0R2xvYmFsQ29tcG9uZW50cyIsIkNPTVBPTkVOVFMiLCJfZ2xvYmFsIiwiUmVnaXN0ZXJDb21wb25lbnQiLCJjb21wb25lbnQiLCJncm91cCIsIkRFRkFVTFRfR1JPVVAiLCJSZWdpc3Rlckdsb2JhbENvbXBvbmVudCIsIkdldEdsb2JhbERpcmVjdGl2ZXMiLCJESVJFQ1RJVkVTIiwiUmVnaXN0ZXJEaXJlY3RpdmUiLCJkaXJlY3RpdmUiLCJSZWdpc3Rlckdsb2JhbERpcmVjdGl2ZSIsIlNldFZ1ZU9wdGlvbiIsIk9QVElPTlMiLCJtZXJnZVZ1ZU9wdGlvbnMiLCJiZWZvcmVDcmVhdGUiLCJjcmVhdGVkIiwiZ2V0VnVlT3B0aW9ucyIsImRlbGltaXRlcnMiLCJncm91cENvbXBvbmVudHMiLCJncm91cERpcmVjdGl2ZXMiLCJjb21wb25lbnRzIiwiYXNzaWduIiwiZGlyZWN0aXZlcyIsImFyZ3MiLCJhcmdzXzEiLCJjb21wb25lbnROYW1lIiwialF1ZXJ5IiwiYWpheFNldHVwIiwiZGF0YUZpbHRlciIsInN0cmlwWHNzaVByZWZpeCIsInNoYXJlZF9jb25maWd1cmF0aW9uXzEiLCJzdG9yYWdlXzEiLCJjb25maWciLCJwZXJzaXN0UXVldWUiLCJpc0xvYWRlZCIsImlzRmx1c2hpbmciLCJsb2FkaW5nUHJvbWlzZSIsImxhc3RGbHVzaFRpbWUiLCJuZXh0Rmx1c2hUaW1lcklkIiwiaXNQcm9kIiwiYWRkIiwiREVCVUciLCJ0cmFjZSIsImdldENhbGxlck5hbWUiLCJpbmZvIiwic3VjY2VzcyIsIlNVQ0NFU1MiLCJ3YXJuaW5nIiwiV0FSTklORyIsIkVSUk9SIiwicmVtb3ZlIiwibG9hZCIsIm9uRmluaXNoIiwicmVzdWx0IiwiZGVjb2RlZCIsImdldEFsbCIsIml0ZW1zIiwibCIsIm0iLCJ3YXJuIiwic3Vic3RyaW5nIiwicHJlcGFyZU9iamVjdEZvckR1bXAiLCJEYXRlIiwibm93IiwiZmx1c2giLCJkZWxheSIsIk1hdGgiLCJtYXgiLCJpbmRleCIsInNwbGl0IiwiaXNBcnJheSIsInN0ciIsInBhcmVudGhlc2lzUG9zIiwicGFydHMiLCJqb2luIiwicmVwbGFjZSIsIlN0b3JhZ2VTZXJ2aWNlU3ltYm9sIiwiU3RvcmFnZVNlcnZpY2UiLCJIdHRwUmVzcG9uc2VTdGF0dXMiLCJIdHRwTWV0aG9kcyIsIkF1dGhlbnRpY2F0aW9uRXJyb3IiLCJodHRwX2Vycm9yXzEiLCJIdHRwRXJyb3IiLCJDYW5jZWxFcnJvciIsInN0YXR1cyIsInBheWxvYWQiLCJOZXR3b3JrRXJyb3IiLCJIdHRwUmVxdWVzdCIsIm1ldGhvZCIsImhlYWRlcnMiLCJtYXhSZXRyeUNvdW50IiwiSHR0cFJlc3BvbnNlIiwiUGVuZGluZyIsIklkSW5jcmVtZW50IiwiaHR0cFN0YXR1c0NvZGUiLCJodHRwU3RhdHVzVGV4dCIsInJhd1Jlc3VsdCIsInJhd1Jlc3VsdFR5cGUiLCJwcm9taXNlIiwic2V0U3RhdHVzIiwiY2FuY2VsIiwiQ2FuY2VsZWQiLCJpc1BlbmRpbmciLCJpc1N1Y2Nlc3MiLCJTdWNjZXNzIiwiaXNFcnJvciIsImlzQ2FuY2VsZWQiLCJzeW5jV2l0aCIsIm90aGVyIiwiZGVjb3JhdGUiLCJkZWNvcmF0ZWQiLCJfbG9vcF8xIiwidGhpc18xIiwia2V5cyIsIkh0dHBTZXJ2aWNlU3ltYm9sIiwiSHR0cFNlcnZpY2UiLCJuZXR3b3JrX2Vycm9yXzEiLCJhdXRoZW50aWNhdGlvbl9lcnJvcl8xIiwibmV0d29ya193YXRjaGVyX3NlcnZpY2VfMSIsImh0dHBfcmVxdWVzdF8xIiwiaHR0cF9yZXNwb25zZV8xIiwiY2FuY2VsX2Vycm9yXzEiLCJuZXR3b3JrV2F0Y2hlciIsInJlcXVlc3RzUXVldWUiLCJxdWV1ZVByb2Nlc3NUaW1lb3V0Iiwid2F0Y2giLCJvbk5ldHdvcmtBdmFpbGFiaWxpdHlDaGFuZ2UiLCJyZXRyeUNvdW50IiwicmVxdWVzdCIsIkdFVCIsInBvc3QiLCJib2R5IiwiUE9TVCIsInB1dCIsIlBVVCIsIkRFTEVURSIsInF1ZXVlUmVxdWVzdCIsImV4ZWN1dGVRdWV1ZWRSZXF1ZXN0IiwicmVtb3ZlRnJvbVF1ZXVlIiwianF1ZXJ5QWpheE9wdGlvbnMiLCJkYXRhVHlwZSIsImNvbnRlbnRUeXBlIiwieGhyRmllbGRzIiwid2l0aENyZWRlbnRpYWxzIiwianFYSFIiLCJhamF4IiwiaXNFeGVjdXRpbmciLCJzdGF0dXNUZXh0Iiwic2V0UmVxdWVzdFJhd1Jlc3VsdCIsIm9uRXJyb3IiLCJpc09ubGluZSIsImV4ZWN1dGVBdCIsImdldFRpbWUiLCJ0cmllc0xlZnQiLCJyZWplY3RSZXF1ZXN0IiwicmVzcG9uc2VUZXh0Iiwic2NoZWR1bGVRdWV1ZUZvclByb2Nlc3MiLCJyZWxvYWQiLCJyZXNwb25zZUpTT04iLCJhYm9ydCIsInhociIsImNsaWVudFJlc3BvbnNlIiwiZ2V0UmVzcG9uc2VIZWFkZXIiLCJwcm9jZXNzUXVldWUiLCJjdXJyZW50VGltZSIsImRlbHRhIiwib25saW5lIiwicXVldWVkUmVxdWVzdCIsImNsZWFyVGltZW91dCIsIk5ldHdvcmtXYXRjaGVyU2VydmljZVN5bWJvbCIsIk5ldHdvcmtXYXRjaGVyU2VydmljZSIsInJ4anNfMSIsImlzU3VwcG9ydGVkIiwibmF2aWdhdG9yIiwiaXNPbmxpbmVBdHRyIiwib25MaW5lIiwibW9uaXRvcmluZ1N1YnNjcmlwdGlvbiIsIm9uQ29ubmVjdGlvblJldHJpZXZlZEZuIiwib25Db25uZWN0aW9uTG9zdEZuIiwib2JzZXJ2ZXJzIiwib25Db25uZWN0aW9uUmV0cmlldmVkIiwib25Db25uZWN0aW9uTG9zdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJPYnNlcnZhYmxlIiwib2JzZXJ2ZXIiLCJ1bndhdGNoIiwibmV4dCIsImFwcGVuZFF1ZXJ5UGFyYW1ldGVycyIsInF1ZXJ5UGFyYW1ldGVyc0FycmF5IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicGFyYW1zIiwicXVlcnlTdHJpbmciLCJwb3MiLCJwcmVmaXgiLCJDb29raWVzRHJpdmVyU2VydmljZVN5bWJvbCIsIkNvb2tpZXNEcml2ZXJTZXJ2aWNlIiwic3RvcmFnZV9zZXJ2aWNlXzEiLCJDb29raWVzRHJpdmVyU2VydmljZV8xIiwiY29va2llIiwiUFJFRklYIiwiZGF0ZSIsInNldFRpbWUiLCJleHBpcmVzIiwidG9VVENTdHJpbmciLCJrZXlzXzEiLCJjb29raWVzIiwiZ2V0RHJpdmVyTmFtZSIsIkxvY2FsU3RvcmFnZURyaXZlclNlcnZpY2VTeW1ib2wiLCJMb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiYyIsImxvY2FsX3N0b3JhZ2VfZHJpdmVyX3NlcnZpY2VfMSIsImNvb2tpZXNfZHJpdmVyX3NlcnZpY2VfMSIsImNvbnRleHQiLCJrIiwicGFyYW1ldGVycyIsInYiLCJjb3VudCIsImJhc2U2NGRlY29kZVVybFNhZmUiLCJiYXNlNjRkZWNvZGUiLCJiYXNlNjRlbmNvZGUiLCJCYXNlNjQiLCJnbG9iYWwiLCJfQmFzZTY0IiwiYnVmZmVyIiwibW9kdWxlIiwiZXZhbCIsImVyciIsImI2NGNoYXJzIiwiYjY0dGFiIiwiYmluIiwidCIsImNoYXJBdCIsImZyb21DaGFyQ29kZSIsIlN0cmluZyIsImNiX3V0b2IiLCJjYyIsImNoYXJDb2RlQXQiLCJyZV91dG9iIiwidXRvYiIsInUiLCJjYl9lbmNvZGUiLCJjY2MiLCJwYWRsZW4iLCJvcmQiLCJjaGFycyIsImJ0b2EiLCJiIiwiX2VuY29kZSIsImlzVWludDhBcnJheSIsImVuY29kZSIsInVyaXNhZmUiLCJtMCIsImVuY29kZVVSSSIsInJlX2J0b3UiLCJjYl9idG91IiwiY2NjYyIsImNwIiwib2Zmc2V0IiwiYnRvdSIsImNiX2RlY29kZSIsImxlbiIsIm4iLCJfYXRvYiIsImF0b2IiLCJhIiwiX2RlY29kZSIsImZyb20iLCJVaW50OEFycmF5IiwiZGVjb2RlIiwibm9Db25mbGljdCIsIlZFUlNJT04iLCJmcm9tQmFzZTY0IiwidG9CYXNlNjQiLCJfX2J1ZmZlcl9fIiwibm9FbnVtIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiZXh0ZW5kU3RyaW5nIiwidHdvRGlnaXRzIiwiZCIsInRvVVRDRGF0ZVRpbWUiLCJnZXRVVENGdWxsWWVhciIsImdldFVUQ01vbnRoIiwiZ2V0VVRDRGF0ZSIsImdldFVUQ0hvdXJzIiwiZ2V0VVRDTWludXRlcyIsImdldFVUQ1NlY29uZHMiLCJ0b0RhdGVUaW1lIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwiZm9ybWF0IiwiYXJnTnVtIiwibWF0Y2giLCJjdXJBcmdOdW0iLCJzdWJzdHIiLCJwYXJzZWQiLCJtZDUiLCJtZDVjeWNsZSIsIngiLCJmZiIsImdnIiwiaGgiLCJpaSIsImFkZDMyIiwiY21uIiwicSIsInMiLCJtZDUxIiwic3RhdGUiLCJtZDVibGsiLCJ0YWlsIiwibWQ1YmxrcyIsImhleF9jaHIiLCJyaGV4IiwiaiIsImhleCIsImZsYXR0ZW4iLCJyZXBsYWNlU3RyaW5nVmFyaWFibGVzIiwiZ2V0VmFsdWVJbk9iamVjdCIsImdlbmVyYXRlSGFzaERhdGEiLCJnZW5lcmF0ZU9iamVjdEhhc2giLCJjbG9uZU9iamVjdFdpdGhNYXNrIiwibWVyZ2UiLCJjbG9uZURlZXAiLCJhcmVTYW1lIiwiYXJlU2FtZU9iamVjdHMiLCJjb21wYXJlT2JqZWN0cyIsImdldE9iamVjdFZhbHVlQXNPYmplY3QiLCJnZXRPYmplY3RWYWx1ZUFzQXJyYXkiLCJnZXRPYmplY3RWYWx1ZUFzQm9vbGVhbiIsImdldE9iamVjdFZhbHVlQXNOdW1iZXIiLCJnZXRPYmplY3RWYWx1ZUFzU3RyaW5nIiwibG9kYXNoQ2xvbmVEZWVwIiwibWQ1XzEiLCJzdHJpbmdfMSIsImVuc3VyZVN0cmluZyIsImVuc3VyZU51bWJlciIsImVuc3VyZUJvb2xlYW4iLCJlbnN1cmVPYmplY3QiLCJrZXlfMSIsInJlZ0V4cCIsIm5hbWVzIiwiZXhlYyIsImtlZXBCb3RoVmFsdWVzIiwic3ViT3V0cHV0IiwiZHN0Iiwib2JqcyIsImRlZXAiLCJqaiIsInNyYyIsImlzRGF0ZSIsInZhbHVlT2YiLCJpc1JlZ0V4cCIsIlJlZ0V4cCIsIm5vZGVOYW1lIiwiY2xvbmVOb2RlIiwiaXNFbGVtZW50IiwiY2xvbmUiLCJpc1Byb21pc2VMaWtlIiwiaXNhciIsIm1hc2siLCJzb3VyY2VJc0FycmF5IiwibWFza0tleXMiLCJyYXdLZXkiLCJyZXMiLCJOdW1iZXIiLCJfYiIsImRhdGFfMSIsInNvcnQiLCJrZXlzXzIiLCJzbHVnaWZ5Iiwic2VhcmNoIiwic2xpY2UiLCJyZXBsYWNlbWVudHMiLCJzdGFydENoYXIiLCJlbmRDaGFyIiwicmVnIiwicmVwbGFjZW1lbnRzUmVzdWx0cyIsIm1hdGNoZXMiLCJ0b1JlcGxhY2UiLCJtYXhEZXB0aCIsIm9iamVjdHNTdGFjayIsImRlcHRoIiwibWF4TnVtYmVyT2ZJdGVtcyIsIml0ZW1JbmRleCIsImlucHV0XzEiLCJvYmplY3RzU3RhY2tfMSIsImtleXNDb3VudCIsIm1heE51bWJlck9mS2V5cyIsImtleUluZGV4IiwiY29uY2F0ZW5hdG9yIiwicmVkdWNlIiwiYWNjIiwiX19hc3NpZ24iLCJmbGF0dGVuZWRDaGlsZCIsImNoaWxkQWNjIiwiY2hpbGRLZXkiLCJyYW5kb21TdHJpbmciLCJyZW1vdmVBY2NlbnRzIiwibm9ybWFsaXplVXJsIiwiaXNVcmwiLCJpc0VtcHR5U3RyaW5nIiwiQUxQSEFCRVRTIiwiRElBQ1JJVElDU19NQVAiLCJBTFBIQSIsIkFMUEhBTlVNRVJJQyIsIkFMUEhBTlVNRVJJQ19TSU1QTElGSUVEIiwiQkFTRV82NCIsIkNPTVBMRVgiLCJIRVhBREVDSU1BTCIsIk5VTUVSSUMiLCJ0ZXN0IiwibGV0dGVyIiwidG9Mb3dlckNhc2UiLCJhbHBoYWJldCIsInJhbmRvbUludCIsInVwZGF0ZVVybEZyYWdtZW50IiwicGFyc2VVcmxGcmFnbWVudCIsIndhaXRGb3JEZWxheSIsIm9uTmV4dEN5Y2xlIiwicmVtb3ZlRnJvbUFycmF5IiwiZ2V0Rmlyc3RPZiIsImdldEZ1bmN0aW9uQXJndW1lbnRzIiwiaHVtYW5GaWxlU2l6ZSIsInRocm90dGxlIiwiZGVib3VuY2UiLCJyYW5kb21JbkFycmF5IiwiaGFzUHJvcGVydHlOZXN0ZWQiLCJ0cmltQXJyYXkiLCJlbnN1cmVTYW1lVHlwZSIsImVuc3VyZUludGVnZXIiLCJpc0NvbnN0cnVjdG9yIiwiaXNWYWxpZE1vbWVudERhdGUiLCJpc1Bvam8iLCJpc1NjYWxhciIsImlzSW50ZWdlciIsImlzVmFsaWROdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0Jsb2IiLCJpc0ZpbGUiLCJpc051bWVyaWMiLCJpc051bWJlciIsImlzQmxhbmtPYmplY3QiLCJpc0RlZmluZWQiLCJsb2Rhc2hUb1N0cmluZyIsImxvZGFzaFRyaW0iLCJzdHJpY3QiLCJnZXRQcm90b3R5cGVPZiIsImlzTmFOIiwicGFyc2VGbG9hdCIsImlzRmluaXRlIiwidGVzdE9ialZhbHVlIiwidmFsdWVfMSIsIm5vZGUiLCJmaW5kIiwiaXNNb21lbnQiLCJfaXNBTW9tZW50T2JqZWN0IiwiaXNWYWxpZCIsIl9pc1ZhbGlkIiwiUHJveHkiLCJjb25zdHJ1Y3QiLCJwYXJzZUludCIsInJlZmVyZW5jZVZhbHVlIiwidGFyZ2V0VHlwZSIsIm1pbiIsImZsb29yIiwicmFuZG9tIiwiYXJyIiwiZm4iLCJ0bXAiLCJBcnJheSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImxhdGVyIiwiY2FsbE5vdyIsInRocmVzaG9sZCIsImxhc3QiLCJkZWZlclRpbWVyIiwiYnl0ZXMiLCJzaSIsInRocmVzaCIsImFicyIsInVuaXRzIiwidG9GaXhlZCIsIlNUUklQX0NPTU1FTlRTIiwiQVJHVU1FTlRfTkFNRVMiLCJhciIsInRhIiwidGIiLCJkdXJhdGlvbiIsImhhc2giLCJmcmFnbWVudCIsIkFic3RyYWN0RGlyZWN0aXZlIiwiZXZlbnRMaXN0ZW5lcnMiLCJXZWFrTWFwIiwiYmluZGluZ1ZhbHVlc1dhdGNoZXJzIiwibGFzdEJpbmRpbmdWYWx1ZVNuYXBzaG90IiwiYmluZGluZyIsInZub2RlIiwib2xkVm5vZGUiLCJ1cGRhdGVEYXRhIiwiaW5zZXJ0ZWQiLCJ1cGRhdGUiLCJjb21wb25lbnRVcGRhdGVkIiwiZmV0Y2hCaW5kaW5nVmFsdWUiLCJ3YXRjaEJpZGluZ1ZhbHVlIiwibGFzdFZhbHVlIiwiY2FsbGJhY2tzIiwibWFwIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIndyYXBwZWRDYWxsYmFjayIsImVtaXQiLCJldmVudERhdGEiLCJjb21wb25lbnRJbnN0YW5jZSIsIiRlbWl0IiwiZWxtIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiY2hlY2tBbmROb3RpZnlGb3JCaW5kaW5nVmFsdWVDaGFuZ2VzIiwiZGlmZmVyZW5jZXMiLCJwcm9wZXJ0eU5hbWUiLCJfYyIsIkRpcmVjdGl2ZUZhY3RvcnkiLCJDcmVhdGUiLCJjdG9yIiwiSW5zdGFuY2VzIiwiUGVyZmVjdFNjcm9sbGJhciIsIlBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUiLCJ2dWVfYXBwXzEiLCJhYnN0cmFjdF9kaXJlY3RpdmVfMSIsImRpcmVjdGl2ZV9mYWN0b3J5XzEiLCJwZXJmZWN0X3Njcm9sbGJhcl8xIiwiVXBkYXRlRm9yRWxlbWVudCIsInBzIiwibmV4dFRpY2siLCJEZWZhdWx0cyIsImRlc3Ryb3kiLCJ3aGVlbFByb3BhZ2F0aW9uIiwic3VwcHJlc3NTY3JvbGxYIiwiVElQUFlfREVGQVVMVF9PUFRJT05TIiwiYWxsb3dIVE1MIiwiYXJyb3ciLCJkaXN0YW5jZSIsImhpZGVPbkNsaWNrIiwiaW50ZXJhY3RpdmUiLCJtYXhXaWR0aCIsInBsYWNlbWVudCIsImFuaW1hdGlvbiIsImFuaW1hdGVGaWxsIiwidHJpZ2dlclRhcmdldCIsInpJbmRleCIsImFwcGVuZFRvIiwidmlzaWJsZSIsIlRvb2x0aXAiLCJ0aXBweV9qc18xIiwidGlwcHlfZGVmYXVsdF9vcHRpb25zXzEiLCJjdXJyZW50VGlwcHlPcHRpb25zIiwiYnVpbGRPcHRpb25zIiwiZGVmYXVsdE9wdGlvbnMiLCJnZXRBdHRyaWJ1dGUiLCJmaWx0ZXJPcHRpb25zIiwiY3JlYXRlVGlwcHkiLCJoYW5kbGVycyIsIm9uIiwiY29tcG9uZW50T3B0aW9ucyIsIm9wdHMiLCJvblNob3ciLCJmbnMiLCJvblNob3duIiwib25IaWRkZW4iLCJvbkhpZGUiLCJvbk1vdW50IiwicGx1Z2lucyIsImZvbGxvd0N1cnNvciIsInNob3dPbkxvYWQiLCJfdGlwcHkiLCJzaG93IiwiaGFuZGxlTWFudWFsVmlzaWJpbGl0eSIsImhpZGUiLCJzZXRQcm9wcyIsImFwcF8xIiwicmVhZHkiLCJhcHAiLCJNYW5hZ2VyQ29tcG9uZW50IiwibW9tZW50IiwibmV0d29ya18xIiwidnVlX2NsYXNzX2NvbXBvbmVudF8xIiwidGFza19jb21wb25lbnRfMSIsImh0dHBSZXNwb25zZSIsImFjdGl2ZVRhc2tzIiwiaGlzdG9yeVRhc2tzIiwiYWN0aXZlVGFiIiwiaHR0cCIsIm1vdW50ZWQiLCJzZXRJbnRlcnZhbCIsImFjdGl2ZSIsImhpc3RvcnkiLCJtZXJnZWQiLCJtZXJnZWRfMSIsInN0YXJ0VGltZSIsInVuaXgiLCJwcm9ncmVzcyIsInRlbXBsYXRlIiwiVGFza0NvbXBvbmVudCIsInZ1ZV9wcm9wZXJ0eV9kZWNvcmF0b3JfMSIsIlByb3AiLCJyZXF1aXJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOzs7Ozs7Ozs7Ozs7OztBQUNi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QlEsaUJBQWpCLENBQW1DLGNBQW5DLEVBQW1Ec21CLGFBQW5ELEU7Ozs7Ozs7Ozs7O0FDekJBLHVDOzs7Ozs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUYiLCJmaWxlIjoid2ViZWFraGVhdnl0YXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFwcFN5bWJvbCA9IGV4cG9ydHMuQXBwID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgZXZlbnRfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2V2ZW50XCIpO1xudmFyIGNvbnRhaW5lcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvaW52ZXJzaWZ5L2NvbnRhaW5lclwiKTtcbnZhciBqcXVlcnlfbW9kdWxlc19tYW5hZ2VyXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9qcXVlcnkvanF1ZXJ5LW1vZHVsZXMtbWFuYWdlclwiKTtcbnZhciBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XG52YXIgQXBwID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIEBpbmplY3QoKSBub3QgdXNlZCB0byBmYWNpbGl0YXRlIG92ZXJyaWRpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gQXBwKCkge1xuICAgICAgICB0aGlzLmpxdWVyeU1vZHVsZXNNYW5hZ2VyID0gY29udGFpbmVyXzEuQ29udGFpbmVyLmdldENvbnRhaW5lcigpLmdldChqcXVlcnlfbW9kdWxlc19tYW5hZ2VyXzEuSnF1ZXJ5TW9kdWxlc01hbmFnZXJTeW1ib2wpO1xuICAgICAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlciA9IGNvbnRhaW5lcl8xLkNvbnRhaW5lci5nZXRDb250YWluZXIoKS5nZXQoZXZlbnRfMS5FdmVudERpc3BhdGNoZXJTZXJ2aWNlU3ltYm9sKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplcnMgPSBbXTtcbiAgICAgICAgdGhpcy5pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgQXBwLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMuaW5pdGlhbGl6ZXJzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGluaXRpYWxpemVyID0gX2FbX2ldO1xuICAgICAgICAgICAgaW5pdGlhbGl6ZXIuYXBwbHkobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplcnMgPSBbXTtcbiAgICAgICAgdGhpcy5qcXVlcnlNb2R1bGVzTWFuYWdlci5zY2FuKCk7XG4gICAgICAgIHRoaXMuaXNTdGFydGVkID0gdHJ1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBhcHAgc3RhcnRzLlxuICAgICAqL1xuICAgIEFwcC5wcm90b3R5cGUucmVnaXN0ZXJJbml0aWFsaXplciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRoaXMuaXNTdGFydGVkKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaCBhIGdsb2JhbCBldmVudCBpbnRvIHRoZSBhcHAuXG4gICAgICovXG4gICAgQXBwLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKG5hbWUsIGFyZykge1xuICAgICAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaChuYW1lLCBhcmcpO1xuICAgIH07XG4gICAgQXBwID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpLFxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSlcbiAgICBdLCBBcHApO1xuICAgIHJldHVybiBBcHA7XG59KCkpO1xuZXhwb3J0cy5BcHAgPSBBcHA7XG5leHBvcnRzLkFwcFN5bWJvbCA9IFN5bWJvbChcIkFwcFwiKTtcbmNvbnRhaW5lcl8xLkNvbnRhaW5lci5nZXRDb250YWluZXIoKS5iaW5kKGV4cG9ydHMuQXBwU3ltYm9sKS50byhBcHApLmluU2luZ2xldG9uU2NvcGUoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TaGFyZWRDb25maWd1cmF0aW9uU3ltYm9sID0gZXhwb3J0cy5TaGFyZWRDb25maWd1cmF0aW9uID0gZXhwb3J0cy5FTlYgPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2xvZy9jb25zdGFudHNcIik7XG52YXIgdmFyX2hvbGRlcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvc3RvcmFnZS92YXItaG9sZGVyXCIpO1xudmFyIGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbnZhciBjb250YWluZXJfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2ludmVyc2lmeS9jb250YWluZXJcIik7XG4vKipcbiAqIEN1cnJlbnQgZW52aXJvbm1lbnQuXG4gKi9cbmV4cG9ydHMuRU5WID0gJ3Byb2QnO1xudmFyIFNoYXJlZENvbmZpZ3VyYXRpb24gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoU2hhcmVkQ29uZmlndXJhdGlvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaGFyZWRDb25maWd1cmF0aW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ3VycmVudCBlbnZpcm9ubWVudC5cbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLmVudiA9IGV4cG9ydHMuRU5WO1xuICAgICAgICAvKipcbiAgICAgICAgICogVmVyc2lvbiBudW1iZXIuXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy52ZXJzaW9uID0gJzAuMC4xJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEN1cnJlbnQgdGltZXpvbmUgaW4gdXNlIGluIHRoZSBhcHAuXG4gICAgICAgICAqL1xuICAgICAgICBfdGhpcy50aW1lem9uZSA9ICdFdXJvcGUvUGFyaXMnO1xuICAgICAgICAvKipcbiAgICAgICAgICogRGVidWcgY29uZmlndXJhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIF90aGlzLmRlYnVnID0ge1xuICAgICAgICAgICAgbG9nczoge1xuICAgICAgICAgICAgICAgIGxldmVsOiBjb25zdGFudHNfMS5Mb2dMZXZlbC5JTkZPLFxuICAgICAgICAgICAgICAgIHN0b3JhZ2VLZXk6ICdkZWJ1Zzpsb2dzJyxcbiAgICAgICAgICAgICAgICBzdG9yYWdlV3JpdGVJbnRlcnZhbDogMTAwMDAsXG4gICAgICAgICAgICAgICAgbWF4aW11bUNvdW50OiA1MFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5uZXR3b3JrID0ge1xuICAgICAgICAgICAgY29ubmVjdGlvbkVycm9yUmV0cnlEZWxheTogMTUwMDAsXG4gICAgICAgICAgICByZWxvYWRPbkF1dGhlbnRpY2F0aW9uRXJyb3I6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgX3RoaXMuc3RvcmFnZSA9IF90aGlzO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNoYXJlZENvbmZpZ3VyYXRpb24gbXVzdCBiZSByZWdpc3RlcmVkIHR3aWNlIGluIHRoZSBjb250YWluZXI6XG4gICAgICogICAtIHdpdGggYSBzeW1ib2wgaWRlbnRpZmllciBsaWtlIGFueSBzZXJ2aWNlXG4gICAgICogICAtIHdpdGggYSBzdHJpbmcgY29uc3RhbnQgaWRlbnRpZmllciB0byBiZSBpbmplY3RhYmxlIGFueXdoZXJlIGluIHRoZSBhcHAgd2l0aG91dCByaXNraW5nIGEgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgKlxuICAgICAqIEl0IG11c3QgYWxzbyBiZSBvdmVycmlkYWJsZSBzbyB0aGUgbGFzdCByZWdpc3RyYXRpb24gb3ZlcnJpZGVzIHRoZSBwcmV2aW91cyBvbmVzLlxuICAgICAqXG4gICAgICogRm9yIHRoZXNlIHJlYXNvbnMsIHRoZSBSZWdpc3RlciBtZXRob2QgaGFzIGJlZW4gY3JlYXRlZCwgdG8gZW5zdXJlIGl0IGlzIHJlZ2lzdGVyZWQgcHJvcGVybHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqIGEgcmVmZXJlbmNlIHRvIHRoZSBjbGFzcyB0byByZWdpc3RlclxuICAgICAqL1xuICAgIFNoYXJlZENvbmZpZ3VyYXRpb24uUmVnaXN0ZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSBjb250YWluZXJfMS5Db250YWluZXIuZ2V0Q29udGFpbmVyKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb250YWluZXIuZ2V0KGV4cG9ydHMuU2hhcmVkQ29uZmlndXJhdGlvblN5bWJvbCk7XG4gICAgICAgICAgICBjb250YWluZXIudW5iaW5kKCdTaGFyZWRDb25maWd1cmF0aW9uJyk7XG4gICAgICAgICAgICBjb250YWluZXIudW5iaW5kKGV4cG9ydHMuU2hhcmVkQ29uZmlndXJhdGlvblN5bWJvbCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHsgfVxuICAgICAgICBjb250YWluZXIuYmluZChleHBvcnRzLlNoYXJlZENvbmZpZ3VyYXRpb25TeW1ib2wpLnRvKG9iaikuaW5TaW5nbGV0b25TY29wZSgpO1xuICAgICAgICBjb250YWluZXIuYmluZCgnU2hhcmVkQ29uZmlndXJhdGlvbicpLnRvQ29uc3RhbnRWYWx1ZShjb250YWluZXIuZ2V0KGV4cG9ydHMuU2hhcmVkQ29uZmlndXJhdGlvblN5bWJvbCkpO1xuICAgIH07XG4gICAgU2hhcmVkQ29uZmlndXJhdGlvbiA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pXG4gICAgXSwgU2hhcmVkQ29uZmlndXJhdGlvbik7XG4gICAgcmV0dXJuIFNoYXJlZENvbmZpZ3VyYXRpb247XG59KHZhcl9ob2xkZXJfMS5WYXJIb2xkZXIpKTtcbmV4cG9ydHMuU2hhcmVkQ29uZmlndXJhdGlvbiA9IFNoYXJlZENvbmZpZ3VyYXRpb247XG5leHBvcnRzLlNoYXJlZENvbmZpZ3VyYXRpb25TeW1ib2wgPSBTeW1ib2woXCJTaGFyZWRDb25maWd1cmF0aW9uXCIpO1xuU2hhcmVkQ29uZmlndXJhdGlvbi5SZWdpc3RlcihTaGFyZWRDb25maWd1cmF0aW9uKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Db25zdGFudHMgPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciB2YXJfaG9sZGVyXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9zdG9yYWdlL3Zhci1ob2xkZXJcIik7XG52YXIgZXJyb3JfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2Vycm9yXCIpO1xudmFyIENvbnN0YW50cyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhDb25zdGFudHMsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ29uc3RhbnRzKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgYSBjb25zdGFudC5cbiAgICAgKi9cbiAgICBDb25zdGFudHMuR2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIENvbnN0YW50cy5HZXRJbnN0YW5jZSgpLmdldChuYW1lKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgY29uc3RhbnQuXG4gICAgICovXG4gICAgQ29uc3RhbnRzLlJlZ2lzdGVyID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGlmIChDb25zdGFudHMuR2V0SW5zdGFuY2UoKS5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBlcnJvcl8xLkFwcEVycm9yKFwiQSBjb25zdGFudCBuYW1lZCBcIiArIG5hbWUgKyBcIiBpcyBhbHJlYWR5IGRlZmluZWQuIENob29zZSBhbm90aGVyIG5hbWUgb2YgdXNlIHRoZSBzaGFyZWQgY29uZmlndXJhdGlvbiBpZiB0aGUgdmFsdWUgbXVzdCBiZSBvdmVycmlkZGVuLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBDb25zdGFudHMuR2V0SW5zdGFuY2UoKS5zZXQobmFtZSwgdmFsdWUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IChhbmQgY3JlYXRlIGlmIG5lY2Vzc2FyeSkgdGhlIHNpbmdsZXRvbiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBDb25zdGFudHMuR2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChDb25zdGFudHMuSW5zdGFuY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIENvbnN0YW50cy5JbnN0YW5jZSA9IG5ldyBDb25zdGFudHMoKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVnaXN0ZXIgc29tZSBnbG9iYWwgY29uc3RhbnRzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAvLyBDdXN0b20gVnVlSlMgZGVsaW1pdGVycyBzbyB0aGV5IGRvIG5vdCBjb25mbGljdCB3aXRoIFR3aWcuXG4gICAgICAgICAgICBDb25zdGFudHMuUmVnaXN0ZXIoJ0RFTElNSVRFUlMnLCBbJyR7JywgJ30nXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENvbnN0YW50cy5JbnN0YW5jZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNpbmdsZXRvbi5cbiAgICAgKi9cbiAgICBDb25zdGFudHMuSW5zdGFuY2UgPSBudWxsO1xuICAgIHJldHVybiBDb25zdGFudHM7XG59KHZhcl9ob2xkZXJfMS5WYXJIb2xkZXIpKTtcbmV4cG9ydHMuQ29uc3RhbnRzID0gQ29uc3RhbnRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIFRoaXMgZmlsZSBpbmNsdWRlcyBiYXNlIGRlcGVuZGVuY2llcyBhbHdheXMgcmVxdWlyZWQgbm8gbWF0dGVyIHRoZSBwcm9qZWN0LlxuICogVGhpcyBzaG91bGQgYmUgdGhlIGZpcnN0IHRoaW5nIHRvIGluY2x1ZGUgaW4gdGhlIHByb2plY3QuXG4gKi9cbnJlcXVpcmUoXCJyZWZsZWN0LW1ldGFkYXRhXCIpO1xucmVxdWlyZShcImVzc2VudGlhbHMvdXRpbHMvZXh0ZW5zaW9ucy9hbGxcIik7XG5yZXF1aXJlKFwiZXNzZW50aWFscy9qcXVlcnkvc3RyaXAteHNzaVwiKTtcbnJlcXVpcmUoXCJlc3NlbnRpYWxzL3N0b3JhZ2Uvc3RvcmFnZS5mYWN0b3J5XCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFsZXJ0aWZ5U2VydmljZVN5bWJvbCA9IGV4cG9ydHMuQWxlcnRpZnlTZXJ2aWNlID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG4vLyBAdHMtaWdub3JlXG52YXIgYWxlcnRpZnkgPSByZXF1aXJlKFwiYWxlcnRpZnlqc1wiKTtcbnZhciBjb250YWluZXJfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2ludmVyc2lmeS9jb250YWluZXJcIik7XG52YXIganF1ZXJ5X21vZHVsZXNfbWFuYWdlcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvanF1ZXJ5L2pxdWVyeS1tb2R1bGVzLW1hbmFnZXJcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL25ldHdvcmsvdXRpbHNcIik7XG52YXIgYmFzZTY0XzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy9iYXNlNjRcIik7XG52YXIgb2JqZWN0XzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy9vYmplY3RcIik7XG52YXIgdXRpbHNfMiA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL3V0aWxzL3V0aWxzXCIpO1xudmFyIGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbnZhciBBbGVydGlmeVNlcnZpY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQWxlcnRpZnlTZXJ2aWNlKCkge1xuICAgICAgICB0aGlzLmpxdWVyeU1vZHVsZXNNYW5hZ2VyID0gY29udGFpbmVyXzEuQ29udGFpbmVyLmdldENvbnRhaW5lcigpLmdldChqcXVlcnlfbW9kdWxlc19tYW5hZ2VyXzEuSnF1ZXJ5TW9kdWxlc01hbmFnZXJTeW1ib2wpO1xuICAgIH1cbiAgICBBbGVydGlmeVNlcnZpY2VfMSA9IEFsZXJ0aWZ5U2VydmljZTtcbiAgICAvKipcbiAgICAgKiBTaG93IGEgZ2VuZXJpYyBkaWFsb2cgZnJvbSBhbiBIVE1MIHNvdXJjZSBjb2RlIG9yIGEgZG9tIGVsZW1lbnQgKHN1cHBvcnRzIGpxdWVyeSkuXG4gICAgICovXG4gICAgQWxlcnRpZnlTZXJ2aWNlLnByb3RvdHlwZS5kaWFsb2cgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciBpZCA9IHRoaXMuZ2VuZXJhdGVVbmlxdWVJZCgpO1xuICAgICAgICB2YXIgZWwgPSB0aGlzLnJlc29sdmVEaWFsb2dTb3VyY2UoaWQsIG9wdGlvbnMuc291cmNlKTtcbiAgICAgICAgdmFyIHdyYXBDYWxsYmFjayA9IGZ1bmN0aW9uIChjYWxsYmFjaywgcHJldmlvdXMpIHtcbiAgICAgICAgICAgIGlmICghdXRpbHNfMi5pc0Z1bmN0aW9uKHByZXZpb3VzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBwcmV2aW91cy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHV0aWxzXzIuaXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5idXR0b25zKSkge1xuICAgICAgICAgICAgb3B0aW9ucy5idXR0b25zID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ09rJyxcbiAgICAgICAgICAgICAgICAgICAga2V5OiAyNyxcbiAgICAgICAgICAgICAgICAgICAgaW52b2tlT25DbG9zZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBhbGVydGlmeS5kZWZhdWx0cy50aGVtZS5vayxcbiAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgYXR0cmlidXRlOiAndmFsdWUnIH0sXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAnYXV4aWxpYXJ5JyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoZWwpO1xuICAgICAgICBhbGVydGlmeS5kaWFsb2coaWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkaWFsb2dDb25maWcgPSB7fTtcbiAgICAgICAgICAgIHZhciBob29rc0NvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBvbnNob3c6IHdyYXBDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuanF1ZXJ5TW9kdWxlc01hbmFnZXIuc2NhbigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBvYmplY3RfMS5nZXRPYmplY3RWYWx1ZShvcHRpb25zLCBbJ2hvb2tzJywgJ29uc2hvdyddLCB1dGlsc18yLm5vb3ApKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG9iamVjdF8xLmFkZFRvT2JqZWN0SWZEZWZpbmVkKGhvb2tzQ29uZmlnLCAnb25jbG9zZScsIG9iamVjdF8xLmdldE9iamVjdFZhbHVlKG9wdGlvbnMsIFsnaG9va3MnLCAnb25jbG9zZSddLCB1bmRlZmluZWQpKTtcbiAgICAgICAgICAgIG9iamVjdF8xLmFkZFRvT2JqZWN0SWZEZWZpbmVkKGhvb2tzQ29uZmlnLCAnb251cGRhdGUnLCBvYmplY3RfMS5nZXRPYmplY3RWYWx1ZShvcHRpb25zLCBbJ2hvb2tzJywgJ29udXBkYXRlJ10sIHVuZGVmaW5lZCkpO1xuICAgICAgICAgICAgb2JqZWN0XzEuYWRkVG9PYmplY3RJZkRlZmluZWQoZGlhbG9nQ29uZmlnLCAnY2FsbGJhY2snLCBvcHRpb25zLm9uQ2FsbGJhY2spO1xuICAgICAgICAgICAgb2JqZWN0XzEuYWRkVG9PYmplY3RJZkRlZmluZWQoZGlhbG9nQ29uZmlnLCAnc2V0dGluZ3MnLCBvcHRpb25zLnNldHRpbmdzKTtcbiAgICAgICAgICAgIGRpYWxvZ0NvbmZpZy5ob29rcyA9IGhvb2tzQ29uZmlnO1xuICAgICAgICAgICAgZGlhbG9nQ29uZmlnLnNldHVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZXR1cENvbmZpZyA9IHsgb3B0aW9uczogb2JqZWN0XzEuZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFzaWM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW1pemFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNpemFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMub3B0aW9ucykgfTtcbiAgICAgICAgICAgICAgICBvYmplY3RfMS5hZGRUb09iamVjdElmRGVmaW5lZChzZXR1cENvbmZpZywgJ2J1dHRvbnMnLCBvcHRpb25zLmJ1dHRvbnMpO1xuICAgICAgICAgICAgICAgIG9iamVjdF8xLmFkZFRvT2JqZWN0SWZEZWZpbmVkKHNldHVwQ29uZmlnLCAnZm9jdXMnLCBvcHRpb25zLmZvY3VzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0dXBDb25maWc7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGlhbG9nQ29uZmlnLm1haW4gPSB3cmFwQ2FsbGJhY2soZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENvbnRlbnQoY29udGVudCk7XG4gICAgICAgICAgICB9LCBvcHRpb25zLm9uTWFpbik7XG4gICAgICAgICAgICBkaWFsb2dDb25maWcuYnVpbGQgPSB3cmFwQ2FsbGJhY2sodXRpbHNfMi5ub29wLCBvcHRpb25zLm9uQnVpbGQpO1xuICAgICAgICAgICAgZGlhbG9nQ29uZmlnLnByZXBhcmUgPSB3cmFwQ2FsbGJhY2sodXRpbHNfMi5ub29wLCBvcHRpb25zLm9uUHJlcGFyZSk7XG4gICAgICAgICAgICBkaWFsb2dDb25maWcuc2V0dGluZ1VwZGF0ZWQgPSB3cmFwQ2FsbGJhY2sodXRpbHNfMi5ub29wLCBvcHRpb25zLm9uU2V0dGluZ1VwZGF0ZWQpO1xuICAgICAgICAgICAgcmV0dXJuIGRpYWxvZ0NvbmZpZztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhbGVydGlmeVtpZF0oZWwpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2hvdyBhIGZsYXNoIG5vdGlmaWNhdGlvbiBvZiB0eXBlIFwiaW5mb1wiLlxuICAgICAqL1xuICAgIEFsZXJ0aWZ5U2VydmljZS5wcm90b3R5cGUubm90aWZ5SW5mbyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBkdXJhdGlvbkluU2Vjb25kcykge1xuICAgICAgICBhbGVydGlmeS5ub3RpZnkobWVzc2FnZSwgJ2luZm8nLCBkdXJhdGlvbkluU2Vjb25kcyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTaG93IGEgZmxhc2ggbm90aWZpY2F0aW9uIG9mIHR5cGUgXCJzdWNjZXNzXCIuXG4gICAgICovXG4gICAgQWxlcnRpZnlTZXJ2aWNlLnByb3RvdHlwZS5ub3RpZnlTdWNjZXNzID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGR1cmF0aW9uSW5TZWNvbmRzKSB7XG4gICAgICAgIGFsZXJ0aWZ5Lm5vdGlmeShtZXNzYWdlLCAnc3VjY2VzcycsIGR1cmF0aW9uSW5TZWNvbmRzKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNob3cgYSBmbGFzaCBub3RpZmljYXRpb24gb2YgdHlwZSBcIndhcm5pbmdcIi5cbiAgICAgKi9cbiAgICBBbGVydGlmeVNlcnZpY2UucHJvdG90eXBlLm5vdGlmeVdhcm5pbmcgPSBmdW5jdGlvbiAobWVzc2FnZSwgZHVyYXRpb25JblNlY29uZHMpIHtcbiAgICAgICAgaWYgKGR1cmF0aW9uSW5TZWNvbmRzID09PSB2b2lkIDApIHsgZHVyYXRpb25JblNlY29uZHMgPSAzMDsgfVxuICAgICAgICBhbGVydGlmeS5ub3RpZnkobWVzc2FnZSwgJ3dhcm5pbmcnLCBkdXJhdGlvbkluU2Vjb25kcyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTaG93IGEgZmxhc2ggbm90aWZpY2F0aW9uIG9mIHR5cGUgXCJlcnJvclwiLlxuICAgICAqL1xuICAgIEFsZXJ0aWZ5U2VydmljZS5wcm90b3R5cGUubm90aWZ5RXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSwgZHVyYXRpb25JblNlY29uZHMpIHtcbiAgICAgICAgaWYgKGR1cmF0aW9uSW5TZWNvbmRzID09PSB2b2lkIDApIHsgZHVyYXRpb25JblNlY29uZHMgPSAzMDsgfVxuICAgICAgICBhbGVydGlmeS5ub3RpZnkobWVzc2FnZSwgJ2Vycm9yJywgZHVyYXRpb25JblNlY29uZHMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2hvdyBhIGZsYXNoIG5vdGlmaWNhdGlvbiBhZnRlciBhIHJlZGlyZWN0aW9uIHRvIGFub3RoZXIgdXJsIChvZiB0aGUgc2FtZSBwcm9qZWN0Li4pLlxuICAgICAqL1xuICAgIEFsZXJ0aWZ5U2VydmljZS5wcm90b3R5cGUubm90aWZ5QWZ0ZXJSZWRpcmVjdCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlLCB1cmwpIHtcbiAgICAgICAgZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9ICcvX3diX2Vzc2VudGlhbC9taXNjL3JlZGlyZWN0LWFuZC1ub3RpZnknICsgdXRpbHNfMS5idWlsZFF1ZXJ5UGFyYW1ldGVycyh7XG4gICAgICAgICAgICBwOiBiYXNlNjRfMS5iYXNlNjRlbmNvZGVVcmxTYWZlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBhbiBpZCBndWFyYW50ZWVkIHRvIGJlIHVuaXF1ZSBmb3IgdGhlIGN1cnJlbnQgRE9NLlxuICAgICAqL1xuICAgIEFsZXJ0aWZ5U2VydmljZS5wcm90b3R5cGUuZ2VuZXJhdGVVbmlxdWVJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICdhbF9nZF8nICsgKCsrQWxlcnRpZnlTZXJ2aWNlXzEuTUFYX0lEKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYSB2YXJpYWJsZSBpbnB1dCBpbnRvIGFuIEhUTUxFbGVtZW50IGluc3RhbmNlIHJlYWR5IHRvIGJlIHVzZWQgYnkgdGhlIGRpYWxvZyBzeXN0ZW0uXG4gICAgICovXG4gICAgQWxlcnRpZnlTZXJ2aWNlLnByb3RvdHlwZS5yZXNvbHZlRGlhbG9nU291cmNlID0gZnVuY3Rpb24gKGlkLCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHV0aWxzXzIuaXNPYmplY3Qoc291cmNlKSkge1xuICAgICAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdXRpbHNfMi5pc1VuZGVmaW5lZChzb3VyY2UuanF1ZXJ5KSB8fCBzb3VyY2UgaW5zdGFuY2VvZiAkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5nZXQoMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxzXzIuaXNTdHJpbmcoc291cmNlKSAmJiBzb3VyY2VbMF0gIT09ICc8Jykge1xuICAgICAgICAgICAgc291cmNlID0gJzxkaXY+JyArIHNvdXJjZSArICc8L2Rpdj4nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkKHNvdXJjZSkucHJvcCgnaWQnLCBpZCkuZ2V0KDApO1xuICAgIH07XG4gICAgdmFyIEFsZXJ0aWZ5U2VydmljZV8xO1xuICAgIEFsZXJ0aWZ5U2VydmljZS5NQVhfSUQgPSAwO1xuICAgIEFsZXJ0aWZ5U2VydmljZSA9IEFsZXJ0aWZ5U2VydmljZV8xID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpLFxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbXSlcbiAgICBdLCBBbGVydGlmeVNlcnZpY2UpO1xuICAgIHJldHVybiBBbGVydGlmeVNlcnZpY2U7XG59KCkpO1xuZXhwb3J0cy5BbGVydGlmeVNlcnZpY2UgPSBBbGVydGlmeVNlcnZpY2U7XG5leHBvcnRzLkFsZXJ0aWZ5U2VydmljZVN5bWJvbCA9IFN5bWJvbChcIkFsZXJ0aWZ5U2VydmljZVwiKTtcbmNvbnRhaW5lcl8xLkNvbnRhaW5lci5yZWdpc3RlclNlcnZpY2UoZXhwb3J0cy5BbGVydGlmeVNlcnZpY2VTeW1ib2wsIEFsZXJ0aWZ5U2VydmljZSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQXBwRXJyb3IgPSB2b2lkIDA7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL3V0aWxzL3V0aWxzXCIpO1xudmFyIGNvbnRhaW5lcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvaW52ZXJzaWZ5L2NvbnRhaW5lclwiKTtcbi8qKlxuICogQmFzZSBlcnJvciBjbGFzcy5cbiAqIEFsbCBlcnJvcnMgb2YgdGhlIGFwcGxpY2F0aW9uIE1VU1QgaW5oZXJpdCBmcm9tIHRoaXMgY2xhc3MuXG4gKlxuICogRG8gTk9UIHVzZSB0aGUgZGVmYXVsdCBFcnJvciBjbGFzcyBiZWNhdXNlIG9mOlxuICogaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LXdpa2kvYmxvYi9tYXN0ZXIvQnJlYWtpbmctQ2hhbmdlcy5tZCNleHRlbmRpbmctYnVpbHQtaW5zLWxpa2UtZXJyb3ItYXJyYXktYW5kLW1hcC1tYXktbm8tbG9uZ2VyLXdvcmtcbiAqXG4gKiBBbmQgbW9yZSBwYXJ0aWN1bGFybHkgYmVjYXVzZSBvZjpcbiAqXG4gKiBcIlVuZm9ydHVuYXRlbHksIHRoZXNlIHdvcmthcm91bmRzIHdpbGwgbm90IHdvcmsgb24gSW50ZXJuZXQgRXhwbG9yZXIgMTAgYW5kIHByaW9yLlxuICogT25lIGNhbiBtYW51YWxseSBjb3B5IG1ldGhvZHMgZnJvbSB0aGUgcHJvdG90eXBlIG9udG8gdGhlIGluc3RhbmNlIGl0c2VsZiAoaS5lLiBGb29FcnJvci5wcm90b3R5cGUgb250byB0aGlzKSwgYnV0IHRoZSBwcm90b3R5cGUgY2hhaW4gaXRzZWxmIGNhbm5vdCBiZSBmaXhlZC5cIlxuICpcbiAqIFRvIGtlZXAgSUUgMTAgY29tcGF0aWJpbGl0eSwgdGhlIG1vc3QgcmVsaWFibGUgd2F5IGlzIHRvIGhhdmUgb3VyIG93biBiYXNlIGNsYXNzLlxuICovXG52YXIgQXBwRXJyb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBBcHBFcnJvciBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBBcHBFcnJvcihtZXNzYWdlLCBwcmV2aW91cywgZXh0cmEpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UgPT09IHZvaWQgMCkgeyBtZXNzYWdlID0gJyc7IH1cbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5wcmV2aW91cyA9IHByZXZpb3VzO1xuICAgICAgICB0aGlzLmV4dHJhID0gZXh0cmE7XG4gICAgICAgIGlmICghdXRpbHNfMS5pc051bGxPclVuZGVmaW5lZChwcmV2aW91cykgJiYgIShwcmV2aW91cyBpbnN0YW5jZW9mIEFwcEVycm9yKSkge1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91cyA9IEFwcEVycm9yLmNyZWF0ZShwcmV2aW91cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFwcEVycm9yLklzRGV2KCkpIHtcbiAgICAgICAgICAgIGlmICh1dGlsc18xLmlzT2JqZWN0KGV4dHJhKSAmJiAhdXRpbHNfMS5pc051bGxPclVuZGVmaW5lZChleHRyYS5zdGFjaykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhleHRyYS5zdGFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLnRyYWNlKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE9mZmVycyBhbmQgZWFzeSB3YXkgdG8gdGVzdCBpZiB0aGUgY3VycmVudCBlbnYgaXMgZGV2LlxuICAgICAqL1xuICAgIEFwcEVycm9yLklzRGV2ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoQXBwRXJyb3IuX2lzRGV2ID09PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBTaGFyZWRDb25maWd1cmF0aW9uIGhhcyB0aGUgcGFydGljdWxhcml0eSB0byBiZSBhbHNvIHJlZ2lzdGVyZWQgYXMgYSBzdHJpbmcgY29uc3RhbnQgc28gaXQgY2FuXG4gICAgICAgICAgICAvLyBiZSBpbXBvcnRlZCBhbnl3aGVyZSB3aXRob3V0IGNpcmN1bGFyIGRlcGVuZGVuY3kgZXJyb3IuXG4gICAgICAgICAgICB2YXIgY29uZiA9IGNvbnRhaW5lcl8xLkNvbnRhaW5lci5nZXRDb250YWluZXIoKS5nZXQoJ1NoYXJlZENvbmZpZ3VyYXRpb24nKTtcbiAgICAgICAgICAgIEFwcEVycm9yLl9pc0RldiA9IGNvbmYuZW52ID09PSAnZGV2JztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXBwRXJyb3IuX2lzRGV2O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgQXBwRXJyb3IgaW5zdGFuY2UgZnJvbSBhIG1peGVkIGlucHV0LlxuICAgICAqIElucHV0IGNhbiBiZTpcbiAgICAgKiAgIC0gYSBzdHJpbmdcbiAgICAgKiAgIC0gYW4gRXJyb3Igb2JqZWN0XG4gICAgICogICAtIGEgQXBwRXJyb3Igb2JqZWN0XG4gICAgICogICAtIGEgcGxhaW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBcIm1lc3NhZ2VcIiBrZXlcbiAgICAgKi9cbiAgICBBcHBFcnJvci5jcmVhdGUgPSBmdW5jdGlvbiAoaW5wdXQsIGRlZmF1bHRNZXNzYWdlKSB7XG4gICAgICAgIGlmIChkZWZhdWx0TWVzc2FnZSA9PT0gdm9pZCAwKSB7IGRlZmF1bHRNZXNzYWdlID0gJ1Vua25vd24gZXJyb3InOyB9XG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEFwcEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxzXzEuaXNTdHJpbmcoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFwcEVycm9yKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBcHBFcnJvcihpbnB1dC50b1N0cmluZygpLCBudWxsLCB7IG9yaWdpbmFsRXJyb3I6IGlucHV0LCBzdGFjazogaW5wdXQuc3RhY2sgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxzXzEuaXNPYmplY3QoaW5wdXQpICYmIHV0aWxzXzEuaXNTdHJpbmcoaW5wdXQubWVzc2FnZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQXBwRXJyb3IoaW5wdXQubWVzc2FnZSwgbnVsbCwgeyBvcmlnaW5hbEVycm9yOiBpbnB1dCB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFwcEVycm9yKGRlZmF1bHRNZXNzYWdlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFdpbGwgdHJ5IHRvIGZpbmQgdGhlIGZpcnN0IFB1YmxpY0FwcEVycm9yIGluc3RhbmNlIGluIHRoZSBzdGFjayBhbmQgd2lsbCByZXR1cm4gaXRzIG1lc3NhZ2UgaWYgZm91bmQuXG4gICAgICogSWYgbm8gcHVibGljIGVycm9yIGlzIGZvdW5kIHRoZSBkZWZhdWx0IG1lc3NhZ2Ugd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBBcHBFcnJvci5wcm90b3R5cGUuZ2V0UHVibGljTWVzc2FnZSA9IGZ1bmN0aW9uIChkZWZhdWx0TWVzc2FnZSkge1xuICAgICAgICBpZiAoZGVmYXVsdE1lc3NhZ2UgPT09IHZvaWQgMCkgeyBkZWZhdWx0TWVzc2FnZSA9ICdVbmtub3duIGVycm9yJzsgfVxuICAgICAgICB2YXIgcHVibGljRXJyb3IgPSB0aGlzLmdldFB1YmxpY0Vycm9yKCk7XG4gICAgICAgIGlmIChwdWJsaWNFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHB1YmxpY0Vycm9yLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFwcEVycm9yLklzRGV2KCkgPyB0aGlzLmdldFJlYWxFcnJvcigpLm1lc3NhZ2UgOiBkZWZhdWx0TWVzc2FnZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGZpcnN0IFB1YmxpY0FwcEVycm9yIGluc3RhbmNlIGluIHRoZSBzdGFjay5cbiAgICAgKiBJZiBub25lIGlzIGZvdW5kLCByZXR1cm5zIG51bGwuXG4gICAgICovXG4gICAgQXBwRXJyb3IucHJvdG90eXBlLmdldFB1YmxpY0Vycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wcmV2aW91cyAmJiB0aGlzLnByZXZpb3VzLmlzUHVibGljRXJyb3IoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF1dGlsc18xLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMucHJldmlvdXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmV2aW91cy5nZXRQdWJsaWNFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRW5zdXJlIHRoZSBcInJlYWxcIiBlcnJvciBpcyByZXR1cm5lZC5cbiAgICAgKlxuICAgICAqIFRoYXQncyB1c2VmdWwgaW4gY2FzZSB5b3UgZG9uJ3Qga25vdyBpZiB0aGUgZXJyb3IgeW91IHJlY2VpdmUgaGFzIGJlZW4gd3JhcHBlZCBpbnNpZGUgYSBQdWJsaWNBcHBFcnJvci5cbiAgICAgKi9cbiAgICBBcHBFcnJvci5wcm90b3R5cGUuZ2V0UmVhbEVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZmlyc3QgZXJyb3Igb2YgYSBjZXJ0YWluIHR5cGUgaW4gdGhlIHN0YWNrIG9mIGVycm9ycy5cbiAgICAgKi9cbiAgICBBcHBFcnJvci5wcm90b3R5cGUuZ2V0Rmlyc3RFcnJvck9mVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIGlmICh0eXBlID09PSB0aGlzLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcmV2aW91cykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMuZ2V0Rmlyc3RFcnJvck9mVHlwZSh0eXBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXJyb3IuXG4gICAgICovXG4gICAgQXBwRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVhbEVycm9yID0gdGhpcy5nZXRSZWFsRXJyb3IoKTtcbiAgICAgICAgcmV0dXJuIHJlYWxFcnJvciA/IHJlYWxFcnJvci5tZXNzYWdlIDogdGhpcy5tZXNzYWdlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpZiB0aGUgY3VycmVudCBpbnN0YW5jZSBpcyBhIHB1YmxpYyBlcnJvci5cbiAgICAgKiBQdWJsaWMgZXJyb3IgbXVzdCBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byByZXR1cm4gXCJ0cnVlXCIgaW5zdGVhZC5cbiAgICAgKi9cbiAgICBBcHBFcnJvci5wcm90b3R5cGUuaXNQdWJsaWNFcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgQXBwRXJyb3IuX2lzRGV2ID0gbnVsbDtcbiAgICByZXR1cm4gQXBwRXJyb3I7XG59KCkpO1xuZXhwb3J0cy5BcHBFcnJvciA9IEFwcEVycm9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC5lcnJvclwiKSwgZXhwb3J0cyk7XG50c2xpYl8xLl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9wdWJsaWMtYXBwLmVycm9yXCIpLCBleHBvcnRzKTtcbnRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3N0b3AuZXJyb3JcIiksIGV4cG9ydHMpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlB1YmxpY0FwcEVycm9yID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgYXBwX2Vycm9yXzEgPSByZXF1aXJlKFwiLi9hcHAuZXJyb3JcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL3V0aWxzL3V0aWxzXCIpO1xuLyoqXG4gKiBFcnJvciB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgdG8gdGhlIHVzZXIuXG4gKlxuICogQ3JlYXRpbmcgYW4gZXJyb3Igb2YgdGhpcyB0eXBlIGRvZXNuJ3QgbWVhbiBpdCB3aWxsIGJlIHNob3duLCBidXQgaWYgYSBwYXJ0IG9mIHRoZSBhcHBsaWNhdGlvbiB3YW50cyB0byBkaXNwbGF5IGFuIGVycm9yIHRoZSB1c2VyXG4gKiBpdCB3aWxsIHNlYXJjaCBmb3IgdGhlIGZpcnN0IFB1YmxpY0FwcEVycm9yIGluc3RhbmNlIGluIHRoZSBlcnJvciBzdGFjayAoc3RhcnRpbmcgYXQgdGhlIGJvdHRvbSBvZiB0aGUgc3RhY2spLlxuICpcbiAqIEl0J3MgaW1wb3J0YW50IHRoYXQgZm9yIGV2ZXJ5IGNyaXRpY2FsIGVycm9yIGF0IGxlYXN0IG9uZSBwYXJ0IG9mIHRoZSBhcHAgY3JlYXRlcyBhbiBQdWJsaWNBcHBFcnJvciB0byBlbnN1cmVcbiAqIGEgY2xlYXIgbWVzc2FnZSBjYW4gYmUgZGVsaXZlcmVkIHRvIHRoZSB1c2VyLlxuICovXG52YXIgUHVibGljQXBwRXJyb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoUHVibGljQXBwRXJyb3IsIF9zdXBlcik7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIFB1YmxpY0FwcEVycm9yIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFB1YmxpY0FwcEVycm9yKG1lc3NhZ2UsIHJlYWxFcnJvciwgcHJldmlvdXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbWVzc2FnZSwgcHJldmlvdXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICBfdGhpcy5yZWFsRXJyb3IgPSByZWFsRXJyb3I7XG4gICAgICAgIF90aGlzLnByZXZpb3VzID0gcHJldmlvdXM7XG4gICAgICAgIGlmICghdXRpbHNfMS5pc051bGxPclVuZGVmaW5lZChyZWFsRXJyb3IpICYmICEocmVhbEVycm9yIGluc3RhbmNlb2YgYXBwX2Vycm9yXzEuQXBwRXJyb3IpKSB7XG4gICAgICAgICAgICBfdGhpcy5yZWFsRXJyb3IgPSBhcHBfZXJyb3JfMS5BcHBFcnJvci5jcmVhdGUocmVhbEVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIV90aGlzLnByZXZpb3VzICYmIF90aGlzLnJlYWxFcnJvcikge1xuICAgICAgICAgICAgX3RoaXMucHJldmlvdXMgPSBfdGhpcy5yZWFsRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBoaWdoZXN0IFB1YmxpY0FwcEVycm9yIGluc3RhbmNlIGluIHRoZSBzdGFjay5cbiAgICAgKiBJZiBub25lIGlzIGZvdW5kLCByZXR1cm5zIG51bGwuXG4gICAgICovXG4gICAgUHVibGljQXBwRXJyb3IucHJvdG90eXBlLmdldFB1YmxpY0Vycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wcmV2aW91cyA/IHRoaXMucHJldmlvdXMuZ2V0UHVibGljRXJyb3IoKSA6IG51bGw7XG4gICAgICAgIHJldHVybiBwYXJlbnQgPyBwYXJlbnQgOiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBmaXJzdCBlcnJvciBvZiBhIGNlcnRhaW4gdHlwZSBpbiB0aGUgc3RhY2sgb2YgZXJyb3JzLlxuICAgICAqL1xuICAgIFB1YmxpY0FwcEVycm9yLnByb3RvdHlwZS5nZXRGaXJzdEVycm9yT2ZUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhbEVycm9yICYmIHR5cGUgPT09IHRoaXMucmVhbEVycm9yLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFsRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuZ2V0Rmlyc3RFcnJvck9mVHlwZS5jYWxsKHRoaXMsIHR5cGUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcmVhbCBlcnJvciBiZWhpbmQgdGhlIHB1YmxpYyBlcnJvciB3cmFwcGVyLlxuICAgICAqL1xuICAgIFB1YmxpY0FwcEVycm9yLnByb3RvdHlwZS5nZXRSZWFsRXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWxFcnJvcjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgaWYgdGhlIGN1cnJlbnQgaW5zdGFuY2UgaXMgYSBwdWJsaWMgZXJyb3IuXG4gICAgICovXG4gICAgUHVibGljQXBwRXJyb3IucHJvdG90eXBlLmlzUHVibGljRXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgcmV0dXJuIFB1YmxpY0FwcEVycm9yO1xufShhcHBfZXJyb3JfMS5BcHBFcnJvcikpO1xuZXhwb3J0cy5QdWJsaWNBcHBFcnJvciA9IFB1YmxpY0FwcEVycm9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlN0b3BFcnJvciA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIGFwcF9lcnJvcl8xID0gcmVxdWlyZShcIi4vYXBwLmVycm9yXCIpO1xuLyoqXG4gKiBFcnJvciB1c2VkIHRvIHN0b3AgYSBwcm9taXNlIGNoYWluIHdpdGhvdXQgYXBwbHlpbmcgdGhlIG5vcm1hbCBlcnJvciBiZWhhdmlvci5cbiAqL1xudmFyIFN0b3BFcnJvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhTdG9wRXJyb3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3RvcEVycm9yKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBTdG9wRXJyb3I7XG59KGFwcF9lcnJvcl8xLkFwcEVycm9yKSk7XG5leHBvcnRzLlN0b3BFcnJvciA9IFN0b3BFcnJvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FdmVudEFyZyA9IHZvaWQgMDtcbi8qKlxuICogQmFzZSBjbGFzcyBvZiBhbGwgZXZlbnRzLlxuICovXG52YXIgRXZlbnRBcmcgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRBcmcoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIb2xkcyBpZiB0aGUgcHJvcGFnYXRpb24gaXMgc3RvcHBlZC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJvcGFnYXRpb25TdG9wcGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0b3AgdGhlIGV2ZW50IHByb3BhZ2F0aW9uIHNvIG5vIG90aGVyIGxpc3RlbmVyIGlzIGNhbGxlZC5cbiAgICAgKi9cbiAgICBFdmVudEFyZy5wcm90b3R5cGUuc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUZXN0IGlmIHRoZSBwcm9wYWdhdGlvbiBoYXMgYmVlbiBzdG9wcGVkIGZvciB0aGlzIGV2ZW50LlxuICAgICAqL1xuICAgIEV2ZW50QXJnLnByb3RvdHlwZS5pc1Byb3BhZ2F0aW9uU3RvcHBlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcGFnYXRpb25TdG9wcGVkID09PSB0cnVlO1xuICAgIH07XG4gICAgcmV0dXJuIEV2ZW50QXJnO1xufSgpKTtcbmV4cG9ydHMuRXZlbnRBcmcgPSBFdmVudEFyZztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FdmVudERpc3BhdGNoZXJTZXJ2aWNlU3ltYm9sID0gZXhwb3J0cy5FdmVudERpc3BhdGNoZXJTZXJ2aWNlID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xudmFyIGxvZ18xID0gcmVxdWlyZShcImVzc2VudGlhbHMvbG9nXCIpO1xudmFyIGNvbnRhaW5lcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvaW52ZXJzaWZ5L2NvbnRhaW5lclwiKTtcbnZhciBldmVudF9kaXNwYXRjaGVyXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9ldmVudC9ldmVudC1kaXNwYXRjaGVyXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlclNlcnZpY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoRXZlbnREaXNwYXRjaGVyU2VydmljZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFdmVudERpc3BhdGNoZXJTZXJ2aWNlKGxvZ2dlcikge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBhbiBldmVudC5cbiAgICAgKi9cbiAgICBFdmVudERpc3BhdGNoZXJTZXJ2aWNlLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGFyZykge1xuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRGlzcGF0Y2ggXCInICsgZXZlbnROYW1lICsgJ1wiIGV2ZW50LicpO1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmRpc3BhdGNoLmNhbGwodGhpcywgZXZlbnROYW1lLCBhcmcpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBhbiBldmVudCBhbmQgcmV0dXJuIHJlc3BvbnNlcyBvZiBjYWxsYmFja3MuXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCB3YWl0IGZvciBwcm9taXNlcyB0byByZXNvbHZlLlxuICAgICAqL1xuICAgIEV2ZW50RGlzcGF0Y2hlclNlcnZpY2UucHJvdG90eXBlLmRpc3BhdGNoRm9yUmVzcG9uc2UgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBhcmcpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Rpc3BhdGNoIFwiJyArIGV2ZW50TmFtZSArICdcIiBldmVudC4nKTtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuZGlzcGF0Y2hGb3JSZXNwb25zZS5jYWxsKHRoaXMsIGV2ZW50TmFtZSwgYXJnKTtcbiAgICB9O1xuICAgIEV2ZW50RGlzcGF0Y2hlclNlcnZpY2UgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXG4gICAgICAgIHRzbGliXzEuX19wYXJhbSgwLCBpbnZlcnNpZnlfMS5pbmplY3QobG9nXzEuTG9nZ2VyU2VydmljZVN5bWJvbCkpLFxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbbG9nXzEuTG9nZ2VyU2VydmljZV0pXG4gICAgXSwgRXZlbnREaXNwYXRjaGVyU2VydmljZSk7XG4gICAgcmV0dXJuIEV2ZW50RGlzcGF0Y2hlclNlcnZpY2U7XG59KGV2ZW50X2Rpc3BhdGNoZXJfMS5FdmVudERpc3BhdGNoZXIpKTtcbmV4cG9ydHMuRXZlbnREaXNwYXRjaGVyU2VydmljZSA9IEV2ZW50RGlzcGF0Y2hlclNlcnZpY2U7XG5leHBvcnRzLkV2ZW50RGlzcGF0Y2hlclNlcnZpY2VTeW1ib2wgPSBTeW1ib2woXCJFdmVudERpc3BhdGNoZXJTZXJ2aWNlXCIpO1xuY29udGFpbmVyXzEuQ29udGFpbmVyLnJlZ2lzdGVyU2VydmljZShleHBvcnRzLkV2ZW50RGlzcGF0Y2hlclNlcnZpY2VTeW1ib2wsIEV2ZW50RGlzcGF0Y2hlclNlcnZpY2UpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkV2ZW50RGlzcGF0Y2hlciA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcImVzc2VudGlhbHMvdXRpbHMvdXRpbHNcIik7XG52YXIgZXZlbnRfYXJnXzEgPSByZXF1aXJlKFwiLi9ldmVudC1hcmdcIik7XG52YXIgRXZlbnREaXNwYXRjaGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIGFuIGV2ZW50LlxuICAgICAqL1xuICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHV0aWxzXzEuaXNVbmRlZmluZWQodGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXSkpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF1dGlsc18xLmlzVW5kZWZpbmVkKF90aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX3RoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdW2ldID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBhbiBldmVudC5cbiAgICAgKi9cbiAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgYXJnKSB7XG4gICAgICAgIGlmICh1dGlsc18xLmlzVW5kZWZpbmVkKHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhcmcpIHtcbiAgICAgICAgICAgIGFyZyA9IG5ldyBldmVudF9hcmdfMS5FdmVudEFyZygpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLmxpc3RlbmVyc1tldmVudE5hbWVdOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gX2FbX2ldO1xuICAgICAgICAgICAgY2FsbGJhY2soYXJnKTtcbiAgICAgICAgICAgIGlmIChhcmcuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBhbiBldmVudCBhbmQgcmV0dXJuIHJlc3BvbnNlcyBvZiBjYWxsYmFja3MuXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCB3YWl0IGZvciBwcm9taXNlcyB0byByZXNvbHZlLlxuICAgICAqL1xuICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hGb3JSZXNwb25zZSA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGFyZykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKHV0aWxzXzEuaXNVbmRlZmluZWQoX3RoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhcmcpIHtcbiAgICAgICAgICAgICAgICBhcmcgPSBuZXcgZXZlbnRfYXJnXzEuRXZlbnRBcmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXNwb25zZXMgPSBudWxsO1xuICAgICAgICAgICAgdmFyIHBpcGVsaW5lID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB2YXIgcHJvcGFnYXRpb25TdG9wcGVkID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gX3RoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV07IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lID0gcGlwZWxpbmUudGhlbigoZnVuY3Rpb24gKGlubmVyQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwcmV2aW91c1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGFnYXRpb25TdG9wcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZXMucHVzaChwcmV2aW91c1Jlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGlubmVyQ2FsbGJhY2soYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSkoY2FsbGJhY2spKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBpcGVsaW5lLnRoZW4oZnVuY3Rpb24gKHByZXZpb3VzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZXMucHVzaChwcmV2aW91c1Jlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlcyk7XG4gICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgYW4gZXZlbnQgYW5kIHJldHVybiByZXNwb25zZXMgb2YgY2FsbGJhY2tzLlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgd2FpdCBmb3IgcHJvbWlzZXMgdG8gcmVzb2x2ZS5cbiAgICAgKi9cbiAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRm9yU2luZ2xlUmVzcG9uc2UgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBhcmcsIHN0cmF0ZWd5KSB7XG4gICAgICAgIGlmIChzdHJhdGVneSA9PT0gdm9pZCAwKSB7IHN0cmF0ZWd5ID0gJ2xhc3QnOyB9XG4gICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlcztcbiAgICAgICAgICAgIHJldHVybiB0c2xpYl8xLl9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB0aGlzLmRpc3BhdGNoRm9yUmVzcG9uc2UoZXZlbnROYW1lLCBhcmcpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0cmF0ZWd5ID09PSAnbGFzdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHJlc3BvbnNlcy5wb3BdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VzLnNoaWZ0KCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgcmVnaXN0ZXJlZCBsaXN0ZW5lcnMuXG4gICAgICovXG4gICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgICB9O1xuICAgIEV2ZW50RGlzcGF0Y2hlciA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pXG4gICAgXSwgRXZlbnREaXNwYXRjaGVyKTtcbiAgICByZXR1cm4gRXZlbnREaXNwYXRjaGVyO1xufSgpKTtcbmV4cG9ydHMuRXZlbnREaXNwYXRjaGVyID0gRXZlbnREaXNwYXRjaGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2V2ZW50LWFyZ1wiKSwgZXhwb3J0cyk7XG50c2xpYl8xLl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9ldmVudC1kaXNwYXRjaGVyLnNlcnZpY2VcIiksIGV4cG9ydHMpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNvbnRhaW5lciA9IHZvaWQgMDtcbnZhciBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XG52YXIgQ29udGFpbmVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbnRhaW5lcigpIHtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgSW52ZXJzaWZ5J3MgY29udGFpbmVyIGFuZCBjcmVhdGUgaXQgaWYgbmVjZXNzYXJ5LlxuICAgICAqXG4gICAgICogQHJldHVybnMge0ludmVyc2lmeUNvbnRhaW5lcn1cbiAgICAgKi9cbiAgICBDb250YWluZXIuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoQ29udGFpbmVyLmNvbnRhaW5lciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgQ29udGFpbmVyLmNvbnRhaW5lciA9IG5ldyBpbnZlcnNpZnlfMS5Db250YWluZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ29udGFpbmVyLmNvbnRhaW5lcjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGFuIG9iamVjdCBhcyBhIG1vZHVsZSBpbnRvIHRoZSBjb250YWluZXIuXG4gICAgICogTW9kdWxlcyBhcmUgdHJhbnNpZW50LCBhIG5ldyBpbnN0YW5jZSB3aWxsIGJlIGNyZWF0ZWQgZWFjaCB0aW1lIHRoZXkgYXJlIGltcG9ydGVkIGFzIGEgZGVwZW5kZW5jeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3ltYm9sfSBzeW1ib2xcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdHlwZVxuICAgICAqL1xuICAgIENvbnRhaW5lci5yZWdpc3Rlck1vZHVsZSA9IGZ1bmN0aW9uIChzeW1ib2wsIHR5cGUpIHtcbiAgICAgICAgQ29udGFpbmVyLmdldENvbnRhaW5lcigpLmJpbmQoc3ltYm9sKS50byh0eXBlKS5pblRyYW5zaWVudFNjb3BlKCk7XG4gICAgICAgIENvbnRhaW5lci5zeW1ib2xzLm1vZHVsZXMucHVzaChzeW1ib2wpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYW4gb2JqZWN0IGFzIGEgc2VydmljZSBpbnRvIHRoZSBjb250YWluZXIuXG4gICAgICogU2VydmljZXMgYXJlIHNpbmdsZXRvbiwgb25seSBvbmUgaW5zdGFuY2Ugd2lsbCBiZSBjcmVhdGVkIGFuZCB3aWxsIGJlIHNoYXJlZCBlYWNoIHRpbWUgaXQgaXMgaW1wb3J0ZWQgYXMgYSBkZXBlbmRlbmN5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTeW1ib2x9IHN5bWJvbFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlXG4gICAgICovXG4gICAgQ29udGFpbmVyLnJlZ2lzdGVyU2VydmljZSA9IGZ1bmN0aW9uIChzeW1ib2wsIHR5cGUpIHtcbiAgICAgICAgQ29udGFpbmVyLmdldENvbnRhaW5lcigpLmJpbmQoc3ltYm9sKS50byh0eXBlKS5pblNpbmdsZXRvblNjb3BlKCk7XG4gICAgICAgIENvbnRhaW5lci5zeW1ib2xzLnNlcnZpY2VzLnB1c2goc3ltYm9sKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgc2VydmljZSBmYWN0b3J5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTeW1ib2x9ICAgc3ltYm9sXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBDb250YWluZXIucmVnaXN0ZXJGYWN0b3J5ID0gZnVuY3Rpb24gKHN5bWJvbCwgY2FsbGJhY2spIHtcbiAgICAgICAgQ29udGFpbmVyLmdldENvbnRhaW5lcigpLmJpbmQoc3ltYm9sKS50b0R5bmFtaWNWYWx1ZShjYWxsYmFjayk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB3aG9sZSBsaXN0IG9mIHJlZ2lzdGVyZWQgc3ltYm9scyBmb3IgbW9kdWxlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzeW1ib2xbXX1cbiAgICAgKi9cbiAgICBDb250YWluZXIuZ2V0TW9kdWxlc1N5bWJvbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBbXS5jb25jYXQoQ29udGFpbmVyLnN5bWJvbHMubW9kdWxlcyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB3aG9sZSBsaXN0IG9mIHJlZ2lzdGVyZWQgc3ltYm9scyBmb3Igc2VydmljZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3ltYm9sW119XG4gICAgICovXG4gICAgQ29udGFpbmVyLmdldFNlcnZpY2VzU3ltYm9scyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFtdLmNvbmNhdChDb250YWluZXIuc3ltYm9scy5zZXJ2aWNlcyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbnZlcnNpZnkgY29udGFpbmVyIGluc3RhbmNlLlxuICAgICAqL1xuICAgIENvbnRhaW5lci5jb250YWluZXIgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIFN5bWJvbHMgb2YgcmVnaXN0ZXJlZCBtb2R1bGVzLlxuICAgICAqL1xuICAgIENvbnRhaW5lci5zeW1ib2xzID0ge1xuICAgICAgICBtb2R1bGVzOiBbXSxcbiAgICAgICAgc2VydmljZXM6IFtdLFxuICAgIH07XG4gICAgcmV0dXJuIENvbnRhaW5lcjtcbn0oKSk7XG5leHBvcnRzLkNvbnRhaW5lciA9IENvbnRhaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5KcXVlcnlNb2R1bGUgPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciBldmVudF8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvZXZlbnRcIik7XG52YXIgY29udGFpbmVyXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9pbnZlcnNpZnkvY29udGFpbmVyXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy91dGlsc1wiKTtcbnZhciBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XG52YXIgSnF1ZXJ5TW9kdWxlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEpxdWVyeU1vZHVsZSgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFF1ZXVlIG9mIGRlZmVycmVkIG9iamVjdHMgd2FpdGluZyBmb3IgdGhlIGNvbXBvbmVudCB0byBiZSByZWFkeS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25SZWFkeVByb21pc2UgPSBudWxsO1xuICAgICAgICB0aGlzLm9uUmVhZHlQcm9taXNlUmVzb2x2ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyID0gY29udGFpbmVyXzEuQ29udGFpbmVyLmdldENvbnRhaW5lcigpLmdldChldmVudF8xLkV2ZW50RGlzcGF0Y2hlclNlcnZpY2VTeW1ib2wpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmdldERlZmF1bHRPcHRpb25zKCk7XG4gICAgICAgIHRoaXMuc3RhdGVzSG9sZGVyID0ge1xuICAgICAgICAgICAgY3VycmVudDoge30sXG4gICAgICAgICAgICB0YWdzOiB7fSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclN0YXRlVGFncyhKcXVlcnlNb2R1bGVfMS5TVEFURVMuSU5JVElBTElaSU5HLCBKcXVlcnlNb2R1bGVfMS5TVEFURVMuQlVaWSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTdGF0ZVRhZ3MoSnF1ZXJ5TW9kdWxlXzEuU1RBVEVTLklOSVRJQUxJWklORywgSnF1ZXJ5TW9kdWxlXzEuU1RBVEVTLkNPTlNUUlVDVEVEKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclN0YXRlVGFncyhKcXVlcnlNb2R1bGVfMS5TVEFURVMuSU5JVElBTElaRUQsIEpxdWVyeU1vZHVsZV8xLlNUQVRFUy5DT05TVFJVQ1RFRCk7XG4gICAgfVxuICAgIEpxdWVyeU1vZHVsZV8xID0gSnF1ZXJ5TW9kdWxlO1xuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGpRdWVyeSBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgalF1ZXJ5XG4gICAgICovXG4gICAgSnF1ZXJ5TW9kdWxlLnByb3RvdHlwZS5nZXRFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kZWxlbWVudDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGpRdWVyeSBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgbW9kdWxlLlxuICAgICAqL1xuICAgIEpxdWVyeU1vZHVsZS5wcm90b3R5cGUuc2V0RWxlbWVudCA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIHRoZSBtb2R1bGUuXG4gICAgICovXG4gICAgLyogZmluYWwgKi8gSnF1ZXJ5TW9kdWxlLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5lbnRlclN0YXRlKEpxdWVyeU1vZHVsZV8xLlNUQVRFUy5JTklUSUFMSVpJTkcpO1xuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyB8fCB7fSk7XG4gICAgICAgIFByb21pc2UuYWxsKFt0aGlzLmRvSW5pdCgpXSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5lbnRlclN0YXRlKEpxdWVyeU1vZHVsZV8xLlNUQVRFUy5JTklUSUFMSVpFRCk7XG4gICAgICAgICAgICBfdGhpcy5sZWF2ZVN0YXRlKEpxdWVyeU1vZHVsZV8xLlNUQVRFUy5JTklUSUFMSVpJTkcpO1xuICAgICAgICAgICAgaWYgKF90aGlzLm9uUmVhZHlQcm9taXNlUmVzb2x2ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm9uUmVhZHlQcm9taXNlUmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIF90aGlzLm9uUmVhZHlQcm9taXNlUmVzb2x2ZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5hZnRlckluaXQoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDYWxsIHRoZSBwcm9taXNlIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLm9uUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLm9uUmVhZHlQcm9taXNlID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9uUmVhZHlQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5vblJlYWR5UHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1JlYWR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVhZHlQcm9taXNlUmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVhZHlQcm9taXNlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGVzdCBpZiB0aGUgbW9kdWxlIGlzIHJlYWR5IHRvIGJlIHVzZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLmlzUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzSW5TdGF0ZShKcXVlcnlNb2R1bGVfMS5TVEFURVMuSU5JVElBTElaRUQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0cyBhbiBvcHRpb24gYnkgbmFtZS5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLmdldE9wdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdm9pZCAwKSB7IGRlZmF1bHRWYWx1ZSA9IG51bGw7IH1cbiAgICAgICAgaWYgKHRoaXMuaGFzT3B0aW9uKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIGFuIG9wdGlvbiBieSBuYW1lLlxuICAgICAqL1xuICAgIEpxdWVyeU1vZHVsZS5wcm90b3R5cGUuc2V0T3B0aW9uID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHZhciBoYXNPcHRpb24gPSB0aGlzLmhhc09wdGlvbihuYW1lKTtcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gaGFzT3B0aW9uID8gdGhpcy5vcHRpb25zW25hbWVdIDogbnVsbDtcbiAgICAgICAgdGhpcy5vcHRpb25zW25hbWVdID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLmlzUmVhZHkoKSAmJiBoYXNPcHRpb24gJiYgIXV0aWxzXzEuYXJlRXF1YWwob2xkVmFsdWUsIHZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5vbk9wdGlvbkNoYW5nZShuYW1lLCBvbGRWYWx1ZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXJnZSBhbiBvYmplY3Qgb2Ygb3B0aW9ucyBpbnRvIHRoZSBpbnRlcm5hbCBvbmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNsZWFyT3RoZXIgKG9wdGlvbmFsLCBkZWZhdWx0OiBmYWxzZSkgaWYgdHJ1ZSwgdGhlIGludGVybmFsIG9iamVjdCBpcyBjbGVhcmVkIGJlZm9yZSBzZXR0aW5nIG5ldyBvcHRpb25zLlxuICAgICAqICAgICAgICAgICAgICAgICAgQnkgZGVmYXVsdCwgbmV3IG9wdGlvbnMgYXJlIG1lcmdlZCB3aXRoIGV4aXN0aW5nIG9uZXMuXG4gICAgICovXG4gICAgSnF1ZXJ5TW9kdWxlLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNsZWFyT3RoZXIpIHtcbiAgICAgICAgaWYgKGNsZWFyT3RoZXIgPT09IHZvaWQgMCkgeyBjbGVhck90aGVyID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKGNsZWFyT3RoZXIpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIG5hbWVfMSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lXzEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24obmFtZV8xLCBvcHRpb25zW25hbWVfMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUZXN0cyBpZiBhbiBvcHRpb24gaXMgZGVmaW5lZC5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLmhhc09wdGlvbiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbbmFtZV0gIT09IHZvaWQgMDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbmFtZSBvZiB0aGUgb3B0aW9uIHRvIHVzZSB3aGVuIGEgc2NhbGFyIHZhbHVlIGlzIHBhc3NlZFxuICAgICAqIHRvIHRoZSBodG1sIGF0dHJpYnV0ZSwgbGlrZToganFtLW15LW1vZHVsZT1cIjJcIi5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLmdldERlZmF1bHRPcHRpb25OYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemF0aW9uIG1ldGhvZC5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLmRvSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiRlbGVtZW50IHx8IHV0aWxzXzEuaXNVbmRlZmluZWQodGhpcy4kZWxlbWVudC5qcXVlcnkpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiWW91IG11c3Qgc2V0IHRoZSByb290IERPTSBlbGVtZW50IG9mIGEgSlF1ZXJ5IHBsdWdpbiBieSBjYWxsaW5nIHNldEVsZW1lbnQoSlF1ZXJ5KSB3aXRoIGEgSlF1ZXJ5IG9iamVjdC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBET00gYmluZGluZ3MuXG4gICAgICovXG4gICAgSnF1ZXJ5TW9kdWxlLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBPdmVycmlkZSBtZVxuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIERPTSBiaW5kaW5ncy5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gT3ZlcnJpZGUgbWVcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCBjYWxsZWQgYWZ0ZXIgdGhlIGluaXRpYWxpemF0aW9uIGlzIGRvbmUuXG4gICAgICovXG4gICAgSnF1ZXJ5TW9kdWxlLnByb3RvdHlwZS5hZnRlckluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYmluZCgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgd2hvbGUgb2JqZWN0IG9mIG9wdGlvbnMuXG4gICAgICovXG4gICAgSnF1ZXJ5TW9kdWxlLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIHZhbHVlIG9mIGFuIG9wdGlvbiBjaGFuZ2VzLlxuICAgICAqIE5vdGUsIHRoaXMgbWV0aG9kIGlzIG5vdCBjYWxsZWQgd2hpbGUgdGhlIGluaXRpYWxpemF0aW9uIGlzIG5vdCBmaW5pc2hlZC5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLm9uT3B0aW9uQ2hhbmdlID0gZnVuY3Rpb24gKG9wdGlvbk5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICAvLyBPdmVycmlkZSBtZVxuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZGVmYXVsdCBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBPdmVycmlkZSB0aGlzIHRvIGFkZCBjdXN0b20gb3B0aW9ucy5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLmdldERlZmF1bHRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hldGhlciBpZiB0aGUgY29tcG9uZW50IGlzIGluIGEgc3BlY2lmaWMgc3RhdGUgb3Igbm90LlxuICAgICAqL1xuICAgIEpxdWVyeU1vZHVsZS5wcm90b3R5cGUuaXNJblN0YXRlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVzSG9sZGVyLmN1cnJlbnRbbmFtZV0gJiYgdGhpcy5zdGF0ZXNIb2xkZXIuY3VycmVudFtuYW1lXSA+IDA7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBFbnRlcnMgYSBzdGF0ZS5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLmVudGVyU3RhdGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgdGFncyA9IFtuYW1lXS5jb25jYXQodGhpcy5zdGF0ZXNIb2xkZXIudGFnc1tuYW1lXSB8fCBbXSk7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgdGFnc18xID0gdGFnczsgX2kgPCB0YWdzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgdGFnID0gdGFnc18xW19pXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMuc3RhdGVzSG9sZGVyLmN1cnJlbnRbdGFnXSkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc0hvbGRlci5jdXJyZW50W3RhZ10gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGF0ZXNIb2xkZXIuY3VycmVudFt0YWddKys7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIExlYXZlcyBhIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9ICBuYW1lXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhYnNvbHV0ZSAob3B0aW9uYWwsIGRlZmF1bHQ6IGZhbHNlKSBpZiB0cnVlLCB0aGUgc3RhdGUgY291bnRlciBpcyBzZXQgdG8gMCwgbm8gbWF0dGVyIGlzIHZhbHVlXG4gICAgICovXG4gICAgSnF1ZXJ5TW9kdWxlLnByb3RvdHlwZS5sZWF2ZVN0YXRlID0gZnVuY3Rpb24gKG5hbWUsIGFic29sdXRlKSB7XG4gICAgICAgIGlmIChhYnNvbHV0ZSA9PT0gdm9pZCAwKSB7IGFic29sdXRlID0gZmFsc2U7IH1cbiAgICAgICAgdmFyIHRhZ3MgPSBbbmFtZV0uY29uY2F0KHRoaXMuc3RhdGVzSG9sZGVyLnRhZ3NbbmFtZV0gfHwgW10pO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIHRhZ3NfMiA9IHRhZ3M7IF9pIDwgdGFnc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHRhZyA9IHRhZ3NfMltfaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mICh0aGlzLnN0YXRlc0hvbGRlci5jdXJyZW50W3RhZ10pICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFic29sdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzSG9sZGVyLmN1cnJlbnRbdGFnXSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlc0hvbGRlci5jdXJyZW50W3RhZ10tLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhbiBldmVudCBvciBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIHN0YXRlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRhZ3MgdGFncyBhc3NvY2lhdGVkIHdpdGggaXQuIElmIHRhZ3MgYXJlIGFscmVhZHkgZGVmaW5lZCwgbmV3IG9uZXMgd2lsbCBiZSBhZGRlZCB0byB0aGUgbGlzdC5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGUucHJvdG90eXBlLnJlZ2lzdGVyU3RhdGVUYWdzID0gZnVuY3Rpb24gKG5hbWUsIHRhZ3MpIHtcbiAgICAgICAgdGFncyA9IHV0aWxzXzEuZW5zdXJlQXJyYXkodGFncyk7XG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMuc3RhdGVzSG9sZGVyLnRhZ3NbbmFtZV0pID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlc0hvbGRlci50YWdzW25hbWVdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCB0YWdzXzMgPSB0YWdzOyBfaSA8IHRhZ3NfMy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBjYW5kaWRhdGUgPSB0YWdzXzNbX2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGVzSG9sZGVyLnRhZ3NbbmFtZV0uaW5kZXhPZihjYW5kaWRhdGUpIDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVzSG9sZGVyLnRhZ3NbbmFtZV0ucHVzaChjYW5kaWRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgSnF1ZXJ5TW9kdWxlXzE7XG4gICAgLyoqXG4gICAgICogQmFzaWMgbGlzdCBvZiBzdGF0ZXMuXG4gICAgICovXG4gICAgSnF1ZXJ5TW9kdWxlLlNUQVRFUyA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1lYW5zIHRoZSBvYmplY3QgaXMgY3JlYXRlZCBhbmQgdGhlIGluaXRpYWxpemF0aW9uIGhhcyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICovXG4gICAgICAgIENPTlNUUlVDVEVEOiBcImNvbnN0cnVjdGVkXCIsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgb2JqZWN0IGlzIGN1cnJlbnRseSBvbiBpbml0aWFsaXphdGlvbiwgbm90IHlldCBmaW5pc2hlZC5cbiAgICAgICAgICovXG4gICAgICAgIElOSVRJQUxJWklORzogXCJpbml0aWFsaXppbmdcIixcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBvYmplY3QgaXMgaW5pdGlhbGl6ZWQsIHJlYWR5IHRvIGJlIHVzZWQuXG4gICAgICAgICAqL1xuICAgICAgICBJTklUSUFMSVpFRDogXCJpbml0aWFsaXplZFwiLFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG9iamVjdCBpcyBidXN5IGRvaW5nIHNvbWUgcHJvY2Vzc2luZy5cbiAgICAgICAgICovXG4gICAgICAgIEJVWlk6IFwiYnV6eVwiLFxuICAgIH07XG4gICAgSnF1ZXJ5TW9kdWxlID0gSnF1ZXJ5TW9kdWxlXzEgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXG4gICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKVxuICAgIF0sIEpxdWVyeU1vZHVsZSk7XG4gICAgcmV0dXJuIEpxdWVyeU1vZHVsZTtcbn0oKSk7XG5leHBvcnRzLkpxdWVyeU1vZHVsZSA9IEpxdWVyeU1vZHVsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5KcXVlcnlNb2R1bGVzTWFuYWdlclN5bWJvbCA9IGV4cG9ydHMuSnF1ZXJ5TW9kdWxlc01hbmFnZXIgPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciBjb250YWluZXJfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2ludmVyc2lmeS9jb250YWluZXJcIik7XG52YXIgb2JqZWN0XzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy9vYmplY3RcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL3V0aWxzL3V0aWxzXCIpO1xudmFyIGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbnZhciBjYW1lbENhc2UgPSByZXF1aXJlKFwibG9kYXNoL2NhbWVsQ2FzZVwiKTtcbnZhciBrZWJhYkNhc2UgPSByZXF1aXJlKFwibG9kYXNoL2tlYmFiQ2FzZVwiKTtcbnZhciB0cmltID0gcmVxdWlyZShcImxvZGFzaC90cmltXCIpO1xuLyoqXG4gKiBNYW5hZ2VzIG1vZHVsZXMgY3JlYXRlZCB1c2luZyBbanFtLSpdIGF0dHJpYnV0ZXMgaW4gdGhlIERPTS5cbiAqL1xudmFyIEpxdWVyeU1vZHVsZXNNYW5hZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEpxdWVyeU1vZHVsZXNNYW5hZ2VyKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogTGlzdCBvZiBhdHRyaWJ1dGVzIHNlbGVjdG9ycyB3aXRoIHRoZSBzeW1ib2wgb2YgdGhlaXIgYXNzb2NpYXRlZCBtb2R1bGUuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm1vZHVsZXNBdHRyaWJ1dGVTZWxlY3RvcnMgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogTGlzdCBvZiBpbnN0YW50aWF0ZWQgbW9kdWxlcy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubW9kdWxlcyA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogSG9sZHMgaWYgYSBzY2FuIGlzIHJ1bm5pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNjYW5uaW5nID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcnVlIGlmIGEgc2NhbiB3YXMgYXNrZWQgd2hpbGUgaXMgc2NhbiB3YXMgcnVubmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2NhbkluUXVldWUgPSBmYWxzZTtcbiAgICB9XG4gICAgSnF1ZXJ5TW9kdWxlc01hbmFnZXJfMSA9IEpxdWVyeU1vZHVsZXNNYW5hZ2VyO1xuICAgIC8qKlxuICAgICAqIFNjYW4gdGhlIERPTSBpbiB0aGUgc2VhcmNoIG9mIFtqcW0tKl0gYXR0cmlidXRlcyBhbmQgY3JlYXRlIHRoZSBWdWVKUyBjb21wb25lbnRzIGFzc29jaWF0ZWQuXG4gICAgICovXG4gICAgSnF1ZXJ5TW9kdWxlc01hbmFnZXIucHJvdG90eXBlLnNjYW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnNjYW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnNjYW5JblF1ZXVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjYW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kb1NjYW4oKTtcbiAgICAgICAgdGhpcy5zY2FubmluZyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5zY2FuSW5RdWV1ZSkge1xuICAgICAgICAgICAgdGhpcy5zY2FuSW5RdWV1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQodXRpbHNfMS5wcm94eSh0aGlzLnNjYW4sIHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRG8gdGhlIGFjdHVhbCBzY2FubmluZyB0aGluZy5cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGVzTWFuYWdlci5wcm90b3R5cGUuZG9TY2FuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLm1vZHVsZXNBdHRyaWJ1dGVTZWxlY3RvcnMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMubW9kdWxlc0F0dHJpYnV0ZVNlbGVjdG9ycyA9IHRoaXMuY29tcHV0ZU1vZHVsZXNBdHRyaWJ1dGVTZWxlY3RvcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBzZWxlY3RvciBpbiB0aGlzLm1vZHVsZXNBdHRyaWJ1dGVTZWxlY3RvcnMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5tb2R1bGVzQXR0cmlidXRlU2VsZWN0b3JzLmhhc093blByb3BlcnR5KHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChcIltcIiArIHNlbGVjdG9yICsgXCJdXCIpLmVhY2goKGZ1bmN0aW9uIChhdHRyTmFtZSwgbW9kdWxlU3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRlbCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyVmFsdWUgPSB0cmltKCRlbC5hdHRyKGF0dHJOYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhTmFtZSA9IGNhbWVsQ2FzZShhdHRyTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtb2R1bGVJbnN0YW5jZSA9IGNvbnRhaW5lcl8xLkNvbnRhaW5lci5nZXRDb250YWluZXIoKS5nZXQobW9kdWxlU3ltYm9sKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF1dGlsc18xLmlzVW5kZWZpbmVkKCRlbC5kYXRhKGF0dHJOYW1lKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNdWx0aXBsZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgalF1ZXJ5IG1vZHVsZSBcXFwiXCIgKyBvYmplY3RfMS5nZXRTeW1ib2xEZXNjcmlwdGlvbihtb2R1bGVTeW1ib2wpICsgXCJcXFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0clZhbHVlWzBdID09PSBcIntcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBKU09OLnBhcnNlKGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKG9wdGlvbnMpICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBkZWNvZGUgb3B0aW9ucyBvZiB0aGUgalF1ZXJ5IG1vZHVsZSBcXFwiXCIgKyBvYmplY3RfMS5nZXRTeW1ib2xEZXNjcmlwdGlvbihtb2R1bGVTeW1ib2wpICsgXCJcXFwiLiBQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIEpTT04gb2JqZWN0LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0T3B0aW9uTmFtZSA9IG1vZHVsZUluc3RhbmNlLmdldERlZmF1bHRPcHRpb25OYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWxzXzEuaXNTdHJpbmcoZGVmYXVsdE9wdGlvbk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbZGVmYXVsdE9wdGlvbk5hbWVdID0gYXR0clZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIGRlZmF1bHQgb3B0aW9uIG5hbWUgaGFzIGJlZW4gZGVmaW5lZCBmb3IgdGhlIGpRdWVyeSBtb2R1bGUgXFxcIlwiICsgb2JqZWN0XzEuZ2V0U3ltYm9sRGVzY3JpcHRpb24obW9kdWxlU3ltYm9sKSArIFwiXFxcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICRlbC5yZW1vdmVBdHRyKGF0dHJOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlSW5zdGFuY2Uuc2V0RWxlbWVudCgkZWwpO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVJbnN0YW5jZS5pbml0aWFsaXplKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAkZWwuZGF0YShkYXRhTmFtZSwgbW9kdWxlSW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vZHVsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudDogJGVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YU5hbWU6IGRhdGFOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IG1vZHVsZUluc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IGF0dHJOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sOiBtb2R1bGVTeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KShzZWxlY3RvciwgdGhpcy5tb2R1bGVzQXR0cmlidXRlU2VsZWN0b3JzW3NlbGVjdG9yXSkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gb2JqZWN0IGNvbnRhaW5pbmc6XG4gICAgICogICAtIGFzIGtleTogYW4gSFRNTCBhdHRyaWJ1dGVcbiAgICAgKiAgIC0gYXMgdmFsdWU6IHRoZSBzeW1ib2wgY29ycmVzcG9uZGluZyB0byB0aGUgbW9kdWxlIHRoYXQgc2hvdWxkIGJlIGNyZWF0ZWQgaWYgdGhlIEhUTUwgYXR0cmlidXRlIGlzIGZvdW5kLlxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgKi9cbiAgICBKcXVlcnlNb2R1bGVzTWFuYWdlci5wcm90b3R5cGUuY29tcHV0ZU1vZHVsZXNBdHRyaWJ1dGVTZWxlY3RvcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICAgICAgdmFyIHN5bWJvbHMgPSBjb250YWluZXJfMS5Db250YWluZXIuZ2V0TW9kdWxlc1N5bWJvbHMoKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBzeW1ib2xzXzEgPSBzeW1ib2xzOyBfaSA8IHN5bWJvbHNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gc3ltYm9sc18xW19pXTtcbiAgICAgICAgICAgIHZhciBhdHRyTmFtZSA9IEpxdWVyeU1vZHVsZXNNYW5hZ2VyXzEuTU9EVUxFU19IVE1MX0FUVFJJQlVURVNfUFJFRklYICsga2ViYWJDYXNlKG9iamVjdF8xLmdldFN5bWJvbERlc2NyaXB0aW9uKGl0ZW0pKTtcbiAgICAgICAgICAgIG91dHB1dFthdHRyTmFtZV0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgICB2YXIgSnF1ZXJ5TW9kdWxlc01hbmFnZXJfMTtcbiAgICBKcXVlcnlNb2R1bGVzTWFuYWdlci5NT0RVTEVTX0hUTUxfQVRUUklCVVRFU19QUkVGSVggPSBcImpxbS1cIjtcbiAgICBKcXVlcnlNb2R1bGVzTWFuYWdlciA9IEpxdWVyeU1vZHVsZXNNYW5hZ2VyXzEgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKClcbiAgICBdLCBKcXVlcnlNb2R1bGVzTWFuYWdlcik7XG4gICAgcmV0dXJuIEpxdWVyeU1vZHVsZXNNYW5hZ2VyO1xufSgpKTtcbmV4cG9ydHMuSnF1ZXJ5TW9kdWxlc01hbmFnZXIgPSBKcXVlcnlNb2R1bGVzTWFuYWdlcjtcbmV4cG9ydHMuSnF1ZXJ5TW9kdWxlc01hbmFnZXJTeW1ib2wgPSBTeW1ib2woXCJKcXVlcnlNb2R1bGVzTWFuYWdlclwiKTtcbmNvbnRhaW5lcl8xLkNvbnRhaW5lci5yZWdpc3RlclNlcnZpY2UoZXhwb3J0cy5KcXVlcnlNb2R1bGVzTWFuYWdlclN5bWJvbCwgSnF1ZXJ5TW9kdWxlc01hbmFnZXIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlZ1ZUFwcFN5bWJvbCA9IGV4cG9ydHMuVnVlQXBwID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9jb25zdGFudHNcIik7XG52YXIgY29udGFpbmVyXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9pbnZlcnNpZnkvY29udGFpbmVyXCIpO1xudmFyIGpxdWVyeV9tb2R1bGVfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2pxdWVyeS9qcXVlcnktbW9kdWxlXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy91dGlsc1wiKTtcbnZhciBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XG52YXIgdnVlXzEgPSByZXF1aXJlKFwidnVlXCIpO1xudmFyIFZ1ZUFwcCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhWdWVBcHAsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVnVlQXBwKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy52dWUgPSBudWxsO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFZ1ZUFwcF8xID0gVnVlQXBwO1xuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG9iamVjdCBob2xkaW5nIGdsb2JhbCBjb21wb25lbnRzLlxuICAgICAqL1xuICAgIFZ1ZUFwcC5HZXRHbG9iYWxDb21wb25lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gVnVlQXBwXzEuQ09NUE9ORU5UUy5fZ2xvYmFsO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYSBWdWVKUyBjb21wb25lbnQuXG4gICAgICovXG4gICAgVnVlQXBwLlJlZ2lzdGVyQ29tcG9uZW50ID0gZnVuY3Rpb24gKG5hbWUsIGNvbXBvbmVudCwgZ3JvdXApIHtcbiAgICAgICAgaWYgKGdyb3VwID09PSB2b2lkIDApIHsgZ3JvdXAgPSBWdWVBcHBfMS5ERUZBVUxUX0dST1VQOyB9XG4gICAgICAgIGlmICh1dGlsc18xLmlzVW5kZWZpbmVkKFZ1ZUFwcF8xLkNPTVBPTkVOVFNbZ3JvdXBdKSkge1xuICAgICAgICAgICAgVnVlQXBwXzEuQ09NUE9ORU5UU1tncm91cF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBWdWVBcHBfMS5DT01QT05FTlRTW2dyb3VwXVtuYW1lXSA9IGNvbXBvbmVudDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgVnVlSlMgY29tcG9uZW50IHRoYXQgbXVzdCBiZSBhdmFpbGFibGUgaW4gYWxsIGFwcHMuXG4gICAgICovXG4gICAgVnVlQXBwLlJlZ2lzdGVyR2xvYmFsQ29tcG9uZW50ID0gZnVuY3Rpb24gKG5hbWUsIGNvbXBvbmVudCkge1xuICAgICAgICBWdWVBcHBfMS5DT01QT05FTlRTLl9nbG9iYWxbbmFtZV0gPSBjb21wb25lbnQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBvYmplY3QgaG9sZGluZyBnbG9iYWwgZGlyZWN0aXZlcy5cbiAgICAgKi9cbiAgICBWdWVBcHAuR2V0R2xvYmFsRGlyZWN0aXZlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFZ1ZUFwcF8xLkRJUkVDVElWRVMuX2dsb2JhbDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGEgVnVlSlMgZGlyZWN0aXZlLlxuICAgICAqL1xuICAgIFZ1ZUFwcC5SZWdpc3RlckRpcmVjdGl2ZSA9IGZ1bmN0aW9uIChuYW1lLCBkaXJlY3RpdmUsIGdyb3VwKSB7XG4gICAgICAgIGlmIChncm91cCA9PT0gdm9pZCAwKSB7IGdyb3VwID0gVnVlQXBwXzEuREVGQVVMVF9HUk9VUDsgfVxuICAgICAgICBpZiAodXRpbHNfMS5pc1VuZGVmaW5lZChWdWVBcHBfMS5ESVJFQ1RJVkVTW2dyb3VwXSkpIHtcbiAgICAgICAgICAgIFZ1ZUFwcF8xLkRJUkVDVElWRVNbZ3JvdXBdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgVnVlQXBwXzEuRElSRUNUSVZFU1tncm91cF1bbmFtZV0gPSBkaXJlY3RpdmU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBhIFZ1ZUpTIGRpcmVjdGl2ZSB0aGF0IG11c3QgYmUgYXZhaWxhYmxlIGluIGFsbCBhcHBzLlxuICAgICAqL1xuICAgIFZ1ZUFwcC5SZWdpc3Rlckdsb2JhbERpcmVjdGl2ZSA9IGZ1bmN0aW9uIChuYW1lLCBkaXJlY3RpdmUpIHtcbiAgICAgICAgVnVlQXBwXzEuRElSRUNUSVZFUy5fZ2xvYmFsW25hbWVdID0gZGlyZWN0aXZlO1xuICAgICAgICB2dWVfMS5kZWZhdWx0LmRpcmVjdGl2ZShuYW1lLCBkaXJlY3RpdmUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYSBnbG9iYWwgVnVlSlMgb3B0aW9uIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gZXZlcnkgVnVlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIFZ1ZUFwcC5TZXRWdWVPcHRpb24gPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgVnVlQXBwXzEuT1BUSU9OU1tuYW1lXSA9IHZhbHVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQGluaGVyaXREb2NcbiAgICAgKi9cbiAgICBWdWVBcHAucHJvdG90eXBlLmdldERlZmF1bHRPcHRpb25OYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJ2dyb3VwJztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBpbmhlcml0RG9jXG4gICAgICovXG4gICAgVnVlQXBwLnByb3RvdHlwZS5nZXREZWZhdWx0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIE5hbWUgb2YgdGhlIGdyb3VwIG9mIGNvbXBvbmVudHMgdG8gaW5jbHVkZS5cbiAgICAgICAgICAgIGdyb3VwOiBWdWVBcHBfMS5ERUZBVUxUX0dST1VQLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQGluaGVyaXREb2NcbiAgICAgKi9cbiAgICBWdWVBcHAucHJvdG90eXBlLmRvSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMudnVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW5ub3QgY2FsbCBzZXRFbGVtZW50KCkgdHdpY2Ugb24gYSB2dWUgbW9kdWxlLicpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5tZXJnZVZ1ZU9wdGlvbnMoe1xuICAgICAgICAgICAgYmVmb3JlQ3JlYXRlOiB1dGlsc18xLnByb3h5KHRoaXMuYmVmb3JlQ3JlYXRlLCB0aGlzKSxcbiAgICAgICAgICAgIGNyZWF0ZWQ6IHV0aWxzXzEucHJveHkodGhpcy5jcmVhdGVkLCB0aGlzKSxcbiAgICAgICAgfSwgdGhpcy5nZXRWdWVPcHRpb25zKCksIHtcbiAgICAgICAgICAgIGVsOiB0aGlzLiRlbGVtZW50LmdldCgwKSxcbiAgICAgICAgICAgIGRlbGltaXRlcnM6IGNvbnN0YW50c18xLkNvbnN0YW50cy5HZXQoJ0RFTElNSVRFUlMnKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52dWUgPSBuZXcgdnVlXzEuZGVmYXVsdChvcHRpb25zKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqICoqVnVlSlMgbGlmZWN5Y2xlIGV2ZW50KipcbiAgICAgKlxuICAgICAqIENhbGxlZCBzeW5jaHJvbm91c2x5IGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBpbnN0YW5jZSBoYXMgYmVlbiBpbml0aWFsaXplZCxcbiAgICAgKiBiZWZvcmUgZGF0YSBvYnNlcnZhdGlvbiBhbmQgZXZlbnQvd2F0Y2hlciBzZXR1cC5cbiAgICAgKi9cbiAgICBWdWVBcHAucHJvdG90eXBlLmJlZm9yZUNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqICoqVnVlSlMgbGlmZWN5Y2xlIGV2ZW50KipcbiAgICAgKlxuICAgICAqIENhbGxlZCBzeW5jaHJvbm91c2x5IGFmdGVyIHRoZSBpbnN0YW5jZSBpcyBjcmVhdGVkLlxuICAgICAqIEF0IHRoaXMgc3RhZ2UsIHRoZSBpbnN0YW5jZSBoYXMgZmluaXNoZWQgcHJvY2Vzc2luZyB0aGUgb3B0aW9ucyB3aGljaCBtZWFucyB0aGUgZm9sbG93aW5nIGhhdmUgYmVlbiBzZXQgdXA6XG4gICAgICogZGF0YSBvYnNlcnZhdGlvbiwgY29tcHV0ZWQgcHJvcGVydGllcywgbWV0aG9kcywgd2F0Y2gvZXZlbnQgY2FsbGJhY2tzLlxuICAgICAqXG4gICAgICogSG93ZXZlciwgdGhlIG1vdW50aW5nIHBoYXNlIGhhcyBub3QgYmVlbiBzdGFydGVkLCBhbmQgdGhlICRlbCBwcm9wZXJ0eSB3aWxsIG5vdCBiZSBhdmFpbGFibGUgeWV0LlxuICAgICAqL1xuICAgIFZ1ZUFwcC5wcm90b3R5cGUuY3JlYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEJ1aWxkIGFuIG9iamVjdCBjb250YWluaW5nIHVzZXIgZGVmaW5lZCBvcHRpb25zLlxuICAgICAqL1xuICAgIFZ1ZUFwcC5wcm90b3R5cGUuZ2V0VnVlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgdmFyIGdyb3VwID0gdGhpcy5nZXRPcHRpb24oJ2dyb3VwJyk7XG4gICAgICAgIHZhciBncm91cENvbXBvbmVudHMgPSAhdXRpbHNfMS5pc1VuZGVmaW5lZChWdWVBcHBfMS5DT01QT05FTlRTW2dyb3VwXSkgPyBWdWVBcHBfMS5DT01QT05FTlRTW2dyb3VwXSA6IHt9O1xuICAgICAgICB2YXIgZ3JvdXBEaXJlY3RpdmVzID0gIXV0aWxzXzEuaXNVbmRlZmluZWQoVnVlQXBwXzEuRElSRUNUSVZFU1tncm91cF0pID8gVnVlQXBwXzEuRElSRUNUSVZFU1tncm91cF0gOiB7fTtcbiAgICAgICAgb3B0aW9ucy5jb21wb25lbnRzID0gT2JqZWN0LmFzc2lnbihWdWVBcHBfMS5DT01QT05FTlRTLl9nbG9iYWwsIGdyb3VwQ29tcG9uZW50cyk7XG4gICAgICAgIG9wdGlvbnMuZGlyZWN0aXZlcyA9IE9iamVjdC5hc3NpZ24oVnVlQXBwXzEuRElSRUNUSVZFUy5fZ2xvYmFsLCBncm91cERpcmVjdGl2ZXMpO1xuICAgICAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCBWdWVBcHBfMS5PUFRJT05TKTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXJnZSBtdWx0aXBsZSBhcnJheXMgb2YgdnVlIG9wdGlvbnMgdG9nZXRoZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqL1xuICAgIFZ1ZUFwcC5wcm90b3R5cGUubWVyZ2VWdWVPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBhcmdzXzEgPSBhcmdzOyBfYSA8IGFyZ3NfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmdzXzFbX2FdO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZykge1xuICAgICAgICAgICAgICAgIGlmICghYXJnLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdjb21wb25lbnRzJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXV0aWxzXzEuaXNPYmplY3Qob3V0cHV0LmNvbXBvbmVudHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuY29tcG9uZW50cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGNvbXBvbmVudE5hbWUgaW4gYXJnW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdba2V5XS5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdID0gYXJnW2tleV1bY29tcG9uZW50TmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFtrZXldID0gYXJnW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgICB2YXIgVnVlQXBwXzE7XG4gICAgLy8gU3RhdGljIHZhcnNcbiAgICBWdWVBcHAuREVGQVVMVF9HUk9VUCA9ICdkZWZhdWx0JztcbiAgICBWdWVBcHAuQ09NUE9ORU5UUyA9IHsgX2dsb2JhbDoge30sIGRlZmF1bHQ6IHt9IH07XG4gICAgVnVlQXBwLkRJUkVDVElWRVMgPSB7IF9nbG9iYWw6IHt9LCBkZWZhdWx0OiB7fSB9O1xuICAgIFZ1ZUFwcC5PUFRJT05TID0ge307XG4gICAgVnVlQXBwID0gVnVlQXBwXzEgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXG4gICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtdKVxuICAgIF0sIFZ1ZUFwcCk7XG4gICAgcmV0dXJuIFZ1ZUFwcDtcbn0oanF1ZXJ5X21vZHVsZV8xLkpxdWVyeU1vZHVsZSkpO1xuZXhwb3J0cy5WdWVBcHAgPSBWdWVBcHA7XG5leHBvcnRzLlZ1ZUFwcFN5bWJvbCA9IFN5bWJvbChcIlZ1ZUFwcFwiKTtcbmNvbnRhaW5lcl8xLkNvbnRhaW5lci5yZWdpc3Rlck1vZHVsZShleHBvcnRzLlZ1ZUFwcFN5bWJvbCwgVnVlQXBwKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9uZXR3b3JrL3V0aWxzXCIpO1xuLyoqXG4gKiBXaGVuIHRoZSBBUEkgcmVzcG9uZCB3aXRoIGFuIGFycmF5LCBhIHByZWZpeCBpcyBhZGRlZCB0byBwcmV2ZW50IFhTU0kgYXR0YWNrcy5cbiAqIFRoaXMgZmlsdGVyIGlzIGhlcmUgdG8gdGFrZSBpdCBvZmYgb3IgalF1ZXJ5IHdpbGwgY3Jhc2ggd2hlbiBwYXJzaW5nIHRoZSBwYXlsb2FkLlxuICovXG5qUXVlcnkuYWpheFNldHVwKHtcbiAgICBkYXRhRmlsdGVyOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHV0aWxzXzEuc3RyaXBYc3NpUHJlZml4KGlucHV0KTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Mb2dMZXZlbCA9IHZvaWQgMDtcbi8qKlxuICogRGVmaW5lcyB0aGUgbG9ncyBsZXZlbHMuXG4gKi9cbnZhciBMb2dMZXZlbDtcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIk5PTkVcIl0gPSAwXSA9IFwiTk9ORVwiO1xuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiREVCVUdcIl0gPSAxXSA9IFwiREVCVUdcIjtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiU1VDQ0VTU1wiXSA9IDNdID0gXCJTVUNDRVNTXCI7XG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJXQVJOSU5HXCJdID0gNF0gPSBcIldBUk5JTkdcIjtcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkVSUk9SXCJdID0gNV0gPSBcIkVSUk9SXCI7XG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJBTExcIl0gPSA2XSA9IFwiQUxMXCI7XG59KShMb2dMZXZlbCA9IGV4cG9ydHMuTG9nTGV2ZWwgfHwgKGV4cG9ydHMuTG9nTGV2ZWwgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2NvbnN0YW50c1wiKSwgZXhwb3J0cyk7XG50c2xpYl8xLl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9sb2dnZXIuc2VydmljZVwiKSwgZXhwb3J0cyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTG9nZ2VyU2VydmljZVN5bWJvbCA9IGV4cG9ydHMuTG9nZ2VyU2VydmljZSA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbnZhciB0cmltID0gcmVxdWlyZShcImxvZGFzaC90cmltXCIpO1xudmFyIGNvbnRhaW5lcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvaW52ZXJzaWZ5L2NvbnRhaW5lclwiKTtcbnZhciBvYmplY3RfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL3V0aWxzL29iamVjdFwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcImVzc2VudGlhbHMvdXRpbHMvdXRpbHNcIik7XG52YXIgc2hhcmVkX2NvbmZpZ3VyYXRpb25fMSA9IHJlcXVpcmUoXCIuLi9jb25maWcvc2hhcmVkLWNvbmZpZ3VyYXRpb25cIik7XG52YXIgc3RvcmFnZV8xID0gcmVxdWlyZShcIi4uL3N0b3JhZ2VcIik7XG52YXIgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi9jb25zdGFudHNcIik7XG52YXIgTG9nZ2VyU2VydmljZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBMb2dnZXJTZXJ2aWNlKHN0b3JhZ2UsIGNvbmZpZykge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5sb2dzID0gW107XG4gICAgICAgIHRoaXMucGVyc2lzdFF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0ZsdXNoaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubG9hZGluZ1Byb21pc2UgPSBudWxsO1xuICAgICAgICB0aGlzLmxhc3RGbHVzaFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLm5leHRGbHVzaFRpbWVySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmlzUHJvZCA9IHRoaXMuY29uZmlnLmVudiA9PT0gJ3Byb2QnO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gZGV1YmcgbG9nLlxuICAgICAqL1xuICAgIExvZ2dlclNlcnZpY2UucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGV4dHJhKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUHJvZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkKGNvbnN0YW50c18xLkxvZ0xldmVsLkRFQlVHLCBtZXNzYWdlLCBvYmplY3RfMS5leHRlbmQoZXh0cmEgfHwge30sIHsgdHJhY2U6IHRoaXMuZ2V0Q2FsbGVyTmFtZSgzKSB9KSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgYW4gaW5mbyBsb2cuXG4gICAgICovXG4gICAgTG9nZ2VyU2VydmljZS5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBleHRyYSkge1xuICAgICAgICB0aGlzLmFkZChjb25zdGFudHNfMS5Mb2dMZXZlbC5JTkZPLCBtZXNzYWdlLCBleHRyYSB8fCBudWxsKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBhIGxvZyBpbmRpY2F0aW5nIHRoZSBzdWNjZXNzIG9mIGFuIG9wZXJhdGlvbi5cbiAgICAgKi9cbiAgICBMb2dnZXJTZXJ2aWNlLnByb3RvdHlwZS5zdWNjZXNzID0gZnVuY3Rpb24gKG1lc3NhZ2UsIGV4dHJhKSB7XG4gICAgICAgIHRoaXMuYWRkKGNvbnN0YW50c18xLkxvZ0xldmVsLlNVQ0NFU1MsIG1lc3NhZ2UsIGV4dHJhIHx8IG51bGwpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWRkIGEgd2FybmluZyBsb2cuXG4gICAgICovXG4gICAgTG9nZ2VyU2VydmljZS5wcm90b3R5cGUud2FybmluZyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBleHRyYSkge1xuICAgICAgICB0aGlzLmFkZChjb25zdGFudHNfMS5Mb2dMZXZlbC5XQVJOSU5HLCBtZXNzYWdlLCBleHRyYSB8fCBudWxsKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBhbiBlcnJvciBsb2cuXG4gICAgICovXG4gICAgTG9nZ2VyU2VydmljZS5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSwgZXh0cmEpIHtcbiAgICAgICAgdGhpcy5hZGQoY29uc3RhbnRzXzEuTG9nTGV2ZWwuRVJST1IsIG1lc3NhZ2UsIGV4dHJhIHx8IG51bGwpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIGxvZ3MuXG4gICAgICovXG4gICAgTG9nZ2VyU2VydmljZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubG9ncyA9IFtdO1xuICAgICAgICB0aGlzLnBlcnNpc3RRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlKHRoaXMuY29uZmlnLmRlYnVnLmxvZ3Muc3RvcmFnZUtleSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBEb24ndCBjYXJlIGFib3V0IHRoZSByZXN1bHQuXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIERvbid0IGNhcmUgYWJvdXQgdGhlIHJlc3VsdC5cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBMb2FkIGV4aXN0aW5nIGxvZ3MgZnJvbSB0aGUgc3RvcmFnZS5cbiAgICAgKlxuICAgICAqIFRoZSBsb2FkaW5nIGNhbiBuZXZlciBmYWlsLlxuICAgICAqIElmIGFuIGVycm9yIG9jY3VycyB3aGVuIHRyeWluZyB0byBmZXRjaCB0aGUgbG9ncyBvciB0byBkZWNvZGUgdGhlIHJlc3VsdCwgdGhlIGVycm9yIGlzIGlnbm9yZWQgYW5kXG4gICAgICogYW4gZW1wdHkgYXJyYXkgd2lsbCBiZSBzZW50IGFzIGEgcmVzdWx0LlxuICAgICAqXG4gICAgICogTG9ncyBhcmUgYW4gb3B0aW9uYWwgZmVhdHVyZSwgYSBkZWJ1ZyBmZWF0dXJlLlxuICAgICAqIE5vIG1hdHRlciB3aGF0IGhhcHBlbnMsIHRoZSBsb2dnZXIgc2VydmljZSBtdXN0IE5FVkVSIHByZXZlbnQgdGhlIGFwcGxpY2F0aW9uIHRvIHJ1biBvciBub3RpZnkgdGhlIHVzZXIgb2YgYW55IHByb2JsZW0uXG4gICAgICovXG4gICAgTG9nZ2VyU2VydmljZS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZ1Byb21pc2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRpbmdQcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGluZ1Byb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgb25GaW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaXNMb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIF90aGlzLmxvYWRpbmdQcm9taXNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZXNvbHZlKF90aGlzLmxvZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIF90aGlzLnN0b3JhZ2UuZ2V0KF90aGlzLmNvbmZpZy5kZWJ1Zy5sb2dzLnN0b3JhZ2VLZXkpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWNvZGVkID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5sb2dzID0gdXRpbHNfMS5lbnN1cmVBcnJheShkZWNvZGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubG9ncyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvbkZpbmlzaCgpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmxvZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICBvbkZpbmlzaCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2FkaW5nUHJvbWlzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBhbGwgbG9ncyBpbmNsdWRpbmcgbm9uIHlldCBwZXJzaXN0ZWQgb25lcy5cbiAgICAgKi9cbiAgICBMb2dnZXJTZXJ2aWNlLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5sb2FkKCkudGhlbihmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gX3RoaXMucGVyc2lzdFF1ZXVlOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9nID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGxvZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShfdGhpcy5wZXJzaXN0UXVldWUuY29uY2F0KFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBsOiBjb25zdGFudHNfMS5Mb2dMZXZlbC5FUlJPUixcbiAgICAgICAgICAgICAgICAgICAgICAgIGU6IHsgZXJyb3I6IGVycm9yIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtOiAnRmFpbGVkIHRvIGdldCBsb2dzLCBzdG9yYWdlIG1heSBub3QgYmUgcmVhZHkgeWV0LidcbiAgICAgICAgICAgICAgICAgICAgfV0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBhIG5ldyBsb2cuXG4gICAgICovXG4gICAgTG9nZ2VyU2VydmljZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGxldmVsLCBtZXNzYWdlLCBleHRyYSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAobGV2ZWwgPCB0aGlzLmNvbmZpZy5kZWJ1Zy5sb2dzLmxldmVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxldmVsID09PSBjb25zdGFudHNfMS5Mb2dMZXZlbC5FUlJPUikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsZXZlbCA9PT0gY29uc3RhbnRzXzEuTG9nTGV2ZWwuV0FSTklORykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZXJzaXN0UXVldWUucHVzaCh7XG4gICAgICAgICAgICBsOiBsZXZlbCxcbiAgICAgICAgICAgIG06IHV0aWxzXzEuaXNTdHJpbmcobWVzc2FnZSkgPyBtZXNzYWdlLnN1YnN0cmluZygwLCAyNTUpIDogbnVsbCxcbiAgICAgICAgICAgIGU6IGV4dHJhID8gb2JqZWN0XzEucHJlcGFyZU9iamVjdEZvckR1bXAoZXh0cmEsIDUpIDogbnVsbFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMubGFzdEZsdXNoVGltZSA9PT0gbnVsbCB8fCBEYXRlLm5vdygpIC0gdGhpcy5sYXN0Rmx1c2hUaW1lID49IHRoaXMuY29uZmlnLmRlYnVnLmxvZ3Muc3RvcmFnZVdyaXRlSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuZmx1c2goKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm5leHRGbHVzaFRpbWVySWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBkZWxheSA9IE1hdGgubWF4KDAsIHRoaXMuY29uZmlnLmRlYnVnLmxvZ3Muc3RvcmFnZVdyaXRlSW50ZXJ2YWwgLSAoRGF0ZS5ub3coKSAtIHRoaXMubGFzdEZsdXNoVGltZSkpO1xuICAgICAgICAgICAgdGhpcy5uZXh0Rmx1c2hUaW1lcklkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubmV4dEZsdXNoVGltZXJJZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgX3RoaXMuZmx1c2goKTtcbiAgICAgICAgICAgIH0sIGRlbGF5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRmx1c2ggbG9ncyBpbiB0aGUgcGVyc2lzdCBxdWV1ZSBpbnRvIHRoZSBzdG9yYWdlLlxuICAgICAqL1xuICAgIExvZ2dlclNlcnZpY2UucHJvdG90eXBlLmZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5pc0ZsdXNoaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzRmx1c2hpbmcgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5sb2FkaW5nUHJvbWlzZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nUHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pc0ZsdXNoaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX3RoaXMuZmx1c2goKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnBlcnNpc3RRdWV1ZTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBsb2cgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAodGhpcy5sb2dzLmxlbmd0aCA+PSB0aGlzLmNvbmZpZy5kZWJ1Zy5sb2dzLm1heGltdW1Db3VudCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9ncy5zaGlmdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sb2dzLnB1c2gobG9nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBlcnNpc3RRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0KHRoaXMuY29uZmlnLmRlYnVnLmxvZ3Muc3RvcmFnZUtleSwgSlNPTi5zdHJpbmdpZnkodGhpcy5sb2dzKSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5pc0ZsdXNoaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBfdGhpcy5sYXN0Rmx1c2hUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gSWdub3JlIHRoZSBlcnJvci5cbiAgICAgICAgICAgIF90aGlzLmlzRmx1c2hpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUcnkgdG8gZ2V0IHRoZSBmdW5jdGlvbiBhbmQgY2xhc3MgbmFtZSB0aGF0IGNhbGxlZCB0aGUgbG9nZ2VyLlxuICAgICAqL1xuICAgIExvZ2dlclNlcnZpY2UucHJvdG90eXBlLmdldENhbGxlck5hbWUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoKTtcbiAgICAgICAgaWYgKCFlLnN0YWNrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIElFIHJlcXVpcmVzIHRoZSBFcnJvciB0byBhY3R1YWxseSBiZSB0aHJvd24gb3IgZWxzZSB0aGVcbiAgICAgICAgICAgICAgICAvLyBFcnJvcidzICdzdGFjaycgcHJvcGVydHkgaXMgdW5kZWZpbmVkLlxuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmICghZS5zdGFjaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gSUUgPCAxMCwgbGlrZWx5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBzdGFjayA9IGUuc3RhY2sudG9TdHJpbmcoKS5zcGxpdCgvXFxyXFxufFxcbi8pO1xuICAgICAgICBpZiAodXRpbHNfMS5pc0FycmF5KHN0YWNrKSAmJiAhdXRpbHNfMS5pc1VuZGVmaW5lZChzdGFja1tpbmRleF0pKSB7XG4gICAgICAgICAgICB2YXIgc3RyID0gc3RhY2tbaW5kZXhdO1xuICAgICAgICAgICAgdmFyIHBhcmVudGhlc2lzUG9zID0gc3RyLmluZGV4T2YoJygnKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRoZXNpc1BvcyA+IDAgJiYgdXRpbHNfMS5pc1N0cmluZyhzdHIpKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCBwYXJlbnRoZXNpc1Bvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcGFydHMgPSBzdHIuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgIHBhcnRzID0gcGFydHMuc3BsaWNlKHBhcnRzLmxlbmd0aCAtIDIsIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRyaW0ocGFydHMuam9pbignOicpLnJlcGxhY2UoL1xccyphdFxccysvLCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgTG9nZ2VyU2VydmljZSA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcbiAgICAgICAgdHNsaWJfMS5fX3BhcmFtKDAsIGludmVyc2lmeV8xLmluamVjdChzdG9yYWdlXzEuU3RvcmFnZVNlcnZpY2VTeW1ib2wpKSxcbiAgICAgICAgdHNsaWJfMS5fX3BhcmFtKDEsIGludmVyc2lmeV8xLmluamVjdChzaGFyZWRfY29uZmlndXJhdGlvbl8xLlNoYXJlZENvbmZpZ3VyYXRpb25TeW1ib2wpKSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW3N0b3JhZ2VfMS5TdG9yYWdlU2VydmljZSxcbiAgICAgICAgICAgIHNoYXJlZF9jb25maWd1cmF0aW9uXzEuU2hhcmVkQ29uZmlndXJhdGlvbl0pXG4gICAgXSwgTG9nZ2VyU2VydmljZSk7XG4gICAgcmV0dXJuIExvZ2dlclNlcnZpY2U7XG59KCkpO1xuZXhwb3J0cy5Mb2dnZXJTZXJ2aWNlID0gTG9nZ2VyU2VydmljZTtcbmV4cG9ydHMuTG9nZ2VyU2VydmljZVN5bWJvbCA9IFN5bWJvbChcIkxvZ2dlclNlcnZpY2VcIik7XG5jb250YWluZXJfMS5Db250YWluZXIucmVnaXN0ZXJTZXJ2aWNlKGV4cG9ydHMuTG9nZ2VyU2VydmljZVN5bWJvbCwgTG9nZ2VyU2VydmljZSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSHR0cFJlc3BvbnNlU3RhdHVzID0gZXhwb3J0cy5IdHRwTWV0aG9kcyA9IHZvaWQgMDtcbi8qKlxuICogQmFzaWMgSFRUUCBtZXRob2RzLlxuICogVGhlIGxpc3QgaXMgbm90IG1lYW50IHRvIGJlIGV4aGF1c3RpdmUsIGl0IG9ubHkgY29udGFpbnMgd2hhdCdzIGJlaW5nIHVzZWQuXG4gKi9cbnZhciBIdHRwTWV0aG9kcztcbihmdW5jdGlvbiAoSHR0cE1ldGhvZHMpIHtcbiAgICBIdHRwTWV0aG9kc1tcIkdFVFwiXSA9IFwiR0VUXCI7XG4gICAgSHR0cE1ldGhvZHNbXCJQT1NUXCJdID0gXCJQT1NUXCI7XG4gICAgSHR0cE1ldGhvZHNbXCJQVVRcIl0gPSBcIlBVVFwiO1xuICAgIEh0dHBNZXRob2RzW1wiREVMRVRFXCJdID0gXCJERUxFVEVcIjtcbiAgICBIdHRwTWV0aG9kc1tcIk9QVElPTlNcIl0gPSBcIk9QVElPTlNcIjtcbn0pKEh0dHBNZXRob2RzID0gZXhwb3J0cy5IdHRwTWV0aG9kcyB8fCAoZXhwb3J0cy5IdHRwTWV0aG9kcyA9IHt9KSk7XG4vKipcbiAqIERpZmZlcmVudCBzdGF0dXMgb2YgdGhlIHJlc3BvbnNlLlxuICovXG52YXIgSHR0cFJlc3BvbnNlU3RhdHVzO1xuKGZ1bmN0aW9uIChIdHRwUmVzcG9uc2VTdGF0dXMpIHtcbiAgICBIdHRwUmVzcG9uc2VTdGF0dXNbSHR0cFJlc3BvbnNlU3RhdHVzW1wiUGVuZGluZ1wiXSA9IDBdID0gXCJQZW5kaW5nXCI7XG4gICAgSHR0cFJlc3BvbnNlU3RhdHVzW0h0dHBSZXNwb25zZVN0YXR1c1tcIlN1Y2Nlc3NcIl0gPSAxXSA9IFwiU3VjY2Vzc1wiO1xuICAgIEh0dHBSZXNwb25zZVN0YXR1c1tIdHRwUmVzcG9uc2VTdGF0dXNbXCJFcnJvclwiXSA9IDJdID0gXCJFcnJvclwiO1xuICAgIEh0dHBSZXNwb25zZVN0YXR1c1tIdHRwUmVzcG9uc2VTdGF0dXNbXCJDYW5jZWxlZFwiXSA9IDNdID0gXCJDYW5jZWxlZFwiO1xufSkoSHR0cFJlc3BvbnNlU3RhdHVzID0gZXhwb3J0cy5IdHRwUmVzcG9uc2VTdGF0dXMgfHwgKGV4cG9ydHMuSHR0cFJlc3BvbnNlU3RhdHVzID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BdXRoZW50aWNhdGlvbkVycm9yID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgaHR0cF9lcnJvcl8xID0gcmVxdWlyZShcIi4vaHR0cC5lcnJvclwiKTtcbi8qKlxuICogRXJyb3IgaW5kaWNhdGluZyB0aGUgcmVxdWVzdCBjYW5ub3QgYmUgcGVyZm9ybWVkIGJ5IHRoZSBjdXJyZW50IHVzZXIsXG4gKiBlaXRoZXIgYmVjYXVzZSBoZSdzIG5vdCBhdXRoZW50aWNhdGVkIGF0IGFsbCBvciBiZWNhdXNlIGhlIGhhcyBpbnN1ZmZpY2llbnQgYWNjZXNzIHJpZ2h0cy5cbiAqL1xudmFyIEF1dGhlbnRpY2F0aW9uRXJyb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoQXV0aGVudGljYXRpb25FcnJvciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBdXRoZW50aWNhdGlvbkVycm9yKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBBdXRoZW50aWNhdGlvbkVycm9yO1xufShodHRwX2Vycm9yXzEuSHR0cEVycm9yKSk7XG5leHBvcnRzLkF1dGhlbnRpY2F0aW9uRXJyb3IgPSBBdXRoZW50aWNhdGlvbkVycm9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNhbmNlbEVycm9yID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgaHR0cF9lcnJvcl8xID0gcmVxdWlyZShcIi4vaHR0cC5lcnJvclwiKTtcbi8qKlxuICogRXJyb3IgdGhyb3duIHdoZW4gcmVqZWN0aW5nIGEgcHJvbWlzZSBhc3NvY2lhdGVkIHdpdGggYSBjYW5jZWxlZCByZXF1ZXN0LlxuICovXG52YXIgQ2FuY2VsRXJyb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoQ2FuY2VsRXJyb3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2FuY2VsRXJyb3IoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCAwKSB8fCB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gQ2FuY2VsRXJyb3I7XG59KGh0dHBfZXJyb3JfMS5IdHRwRXJyb3IpKTtcbmV4cG9ydHMuQ2FuY2VsRXJyb3IgPSBDYW5jZWxFcnJvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5IdHRwRXJyb3IgPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcImVzc2VudGlhbHMvdXRpbHMvdXRpbHNcIik7XG52YXIgZXJyb3JfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2Vycm9yXCIpO1xuLyoqXG4gKiBFcnJvciByZWxhdGl2ZSB0byBhbiBodHRwIHJlcXVlc3QuXG4gKi9cbnZhciBIdHRwRXJyb3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoSHR0cEVycm9yLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEh0dHBFcnJvcihzdGF0dXMsIGVycm9yLCBtZXNzYWdlLCBwYXlsb2FkLCBwcmV2aW91cykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBtZXNzYWdlLCBwcmV2aW91cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICBfdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICBfdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gSHR0cEVycm9yIGluc3RhbmNlIGZyb20gYSBtaXhlZCBpbnB1dC5cbiAgICAgKiBJbnB1dCBjYW4gYmU6XG4gICAgICogICAtIGEgc3RyaW5nXG4gICAgICogICAtIGFuIEVycm9yIG9iamVjdFxuICAgICAqICAgLSBhbiBBcHBFcnJvciBvYmplY3RcbiAgICAgKiAgIC0gYSBwbGFpbiBvYmplY3QgY29udGFpbmluZyBhIFwibWVzc2FnZVwiIGtleVxuICAgICAqICAgLSBhbiBIdHRwRXJyb3JSZXNwb25zZVxuICAgICAqL1xuICAgIEh0dHBFcnJvci5jcmVhdGUgPSBmdW5jdGlvbiAoaW5wdXQsIGRlZmF1bHRNZXNzYWdlLCBwYXlsb2FkKSB7XG4gICAgICAgIGlmIChkZWZhdWx0TWVzc2FnZSA9PT0gdm9pZCAwKSB7IGRlZmF1bHRNZXNzYWdlID0gJ1Vua25vd24gZXJyb3InOyB9XG4gICAgICAgIGlmIChwYXlsb2FkID09PSB2b2lkIDApIHsgcGF5bG9hZCA9IG51bGw7IH1cbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgSHR0cEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgZXJyb3JfMS5BcHBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBIdHRwRXJyb3IoMCwgbnVsbCwgaW5wdXQubWVzc2FnZSwgcGF5bG9hZCwgaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIChpbnB1dCBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlKSB7XG4gICAgICAgIC8vICAgICBsZXQgbWVzc2FnZTogYW55ID0gaW5wdXQuZXJyb3I7XG4gICAgICAgIC8vICAgICBpZiAoaXNPYmplY3QobWVzc2FnZSkpIHtcbiAgICAgICAgLy8gICAgICAgICBtZXNzYWdlID0gaXNTdHJpbmcobWVzc2FnZS5tZXNzYWdlKSA/IG1lc3NhZ2UubWVzc2FnZSA6ICdVbmtub3duIGVycm9yLic7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICByZXR1cm4gbmV3IEh0dHBFcnJvcihpbnB1dC5zdGF0dXMsIGlucHV0LmVycm9yLCBlbnN1cmVTdHJpbmcobWVzc2FnZSkpO1xuICAgICAgICAvLyB9XG4gICAgICAgIGlmICh1dGlsc18xLmlzU3RyaW5nKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBIdHRwRXJyb3IoMCwgbnVsbCwgaW5wdXQsIHBheWxvYWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlsc18xLmlzT2JqZWN0KGlucHV0KSAmJiB1dGlsc18xLmlzU3RyaW5nKGlucHV0Lm1lc3NhZ2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEh0dHBFcnJvcigwLCBudWxsLCBpbnB1dC5tZXNzYWdlLCBwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEh0dHBFcnJvcigwLCBudWxsLCBkZWZhdWx0TWVzc2FnZSwgcGF5bG9hZCk7XG4gICAgfTtcbiAgICByZXR1cm4gSHR0cEVycm9yO1xufShlcnJvcl8xLkFwcEVycm9yKSk7XG5leHBvcnRzLkh0dHBFcnJvciA9IEh0dHBFcnJvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5OZXR3b3JrRXJyb3IgPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciBlcnJvcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvZXJyb3JcIik7XG4vKipcbiAqIEVycm9yIGluZGljYXRpbmcgdGhlIHNlcnZlciBjYW5ub3QgYmUgY29udGFjdGVkLlxuICovXG52YXIgTmV0d29ya0Vycm9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIHRzbGliXzEuX19leHRlbmRzKE5ldHdvcmtFcnJvciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBOZXR3b3JrRXJyb3IoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIE5ldHdvcmtFcnJvcjtcbn0oZXJyb3JfMS5BcHBFcnJvcikpO1xuZXhwb3J0cy5OZXR3b3JrRXJyb3IgPSBOZXR3b3JrRXJyb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSHR0cFJlcXVlc3QgPSB2b2lkIDA7XG52YXIgSHR0cFJlcXVlc3QgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgUmVxdWVzdCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbWV0aG9kICAgICAgICBIVFRQIG1ldGhvZC5cbiAgICAgKiBAcGFyYW0gdXJsICAgICAgICAgICBSZWFkeSB0byB1c2UgdXJsLlxuICAgICAqIEBwYXJhbSBwYXlsb2FkICAgICAgIEJvZHkgb2YgdGhlIHJlcXVlc3QgKG9wdGlvbmFsKS5cbiAgICAgKiBAcGFyYW0gaGVhZGVycyAgICAgICBBZGRpdGlvbmFsIGhlYWRlcnMgdG8gc2VuZCB3aXRoIHRoZSByZXF1ZXN0LlxuICAgICAqIEBwYXJhbSBtYXhSZXRyeUNvdW50IE1heGltdW0gbnVtYmVyIG9mIHRpbWUgdGhlIHJlcXVlc3QgY2FuIGZhaWwgYmVjYXVzZSBvZiBhIG5ldHdvcmsgZXJyb3Igb3Igc29tZSBvdGhlciBub24gZGVmaW5pdGl2ZSBlcnJvclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEh0dHBSZXF1ZXN0KG1ldGhvZCwgdXJsLCBwYXlsb2FkLCBoZWFkZXJzLCBtYXhSZXRyeUNvdW50KSB7XG4gICAgICAgIGlmIChwYXlsb2FkID09PSB2b2lkIDApIHsgcGF5bG9hZCA9IG51bGw7IH1cbiAgICAgICAgaWYgKGhlYWRlcnMgPT09IHZvaWQgMCkgeyBoZWFkZXJzID0ge307IH1cbiAgICAgICAgaWYgKG1heFJldHJ5Q291bnQgPT09IHZvaWQgMCkgeyBtYXhSZXRyeUNvdW50ID0gMzsgfVxuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG4gICAgICAgIHRoaXMubWF4UmV0cnlDb3VudCA9IG1heFJldHJ5Q291bnQ7XG4gICAgfVxuICAgIHJldHVybiBIdHRwUmVxdWVzdDtcbn0oKSk7XG5leHBvcnRzLkh0dHBSZXF1ZXN0ID0gSHR0cFJlcXVlc3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSHR0cFJlc3BvbnNlID0gdm9pZCAwO1xudmFyIGNvbnN0YW50c18xID0gcmVxdWlyZShcImVzc2VudGlhbHMvbmV0d29yay9jb25zdGFudHNcIik7XG52YXIgSHR0cFJlc3BvbnNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEh0dHBSZXNwb25zZShzdGF0dXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gdm9pZCAwKSB7IHN0YXR1cyA9IGNvbnN0YW50c18xLkh0dHBSZXNwb25zZVN0YXR1cy5QZW5kaW5nOyB9XG4gICAgICAgIHRoaXMuaWQgPSArK0h0dHBSZXNwb25zZS5JZEluY3JlbWVudDtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IDA7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c1RleHQgPSAnJztcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5yYXdSZXN1bHQgPSBudWxsO1xuICAgICAgICB0aGlzLnJhd1Jlc3VsdFR5cGUgPSAndGV4dCc7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzKHN0YXR1cyk7XG4gICAgICAgIHRoaXMuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gU2ltcGx5IG1hcmsgdGhlIHJlcXVlc3QgYXMgY2FuY2VsZWQgaXMgZW5vdWdoIGhlcmUgYmVjYXVzZSBpZiB0aGUgXCJjYW5jZWwoKVwiIG1ldGhvZFxuICAgICAgICAgICAgLy8gaGFzIG5vdCB5ZXQgYmVlbiBvdmVycmlkZGVuIGJ5IHRoZSBIdHRwU2VydmljZSBpdCBtZWFucyB0aGF0IHRoZSByZXF1ZXN0IGhhcyBub3Qgc3RhcnRlZCB5ZXQuXG4gICAgICAgICAgICAvLyBUaGUgSHR0cFNlcnZpY2Ugd2lsbCBjaGVjayB0aGUgZmxhZyBiZWZvcmUgZG9pbmcgdGhlIHJlcXVlc3QuXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NBTkNFTCB2aWEgb3JpZ2luYWwgY2FsbGJhY2snLCBfdGhpcy5pZCk7XG4gICAgICAgICAgICBfdGhpcy5zZXRTdGF0dXMoY29uc3RhbnRzXzEuSHR0cFJlc3BvbnNlU3RhdHVzLkNhbmNlbGVkKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSByZXNwb25zZSdzIHN0YXR1cy5cbiAgICAgKi9cbiAgICBIdHRwUmVzcG9uc2UucHJvdG90eXBlLnNldFN0YXR1cyA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHRoaXMuaXNQZW5kaW5nID0gdGhpcy5zdGF0dXMgPT09IGNvbnN0YW50c18xLkh0dHBSZXNwb25zZVN0YXR1cy5QZW5kaW5nO1xuICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IHRoaXMuc3RhdHVzID09PSBjb25zdGFudHNfMS5IdHRwUmVzcG9uc2VTdGF0dXMuU3VjY2VzcztcbiAgICAgICAgdGhpcy5pc0Vycm9yID0gdGhpcy5zdGF0dXMgPT09IGNvbnN0YW50c18xLkh0dHBSZXNwb25zZVN0YXR1cy5FcnJvcjtcbiAgICAgICAgdGhpcy5pc0NhbmNlbGVkID0gdGhpcy5zdGF0dXMgPT09IGNvbnN0YW50c18xLkh0dHBSZXNwb25zZVN0YXR1cy5DYW5jZWxlZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENvcHkgdGhlIHN0YXRlIG9mIGFub3RoZXIgcmVzcG9uc2UgaW50byB0aGlzIG9uZSwgZXhjZXB0IHRoZSBwcm9taXNlLlxuICAgICAqL1xuICAgIEh0dHBSZXNwb25zZS5wcm90b3R5cGUuc3luY1dpdGggPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0dXMob3RoZXIuc3RhdHVzKTtcbiAgICAgICAgdGhpcy5lcnJvciA9IG90aGVyLmVycm9yO1xuICAgICAgICB0aGlzLnJlc3VsdCA9IG90aGVyLnJlc3VsdDtcbiAgICAgICAgdGhpcy5yYXdSZXN1bHQgPSBvdGhlci5yYXdSZXN1bHQ7XG4gICAgICAgIHRoaXMucmF3UmVzdWx0VHlwZSA9IG90aGVyLnJhd1Jlc3VsdFR5cGU7XG4gICAgICAgIHRoaXMuaHR0cFN0YXR1c1RleHQgPSBvdGhlci5odHRwU3RhdHVzVGV4dDtcbiAgICAgICAgdGhpcy5odHRwU3RhdHVzQ29kZSA9IG90aGVyLmh0dHBTdGF0dXNDb2RlO1xuICAgICAgICB0aGlzLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG90aGVyLmNhbmNlbCgpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogV3JhcCBhbm90aGVyIHJlc3BvbnNlIGludG8gdGhpcyBvbmUsIGV4Y2VwdCB0aGUgcHJvbWlzZS5cbiAgICAgKi9cbiAgICBIdHRwUmVzcG9uc2UucHJvdG90eXBlLmRlY29yYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzXzEsIGtleSwge1xuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVjb3JhdGVkW2tleV07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWNvcmF0ZWRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgdGhpc18xID0gdGhpcztcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKHRoaXMpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IF9hW19pXTtcbiAgICAgICAgICAgIF9sb29wXzEoa2V5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSHR0cFJlc3BvbnNlLklkSW5jcmVtZW50ID0gMDtcbiAgICByZXR1cm4gSHR0cFJlc3BvbnNlO1xufSgpKTtcbmV4cG9ydHMuSHR0cFJlc3BvbnNlID0gSHR0cFJlc3BvbnNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkh0dHBTZXJ2aWNlU3ltYm9sID0gZXhwb3J0cy5IdHRwU2VydmljZSA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbnZhciBuZXR3b3JrX2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvci9uZXR3b3JrLmVycm9yXCIpO1xudmFyIGF1dGhlbnRpY2F0aW9uX2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvci9hdXRoZW50aWNhdGlvbi5lcnJvclwiKTtcbnZhciBodHRwX2Vycm9yXzEgPSByZXF1aXJlKFwiLi9lcnJvci9odHRwLmVycm9yXCIpO1xudmFyIG5ldHdvcmtfd2F0Y2hlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9uZXR3b3JrLXdhdGNoZXIuc2VydmljZVwiKTtcbnZhciBsb2dfMSA9IHJlcXVpcmUoXCIuLi9sb2dcIik7XG52YXIgZXJyb3JfMSA9IHJlcXVpcmUoXCIuLi9lcnJvclwiKTtcbnZhciBjb250YWluZXJfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2ludmVyc2lmeS9jb250YWluZXJcIik7XG52YXIgc2hhcmVkX2NvbmZpZ3VyYXRpb25fMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2NvbmZpZy9zaGFyZWQtY29uZmlndXJhdGlvblwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcImVzc2VudGlhbHMvdXRpbHMvdXRpbHNcIik7XG52YXIgaHR0cF9yZXF1ZXN0XzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9uZXR3b3JrL2h0dHAtcmVxdWVzdFwiKTtcbnZhciBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL25ldHdvcmsvY29uc3RhbnRzXCIpO1xudmFyIGh0dHBfcmVzcG9uc2VfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL25ldHdvcmsvaHR0cC1yZXNwb25zZVwiKTtcbnZhciB1dGlsc18yID0gcmVxdWlyZShcImVzc2VudGlhbHMvbmV0d29yay91dGlsc1wiKTtcbnZhciBjYW5jZWxfZXJyb3JfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL25ldHdvcmsvZXJyb3IvY2FuY2VsLmVycm9yXCIpO1xudmFyIEh0dHBTZXJ2aWNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEh0dHBTZXJ2aWNlKGNvbmZpZywgbmV0d29ya1dhdGNoZXIsIGxvZ2dlcikge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5uZXR3b3JrV2F0Y2hlciA9IG5ldHdvcmtXYXRjaGVyO1xuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5yZXF1ZXN0c1F1ZXVlID0gW107XG4gICAgICAgIHRoaXMucXVldWVQcm9jZXNzVGltZW91dCA9IG51bGw7XG4gICAgICAgIHRoaXMubmV0d29ya1dhdGNoZXIud2F0Y2goKS5zdWJzY3JpYmUodXRpbHNfMS5wcm94eSh0aGlzLm9uTmV0d29ya0F2YWlsYWJpbGl0eUNoYW5nZSwgdGhpcykpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEbyBhIEdFVCByZXF1ZXN0LlxuICAgICAqL1xuICAgIEh0dHBTZXJ2aWNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAodXJsLCBoZWFkZXJzLCByZXRyeUNvdW50KSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID09PSB2b2lkIDApIHsgcmV0cnlDb3VudCA9IDM7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChuZXcgaHR0cF9yZXF1ZXN0XzEuSHR0cFJlcXVlc3QoY29uc3RhbnRzXzEuSHR0cE1ldGhvZHMuR0VULCB1cmwsIG51bGwsIGhlYWRlcnMsIHJldHJ5Q291bnQpKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERvIGEgUE9TVCByZXF1ZXN0LlxuICAgICAqL1xuICAgIEh0dHBTZXJ2aWNlLnByb3RvdHlwZS5wb3N0ID0gZnVuY3Rpb24gKHVybCwgYm9keSwgaGVhZGVycywgcmV0cnlDb3VudCkge1xuICAgICAgICBpZiAocmV0cnlDb3VudCA9PT0gdm9pZCAwKSB7IHJldHJ5Q291bnQgPSAzOyB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QobmV3IGh0dHBfcmVxdWVzdF8xLkh0dHBSZXF1ZXN0KGNvbnN0YW50c18xLkh0dHBNZXRob2RzLlBPU1QsIHVybCwgYm9keSwgaGVhZGVycywgcmV0cnlDb3VudCkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRG8gYSBQVVQgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBIdHRwU2VydmljZS5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gKHVybCwgYm9keSwgaGVhZGVycywgcmV0cnlDb3VudCkge1xuICAgICAgICBpZiAocmV0cnlDb3VudCA9PT0gdm9pZCAwKSB7IHJldHJ5Q291bnQgPSAzOyB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QobmV3IGh0dHBfcmVxdWVzdF8xLkh0dHBSZXF1ZXN0KGNvbnN0YW50c18xLkh0dHBNZXRob2RzLlBVVCwgdXJsLCBib2R5LCBoZWFkZXJzLCByZXRyeUNvdW50KSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEbyBhIERFTEVURSByZXF1ZXN0LlxuICAgICAqL1xuICAgIEh0dHBTZXJ2aWNlLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAodXJsLCBoZWFkZXJzLCByZXRyeUNvdW50KSB7XG4gICAgICAgIGlmIChyZXRyeUNvdW50ID09PSB2b2lkIDApIHsgcmV0cnlDb3VudCA9IDM7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChuZXcgaHR0cF9yZXF1ZXN0XzEuSHR0cFJlcXVlc3QoY29uc3RhbnRzXzEuSHR0cE1ldGhvZHMuREVMRVRFLCB1cmwsIG51bGwsIGhlYWRlcnMsIHJldHJ5Q291bnQpKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERvIGEgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBIdHRwU2VydmljZS5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciByZXNwb25zZSA9IG5ldyBodHRwX3Jlc3BvbnNlXzEuSHR0cFJlc3BvbnNlKCk7XG4gICAgICAgIHJlc3BvbnNlLnNldFN0YXR1cyhjb25zdGFudHNfMS5IdHRwUmVzcG9uc2VTdGF0dXMuUGVuZGluZyk7XG4gICAgICAgIHJlc3BvbnNlLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAvLyBJbiBjYXNlIHRoZSByZXF1ZXN0IGhhcyBiZWVuIGNhbmNlbGVkIHJpZ2h0IGFmdGVyIHRoZSBjYWxsIHRvIHJlcXVlc3QoKVxuICAgICAgICAgICAgLy8gYW5kIGJlZm9yZSB0aGUgcHJvbWlzZSBtaWNybyB0YXNrIGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5pc0NhbmNlbGVkKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG51bGwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3BvbnNlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZS5zZXRTdGF0dXMoY29uc3RhbnRzXzEuSHR0cFJlc3BvbnNlU3RhdHVzLkNhbmNlbGVkKTtcbiAgICAgICAgICAgICAgICByZWplY3QobnVsbCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgX3RoaXMucXVldWVSZXF1ZXN0KHJlcXVlc3QsIHJlc3BvbnNlLCAwLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRG8gYSByZXF1ZXN0LlxuICAgICAqL1xuICAgIEh0dHBTZXJ2aWNlLnByb3RvdHlwZS5leGVjdXRlUXVldWVkUmVxdWVzdCA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IG1heSBoYXZlIGJlZW4gY2FuY2VsZWQgd2hpbGUgaW4gcXVldWUsIGluIHN1Y2ggYSBjYXNlIHNpbXBseSBpZ25vcmUgaXQuXG4gICAgICAgIC8vIFRoZSBwcm9taXNlIGhhcyBhbHJlYWR5IGJlZW4gcmVzb2x2ZWQgYnkgdGhlIGRlZmF1bHQgXCJjYW5jZWwoKVwiIGNhbGxiYWNrIGluc2lkZSB0aGUgSHR0cFJlc3BvbnNlLlxuICAgICAgICBpZiAocmVxdWVzdC5yZXNwb25zZS5pc0NhbmNlbGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21RdWV1ZShyZXF1ZXN0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIganF1ZXJ5QWpheE9wdGlvbnMgPSB7XG4gICAgICAgICAgICB1cmw6IHJlcXVlc3QudXJsLFxuICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycyB8fCB7fSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XG4gICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBpZiAocmVxdWVzdC5tZXRob2QgPT09IGNvbnN0YW50c18xLkh0dHBNZXRob2RzLlBPU1QgfHwgcmVxdWVzdC5tZXRob2QgPT09IGNvbnN0YW50c18xLkh0dHBNZXRob2RzLlBVVCkge1xuICAgICAgICAgICAganF1ZXJ5QWpheE9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KHJlcXVlc3QucGF5bG9hZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0V4ZWN1dGUgcmVxdWVzdC4nLCB7IHJlcXVlc3Q6IHJlcXVlc3QgfSk7XG4gICAgICAgIHJlcXVlc3QuanFYSFIgPSAkLmFqYXgoanF1ZXJ5QWpheE9wdGlvbnMpO1xuICAgICAgICByZXF1ZXN0LmlzRXhlY3V0aW5nID0gdHJ1ZTtcbiAgICAgICAgcmVxdWVzdC5qcVhIUi50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSwgc3RhdHVzVGV4dCwganFYSFIpIHtcbiAgICAgICAgICAgIF90aGlzLmxvZ2dlci5kZWJ1ZygnUmVxdWVzdCBzdWNjZXNzLicsIHsgcmVxdWVzdDogcmVxdWVzdCB9KTtcbiAgICAgICAgICAgIF90aGlzLnNldFJlcXVlc3RSYXdSZXN1bHQoanFYSFIsIHJlcXVlc3QucmVzcG9uc2UpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25zZS5yZXN1bHQgPSByZXNwb25zZTtcbiAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uc2Uuc2V0U3RhdHVzKGNvbnN0YW50c18xLkh0dHBSZXNwb25zZVN0YXR1cy5TdWNjZXNzKTtcbiAgICAgICAgICAgIHJlcXVlc3QucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVGcm9tUXVldWUocmVxdWVzdCk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChqcVhIUikge1xuICAgICAgICAgICAgaWYgKHJlcXVlc3QucmVzcG9uc2UuaXNDYW5jZWxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnNldFJlcXVlc3RSYXdSZXN1bHQoanFYSFIsIHJlcXVlc3QucmVzcG9uc2UpO1xuICAgICAgICAgICAgcmVxdWVzdC5pc0V4ZWN1dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmVxdWVzdC5vbkVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIFdlIG1heSBoYXZlIGEgbmV0d29yayBpc3N1ZSwgYnV0IHdlIHdpbGwgaGF2ZSB0byBiZSBzdXJlIGJlZm9yZSBjaG9vc2luZyB3aGF0IHRvIGRvLlxuICAgICAgICAgICAgaWYgKCFfdGhpcy5uZXR3b3JrV2F0Y2hlci5pc09ubGluZSgpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubG9nZ2VyLmVycm9yKCdSZXF1ZXN0IGZhaWxlZCBtYXliZSBiZWNhdXNlIG9mIGEgY29ubmVjdGlvbiBlcnJvci4nLCB7IHJlcXVlc3Q6IHJlcXVlc3QsIGpxWEhSOiBqcVhIUiB9KTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0LmV4ZWN1dGVBdCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgKyBfdGhpcy5jb25maWcubmV0d29yay5jb25uZWN0aW9uRXJyb3JSZXRyeURlbGF5O1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnRyaWVzTGVmdCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubG9nZ2VyLmRlYnVnKHJlcXVlc3QudHJpZXNMZWZ0ICsgJyB0cmllcyBsZWZ0LiBSZXF1ZXN0IHdpbGwgYmUgcXVldWVkIGFnYWluLicpO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnRyaWVzTGVmdC0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubG9nZ2VyLmRlYnVnKCdSZXF1ZXN0IGhhcyBleHBpcmVkIGFsbCBpdHMgdHJpZXMsIHJlamVjdGluZyBpdHMgcHJvbWlzZS4nKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVtb3ZlRnJvbVF1ZXVlKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZWplY3RSZXF1ZXN0KHJlcXVlc3QsIG5ldyBlcnJvcl8xLlB1YmxpY0FwcEVycm9yKCdJbXBvc3NpYmxlIGRlIGpvaW5kcmUgbGUgc2VydmV1ci4nLCBuZXcgbmV0d29ya19lcnJvcl8xLk5ldHdvcmtFcnJvcihqcVhIUi5yZXNwb25zZVRleHQpKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuc2NoZWR1bGVRdWV1ZUZvclByb2Nlc3MoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoanFYSFIuc3RhdHVzID09PSA0MDEgJiYgX3RoaXMuY29uZmlnLm5ldHdvcmsucmVsb2FkT25BdXRoZW50aWNhdGlvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChqcVhIUi5zdGF0dXMgPT09IDQwMSB8fCBqcVhIUi5zdGF0dXMgPT09IDQwMykge1xuICAgICAgICAgICAgICAgIF90aGlzLmxvZ2dlci5lcnJvcignUmVxdWVzdCBmYWlsZWQgYmVjYXVzZSBvZiBhbiBhdXRoZW50aWNhdGlvbiBlcnJvci4nLCB7IHJlcXVlc3Q6IHJlcXVlc3QgfSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucmVqZWN0UmVxdWVzdChyZXF1ZXN0LCBuZXcgZXJyb3JfMS5QdWJsaWNBcHBFcnJvcignVm91cyBuXFwnYXZleiBwYXMgbGVzIGRyb2l0cyBuw6ljZXNzYWlyZXMgcG91ciBhY2PDqWRlciDDoCBjZXR0ZSByZXNzb3VyY2UuJywgbmV3IGF1dGhlbnRpY2F0aW9uX2Vycm9yXzEuQXV0aGVudGljYXRpb25FcnJvcig0MDEpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChqcVhIUi5zdGF0dXMgPT09IDQwNCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmxvZ2dlci5lcnJvcignUmVxdWVzdCBmYWlsZWQgYmVjYXVzZSB0aGUgdXJsIHdhcyBub3QgZm91bmQuJywgeyByZXF1ZXN0OiByZXF1ZXN0LCBqcVhIUjoganFYSFIgfSk7XG4gICAgICAgICAgICAgICAgX3RoaXMucmVqZWN0UmVxdWVzdChyZXF1ZXN0LCBuZXcgZXJyb3JfMS5QdWJsaWNBcHBFcnJvcignUmVzb3VyY2Ugbm9uIHRyb3V2w6llIHN1ciBsZSBzZXJ2ZXVyLicsIGh0dHBfZXJyb3JfMS5IdHRwRXJyb3IuY3JlYXRlKGpxWEhSLnN0YXR1c1RleHQpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1dGlsc18xLmlzT2JqZWN0KGpxWEhSLnJlc3BvbnNlSlNPTikgJiYganFYSFIucmVzcG9uc2VKU09OLnR5cGUuaW5kZXhPZihcIlB1YmxpY0V4Y2VwdGlvblwiLCBcIldlYmVha1xcXFxCdW5kbGVcXFxcRXNzZW50aWFsQnVuZGxlXFxcXEV4Y2VwdGlvblxcXFxQdWJsaWNFeGNlcHRpb25cIikgPj0gMCAmJiB1dGlsc18xLmlzU3RyaW5nKGpxWEhSLnJlc3BvbnNlSlNPTi5tZXNzYWdlKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnJlamVjdFJlcXVlc3QocmVxdWVzdCwgbmV3IGVycm9yXzEuUHVibGljQXBwRXJyb3IoanFYSFIucmVzcG9uc2VKU09OLm1lc3NhZ2UsIGh0dHBfZXJyb3JfMS5IdHRwRXJyb3IuY3JlYXRlKGpxWEhSLnN0YXR1c1RleHQpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5sb2dnZXIuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkIGZvciBhbiB1bmtub3duIHJlYXNvbi4nLCB7IHJlcXVlc3Q6IHJlcXVlc3QsIGpxWEhSOiBqcVhIUiB9KTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZWplY3RSZXF1ZXN0KHJlcXVlc3QsIG5ldyBlcnJvcl8xLlB1YmxpY0FwcEVycm9yKCfDiWNoZWMgZGUgbGEgcmVxdcOqdGUgYXUgc2VydmV1ciBwb3VyIHVuZSBlcnJldXIgaW50ZXJuZS4nLCBodHRwX2Vycm9yXzEuSHR0cEVycm9yLmNyZWF0ZShqcVhIUi5zdGF0dXNUZXh0LCAnVW5rbm93biByZWFzb24nLCBqcVhIUi5yZXNwb25zZUpTT04pKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVGcm9tUXVldWUocmVxdWVzdCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBTZXR1cCB0aGUgY2FuY2VsIGNhbGxiYWNrLlxuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlcXVlc3QuanFYSFIuYWJvcnQoKTtcbiAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uc2Uuc2V0U3RhdHVzKGNvbnN0YW50c18xLkh0dHBSZXNwb25zZVN0YXR1cy5DYW5jZWxlZCk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlamVjdChuZXcgY2FuY2VsX2Vycm9yXzEuQ2FuY2VsRXJyb3IoKSk7XG4gICAgICAgICAgICBfdGhpcy5yZW1vdmVGcm9tUXVldWUocmVxdWVzdCk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNYXJrIHRoZSByZXF1ZXN0IGFzIG9uIGVycm9yLCByZWplY3QgaXRzIHByb21pc2UgYW5kIHNldCB0aGUgZXJyb3IuXG4gICAgICovXG4gICAgSHR0cFNlcnZpY2UucHJvdG90eXBlLnJlamVjdFJlcXVlc3QgPSBmdW5jdGlvbiAocmVxdWVzdCwgZXJyb3IpIHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZS5zZXRTdGF0dXMoY29uc3RhbnRzXzEuSHR0cFJlc3BvbnNlU3RhdHVzLkVycm9yKTtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZS5lcnJvciA9IGVycm9yO1xuICAgICAgICByZXF1ZXN0LnJlamVjdChlcnJvcik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUYWtlIHRoZSByYXcgcmVzcG9uc2UgZm9ybSB0aGUgc2VydmVyIGFuZCBhc3NpZ24gaXQgdG8gdGhlIGNsaWVudCByZXNwb25zZS5cbiAgICAgKi9cbiAgICBIdHRwU2VydmljZS5wcm90b3R5cGUuc2V0UmVxdWVzdFJhd1Jlc3VsdCA9IGZ1bmN0aW9uICh4aHIsIGNsaWVudFJlc3BvbnNlKSB7XG4gICAgICAgIGNsaWVudFJlc3BvbnNlLmh0dHBTdGF0dXNDb2RlID0geGhyLnN0YXR1cztcbiAgICAgICAgY2xpZW50UmVzcG9uc2UuaHR0cFN0YXR1c1RleHQgPSB4aHIuc3RhdHVzVGV4dDtcbiAgICAgICAgaWYgKCF1dGlsc18xLmlzTnVsbE9yVW5kZWZpbmVkKHhoci5yZXNwb25zZUpTT04pKSB7XG4gICAgICAgICAgICBjbGllbnRSZXNwb25zZS5yYXdSZXN1bHQgPSB1dGlsc18yLnN0cmlwWHNzaVByZWZpeCh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIGNsaWVudFJlc3BvbnNlLnJhd1Jlc3VsdFR5cGUgPSAnanNvbic7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiY29udGVudC10eXBlXCIpIHx8ICcnO1xuICAgICAgICBjbGllbnRSZXNwb25zZS5yYXdSZXN1bHRUeXBlID0gKGNvbnRlbnRUeXBlLmluZGV4T2YoJ2h0bWwnKSA+PSAwKSA/ICdodG1sJyA6ICd0ZXh0JztcbiAgICAgICAgY2xpZW50UmVzcG9uc2UucmF3UmVzdWx0ID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgYXZhaWxhYmxlIHJlcXVlc3QgYW5kIHByZXBhcmUgdGhlIG5leHQgcHJvY2VzcyBxdWV1ZSBpZiB0aGUgcXVldWUgc3RpbGwgY29udGFpbnMgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBIdHRwU2VydmljZS5wcm90b3R5cGUucHJvY2Vzc1F1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnUHJvY2VzcyBxdWV1ZS4nKTtcbiAgICAgICAgdmFyIGN1cnJlbnRUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucmVxdWVzdHNRdWV1ZTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0gX2FbX2ldO1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0LmlzRXhlY3V0aW5nICYmIHJlcXVlc3QuZXhlY3V0ZUF0IDw9IGN1cnJlbnRUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlUXVldWVkUmVxdWVzdChyZXF1ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjaGVkdWxlUXVldWVGb3JQcm9jZXNzKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSByZXF1ZXN0IGZyb20gdGhlIHF1ZXVlLlxuICAgICAqL1xuICAgIEh0dHBTZXJ2aWNlLnByb3RvdHlwZS5yZW1vdmVGcm9tUXVldWUgPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVxdWVzdHNRdWV1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVxdWVzdHNRdWV1ZVtpXSA9PT0gcmVxdWVzdCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdSZW1vdmUgcmVxdWVzdCBmcm9tIHF1ZXVlLicsIHsgcmVxdWVzdDogcmVxdWVzdCB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RzUXVldWUuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogUXVldWUgYSByZXF1ZXN0IGZvciByZXRyeS5cbiAgICAgKi9cbiAgICBIdHRwU2VydmljZS5wcm90b3R5cGUucXVldWVSZXF1ZXN0ID0gZnVuY3Rpb24gKHJlcXVlc3QsIHJlc3BvbnNlLCBleGVjdXRlQXQsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB0aGlzLnJlcXVlc3RzUXVldWUucHVzaCh7XG4gICAgICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuICAgICAgICAgICAgdXJsOiByZXF1ZXN0LnVybCxcbiAgICAgICAgICAgIHBheWxvYWQ6IHJlcXVlc3QucGF5bG9hZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycyxcbiAgICAgICAgICAgIHRyaWVzTGVmdDogcmVxdWVzdC5tYXhSZXRyeUNvdW50LFxuICAgICAgICAgICAgZXhlY3V0ZUF0OiBleGVjdXRlQXQsXG4gICAgICAgICAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgICAgICAgICAgcmVqZWN0OiByZWplY3QsXG4gICAgICAgICAgICBpc0V4ZWN1dGluZzogZmFsc2UsXG4gICAgICAgICAgICBvbkVycm9yOiBmYWxzZSxcbiAgICAgICAgICAgIGpxWEhSOiBudWxsLFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnUXVldWUgaHR0cCByZXF1ZXN0JywgeyByZXF1ZXN0OiB0aGlzLnJlcXVlc3RzUXVldWVbdGhpcy5yZXF1ZXN0c1F1ZXVlLmxlbmd0aCAtIDFdIH0pO1xuICAgICAgICB0aGlzLnNjaGVkdWxlUXVldWVGb3JQcm9jZXNzKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBQdXQgYSB0aW1lb3V0IHRvIHByb2Nlc3MgdGhlIHF1ZXVlIGFzIHNvb24gYXMgdGhlIGxlc3MgZGVsYXllZCByZXF1ZXN0IGlzIGF2YWlsYWJsZSBmb3IgcmV0cnkuXG4gICAgICogQSB0aW1lb3V0IHdpbGwgYWx3YXlzIGJlIHNldCBldmVuIGlmIG5vIHJlcXVlc3QgYXNrIGZvciBhIGRlbGF5LlxuICAgICAqL1xuICAgIEh0dHBTZXJ2aWNlLnByb3RvdHlwZS5zY2hlZHVsZVF1ZXVlRm9yUHJvY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMucXVldWVQcm9jZXNzVGltZW91dCAhPT0gbnVsbCB8fCAhdGhpcy5yZXF1ZXN0c1F1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJyZW50VGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciBkZWxheSA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnJlcXVlc3RzUXVldWU7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0LmlzRXhlY3V0aW5nKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZGVsdGEgPSByZXF1ZXN0LmV4ZWN1dGVBdCA+IDAgPyBNYXRoLm1heCgwLCByZXF1ZXN0LmV4ZWN1dGVBdCAtIGN1cnJlbnRUaW1lKSA6IDA7XG4gICAgICAgICAgICBpZiAoZGVsYXkgPT09IG51bGwgfHwgZGVsYXkgPiBkZWx0YSkge1xuICAgICAgICAgICAgICAgIGRlbGF5ID0gZGVsdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlbGF5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnV2FpdGluZyAnICsgZGVsYXkgKyAnbXMgYmVmb3JlIHByb2Nlc3NpbmcgaHR0cCByZXF1ZXN0cyBxdWV1ZS4nKTtcbiAgICAgICAgICAgIHRoaXMucXVldWVQcm9jZXNzVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnF1ZXVlUHJvY2Vzc1RpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIF90aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgc3RhdHVzIG9uIHRoZSBpbnRlcm5ldCBjb25uZWN0aW9uIGNoYW5nZXMuXG4gICAgICovXG4gICAgSHR0cFNlcnZpY2UucHJvdG90eXBlLm9uTmV0d29ya0F2YWlsYWJpbGl0eUNoYW5nZSA9IGZ1bmN0aW9uIChvbmxpbmUpIHtcbiAgICAgICAgaWYgKG9ubGluZSkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIuaW5mbygnTmV0d29yayByZXRyaWV2ZWQsIHNjaGVkdWxlIHRoZSBodHRwIHJlcXVlc3RzIHF1ZXVlIGZvciBwcm9jZXNzaW5nLicpO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucmVxdWVzdHNRdWV1ZTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcXVldWVkUmVxdWVzdCA9IF9hW19pXTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWVkUmVxdWVzdC5vbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlZFJlcXVlc3QuZXhlY3V0ZUF0ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5xdWV1ZVByb2Nlc3NUaW1lb3V0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucXVldWVQcm9jZXNzVGltZW91dCk7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWV1ZVByb2Nlc3NUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVRdWV1ZUZvclByb2Nlc3MoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSHR0cFNlcnZpY2UgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKCksXG4gICAgICAgIHRzbGliXzEuX19wYXJhbSgwLCBpbnZlcnNpZnlfMS5pbmplY3Qoc2hhcmVkX2NvbmZpZ3VyYXRpb25fMS5TaGFyZWRDb25maWd1cmF0aW9uU3ltYm9sKSksXG4gICAgICAgIHRzbGliXzEuX19wYXJhbSgxLCBpbnZlcnNpZnlfMS5pbmplY3QobmV0d29ya193YXRjaGVyX3NlcnZpY2VfMS5OZXR3b3JrV2F0Y2hlclNlcnZpY2VTeW1ib2wpKSxcbiAgICAgICAgdHNsaWJfMS5fX3BhcmFtKDIsIGludmVyc2lmeV8xLmluamVjdChsb2dfMS5Mb2dnZXJTZXJ2aWNlU3ltYm9sKSksXG4gICAgICAgIHRzbGliXzEuX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtzaGFyZWRfY29uZmlndXJhdGlvbl8xLlNoYXJlZENvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgICBuZXR3b3JrX3dhdGNoZXJfc2VydmljZV8xLk5ldHdvcmtXYXRjaGVyU2VydmljZSxcbiAgICAgICAgICAgIGxvZ18xLkxvZ2dlclNlcnZpY2VdKVxuICAgIF0sIEh0dHBTZXJ2aWNlKTtcbiAgICByZXR1cm4gSHR0cFNlcnZpY2U7XG59KCkpO1xuZXhwb3J0cy5IdHRwU2VydmljZSA9IEh0dHBTZXJ2aWNlO1xuZXhwb3J0cy5IdHRwU2VydmljZVN5bWJvbCA9IFN5bWJvbChcIkh0dHBTZXJ2aWNlXCIpO1xuY29udGFpbmVyXzEuQ29udGFpbmVyLnJlZ2lzdGVyU2VydmljZShleHBvcnRzLkh0dHBTZXJ2aWNlU3ltYm9sLCBIdHRwU2VydmljZSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudHNsaWJfMS5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vaHR0cC5zZXJ2aWNlXCIpLCBleHBvcnRzKTtcbnRzbGliXzEuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL25ldHdvcmstd2F0Y2hlci5zZXJ2aWNlXCIpLCBleHBvcnRzKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5OZXR3b3JrV2F0Y2hlclNlcnZpY2VTeW1ib2wgPSBleHBvcnRzLk5ldHdvcmtXYXRjaGVyU2VydmljZSA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIGludmVyc2lmeV8xID0gcmVxdWlyZShcImludmVyc2lmeVwiKTtcbnZhciByeGpzXzEgPSByZXF1aXJlKFwicnhqc1wiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcImVzc2VudGlhbHMvdXRpbHMvdXRpbHNcIik7XG52YXIgZXZlbnRfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2V2ZW50XCIpO1xudmFyIGxvZ18xID0gcmVxdWlyZShcImVzc2VudGlhbHMvbG9nXCIpO1xudmFyIGNvbnRhaW5lcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvaW52ZXJzaWZ5L2NvbnRhaW5lclwiKTtcbnZhciBOZXR3b3JrV2F0Y2hlclNlcnZpY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTmV0d29ya1dhdGNoZXJTZXJ2aWNlKGV2ZW50RGlzcGF0Y2hlciwgbG9nZ2VyKSB7XG4gICAgICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyID0gZXZlbnREaXNwYXRjaGVyO1xuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5pc1N1cHBvcnRlZCA9IHV0aWxzXzEuaXNPYmplY3Qod2luZG93Lm5hdmlnYXRvcik7XG4gICAgICAgIHRoaXMuaXNPbmxpbmVBdHRyID0gdGhpcy5pc1N1cHBvcnRlZCA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lICE9PSBmYWxzZSA6IHRydWU7XG4gICAgICAgIHRoaXMubW9uaXRvcmluZ1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMub25Db25uZWN0aW9uUmV0cmlldmVkRm4gPSBudWxsO1xuICAgICAgICB0aGlzLm9uQ29ubmVjdGlvbkxvc3RGbiA9IG51bGw7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRlc3QgaWYgdGhlIGN1cnJlbnQgY29ubmVjdGlvbiBoYXMgYWNjZXNzIHRvIHRoZSBpbnRlcm5ldC5cbiAgICAgKi9cbiAgICBOZXR3b3JrV2F0Y2hlclNlcnZpY2UucHJvdG90eXBlLmlzT25saW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc09ubGluZUF0dHI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTdGFydCB3YXRjaGluZyB0aGUgbmV0d29yayBzdGF0dXMuXG4gICAgICovXG4gICAgTmV0d29ya1dhdGNoZXJTZXJ2aWNlLnByb3RvdHlwZS53YXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1N0YXJ0IHdhdGNoaW5nIHRoZSBuZXR3b3JrLi4uJyk7XG4gICAgICAgIGlmICh0aGlzLm9uQ29ubmVjdGlvbkxvc3RGbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3Rpb25SZXRyaWV2ZWRGbiA9IHV0aWxzXzEucHJveHkodGhpcy5vbkNvbm5lY3Rpb25SZXRyaWV2ZWQsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3Rpb25Mb3N0Rm4gPSB1dGlsc18xLnByb3h5KHRoaXMub25Db25uZWN0aW9uTG9zdCwgdGhpcyk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgdGhpcy5vbkNvbm5lY3Rpb25SZXRyaWV2ZWRGbik7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIHRoaXMub25Db25uZWN0aW9uTG9zdEZuKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHJ4anNfMS5PYnNlcnZhYmxlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICAgICAgX3RoaXMub2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFN0b3Agd2F0Y2hpbmcgdGhlIG5ldHdvcmsuXG4gICAgICovXG4gICAgTmV0d29ya1dhdGNoZXJTZXJ2aWNlLnByb3RvdHlwZS51bndhdGNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vbkNvbm5lY3Rpb25Mb3N0Rm4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnU3RvcCB3YXRjaGluZyB0aGUgbmV0d29yay4nKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHRoaXMub25Db25uZWN0aW9uUmV0cmlldmVkRm4pO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsIHRoaXMub25Db25uZWN0aW9uTG9zdEZuKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIGxvc3QuXG4gICAgICovXG4gICAgTmV0d29ya1dhdGNoZXJTZXJ2aWNlLnByb3RvdHlwZS5vbkNvbm5lY3Rpb25Mb3N0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKCdDb25uZWN0aW9uIGxvc3QuJyk7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLm9ic2VydmVyczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBvYnNlcnZlciA9IF9hW19pXTtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoKCduZXR3b3JrOm9mZmxpbmUnKTtcbiAgICAgICAgdGhpcy5pc09ubGluZUF0dHIgPSBmYWxzZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGJlY29tZXMgYXZhaWxhYmxlIGFnYWluLlxuICAgICAqL1xuICAgIE5ldHdvcmtXYXRjaGVyU2VydmljZS5wcm90b3R5cGUub25Db25uZWN0aW9uUmV0cmlldmVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKCdDb25uZWN0aW9uIHJldHJpZXZlZC4nKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMub2JzZXJ2ZXJzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIG9ic2VydmVyID0gX2FbX2ldO1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaCgnbmV0d29yazpvbmxpbmUnKTtcbiAgICAgICAgdGhpcy5pc09ubGluZUF0dHIgPSB0cnVlO1xuICAgIH07XG4gICAgTmV0d29ya1dhdGNoZXJTZXJ2aWNlID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpLFxuICAgICAgICB0c2xpYl8xLl9fcGFyYW0oMCwgaW52ZXJzaWZ5XzEuaW5qZWN0KGV2ZW50XzEuRXZlbnREaXNwYXRjaGVyU2VydmljZVN5bWJvbCkpLFxuICAgICAgICB0c2xpYl8xLl9fcGFyYW0oMSwgaW52ZXJzaWZ5XzEuaW5qZWN0KGxvZ18xLkxvZ2dlclNlcnZpY2VTeW1ib2wpKSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW2V2ZW50XzEuRXZlbnREaXNwYXRjaGVyU2VydmljZSxcbiAgICAgICAgICAgIGxvZ18xLkxvZ2dlclNlcnZpY2VdKVxuICAgIF0sIE5ldHdvcmtXYXRjaGVyU2VydmljZSk7XG4gICAgcmV0dXJuIE5ldHdvcmtXYXRjaGVyU2VydmljZTtcbn0oKSk7XG5leHBvcnRzLk5ldHdvcmtXYXRjaGVyU2VydmljZSA9IE5ldHdvcmtXYXRjaGVyU2VydmljZTtcbmV4cG9ydHMuTmV0d29ya1dhdGNoZXJTZXJ2aWNlU3ltYm9sID0gU3ltYm9sKFwiTmV0d29ya1dhdGNoZXJTZXJ2aWNlXCIpO1xuY29udGFpbmVyXzEuQ29udGFpbmVyLnJlZ2lzdGVyU2VydmljZShleHBvcnRzLk5ldHdvcmtXYXRjaGVyU2VydmljZVN5bWJvbCwgTmV0d29ya1dhdGNoZXJTZXJ2aWNlKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zdHJpcFhzc2lQcmVmaXggPSBleHBvcnRzLmFwcGVuZFF1ZXJ5UGFyYW1ldGVycyA9IGV4cG9ydHMuYnVpbGRRdWVyeVBhcmFtZXRlcnMgPSB2b2lkIDA7XG4vKipcbiAqIEJ1aWxkIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHN0cmluZyBmb3IgYW4gdXJsLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICogICBidWlsZFF1ZXJ5UGFyYW1ldGVycyh7XG4gKiAgICAgICBwYXJhbTE6ICdodHRwOi8vZXhhbXBsZS5vcmcvP2E9MTImYj01NScsXG4gKiAgICAgICBwYXJhbTI6IDk5XG4gKiAgIH0pXG4gKlxuICogd2lsbCBvdXRwdXQ6XG4gKiA/cGFyYW0xPWh0dHAlM0ElMkYlMkZleGFtcGxlLm9yZyUyRiVGZmElM0QxMiUyNmIlM0Q1NSZwYXJhbTI9OTlcbiAqL1xuZnVuY3Rpb24gYnVpbGRRdWVyeVBhcmFtZXRlcnMob2JqKSB7XG4gICAgdmFyIHF1ZXJ5UGFyYW1ldGVyc0FycmF5ID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKG9iaik7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBfYVtfaV07XG4gICAgICAgIHF1ZXJ5UGFyYW1ldGVyc0FycmF5LnB1c2goa2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKSk7XG4gICAgfVxuICAgIGlmIChxdWVyeVBhcmFtZXRlcnNBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiAnPycgKyBxdWVyeVBhcmFtZXRlcnNBcnJheS5qb2luKCcmJyk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbmV4cG9ydHMuYnVpbGRRdWVyeVBhcmFtZXRlcnMgPSBidWlsZFF1ZXJ5UGFyYW1ldGVycztcbi8qKlxuICogQ29uc3RydWN0IGEgcXVlcnkgcGFyYW1ldGVyIHN0cmluZyBmcm9tIGFuIGtleS92YWx1ZSBwYWlyIG9iamVjdCBhbmQgYXBwZW5kIGl0IHRoZSBhbiBleGlzdGluZyB1cmwuXG4gKi9cbmZ1bmN0aW9uIGFwcGVuZFF1ZXJ5UGFyYW1ldGVycyh1cmwsIHBhcmFtcykge1xuICAgIHZhciBxdWVyeVN0cmluZyA9IGJ1aWxkUXVlcnlQYXJhbWV0ZXJzKHBhcmFtcyk7XG4gICAgdmFyIHBvcyA9IHVybC5pbmRleE9mKCc/Jyk7XG4gICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAgIHJldHVybiB1cmwgKyAnJicgKyBxdWVyeVN0cmluZy5zdWJzdHJpbmcoMSk7XG4gICAgfVxuICAgIHJldHVybiB1cmwgKyBxdWVyeVN0cmluZztcbn1cbmV4cG9ydHMuYXBwZW5kUXVlcnlQYXJhbWV0ZXJzID0gYXBwZW5kUXVlcnlQYXJhbWV0ZXJzO1xuLyoqXG4gKiBSZW1vdmUgdGhlIHByZWZpeCBzZXQgYnkgdGhlIEFQSSB3aGVuIHJlc3BvbmRpbmcgd2l0aCBhbiBhcnJheSB0byBwcmV2ZW50IFhTU0kgYXR0YWNrcy5cbiAqL1xuZnVuY3Rpb24gc3RyaXBYc3NpUHJlZml4KGlucHV0KSB7XG4gICAgdmFyIHByZWZpeCA9IFwiKV19J1xcblwiO1xuICAgIGlmIChpbnB1dC5zdWJzdHJpbmcoMCwgcHJlZml4Lmxlbmd0aCkgPT09IHByZWZpeCkge1xuICAgICAgICByZXR1cm4gaW5wdXQuc3Vic3RyaW5nKHByZWZpeC5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXQ7XG59XG5leHBvcnRzLnN0cmlwWHNzaVByZWZpeCA9IHN0cmlwWHNzaVByZWZpeDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG50c2xpYl8xLl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9pbnRlcmZhY2Uvc3RvcmFnZS5pbnRlcmZhY2VcIiksIGV4cG9ydHMpO1xudHNsaWJfMS5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc2VydmljZS9zdG9yYWdlLnNlcnZpY2VcIiksIGV4cG9ydHMpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ29va2llc0RyaXZlclNlcnZpY2VTeW1ib2wgPSBleHBvcnRzLkNvb2tpZXNEcml2ZXJTZXJ2aWNlID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xudmFyIHN0b3JhZ2Vfc2VydmljZV8xID0gcmVxdWlyZShcIi4vc3RvcmFnZS5zZXJ2aWNlXCIpO1xudmFyIGNvbnRhaW5lcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvaW52ZXJzaWZ5L2NvbnRhaW5lclwiKTtcbnZhciBDb29raWVzRHJpdmVyU2VydmljZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhDb29raWVzRHJpdmVyU2VydmljZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBDb29raWVzRHJpdmVyU2VydmljZSgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBDb29raWVzRHJpdmVyU2VydmljZV8xID0gQ29va2llc0RyaXZlclNlcnZpY2U7XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIGtleS5cbiAgICAgKi9cbiAgICBDb29raWVzRHJpdmVyU2VydmljZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9ICc7ICcgKyBkb2N1bWVudC5jb29raWU7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSB2YWx1ZS5zcGxpdCgnOyAnICsgQ29va2llc0RyaXZlclNlcnZpY2VfMS5QUkVGSVggKyBrZXkgKyAnPScpO1xuICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocGFydHMucG9wKCkuc3BsaXQoJzsnKS5zaGlmdCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGdpdmVuIGtleS5cbiAgICAgKi9cbiAgICBDb29raWVzRHJpdmVyU2VydmljZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoNCAqIDM2NSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcbiAgICAgICAgICAgIHZhciBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gQ29va2llc0RyaXZlclNlcnZpY2VfMS5QUkVGSVggKyBrZXkgKyAnPScgKyAodmFsdWUgfHwgJycpICsgZXhwaXJlcyArICc7IHBhdGg9Lyc7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFueSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBrZXkuXG4gICAgICovXG4gICAgQ29va2llc0RyaXZlclNlcnZpY2UucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBDb29raWVzRHJpdmVyU2VydmljZV8xLlBSRUZJWCArIGtleSArICc9OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDEgR01UOyc7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIGVudGlyZSBrZXkgdmFsdWUgc3RvcmUuXG4gICAgICovXG4gICAgQ29va2llc0RyaXZlclNlcnZpY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgIF90aGlzLmtleXMoKS50aGVuKGZ1bmN0aW9uIChrZXlzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBrZXlzXzEgPSBrZXlzOyBfaSA8IGtleXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGtleXNfMVtfaV07XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZShrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIGhvdyBtYW55IGtleXMgYXJlIHN0b3JlZCBpbiB0aGUgc3RvcmFnZS5cbiAgICAgKi9cbiAgICBDb29raWVzRHJpdmVyU2VydmljZS5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgIF90aGlzLmtleXMoKS50aGVuKGZ1bmN0aW9uIChrZXlzKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlzLmxlbmd0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBsaXN0IG9mIGFsbCBrZXlzIHN0b3JlZCBpbiB0aGUgc3RvcmFnZS5cbiAgICAgKi9cbiAgICBDb29raWVzRHJpdmVyU2VydmljZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goY29va2llc1tpXS5zcGxpdCgnPScpWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUoa2V5cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdHlwZSBvZiBzdG9yYWdlIHVzZWQuXG4gICAgICovXG4gICAgQ29va2llc0RyaXZlclNlcnZpY2UucHJvdG90eXBlLmdldERyaXZlck5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnQnJvd3NlciAoY29va2llIHN0b3JhZ2UpJztcbiAgICB9O1xuICAgIHZhciBDb29raWVzRHJpdmVyU2VydmljZV8xO1xuICAgIC8qKlxuICAgICAqIFByZWZpeCB0byBiZSBhYmxlIHRvIGRpZmZlcmVudGlhdGUgYmV0d2VlbiBjb29raWVzIG1hbmFnZWQgYnkgdGhlIHN0b3JhZ2UgYW5kIGNvb2tpZXMgd2hvIGRvbid0LlxuICAgICAqL1xuICAgIENvb2tpZXNEcml2ZXJTZXJ2aWNlLlBSRUZJWCA9ICdfX3NjZF8nO1xuICAgIENvb2tpZXNEcml2ZXJTZXJ2aWNlID0gQ29va2llc0RyaXZlclNlcnZpY2VfMSA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKVxuICAgIF0sIENvb2tpZXNEcml2ZXJTZXJ2aWNlKTtcbiAgICByZXR1cm4gQ29va2llc0RyaXZlclNlcnZpY2U7XG59KHN0b3JhZ2Vfc2VydmljZV8xLlN0b3JhZ2VTZXJ2aWNlKSk7XG5leHBvcnRzLkNvb2tpZXNEcml2ZXJTZXJ2aWNlID0gQ29va2llc0RyaXZlclNlcnZpY2U7XG5leHBvcnRzLkNvb2tpZXNEcml2ZXJTZXJ2aWNlU3ltYm9sID0gU3ltYm9sKFwiQ29va2llc0RyaXZlclNlcnZpY2VcIik7XG5jb250YWluZXJfMS5Db250YWluZXIucmVnaXN0ZXJTZXJ2aWNlKGV4cG9ydHMuQ29va2llc0RyaXZlclNlcnZpY2VTeW1ib2wsIENvb2tpZXNEcml2ZXJTZXJ2aWNlKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Mb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlU3ltYm9sID0gZXhwb3J0cy5Mb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xudmFyIGNvbnRhaW5lcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvaW52ZXJzaWZ5L2NvbnRhaW5lclwiKTtcbnZhciBzdG9yYWdlXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9zdG9yYWdlXCIpO1xudmFyIExvY2FsU3RvcmFnZURyaXZlclNlcnZpY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoTG9jYWxTdG9yYWdlRHJpdmVyU2VydmljZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBMb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBrZXkuXG4gICAgICovXG4gICAgTG9jYWxTdG9yYWdlRHJpdmVyU2VydmljZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgIHJlc29sdmUod2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdmFsdWUgZm9yIHRoZSBnaXZlbiBrZXkuXG4gICAgICovXG4gICAgTG9jYWxTdG9yYWdlRHJpdmVyU2VydmljZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFueSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBrZXkuXG4gICAgICovXG4gICAgTG9jYWxTdG9yYWdlRHJpdmVyU2VydmljZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENsZWFyIHRoZSBlbnRpcmUga2V5IHZhbHVlIHN0b3JlLlxuICAgICAqL1xuICAgIExvY2FsU3RvcmFnZURyaXZlclNlcnZpY2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIGhvdyBtYW55IGtleXMgYXJlIHN0b3JlZCBpbiB0aGUgc3RvcmFnZS5cbiAgICAgKi9cbiAgICBMb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgcmVzb2x2ZSh3aW5kb3cubG9jYWxTdG9yYWdlLmxlbmd0aCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbGlzdCBvZiBhbGwga2V5cyBzdG9yZWQgaW4gdGhlIHN0b3JhZ2UuXG4gICAgICovXG4gICAgTG9jYWxTdG9yYWdlRHJpdmVyU2VydmljZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGMgPSBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpIDwgYzsgKytpKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKGxvY2FsU3RvcmFnZS5rZXkoaSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZShrZXlzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB0eXBlIG9mIHN0b3JhZ2UgdXNlZC5cbiAgICAgKi9cbiAgICBMb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlLnByb3RvdHlwZS5nZXREcml2ZXJOYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJ0Jyb3dzZXIgKGxvY2FsIHN0b3JhZ2UpJztcbiAgICB9O1xuICAgIExvY2FsU3RvcmFnZURyaXZlclNlcnZpY2UgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICBpbnZlcnNpZnlfMS5pbmplY3RhYmxlKClcbiAgICBdLCBMb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlKTtcbiAgICByZXR1cm4gTG9jYWxTdG9yYWdlRHJpdmVyU2VydmljZTtcbn0oc3RvcmFnZV8xLlN0b3JhZ2VTZXJ2aWNlKSk7XG5leHBvcnRzLkxvY2FsU3RvcmFnZURyaXZlclNlcnZpY2UgPSBMb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlO1xuZXhwb3J0cy5Mb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlU3ltYm9sID0gU3ltYm9sKFwiTG9jYWxTdG9yYWdlRHJpdmVyU2VydmljZVwiKTtcbmNvbnRhaW5lcl8xLkNvbnRhaW5lci5yZWdpc3RlclNlcnZpY2UoZXhwb3J0cy5Mb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlU3ltYm9sLCBMb2NhbFN0b3JhZ2VEcml2ZXJTZXJ2aWNlKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdG9yYWdlU2VydmljZVN5bWJvbCA9IGV4cG9ydHMuU3RvcmFnZVNlcnZpY2UgPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciBpbnZlcnNpZnlfMSA9IHJlcXVpcmUoXCJpbnZlcnNpZnlcIik7XG52YXIgU3RvcmFnZVNlcnZpY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3RvcmFnZVNlcnZpY2UoKSB7XG4gICAgfVxuICAgIFN0b3JhZ2VTZXJ2aWNlID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgaW52ZXJzaWZ5XzEuaW5qZWN0YWJsZSgpXG4gICAgXSwgU3RvcmFnZVNlcnZpY2UpO1xuICAgIHJldHVybiBTdG9yYWdlU2VydmljZTtcbn0oKSk7XG5leHBvcnRzLlN0b3JhZ2VTZXJ2aWNlID0gU3RvcmFnZVNlcnZpY2U7XG5leHBvcnRzLlN0b3JhZ2VTZXJ2aWNlU3ltYm9sID0gU3ltYm9sKFwiU3RvcmFnZVNlcnZpY2VcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBsb2NhbF9zdG9yYWdlX2RyaXZlcl9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlL2xvY2FsLXN0b3JhZ2UtZHJpdmVyLnNlcnZpY2VcIik7XG52YXIgY29va2llc19kcml2ZXJfc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZS9jb29raWVzLWRyaXZlci5zZXJ2aWNlXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy91dGlsc1wiKTtcbnZhciBjb250YWluZXJfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2ludmVyc2lmeS9jb250YWluZXJcIik7XG52YXIgc3RvcmFnZV9zZXJ2aWNlXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9zdG9yYWdlL3NlcnZpY2Uvc3RvcmFnZS5zZXJ2aWNlXCIpO1xuLyoqXG4gKiBGYWN0b3J5IGNyZWF0aW5nIHRoZSBjb3JyZWN0IHN0b3JhZ2Ugc2VydmljZSBpbnN0YW5jZSBkZXBlbmRpbmcgb24gdGhlIHBsYXRmb3JtLlxuICovXG5jb250YWluZXJfMS5Db250YWluZXIucmVnaXN0ZXJGYWN0b3J5KHN0b3JhZ2Vfc2VydmljZV8xLlN0b3JhZ2VTZXJ2aWNlU3ltYm9sLCBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGlmICghdXRpbHNfMS5pc1VuZGVmaW5lZCh3aW5kb3cubG9jYWxTdG9yYWdlKSkge1xuICAgICAgICByZXR1cm4gY29udGFpbmVyXzEuQ29udGFpbmVyLmdldENvbnRhaW5lcigpLmdldChsb2NhbF9zdG9yYWdlX2RyaXZlcl9zZXJ2aWNlXzEuTG9jYWxTdG9yYWdlRHJpdmVyU2VydmljZVN5bWJvbCk7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXJfMS5Db250YWluZXIuZ2V0Q29udGFpbmVyKCkuZ2V0KGNvb2tpZXNfZHJpdmVyX3NlcnZpY2VfMS5Db29raWVzRHJpdmVyU2VydmljZVN5bWJvbCk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5WYXJIb2xkZXIgPSB2b2lkIDA7XG52YXIgdHNsaWJfMSA9IHJlcXVpcmUoXCJ0c2xpYlwiKTtcbnZhciBlcnJvcl8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvZXJyb3JcIik7XG52YXIgaW52ZXJzaWZ5XzEgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy91dGlsc1wiKTtcbi8qKlxuICogQSBnZW5lcmljIGtleS92YWx1ZSBwYWlyIHN0b3JhZ2UgeW91IGNhbiB1c2UgdG8gc3RvcmUgZGF0YSBpbiBtZW1vcnkuXG4gKi9cbnZhciBWYXJIb2xkZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmFySG9sZGVyKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcGFyYW1ldGVycy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gYXJyYXkgQW4gYXJyYXkgb2YgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIFZhckhvbGRlci5wcm90b3R5cGUuYWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcGFyYW1ldGVyIGtleXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGFycmF5IEFuIGFycmF5IG9mIHBhcmFtZXRlciBrZXlzXG4gICAgICovXG4gICAgVmFySG9sZGVyLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5zdG9yYWdlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBhIHZhbHVlIHN0b3JlZCBpbiB0aGUgc3RvcmFnZS5cbiAgICAgKiBZb3UgY2FuIGdpdmUgYW4gYXJyYXkgb2Yga2V5cyB0byBmZXRjaCBpbiBkZXB0aC5cbiAgICAgKi9cbiAgICBWYXJIb2xkZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBpZiAoZGVmYXVsdFZhbHVlID09PSB2b2lkIDApIHsgZGVmYXVsdFZhbHVlID0gbnVsbDsgfVxuICAgICAgICB2YXIga2V5cyA9IHV0aWxzXzEuZW5zdXJlQXJyYXkoa2V5KTtcbiAgICAgICAgdmFyIHN0b3JhZ2UgPSB0aGlzLnN0b3JhZ2U7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwga2V5c18xID0ga2V5czsgX2kgPCBrZXlzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgayA9IGtleXNfMVtfaV07XG4gICAgICAgICAgICBpZiAoIXV0aWxzXzEuaXNPYmplY3Qoc3RvcmFnZVtrXSkgfHwgdXRpbHNfMS5pc1VuZGVmaW5lZChzdG9yYWdlW2tdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdG9yYWdlID0gc3RvcmFnZVtrXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcmFnZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldCBhIHZhbHVlIGluIHRoZSBzdG9yYWdlLlxuICAgICAqIFlvdSBjYW4gZ2l2ZSBhbiBhcnJheSBvZiBrZXlzIHRvIHNldCBhIHZhbHVlIGRlZXAgaW4gdGhlIG9iamVjdC5cbiAgICAgKi9cbiAgICBWYXJIb2xkZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIHZhciBrZXlzID0gdXRpbHNfMS5lbnN1cmVBcnJheShrZXkpO1xuICAgICAgICB2YXIgc3RvcmFnZSA9IHRoaXMuc3RvcmFnZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aCAtIDE7ICsraSkge1xuICAgICAgICAgICAgaWYgKHV0aWxzXzEuaXNVbmRlZmluZWQoc3RvcmFnZVtrZXlzW2ldXSkpIHtcbiAgICAgICAgICAgICAgICBzdG9yYWdlW2tleXNbaV1dID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXV0aWxzXzEuaXNPYmplY3Qoc3RvcmFnZVtrZXlzW2ldXSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JfMS5BcHBFcnJvcignVGhlIGtleSBcIicgKyBrZXlzW2ldICsgJ1wiIGlzIGFscmVhZHkgdXNlZCBieSBhIG5vbiBvYmplY3QgdmFsdWUuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdG9yYWdlID0gc3RvcmFnZVtrZXlzW2ldXTtcbiAgICAgICAgfVxuICAgICAgICBzdG9yYWdlW2tleXNba2V5cy5sZW5ndGggLSAxXV0gPSB2YWx1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIHRoZSBjdXJyZW50IHBhcmFtZXRlcnMgYnkgYSBuZXcgc2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtZXRlcnMgQW4gYXJyYXkgb2YgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIFZhckhvbGRlci5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIChwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IHBhcmFtZXRlcnM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGRzIHBhcmFtZXRlcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBwYXJhbWV0ZXJzIEFuIGFycmF5IG9mIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBWYXJIb2xkZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChwYXJhbWV0ZXJzKSB7XG4gICAgICAgIGZvciAodmFyIG5hbWVfMSBpbiBwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5oYXNPd25Qcm9wZXJ0eShuYW1lXzEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yYWdlW25hbWVfMV0gPSBwYXJhbWV0ZXJzW25hbWVfMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGRlZmluZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0ga2V5IFRoZSBrZXlcbiAgICAgKlxuICAgICAqIEByZXR1cm4gYm9vbCB0cnVlIGlmIHRoZSBwYXJhbWV0ZXIgZXhpc3RzLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBWYXJIb2xkZXIucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgLy8gV2UgY2FuJ3QgZG86XG4gICAgICAgIC8vICAgYHRoaXMuZ2V0KGtleSwgdW5kZWZpbmVkKWBcbiAgICAgICAgLy8gYmVjYXVzZSBkb2luZyB0aGlzIHdpbGwgc2V0IHRoZSBkZWZhdWx0IHZhbHVlIHRvIGBudWxsYCAodGhlIGRlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlcikuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEFuZCBJIGRvbid0IHdhbnQgdG8gbG9zZSB0aGUgYWJpbGl0eSB0byBoYXZlIHRoZSBkZWZhdWx0IHZhbHVlIHRvIG51bGwgYnkgZGVmYXVsdC5cbiAgICAgICAgLy8gU28gdGhlIHRyaWNrIGlzIHRvIGdldCB0aGUgdmFsdWUgb25jZTpcbiAgICAgICAgdmFyIHYgPSB0aGlzLmdldChrZXkpO1xuICAgICAgICAvLyBJZiB0aGUgdmFsdWUgaXMgbnVsbCwgaXQgbWF5IG5vdCBleGlzdCBpbiB0aGUgc3RvcmFnZS5cbiAgICAgICAgaWYgKHYgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEJ1dCB0aGUgdmFsdWUgc2V0IGJ5IHRoZSB1c2VyIGNvdWxkIGJlIG51bGwsIHNvIGRvIGFub3RoZXIgZ2V0IHRvIGJlIHN1cmVcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldChrZXksICdfJykgPT09IG51bGw7IC8vIElmIHRoZSByZXN1bHQgaXMgc3RpbGwgbnVsbCwgdGhlIGtleSB3YXMgZWZmZWN0aXZlbHkgc2V0IHRvIG51bGwgYnkgdGhlIHVzZXIuXG4gICAgICAgIH1cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHRoZSBrZXkgZXhpc3QuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHBhcmFtZXRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleVxuICAgICAqL1xuICAgIFZhckhvbGRlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBkZWxldGUgKHRoaXMuc3RvcmFnZVtrZXldKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwYXJhbWV0ZXJzLlxuICAgICAqXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIFZhckhvbGRlci5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnN0b3JhZ2UpLmxlbmd0aDtcbiAgICB9O1xuICAgIFZhckhvbGRlciA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIGludmVyc2lmeV8xLmluamVjdGFibGUoKSxcbiAgICAgICAgdHNsaWJfMS5fX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pXG4gICAgXSwgVmFySG9sZGVyKTtcbiAgICByZXR1cm4gVmFySG9sZGVyO1xufSgpKTtcbmV4cG9ydHMuVmFySG9sZGVyID0gVmFySG9sZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJhc2U2NGRlY29kZVVybFNhZmUgPSBleHBvcnRzLmJhc2U2NGVuY29kZVVybFNhZmUgPSBleHBvcnRzLmJhc2U2NGRlY29kZSA9IGV4cG9ydHMuYmFzZTY0ZW5jb2RlID0gdm9pZCAwO1xuLypcbiAqICBiYXNlNjQuanNcbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEJTRCAzLUNsYXVzZSBMaWNlbnNlLlxuICogICAgaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICpcbiAqICBSZWZlcmVuY2VzOlxuICogICAgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjRcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kYW5rb2dhaS9qcy1iYXNlNjQvYmxvYi9tYXN0ZXIvYmFzZTY0LmpzXG4gKi9cbnZhciBCYXNlNjQgPSAoZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBleGlzdGluZyB2ZXJzaW9uIGZvciBub0NvbmZsaWN0KClcbiAgICBnbG9iYWwgPSBnbG9iYWwgfHwge307XG4gICAgdmFyIF9CYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgIHZhciB2ZXJzaW9uID0gXCIyLjUuMlwiO1xuICAgIC8vIGlmIG5vZGUuanMgYW5kIE5PVCBSZWFjdCBOYXRpdmUsIHdlIHVzZSBCdWZmZXJcbiAgICB2YXIgYnVmZmVyO1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYnVmZmVyID0gZXZhbChcInJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlclwiKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBidWZmZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gY29uc3RhbnRzXG4gICAgdmFyIGI2NGNoYXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuICAgIHZhciBiNjR0YWIgPSBmdW5jdGlvbiAoYmluKSB7XG4gICAgICAgIHZhciB0ID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYmluLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgICAgICAgIHRbYmluLmNoYXJBdChpKV0gPSBpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9KGI2NGNoYXJzKTtcbiAgICB2YXIgZnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbiAgICAvLyBlbmNvZGVyIHN0dWZmXG4gICAgdmFyIGNiX3V0b2IgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICB2YXIgY2M7XG4gICAgICAgIGlmIChjLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIGNjID0gYy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgcmV0dXJuIGNjIDwgMHg4MCA/IGNcbiAgICAgICAgICAgICAgICA6IGNjIDwgMHg4MDAgPyAoZnJvbUNoYXJDb2RlKDB4YzAgfCAoY2MgPj4+IDYpKVxuICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKGNjICYgMHgzZikpKVxuICAgICAgICAgICAgICAgICAgICA6IChmcm9tQ2hhckNvZGUoMHhlMCB8ICgoY2MgPj4+IDEyKSAmIDB4MGYpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+IDYpICYgMHgzZikpXG4gICAgICAgICAgICAgICAgICAgICAgICArIGZyb21DaGFyQ29kZSgweDgwIHwgKGNjICYgMHgzZikpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNjID0gMHgxMDAwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgwKSAtIDB4RDgwMCkgKiAweDQwMFxuICAgICAgICAgICAgICAgICsgKGMuY2hhckNvZGVBdCgxKSAtIDB4REMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgweGYwIHwgKChjYyA+Pj4gMTgpICYgMHgwNykpXG4gICAgICAgICAgICAgICAgKyBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+IDEyKSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGNjID4+PiA2KSAmIDB4M2YpKVxuICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKDB4ODAgfCAoY2MgJiAweDNmKSkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgcmVfdXRvYiA9IC9bXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZGXXxbXlxceDAwLVxceDdGXS9nO1xuICAgIHZhciB1dG9iID0gZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgcmV0dXJuIHUucmVwbGFjZShyZV91dG9iLCBjYl91dG9iKTtcbiAgICB9O1xuICAgIHZhciBjYl9lbmNvZGUgPSBmdW5jdGlvbiAoY2NjKSB7XG4gICAgICAgIHZhciBwYWRsZW4gPSBbMCwgMiwgMV1bY2NjLmxlbmd0aCAlIDNdLCBvcmQgPSBjY2MuY2hhckNvZGVBdCgwKSA8PCAxNlxuICAgICAgICAgICAgfCAoKGNjYy5sZW5ndGggPiAxID8gY2NjLmNoYXJDb2RlQXQoMSkgOiAwKSA8PCA4KVxuICAgICAgICAgICAgfCAoKGNjYy5sZW5ndGggPiAyID8gY2NjLmNoYXJDb2RlQXQoMikgOiAwKSksIGNoYXJzID0gW1xuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KG9yZCA+Pj4gMTgpLFxuICAgICAgICAgICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICAgICAgICAgIHBhZGxlbiA+PSAyID8gJz0nIDogYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDYpICYgNjMpLFxuICAgICAgICAgICAgcGFkbGVuID49IDEgPyAnPScgOiBiNjRjaGFycy5jaGFyQXQob3JkICYgNjMpXG4gICAgICAgIF07XG4gICAgICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgICB9O1xuICAgIHZhciBidG9hID0gZ2xvYmFsLmJ0b2EgPyBmdW5jdGlvbiAoYikge1xuICAgICAgICByZXR1cm4gZ2xvYmFsLmJ0b2EoYik7XG4gICAgfSA6IGZ1bmN0aW9uIChiKSB7XG4gICAgICAgIHJldHVybiBiLnJlcGxhY2UoL1tcXHNcXFNdezEsM30vZywgY2JfZW5jb2RlKTtcbiAgICB9O1xuICAgIHZhciBfZW5jb2RlID0gZnVuY3Rpb24gKHUpIHtcbiAgICAgICAgdmFyIGlzVWludDhBcnJheSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh1KSA9PT0gJ1tvYmplY3QgVWludDhBcnJheV0nO1xuICAgICAgICByZXR1cm4gaXNVaW50OEFycmF5ID8gdS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgICAgIDogYnRvYSh1dG9iKFN0cmluZyh1KSkpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZSA9IGZ1bmN0aW9uICh1LCB1cmlzYWZlKSB7XG4gICAgICAgIHJldHVybiAhdXJpc2FmZVxuICAgICAgICAgICAgPyBfZW5jb2RlKHUpXG4gICAgICAgICAgICA6IF9lbmNvZGUoU3RyaW5nKHUpKS5yZXBsYWNlKC9bK1xcL10vZywgZnVuY3Rpb24gKG0wKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG0wID09ICcrJyA/ICctJyA6ICdfJztcbiAgICAgICAgICAgIH0pLnJlcGxhY2UoLz0vZywgJycpO1xuICAgIH07XG4gICAgdmFyIGVuY29kZVVSSSA9IGZ1bmN0aW9uICh1KSB7IHJldHVybiBlbmNvZGUodSwgdHJ1ZSk7IH07XG4gICAgLy8gZGVjb2RlciBzdHVmZlxuICAgIHZhciByZV9idG91ID0gL1tcXHhDMC1cXHhERl1bXFx4ODAtXFx4QkZdfFtcXHhFMC1cXHhFRl1bXFx4ODAtXFx4QkZdezJ9fFtcXHhGMC1cXHhGN11bXFx4ODAtXFx4QkZdezN9L2c7XG4gICAgdmFyIGNiX2J0b3UgPSBmdW5jdGlvbiAoY2NjYykge1xuICAgICAgICBzd2l0Y2ggKGNjY2MubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgdmFyIGNwID0gKCgweDA3ICYgY2NjYy5jaGFyQ29kZUF0KDApKSA8PCAxOClcbiAgICAgICAgICAgICAgICAgICAgfCAoKDB4M2YgJiBjY2NjLmNoYXJDb2RlQXQoMSkpIDw8IDEyKVxuICAgICAgICAgICAgICAgICAgICB8ICgoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgyKSkgPDwgNilcbiAgICAgICAgICAgICAgICAgICAgfCAoMHgzZiAmIGNjY2MuY2hhckNvZGVBdCgzKSksIG9mZnNldCA9IGNwIC0gMHgxMDAwMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGZyb21DaGFyQ29kZSgob2Zmc2V0ID4+PiAxMCkgKyAweEQ4MDApXG4gICAgICAgICAgICAgICAgICAgICsgZnJvbUNoYXJDb2RlKChvZmZzZXQgJiAweDNGRikgKyAweERDMDApKTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbUNoYXJDb2RlKCgoMHgwZiAmIGNjY2MuY2hhckNvZGVBdCgwKSkgPDwgMTIpXG4gICAgICAgICAgICAgICAgICAgIHwgKCgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDIpKSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tQ2hhckNvZGUoKCgweDFmICYgY2NjYy5jaGFyQ29kZUF0KDApKSA8PCA2KVxuICAgICAgICAgICAgICAgICAgICB8ICgweDNmICYgY2NjYy5jaGFyQ29kZUF0KDEpKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBidG91ID0gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgcmV0dXJuIGIucmVwbGFjZShyZV9idG91LCBjYl9idG91KTtcbiAgICB9O1xuICAgIHZhciBjYl9kZWNvZGUgPSBmdW5jdGlvbiAoY2NjYykge1xuICAgICAgICB2YXIgbGVuID0gY2NjYy5sZW5ndGgsIHBhZGxlbiA9IGxlbiAlIDQsIG4gPSAobGVuID4gMCA/IGI2NHRhYltjY2NjLmNoYXJBdCgwKV0gPDwgMTggOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMSA/IGI2NHRhYltjY2NjLmNoYXJBdCgxKV0gPDwgMTIgOiAwKVxuICAgICAgICAgICAgfCAobGVuID4gMiA/IGI2NHRhYltjY2NjLmNoYXJBdCgyKV0gPDwgNiA6IDApXG4gICAgICAgICAgICB8IChsZW4gPiAzID8gYjY0dGFiW2NjY2MuY2hhckF0KDMpXSA6IDApLCBjaGFycyA9IFtcbiAgICAgICAgICAgIGZyb21DaGFyQ29kZShuID4+PiAxNiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUoKG4gPj4+IDgpICYgMHhmZiksXG4gICAgICAgICAgICBmcm9tQ2hhckNvZGUobiAmIDB4ZmYpXG4gICAgICAgIF07XG4gICAgICAgIGNoYXJzLmxlbmd0aCAtPSBbMCwgMCwgMiwgMV1bcGFkbGVuXTtcbiAgICAgICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICAgIH07XG4gICAgdmFyIF9hdG9iID0gZ2xvYmFsLmF0b2IgPyBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsLmF0b2IoYSk7XG4gICAgfSA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBhLnJlcGxhY2UoL1xcU3sxLDR9L2csIGNiX2RlY29kZSk7XG4gICAgfTtcbiAgICB2YXIgYXRvYiA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBfYXRvYihTdHJpbmcoYSkucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9dL2csICcnKSk7XG4gICAgfTtcbiAgICB2YXIgX2RlY29kZSA9IGJ1ZmZlciA/XG4gICAgICAgIGJ1ZmZlci5mcm9tICYmIFVpbnQ4QXJyYXkgJiYgYnVmZmVyLmZyb20gIT09IFVpbnQ4QXJyYXkuZnJvbVxuICAgICAgICAgICAgPyBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoYS5jb25zdHJ1Y3RvciA9PT0gYnVmZmVyLmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgICAgID8gYSA6IGJ1ZmZlci5mcm9tKGEsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGEuY29uc3RydWN0b3IgPT09IGJ1ZmZlci5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICAgICA/IGEgOiBuZXcgYnVmZmVyKGEsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYnRvdShfYXRvYihhKSk7IH07XG4gICAgdmFyIGRlY29kZSA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBfZGVjb2RlKFN0cmluZyhhKS5yZXBsYWNlKC9bLV9dL2csIGZ1bmN0aW9uIChtMCkgeyByZXR1cm4gbTAgPT0gJy0nID8gJysnIDogJy8nOyB9KVxuICAgICAgICAgICAgLnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXS9nLCAnJykpO1xuICAgIH07XG4gICAgdmFyIG5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBCYXNlNjQgPSBnbG9iYWwuQmFzZTY0O1xuICAgICAgICBnbG9iYWwuQmFzZTY0ID0gX0Jhc2U2NDtcbiAgICAgICAgcmV0dXJuIEJhc2U2NDtcbiAgICB9O1xuICAgIC8vIGV4cG9ydCBCYXNlNjRcbiAgICBnbG9iYWwuQmFzZTY0ID0ge1xuICAgICAgICBWRVJTSU9OOiB2ZXJzaW9uLFxuICAgICAgICBhdG9iOiBhdG9iLFxuICAgICAgICBidG9hOiBidG9hLFxuICAgICAgICBmcm9tQmFzZTY0OiBkZWNvZGUsXG4gICAgICAgIHRvQmFzZTY0OiBlbmNvZGUsXG4gICAgICAgIHV0b2I6IHV0b2IsXG4gICAgICAgIGVuY29kZTogZW5jb2RlLFxuICAgICAgICBlbmNvZGVVUkk6IGVuY29kZVVSSSxcbiAgICAgICAgYnRvdTogYnRvdSxcbiAgICAgICAgZGVjb2RlOiBkZWNvZGUsXG4gICAgICAgIG5vQ29uZmxpY3Q6IG5vQ29uZmxpY3QsXG4gICAgICAgIF9fYnVmZmVyX186IGJ1ZmZlclxuICAgIH07XG4gICAgLy8gaWYgRVM1IGlzIGF2YWlsYWJsZSwgbWFrZSBCYXNlNjQuZXh0ZW5kU3RyaW5nKCkgYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIG5vRW51bSA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogdiwgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfTtcbiAgICAgICAgfTtcbiAgICAgICAgZ2xvYmFsLkJhc2U2NC5leHRlbmRTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RyaW5nLnByb3RvdHlwZSwgJ2Zyb21CYXNlNjQnLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGUodGhpcyk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RyaW5nLnByb3RvdHlwZSwgJ3RvQmFzZTY0Jywgbm9FbnVtKGZ1bmN0aW9uICh1cmlzYWZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZSh0aGlzLCB1cmlzYWZlKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHJpbmcucHJvdG90eXBlLCAndG9CYXNlNjRVUkknLCBub0VudW0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbmNvZGUodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIHRoYXQncyBpdCFcbiAgICByZXR1cm4gZ2xvYmFsLkJhc2U2NDtcbn0pKCk7XG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgaW50byBhIGJhc2UgNjQuXG4gKi9cbmZ1bmN0aW9uIGJhc2U2NGVuY29kZShzdHIpIHtcbiAgICByZXR1cm4gQmFzZTY0LmVuY29kZShzdHIpO1xufVxuZXhwb3J0cy5iYXNlNjRlbmNvZGUgPSBiYXNlNjRlbmNvZGU7XG4vKipcbiAqIERlY29kZSBhIGJhc2UgNjQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlNjRkZWNvZGUoc3RyKSB7XG4gICAgcmV0dXJuIEJhc2U2NC5kZWNvZGUoc3RyKTtcbn1cbmV4cG9ydHMuYmFzZTY0ZGVjb2RlID0gYmFzZTY0ZGVjb2RlO1xuLyoqXG4gKiBFbmNvZGUgYSBzdHJpbmcgaW50byBiYXNlIDY0IGFuZCByZXBsYWNlIHVybCB1bnNhZmUgY2hhcmFjdGVycy5cbiAqL1xuZnVuY3Rpb24gYmFzZTY0ZW5jb2RlVXJsU2FmZShzdHIpIHtcbiAgICByZXR1cm4gQmFzZTY0LmVuY29kZVVSSShzdHIpO1xufVxuZXhwb3J0cy5iYXNlNjRlbmNvZGVVcmxTYWZlID0gYmFzZTY0ZW5jb2RlVXJsU2FmZTtcbi8qKlxuICogRGVjb2RlIGEgc3RyaW5nIGVuY29kZWQgd2l0aCBiYXNlNjRlbmNvZGVVcmxTYWZlLlxuICovXG5mdW5jdGlvbiBiYXNlNjRkZWNvZGVVcmxTYWZlKHN0cikge1xuICAgIHJldHVybiBCYXNlNjQuZGVjb2RlKHN0cik7XG59XG5leHBvcnRzLmJhc2U2NGRlY29kZVVybFNhZmUgPSBiYXNlNjRkZWNvZGVVcmxTYWZlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5yZXF1aXJlKFwiLi9kYXRlLmV4dGVuc2lvbnNcIik7XG5yZXF1aXJlKFwiLi9vYmplY3QuZXh0ZW5zaW9uc1wiKTtcbnJlcXVpcmUoXCIuL3N0cmluZy5leHRlbnNpb25zXCIpO1xuIiwiZnVuY3Rpb24gdHdvRGlnaXRzKGQpIHtcbiAgICBpZiAoMCA8PSBkICYmIGQgPCAxMClcbiAgICAgICAgcmV0dXJuIFwiMFwiICsgZC50b1N0cmluZygpO1xuICAgIGlmICgtMTAgPCBkICYmIGQgPCAwKVxuICAgICAgICByZXR1cm4gXCItMFwiICsgKC0xICogZCkudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gZC50b1N0cmluZygpO1xufVxuLyoqXG4gKiBBZGQgdG8gY2FwYWJpbGl0eSB0byBleHBvcnQgYSBuYXRpdmUgSlMgZGF0ZSBpbnRvIGEgZGF0ZXRpbWUgc3RyaW5nLlxuICovXG5EYXRlLnByb3RvdHlwZS50b1VUQ0RhdGVUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFVUQ0Z1bGxZZWFyKCkgKyBcIi1cIiArXG4gICAgICAgIHR3b0RpZ2l0cygxICsgdGhpcy5nZXRVVENNb250aCgpKSArIFwiLVwiICtcbiAgICAgICAgdHdvRGlnaXRzKHRoaXMuZ2V0VVRDRGF0ZSgpKSArIFwiIFwiICtcbiAgICAgICAgdHdvRGlnaXRzKHRoaXMuZ2V0VVRDSG91cnMoKSkgKyBcIjpcIiArXG4gICAgICAgIHR3b0RpZ2l0cyh0aGlzLmdldFVUQ01pbnV0ZXMoKSkgKyBcIjpcIiArXG4gICAgICAgIHR3b0RpZ2l0cyh0aGlzLmdldFVUQ1NlY29uZHMoKSk7XG59O1xuLyoqXG4gKiBBZGQgdG8gY2FwYWJpbGl0eSB0byBleHBvcnQgYSBuYXRpdmUgSlMgZGF0ZSBpbnRvIGEgZGF0ZXRpbWUgc3RyaW5nLlxuICovXG5EYXRlLnByb3RvdHlwZS50b0RhdGVUaW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bGxZZWFyKCkgKyBcIi1cIiArXG4gICAgICAgIHR3b0RpZ2l0cygxICsgdGhpcy5nZXRNb250aCgpKSArIFwiLVwiICtcbiAgICAgICAgdHdvRGlnaXRzKHRoaXMuZ2V0RGF0ZSgpKSArIFwiIFwiICtcbiAgICAgICAgdHdvRGlnaXRzKHRoaXMuZ2V0SG91cnMoKSkgKyBcIjpcIiArXG4gICAgICAgIHR3b0RpZ2l0cyh0aGlzLmdldE1pbnV0ZXMoKSkgKyBcIjpcIiArXG4gICAgICAgIHR3b0RpZ2l0cyh0aGlzLmdldFNlY29uZHMoKSk7XG59O1xuIiwiLyoqXG4gKiBFeHRlbnNpb25zIG9mIHRoZSBPYmplY3QgaW50ZXJmYWNlLlxuICogSGVyZSBhcmUgcmVncm91cGVkIGFsbCB1dGlsaXRpZXMgZGlyZWN0bHkgaW50ZWdyYXRlZCB0byB0aGUgT2JqZWN0IHByb3RvdHlwZS5cbiAqXG4gKiBEbyBOT1QgcHV0IGV4cG9ydCBmdW5jdGlvbiBoZXJlLlxuICovXG5pZiAoIU9iamVjdC5rZXlzKSB7XG4gICAgT2JqZWN0LmtleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAga2V5cy5wdXNoKGspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG59XG4iLCIvKipcbiAqIEV4dGVuc2lvbnMgb2YgdGhlIFN0cmluZyBpbnRlcmZhY2UuXG4gKiBIZXJlIGFyZSByZWdyb3VwZWQgYWxsIHN0cmluZyB1dGlsaXRpZXMgZGlyZWN0bHkgaW50ZWdyYXRlZCB0byB0aGUgU3RyaW5nIHByb3RvdHlwZS5cbiAqXG4gKiBEbyBOT1QgcHV0IGV4cG9ydCBmdW5jdGlvbiBoZXJlLlxuICovXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXG4vKipcbiAqIFNpbXBsZSBzdHJpbmcgZm9ybWF0IGZ1bmN0aW9uLlxuICpcbiAqIFwie30ge31cIi5mb3JtYXQoXCJhXCIsIFwiYlwiKSA9PiBcImEgYlwiXG4gKiBcInsxfSB7MH1cIi5mb3JtYXQoXCJhXCIsIFwiYlwiKSA9PiBcImIgYVwiXG4gKiBcIntmb299IHtiYXJ9XCIuZm9ybWF0KHsgZm9vOiBcImFcIiwgYmFyOiBcImJcIiB9KSA9PiBcImEgYlwiXG4gKlxuICogQHBhcmFtIHsuLi5hbnl9IHBhcmFtc1xuICpcbiAqIEByZXR1cm5zIHN0cmluZ1xuICovXG5TdHJpbmcucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGFyYW1zID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgcGFyYW1zW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBhcmdOdW0gPSAwO1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL1xceyhcXHcqKVxcfS9naSwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgIHZhciBjdXJBcmdOdW07XG4gICAgICAgIHZhciBwcm9wID0gbnVsbDtcbiAgICAgICAgaWYgKG1hdGNoID09PSBcInt9XCIpIHtcbiAgICAgICAgICAgIGN1ckFyZ051bSA9IGFyZ051bTtcbiAgICAgICAgICAgIGFyZ051bSsrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY3VyQXJnTnVtID0gbWF0Y2guc3Vic3RyKDEsIG1hdGNoLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgdmFyIHBhcnNlZCA9IH5+Y3VyQXJnTnVtO1xuICAgICAgICAgICAgaWYgKHBhcnNlZC50b1N0cmluZygpID09PSBjdXJBcmdOdW0pIHtcbiAgICAgICAgICAgICAgICBjdXJBcmdOdW0gPSBwYXJzZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9wID0gY3VyQXJnTnVtO1xuICAgICAgICAgICAgICAgIGN1ckFyZ051bSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1ckFyZ051bSA+PSBhcmdzLmxlbmd0aCA/IFwiXCIgOiBwcm9wID8gYXJnc1tjdXJBcmdOdW1dW3Byb3BdIHx8IFwiXCIgOiBhcmdzW2N1ckFyZ051bV07XG4gICAgfSk7XG59O1xuLyogdHNsaW50OmVuYWJsZTpuby1iaXR3aXNlICovXG5pZiAoIVN0cmluZy5wcm90b3R5cGUudHJpbSkge1xuICAgIFN0cmluZy5wcm90b3R5cGUudHJpbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csICcnKTtcbiAgICB9O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIE1kNSBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBhdXRob3IgSm9zZXBoIE15ZXJzXG4gKlxuICogQGxpbmsgaHR0cDovL3d3dy5teWVyc2RhaWx5Lm9yZy9qb3NlcGgvamF2YXNjcmlwdC9tZDUuanMxXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubWQ1ID0gdm9pZCAwO1xuLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSAqL1xuZnVuY3Rpb24gbWQ1Y3ljbGUoeCwgaykge1xuICAgIHZhciBhID0geFswXTtcbiAgICB2YXIgYiA9IHhbMV07XG4gICAgdmFyIGMgPSB4WzJdO1xuICAgIHZhciBkID0geFszXTtcbiAgICBhID0gZmYoYSwgYiwgYywgZCwga1swXSwgNywgLTY4MDg3NjkzNik7XG4gICAgZCA9IGZmKGQsIGEsIGIsIGMsIGtbMV0sIDEyLCAtMzg5NTY0NTg2KTtcbiAgICBjID0gZmYoYywgZCwgYSwgYiwga1syXSwgMTcsIDYwNjEwNTgxOSk7XG4gICAgYiA9IGZmKGIsIGMsIGQsIGEsIGtbM10sIDIyLCAtMTA0NDUyNTMzMCk7XG4gICAgYSA9IGZmKGEsIGIsIGMsIGQsIGtbNF0sIDcsIC0xNzY0MTg4OTcpO1xuICAgIGQgPSBmZihkLCBhLCBiLCBjLCBrWzVdLCAxMiwgMTIwMDA4MDQyNik7XG4gICAgYyA9IGZmKGMsIGQsIGEsIGIsIGtbNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XG4gICAgYiA9IGZmKGIsIGMsIGQsIGEsIGtbN10sIDIyLCAtNDU3MDU5ODMpO1xuICAgIGEgPSBmZihhLCBiLCBjLCBkLCBrWzhdLCA3LCAxNzcwMDM1NDE2KTtcbiAgICBkID0gZmYoZCwgYSwgYiwgYywga1s5XSwgMTIsIC0xOTU4NDE0NDE3KTtcbiAgICBjID0gZmYoYywgZCwgYSwgYiwga1sxMF0sIDE3LCAtNDIwNjMpO1xuICAgIGIgPSBmZihiLCBjLCBkLCBhLCBrWzExXSwgMjIsIC0xOTkwNDA0MTYyKTtcbiAgICBhID0gZmYoYSwgYiwgYywgZCwga1sxMl0sIDcsIDE4MDQ2MDM2ODIpO1xuICAgIGQgPSBmZihkLCBhLCBiLCBjLCBrWzEzXSwgMTIsIC00MDM0MTEwMSk7XG4gICAgYyA9IGZmKGMsIGQsIGEsIGIsIGtbMTRdLCAxNywgLTE1MDIwMDIyOTApO1xuICAgIGIgPSBmZihiLCBjLCBkLCBhLCBrWzE1XSwgMjIsIDEyMzY1MzUzMjkpO1xuICAgIGEgPSBnZyhhLCBiLCBjLCBkLCBrWzFdLCA1LCAtMTY1Nzk2NTEwKTtcbiAgICBkID0gZ2coZCwgYSwgYiwgYywga1s2XSwgOSwgLTEwNjk1MDE2MzIpO1xuICAgIGMgPSBnZyhjLCBkLCBhLCBiLCBrWzExXSwgMTQsIDY0MzcxNzcxMyk7XG4gICAgYiA9IGdnKGIsIGMsIGQsIGEsIGtbMF0sIDIwLCAtMzczODk3MzAyKTtcbiAgICBhID0gZ2coYSwgYiwgYywgZCwga1s1XSwgNSwgLTcwMTU1ODY5MSk7XG4gICAgZCA9IGdnKGQsIGEsIGIsIGMsIGtbMTBdLCA5LCAzODAxNjA4Myk7XG4gICAgYyA9IGdnKGMsIGQsIGEsIGIsIGtbMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XG4gICAgYiA9IGdnKGIsIGMsIGQsIGEsIGtbNF0sIDIwLCAtNDA1NTM3ODQ4KTtcbiAgICBhID0gZ2coYSwgYiwgYywgZCwga1s5XSwgNSwgNTY4NDQ2NDM4KTtcbiAgICBkID0gZ2coZCwgYSwgYiwgYywga1sxNF0sIDksIC0xMDE5ODAzNjkwKTtcbiAgICBjID0gZ2coYywgZCwgYSwgYiwga1szXSwgMTQsIC0xODczNjM5NjEpO1xuICAgIGIgPSBnZyhiLCBjLCBkLCBhLCBrWzhdLCAyMCwgMTE2MzUzMTUwMSk7XG4gICAgYSA9IGdnKGEsIGIsIGMsIGQsIGtbMTNdLCA1LCAtMTQ0NDY4MTQ2Nyk7XG4gICAgZCA9IGdnKGQsIGEsIGIsIGMsIGtbMl0sIDksIC01MTQwMzc4NCk7XG4gICAgYyA9IGdnKGMsIGQsIGEsIGIsIGtbN10sIDE0LCAxNzM1MzI4NDczKTtcbiAgICBiID0gZ2coYiwgYywgZCwgYSwga1sxMl0sIDIwLCAtMTkyNjYwNzczNCk7XG4gICAgYSA9IGhoKGEsIGIsIGMsIGQsIGtbNV0sIDQsIC0zNzg1NTgpO1xuICAgIGQgPSBoaChkLCBhLCBiLCBjLCBrWzhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xuICAgIGMgPSBoaChjLCBkLCBhLCBiLCBrWzExXSwgMTYsIDE4MzkwMzA1NjIpO1xuICAgIGIgPSBoaChiLCBjLCBkLCBhLCBrWzE0XSwgMjMsIC0zNTMwOTU1Nik7XG4gICAgYSA9IGhoKGEsIGIsIGMsIGQsIGtbMV0sIDQsIC0xNTMwOTkyMDYwKTtcbiAgICBkID0gaGgoZCwgYSwgYiwgYywga1s0XSwgMTEsIDEyNzI4OTMzNTMpO1xuICAgIGMgPSBoaChjLCBkLCBhLCBiLCBrWzddLCAxNiwgLTE1NTQ5NzYzMik7XG4gICAgYiA9IGhoKGIsIGMsIGQsIGEsIGtbMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xuICAgIGEgPSBoaChhLCBiLCBjLCBkLCBrWzEzXSwgNCwgNjgxMjc5MTc0KTtcbiAgICBkID0gaGgoZCwgYSwgYiwgYywga1swXSwgMTEsIC0zNTg1MzcyMjIpO1xuICAgIGMgPSBoaChjLCBkLCBhLCBiLCBrWzNdLCAxNiwgLTcyMjUyMTk3OSk7XG4gICAgYiA9IGhoKGIsIGMsIGQsIGEsIGtbNl0sIDIzLCA3NjAyOTE4OSk7XG4gICAgYSA9IGhoKGEsIGIsIGMsIGQsIGtbOV0sIDQsIC02NDAzNjQ0ODcpO1xuICAgIGQgPSBoaChkLCBhLCBiLCBjLCBrWzEyXSwgMTEsIC00MjE4MTU4MzUpO1xuICAgIGMgPSBoaChjLCBkLCBhLCBiLCBrWzE1XSwgMTYsIDUzMDc0MjUyMCk7XG4gICAgYiA9IGhoKGIsIGMsIGQsIGEsIGtbMl0sIDIzLCAtOTk1MzM4NjUxKTtcbiAgICBhID0gaWkoYSwgYiwgYywgZCwga1swXSwgNiwgLTE5ODYzMDg0NCk7XG4gICAgZCA9IGlpKGQsIGEsIGIsIGMsIGtbN10sIDEwLCAxMTI2ODkxNDE1KTtcbiAgICBjID0gaWkoYywgZCwgYSwgYiwga1sxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XG4gICAgYiA9IGlpKGIsIGMsIGQsIGEsIGtbNV0sIDIxLCAtNTc0MzQwNTUpO1xuICAgIGEgPSBpaShhLCBiLCBjLCBkLCBrWzEyXSwgNiwgMTcwMDQ4NTU3MSk7XG4gICAgZCA9IGlpKGQsIGEsIGIsIGMsIGtbM10sIDEwLCAtMTg5NDk4NjYwNik7XG4gICAgYyA9IGlpKGMsIGQsIGEsIGIsIGtbMTBdLCAxNSwgLTEwNTE1MjMpO1xuICAgIGIgPSBpaShiLCBjLCBkLCBhLCBrWzFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xuICAgIGEgPSBpaShhLCBiLCBjLCBkLCBrWzhdLCA2LCAxODczMzEzMzU5KTtcbiAgICBkID0gaWkoZCwgYSwgYiwgYywga1sxNV0sIDEwLCAtMzA2MTE3NDQpO1xuICAgIGMgPSBpaShjLCBkLCBhLCBiLCBrWzZdLCAxNSwgLTE1NjAxOTgzODApO1xuICAgIGIgPSBpaShiLCBjLCBkLCBhLCBrWzEzXSwgMjEsIDEzMDkxNTE2NDkpO1xuICAgIGEgPSBpaShhLCBiLCBjLCBkLCBrWzRdLCA2LCAtMTQ1NTIzMDcwKTtcbiAgICBkID0gaWkoZCwgYSwgYiwgYywga1sxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XG4gICAgYyA9IGlpKGMsIGQsIGEsIGIsIGtbMl0sIDE1LCA3MTg3ODcyNTkpO1xuICAgIGIgPSBpaShiLCBjLCBkLCBhLCBrWzldLCAyMSwgLTM0MzQ4NTU1MSk7XG4gICAgeFswXSA9IGFkZDMyKGEsIHhbMF0pO1xuICAgIHhbMV0gPSBhZGQzMihiLCB4WzFdKTtcbiAgICB4WzJdID0gYWRkMzIoYywgeFsyXSk7XG4gICAgeFszXSA9IGFkZDMyKGQsIHhbM10pO1xufVxuZnVuY3Rpb24gY21uKHEsIGEsIGIsIHgsIHMsIHQpIHtcbiAgICBhID0gYWRkMzIoYWRkMzIoYSwgcSksIGFkZDMyKHgsIHQpKTtcbiAgICByZXR1cm4gYWRkMzIoKGEgPDwgcykgfCAoYSA+Pj4gKDMyIC0gcykpLCBiKTtcbn1cbmZ1bmN0aW9uIGZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICByZXR1cm4gY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KTtcbn1cbmZ1bmN0aW9uIGdnKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICByZXR1cm4gY21uKChiICYgZCkgfCAoYyAmICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcbn1cbmZ1bmN0aW9uIGhoKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICByZXR1cm4gY21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XG59XG5mdW5jdGlvbiBpaShhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gICAgcmV0dXJuIGNtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdCk7XG59XG5mdW5jdGlvbiBtZDUxKHMpIHtcbiAgICB2YXIgbiA9IHMubGVuZ3RoO1xuICAgIHZhciBzdGF0ZSA9IFsxNzMyNTg0MTkzLCAtMjcxNzMzODc5LCAtMTczMjU4NDE5NCwgMjcxNzMzODc4XTtcbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSA2NDsgaSA8PSBzLmxlbmd0aDsgaSArPSA2NCkge1xuICAgICAgICBtZDVjeWNsZShzdGF0ZSwgbWQ1YmxrKHMuc3Vic3RyaW5nKGkgLSA2NCwgaSkpKTtcbiAgICB9XG4gICAgcyA9IHMuc3Vic3RyaW5nKGkgLSA2NCk7XG4gICAgdmFyIHRhaWwgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gICAgZm9yIChpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGFpbFtpID4+IDJdIHw9IHMuY2hhckNvZGVBdChpKSA8PCAoKGkgJSA0KSA8PCAzKTtcbiAgICB9XG4gICAgdGFpbFtpID4+IDJdIHw9IDB4ODAgPDwgKChpICUgNCkgPDwgMyk7XG4gICAgaWYgKGkgPiA1NSkge1xuICAgICAgICBtZDVjeWNsZShzdGF0ZSwgdGFpbCk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgICAgICB0YWlsW2ldID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0YWlsWzE0XSA9IG4gKiA4O1xuICAgIG1kNWN5Y2xlKHN0YXRlLCB0YWlsKTtcbiAgICByZXR1cm4gc3RhdGU7XG59XG4vKiB0aGVyZSBuZWVkcyB0byBiZSBzdXBwb3J0IGZvciBVbmljb2RlIGhlcmUsXG4gKiB1bmxlc3Mgd2UgcHJldGVuZCB0aGF0IHdlIGNhbiByZWRlZmluZSB0aGUgTUQtNVxuICogYWxnb3JpdGhtIGZvciBtdWx0aS1ieXRlIGNoYXJhY3RlcnMgKHBlcmhhcHNcbiAqIGJ5IGFkZGluZyBldmVyeSBmb3VyIDE2LWJpdCBjaGFyYWN0ZXJzIGFuZFxuICogc2hvcnRlbmluZyB0aGUgc3VtIHRvIDMyIGJpdHMpLiBPdGhlcndpc2VcbiAqIEkgc3VnZ2VzdCBwZXJmb3JtaW5nIE1ELTUgYXMgaWYgZXZlcnkgY2hhcmFjdGVyXG4gKiB3YXMgdHdvIGJ5dGVzLS1lLmcuLCAwMDQwIDAwMjUgPSBAJS0tYnV0IHRoZW5cbiAqIGhvdyB3aWxsIGFuIG9yZGluYXJ5IE1ELTUgc3VtIGJlIG1hdGNoZWQ/XG4gKiBUaGVyZSBpcyBubyB3YXkgdG8gc3RhbmRhcmRpemUgdGV4dCB0byBzb21ldGhpbmdcbiAqIGxpa2UgVVRGLTggYmVmb3JlIHRyYW5zZm9ybWF0aW9uOyBzcGVlZCBjb3N0IGlzXG4gKiB1dHRlcmx5IHByb2hpYml0aXZlLiBUaGUgSmF2YVNjcmlwdCBzdGFuZGFyZFxuICogaXRzZWxmIG5lZWRzIHRvIGxvb2sgYXQgdGhpczogaXQgc2hvdWxkIHN0YXJ0XG4gKiBwcm92aWRpbmcgYWNjZXNzIHRvIHN0cmluZ3MgYXMgcHJlZm9ybWVkIFVURi04XG4gKiA4LWJpdCB1bnNpZ25lZCB2YWx1ZSBhcnJheXMuXG4gKi9cbmZ1bmN0aW9uIG1kNWJsayhzKSB7XG4gICAgdmFyIG1kNWJsa3MgPSBbXTtcbiAgICB2YXIgaTsgLyogQW5keSBLaW5nIHNhaWQgZG8gaXQgdGhpcyB3YXkuICovXG4gICAgZm9yIChpID0gMDsgaSA8IDY0OyBpICs9IDQpIHtcbiAgICAgICAgbWQ1Ymxrc1tpID4+IDJdID0gcy5jaGFyQ29kZUF0KGkpXG4gICAgICAgICAgICArIChzLmNoYXJDb2RlQXQoaSArIDEpIDw8IDgpXG4gICAgICAgICAgICArIChzLmNoYXJDb2RlQXQoaSArIDIpIDw8IDE2KVxuICAgICAgICAgICAgKyAocy5jaGFyQ29kZUF0KGkgKyAzKSA8PCAyNCk7XG4gICAgfVxuICAgIHJldHVybiBtZDVibGtzO1xufVxudmFyIGhleF9jaHIgPSBcIjAxMjM0NTY3ODlhYmNkZWZcIi5zcGxpdChcIlwiKTtcbmZ1bmN0aW9uIHJoZXgobikge1xuICAgIHZhciBzID0gXCJcIjtcbiAgICB2YXIgaiA9IDA7XG4gICAgZm9yICg7IGogPCA0OyBqKyspIHtcbiAgICAgICAgcyArPSBoZXhfY2hyWyhuID4+IChqICogOCArIDQpKSAmIDB4MEZdXG4gICAgICAgICAgICArIGhleF9jaHJbKG4gPj4gKGogKiA4KSkgJiAweDBGXTtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG59XG5mdW5jdGlvbiBoZXgoeCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgICB4W2ldID0gcmhleCh4W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHguam9pbihcIlwiKTtcbn1cbi8qKlxuICogVGhlIGVudHJ5IHBvaW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICpcbiAqIEByZXR1cm5zIHthbnl9XG4gKi9cbmZ1bmN0aW9uIG1kNShpbnB1dCkge1xuICAgIHJldHVybiBoZXgobWQ1MShpbnB1dCkpO1xufVxuZXhwb3J0cy5tZDUgPSBtZDU7XG4vKiB0aGlzIGZ1bmN0aW9uIGlzIG11Y2ggZmFzdGVyLFxuc28gaWYgcG9zc2libGUgd2UgdXNlIGl0LiBTb21lIElFc1xuYXJlIHRoZSBvbmx5IG9uZXMgSSBrbm93IG9mIHRoYXRcbm5lZWQgdGhlIGlkaW90aWMgc2Vjb25kIGZ1bmN0aW9uLFxuZ2VuZXJhdGVkIGJ5IGFuIGlmIGNsYXVzZS4gICovXG5mdW5jdGlvbiBhZGQzMihhLCBiKSB7XG4gICAgcmV0dXJuIChhICsgYikgJiAweEZGRkZGRkZGO1xufVxuLy9cbi8vIERpc2FibGVkIGJlY2F1c2UgdHlwZXNjcmlwdCBkb2Vzbid0IGFsbG93IGZ1bmN0aW9uIGRlY2xhcmF0aW9uIGluIGEgYmxvY2suXG4vL1xuLy8gaWYgKG1kNShcImhlbGxvXCIpICE9PSBcIjVkNDE0MDJhYmM0YjJhNzZiOTcxOWQ5MTEwMTdjNTkyXCIpIHtcbi8vICAgICBmdW5jdGlvbiBhZGQzMih4LCB5KSB7XG4vLyAgICAgICAgIGNvbnN0IGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKTtcbi8vICAgICAgICAgY29uc3QgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4vLyAgICAgICAgIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xuLy8gICAgIH1cbi8vIH1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5mbGF0dGVuID0gZXhwb3J0cy5wcmVwYXJlT2JqZWN0Rm9yRHVtcCA9IGV4cG9ydHMucmVwbGFjZVN0cmluZ1ZhcmlhYmxlcyA9IGV4cG9ydHMuYWRkVG9PYmplY3RJZkRlZmluZWQgPSBleHBvcnRzLmdldFZhbHVlSW5PYmplY3QgPSBleHBvcnRzLmdlbmVyYXRlSGFzaERhdGEgPSBleHBvcnRzLmdlbmVyYXRlT2JqZWN0SGFzaCA9IGV4cG9ydHMuY2xvbmVPYmplY3RXaXRoTWFzayA9IGV4cG9ydHMubWVyZ2UgPSBleHBvcnRzLmNsb25lRGVlcCA9IGV4cG9ydHMuZXh0ZW5kID0gZXhwb3J0cy5hcmVTYW1lID0gZXhwb3J0cy5hcmVTYW1lT2JqZWN0cyA9IGV4cG9ydHMuY29tcGFyZU9iamVjdHMgPSBleHBvcnRzLmdldFN5bWJvbERlc2NyaXB0aW9uID0gZXhwb3J0cy5nZXRPYmplY3RWYWx1ZSA9IGV4cG9ydHMuZ2V0T2JqZWN0VmFsdWVBc09iamVjdCA9IGV4cG9ydHMuZ2V0T2JqZWN0VmFsdWVBc0FycmF5ID0gZXhwb3J0cy5nZXRPYmplY3RWYWx1ZUFzQm9vbGVhbiA9IGV4cG9ydHMuZ2V0T2JqZWN0VmFsdWVBc051bWJlciA9IGV4cG9ydHMuZ2V0T2JqZWN0VmFsdWVBc1N0cmluZyA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIGxvZGFzaENsb25lRGVlcCA9IHJlcXVpcmUoXCJsb2Rhc2gvY2xvbmVEZWVwXCIpO1xudmFyIG1kNV8xID0gcmVxdWlyZShcIi4vbWQ1XCIpO1xudmFyIHN0cmluZ18xID0gcmVxdWlyZShcIi4vc3RyaW5nXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciB1dGlsc18yID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG4vKipcbiAqIEV4dHJhY3QgYSB2YWx1ZSBmcm9tIGFuIG9iamVjdCBhbmQgZW5zdXJlIGl0IGlzIGEgc3RyaW5nLlxuICogSWYgdGhlIGtleSBpcyBub3QgZm91bmQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIHJldHVybmVkLlxuICovXG5mdW5jdGlvbiBnZXRPYmplY3RWYWx1ZUFzU3RyaW5nKGRhdGEsIGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIHV0aWxzXzEuZW5zdXJlU3RyaW5nKGdldE9iamVjdFZhbHVlKGRhdGEsIGtleSwgZGVmYXVsdFZhbHVlKSk7XG59XG5leHBvcnRzLmdldE9iamVjdFZhbHVlQXNTdHJpbmcgPSBnZXRPYmplY3RWYWx1ZUFzU3RyaW5nO1xuLyoqXG4gKiBFeHRyYWN0IGEgdmFsdWUgZnJvbSBhbiBvYmplY3QgYW5kIGVuc3VyZSBpdCBpcyBhIHZhbGlkIG51bWJlci5cbiAqIElmIHRoZSBrZXkgaXMgbm90IGZvdW5kLCB0aGUgZGVmYXVsdCB2YWx1ZSBpcyByZXR1cm5lZC5cbiAqL1xuZnVuY3Rpb24gZ2V0T2JqZWN0VmFsdWVBc051bWJlcihkYXRhLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiB1dGlsc18xLmVuc3VyZU51bWJlcihnZXRPYmplY3RWYWx1ZShkYXRhLCBrZXksIGRlZmF1bHRWYWx1ZSkpO1xufVxuZXhwb3J0cy5nZXRPYmplY3RWYWx1ZUFzTnVtYmVyID0gZ2V0T2JqZWN0VmFsdWVBc051bWJlcjtcbi8qKlxuICogRXh0cmFjdCBhIHZhbHVlIGZyb20gYW4gb2JqZWN0IGFuZCBlbnN1cmUgaXQgaXMgYSBib29sZWFuLlxuICogSWYgdGhlIGtleSBpcyBub3QgZm91bmQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIHJldHVybmVkLlxuICovXG5mdW5jdGlvbiBnZXRPYmplY3RWYWx1ZUFzQm9vbGVhbihkYXRhLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHZvaWQgMCkgeyBkZWZhdWx0VmFsdWUgPSBmYWxzZTsgfVxuICAgIHJldHVybiB1dGlsc18xLmVuc3VyZUJvb2xlYW4oZ2V0T2JqZWN0VmFsdWUoZGF0YSwga2V5LCBkZWZhdWx0VmFsdWUpKTtcbn1cbmV4cG9ydHMuZ2V0T2JqZWN0VmFsdWVBc0Jvb2xlYW4gPSBnZXRPYmplY3RWYWx1ZUFzQm9vbGVhbjtcbi8qKlxuICogRXh0cmFjdCBhIHZhbHVlIGZyb20gYW4gb2JqZWN0IGFuZCBlbnN1cmUgaXQgaXMgYW4gYXJyYXkuXG4gKiBJZiB0aGUga2V5IGlzIG5vdCBmb3VuZCwgdGhlIGRlZmF1bHQgdmFsdWUgaXMgcmV0dXJuZWQuXG4gKi9cbmZ1bmN0aW9uIGdldE9iamVjdFZhbHVlQXNBcnJheShkYXRhLCBrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHZvaWQgMCkgeyBkZWZhdWx0VmFsdWUgPSBbXTsgfVxuICAgIHJldHVybiB1dGlsc18xLmVuc3VyZUFycmF5KGdldE9iamVjdFZhbHVlKGRhdGEsIGtleSwgZGVmYXVsdFZhbHVlKSk7XG59XG5leHBvcnRzLmdldE9iamVjdFZhbHVlQXNBcnJheSA9IGdldE9iamVjdFZhbHVlQXNBcnJheTtcbi8qKlxuICogRXh0cmFjdCBhIHZhbHVlIGZyb20gYW4gb2JqZWN0IGFuZCBlbnN1cmUgaXQgaXMgYW4gb2JqZWN0LlxuICogSWYgdGhlIGtleSBpcyBub3QgZm91bmQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIHJldHVybmVkLlxuICovXG5mdW5jdGlvbiBnZXRPYmplY3RWYWx1ZUFzT2JqZWN0KGRhdGEsIGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdm9pZCAwKSB7IGRlZmF1bHRWYWx1ZSA9IG51bGw7IH1cbiAgICByZXR1cm4gdXRpbHNfMS5lbnN1cmVPYmplY3QoZ2V0T2JqZWN0VmFsdWUoZGF0YSwga2V5LCBkZWZhdWx0VmFsdWUpKTtcbn1cbmV4cG9ydHMuZ2V0T2JqZWN0VmFsdWVBc09iamVjdCA9IGdldE9iamVjdFZhbHVlQXNPYmplY3Q7XG4vKipcbiAqIFRyeSB0byBnZXQgYSB2YWx1ZSBmcm9tIGFuIG9iamVjdCBhbmQgcmV0dXJucyBhIGRlZmF1bHQgdmFsdWUgaWYgbm90IGZvdW5kLlxuICogVGhlIFwia2V5XCIgcGFyYW1ldGVyIGNhbiBiZSBhbiBhcnJheSBmb3IgbXVsdGktZGltZW5zaW9uYWwgc2VhcmNoLlxuICogWW91IGNhbiBhbHNvIHdyaXRlIGl0IGFzIGEgc3RyaW5nIHNlcGFyYXRlZCB3aXRoIFwiLT5cIi5cbiAqL1xuZnVuY3Rpb24gZ2V0T2JqZWN0VmFsdWUoZGF0YSwga2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAoZGVmYXVsdFZhbHVlID09PSB2b2lkIDApIHsgZGVmYXVsdFZhbHVlID0gbnVsbDsgfVxuICAgIGlmICghdXRpbHNfMS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAga2V5ID0ga2V5LnNwbGl0KFwiLT5cIik7XG4gICAgfVxuICAgIHZhciBjb250YWluZXIgPSBkYXRhO1xuICAgIGZvciAodmFyIF9pID0gMCwga2V5XzEgPSBrZXk7IF9pIDwga2V5XzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0ga2V5XzFbX2ldO1xuICAgICAgICBpZiAoIXV0aWxzXzIuaXNPYmplY3QoY29udGFpbmVyKSB8fCB1dGlsc18yLmlzVW5kZWZpbmVkKGNvbnRhaW5lcltpdGVtXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29udGFpbmVyID0gY29udGFpbmVyW2l0ZW1dO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuZXhwb3J0cy5nZXRPYmplY3RWYWx1ZSA9IGdldE9iamVjdFZhbHVlO1xuLyoqXG4gKiBHZXRzIHRoZSBkZXNjcmlwdGlvbiBzdHJpbmcgb2YgYSBzeW1ib2wuXG4gKi9cbmZ1bmN0aW9uIGdldFN5bWJvbERlc2NyaXB0aW9uKHN5bWJvbCkge1xuICAgIHZhciByZWdFeHAgPSAvXFwoKFteKV0rKVxcKS87XG4gICAgdmFyIG5hbWVzID0gcmVnRXhwLmV4ZWMoc3ltYm9sLnRvU3RyaW5nKCkpIHx8IFtdO1xuICAgIHJldHVybiBuYW1lc1sxXTtcbn1cbmV4cG9ydHMuZ2V0U3ltYm9sRGVzY3JpcHRpb24gPSBnZXRTeW1ib2xEZXNjcmlwdGlvbjtcbi8qKlxuICogQ29tcGFyZXMgdHdvIG9iamVjdHMgYW5kIHJldHVybnMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGVtLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSAgYVxuICogQHBhcmFtIHtvYmplY3R9ICBiXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGtlZXBCb3RoVmFsdWVzIChvcHRpb25hbCwgZGVmYXVsdDogZmFsc2UpIGlmIHRydWUsIGZvciBlYWNoIGRpZmZlcmVuY2UgdGhlIG9sZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSBpcyBzdG9yZWQgYXMgYSBcImJlZm9yZVwiIGtleSBhbmQgdGhlIG5ldyB2YWx1ZSBhcyBhIFwiYWZ0ZXJcIiBrZXkuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZhbHNlLCBvbmx5IHRoZSBuZXcgdmFsdWUgaXMgcmV0dXJuZWQgd2l0aCBubyBhZGRpdGlvbmFsIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVPYmplY3RzKGEsIGIsIGtlZXBCb3RoVmFsdWVzKSB7XG4gICAgaWYgKGtlZXBCb3RoVmFsdWVzID09PSB2b2lkIDApIHsga2VlcEJvdGhWYWx1ZXMgPSBmYWxzZTsgfVxuICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICBpZiAoIXV0aWxzXzIuaXNPYmplY3QoYSkgfHwgIXV0aWxzXzIuaXNPYmplY3QoYikpIHtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgaWYgKCFhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2YWx1ZSA9IGFba2V5XTtcbiAgICAgICAgaWYgKCF1dGlsc18yLmlzVW5kZWZpbmVkKGJba2V5XSkpIHtcbiAgICAgICAgICAgIGlmICh1dGlsc18yLmlzT2JqZWN0KHZhbHVlKSAmJiB1dGlsc18yLmlzT2JqZWN0KGJba2V5XSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3ViT3V0cHV0ID0gY29tcGFyZU9iamVjdHModmFsdWUsIGJba2V5XSwga2VlcEJvdGhWYWx1ZXMpO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhzdWJPdXRwdXQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBzdWJPdXRwdXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgIT09IGJba2V5XSkge1xuICAgICAgICAgICAgICAgIGlmIChrZWVwQm90aFZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRba2V5XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGE6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYjogYltrZXldLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBiW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHV0aWxzXzIuaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBJbiB0aGlzIGNhc2UgYm90aCBhIGFuZCBiIGFyZSBcInVuZGVmaW5lZFwiLCBzbyB0aGVyZSBpcyBubyBkaWZmZXJlbmNlIGFmdGVyIGFsbC5cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtlZXBCb3RoVmFsdWVzKSB7XG4gICAgICAgICAgICBvdXRwdXRba2V5XSA9IHtcbiAgICAgICAgICAgICAgICBhOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBiOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0W2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICAgICAgaWYgKCFiLmhhc093blByb3BlcnR5KGtleSkgfHwgIXV0aWxzXzIuaXNVbmRlZmluZWQoYVtrZXldKSB8fCB1dGlsc18yLmlzVW5kZWZpbmVkKGJba2V5XSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZWVwQm90aFZhbHVlcykge1xuICAgICAgICAgICAgb3V0cHV0W2tleV0gPSB7XG4gICAgICAgICAgICAgICAgYTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGI6IGJba2V5XSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXRba2V5XSA9IGJba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuZXhwb3J0cy5jb21wYXJlT2JqZWN0cyA9IGNvbXBhcmVPYmplY3RzO1xuLyoqXG4gKiBNYWtlIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIG9iamVjdHMgdG8gc2VlIGlmIHRoZXkgYXJlIHRoZSBzYW1lLlxuICovXG5mdW5jdGlvbiBhcmVTYW1lT2JqZWN0cyhhLCBiKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbXBhcmVPYmplY3RzKGEsIGIpKS5sZW5ndGggPT09IDA7XG59XG5leHBvcnRzLmFyZVNhbWVPYmplY3RzID0gYXJlU2FtZU9iamVjdHM7XG4vKipcbiAqIENvbXBhcmUgdHdvIHZhcmlhYmxlcyBmb3IgZXF1YWxpdHkuXG4gKi9cbmZ1bmN0aW9uIGFyZVNhbWUoYSwgYikge1xuICAgIGlmICh0eXBlb2YgKGEpICE9PSB0eXBlb2YgKGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHV0aWxzXzIuaXNPYmplY3QoYSkpIHtcbiAgICAgICAgcmV0dXJuIGFyZVNhbWVPYmplY3RzKGEsIGIpO1xuICAgIH1cbiAgICByZXR1cm4gYSA9PT0gYjtcbn1cbmV4cG9ydHMuYXJlU2FtZSA9IGFyZVNhbWU7XG4vKipcbiAqIENvcHkgdmFsdWVzIGZyb20gb2JqcyBpbnRvIGRzdCwgb3B0aW9uYWxseSByZWN1cnNpdmVseS5cbiAqIFByb21pc2VzIGFyZSBjb3BpZWQgYXMgaXMsIHNvIHRoZXkgd2lsbCBiZSBzaGFyZWQgYmV0d2VlbiBkc3QgYW5kIG9ianMuXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChkc3QsIG9ianMsIGRlZXApIHtcbiAgICBpZiAoZGVlcCA9PT0gdm9pZCAwKSB7IGRlZXAgPSB0cnVlOyB9XG4gICAgaWYgKCF1dGlsc18xLmlzQXJyYXkob2JqcykpIHtcbiAgICAgICAgb2JqcyA9IFtvYmpzXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGlpID0gb2Jqcy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgIHZhciBvYmogPSBvYmpzW2ldO1xuICAgICAgICBpZiAoIXV0aWxzXzIuaXNPYmplY3Qob2JqKSAmJiAhdXRpbHNfMi5pc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpqID0ga2V5cy5sZW5ndGg7IGogPCBqajsgaisrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tqXTtcbiAgICAgICAgICAgIHZhciBzcmMgPSBvYmpba2V5XTtcbiAgICAgICAgICAgIGlmIChkZWVwICYmIHV0aWxzXzIuaXNPYmplY3Qoc3JjKSkge1xuICAgICAgICAgICAgICAgIGlmICh1dGlsc18xLmlzRGF0ZShzcmMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRzdFtrZXldID0gbmV3IERhdGUoc3JjLnZhbHVlT2YoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHV0aWxzXzIuaXNSZWdFeHAoc3JjKSkge1xuICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IG5ldyBSZWdFeHAoc3JjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc3JjLm5vZGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGRzdFtrZXldID0gc3JjLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodXRpbHNfMi5pc0VsZW1lbnQoc3JjKSkge1xuICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyYy5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh1dGlsc18yLmlzUHJvbWlzZUxpa2Uoc3JjKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEbyBub3RoaW5nIGluIGNhc2UgaXQncyBhIHByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgZHN0W2tleV0gPSBzcmM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNhciA9IHV0aWxzXzEuaXNBcnJheShzcmMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXV0aWxzXzIuaXNPYmplY3QoZHN0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IGlzYXIgPyBbXSA6IHt9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc2FyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IGRzdFtrZXldLmNvbmNhdChzcmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5kKGRzdFtrZXldLCBbc3JjXSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkc3Rba2V5XSA9IHNyYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZHN0O1xufVxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGNsb25lIGEgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSkge1xuICAgIHJldHVybiBsb2Rhc2hDbG9uZURlZXAodmFsdWUpO1xufVxuZXhwb3J0cy5jbG9uZURlZXAgPSBjbG9uZURlZXA7XG4vKipcbiAqIFNhbWUgYXMgZXh0ZW5kLCBhIGNvcHkgcGFzdGUgZnJvbSBhbmd1bGFyIGJ1dCBjYWxscyBgZXh0ZW5kYCBpbnN0ZWFkIG9mIGBiYXNlRXh0ZW5kYCAoaW1wbGVtZW50YXRpb24gaW50ZXJuYWwgdG8gYW5ndWxhcikuXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKGRzdCkge1xuICAgIHZhciBzcmMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBzcmNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiBleHRlbmQoZHN0LCBzcmMsIHRydWUpO1xufVxuZXhwb3J0cy5tZXJnZSA9IG1lcmdlO1xuLyoqXG4gKiBNYWtlIGEgY2xvbmUgb2YgYW4gb2JqZWN0IGJhc2VkIG9uIG1hc2sgdGhhdCBkZXNjcmliZXMgd2hhdCBwcm9wZXJ0aWVzIHRvIGNsb25lIG9yIHRvIGlnbm9yZS5cbiAqXG4gKiBUaGUgbWFzayBtdXN0IGZvbGxvdyB0aGUgc3RydWN0dXJlIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUgd2l0aCBmZXcgZXhjZXB0aW9ucy5cbiAqIEZvciBleGFtcGxlIDpcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IHNvdXJjZSA9IHtcbiAqICAgICBkb2Nrczoge1xuICogICAgICAgICB0b3A6IHtcbiAqICAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICogICAgICAgICAgICAgbGVmdDoge1xuICogICAgICAgICAgICAgICAgIGlkOiAxXG4gKiAgICAgICAgICAgICAgICAgdGFiczogW1xuICogICAgICAgICAgICAgICAgICAgICB7aWQ6IDEsIGxhYmVsOiAnRmlyc3QgdGFiJ30sXG4gKiAgICAgICAgICAgICAgICAgICAgIHtpZDogMiwgbGFiZWw6ICdTZWNvbmQgdGFiJ31cbiAqICAgICAgICAgICAgICAgICBdXG4gKiAgICAgICAgICAgICB9LFxuICogICAgICAgICAgICAgcmlnaHQ6IHtcbiAqICAgICAgICAgICAgICAgICBpZDogMixcbiAqICAgICAgICAgICAgICAgICB0YWJzOiBbXG4gKiAgICAgICAgICAgICAgICAgICAgIHtpZDogMywgbGFiZWw6ICdUaGlyZCB0YWInfSxcbiAqICAgICAgICAgICAgICAgICAgICAge2lkOiA0LCBsYWJlbDogJ0ZvdXJ0aCB0YWInfVxuICogICAgICAgICAgICAgICAgIF1cbiAqICAgICAgICAgICAgIH1cbiAqICAgICAgICAgfSxcbiAqICAgICAgICAgbGVmdDoge1xuICogICAgICAgICAgICAgWy4uLl1cbiAqICAgICAgICAgfVxuICogICAgIH1cbiAqIH07XG4gKlxuICogY29uc3QgbWFzayA9IHtcbiAqICAgICBkb2Nrczoge1xuICogICAgICAgICAnKic6IHtcbiAqICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gKiAgICAgICAgICAgICBsZWZ0OiB7XG4gKiAgICAgICAgICAgICAgICAgdGFiczoge1xuICogICAgICAgICAgICAgICAgICAgICAnKic6IHtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0cnVlXG4gKiAgICAgICAgICAgICAgICAgICAgIH1cbiAqICAgICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgICB9LFxuICogICAgICAgICAgICAgcmlnaHQ6IHtcbiAqICAgICAgICAgICAgICAgICB0YWJzOiB0cnVlXG4gKiAgICAgICAgICAgICB9XG4gKiAgICAgICAgIH1cbiAqICAgICB9XG4gKiB9O1xuICogYGBgXG4gKlxuICogRm9yIGVhY2ggbGV2ZWwsIHlvdSBjYW4gZGVmaW5lIHdoaWNoIHByb3BlcnR5IHRvIGNvcHkgYnkgYWRkaW5nIGEga2V5IHdpdGggdGhlaXIgbmFtZS5cbiAqIE9yIHlvdSBjYW4gcHV0ICcqJyB0byB0ZWxsIHRvIGl0ZXJhdGUgdGhlIG9iamVjdCBvciBhcnJheSB0byBjb3B5IGFsbCB0aGUga2V5cy5cbiAqIFNldCBcInRydWVcIiBhcyB2YWx1ZSBpbiB0aGUgbWFzayBzaW1wbHkgYXNrIHRvIGNvcHkgZXZlcnl0aGluZyBmcm9tIHRoZXJlLlxuICpcbiAqIEluIHRoZSBleGFtcGxlIGFib3ZlLCB0aGUgcmVzdWx0aW5nIGNsb25lIHdpbGwgYmU6XG4gKlxuICogYGBgXG4gKiB7XG4gKiAgICAgZG9ja3M6IHtcbiAqICAgICAgICAgdG9wOiB7XG4gKiAgICAgICAgICAgICB2aXNpYmxlOiBmYWxzZSxcbiAqICAgICAgICAgICAgIGxlZnQ6IHtcbiAqICAgICAgICAgICAgICAgICB0YWJzOiBbXG4gKiAgICAgICAgICAgICAgICAgICAgIHtpZDogMX0sXG4gKiAgICAgICAgICAgICAgICAgICAgIHtpZDogMn1cbiAqICAgICAgICAgICAgICAgICBdXG4gKiAgICAgICAgICAgICB9LFxuICogICAgICAgICAgICAgcmlnaHQ6IHtcbiAqICAgICAgICAgICAgICAgICB0YWJzOiBbXG4gKiAgICAgICAgICAgICAgICAgICAgIHtpZDogMywgbGFiZWw6ICdUaGlyZCB0YWInfSxcbiAqICAgICAgICAgICAgICAgICAgICAge2lkOiA0LCBsYWJlbDogJ0ZvdXJ0aCB0YWInfVxuICogICAgICAgICAgICAgICAgIF1cbiAqICAgICAgICAgICAgIH1cbiAqICAgICAgICAgfSxcbiAqICAgICAgICAgbGVmdDoge1xuICogICAgICAgICAgICAgWy4uLl1cbiAqICAgICAgICAgfVxuICogICAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5mdW5jdGlvbiBjbG9uZU9iamVjdFdpdGhNYXNrKHNvdXJjZSwgbWFzaykge1xuICAgIHZhciBzb3VyY2VJc0FycmF5ID0gdXRpbHNfMS5pc0FycmF5KHNvdXJjZSk7XG4gICAgdmFyIGNsb25lID0gc291cmNlSXNBcnJheSA/IFtdIDoge307XG4gICAgaWYgKHV0aWxzXzIuaXNPYmplY3Qoc291cmNlKSkge1xuICAgICAgICBpZiAodXRpbHNfMi5pc09iamVjdChtYXNrLCB0cnVlKSkge1xuICAgICAgICAgICAgdmFyIG1hc2tLZXlzID0gT2JqZWN0LmtleXMobWFzayk7XG4gICAgICAgICAgICBpZiAobWFza0tleXMubGVuZ3RoID09PSAxICYmIG1hc2tLZXlzWzBdID09PSAnKicpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBrZXlzXzEgPSBrZXlzOyBfaSA8IGtleXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJhd0tleSA9IGtleXNfMVtfaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBzb3VyY2VJc0FycmF5ID8gTnVtYmVyKHJhd0tleSkgOiByYXdLZXk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1dGlsc18yLmlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gY2xvbmVPYmplY3RXaXRoTWFzayhzb3VyY2Vba2V5XSwgbWFza1snKiddKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtYXNrICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZUlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lW2tleV0gPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9uZS5wdXNoKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIF9iID0gT2JqZWN0LmtleXMobWFzayk7IF9hIDwgX2IubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfYltfYV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh1dGlsc18yLmlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmVba2V5XSA9IGNsb25lT2JqZWN0V2l0aE1hc2soc291cmNlW2tleV0sIG1hc2tba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobWFzayAhPT0gZmFsc2UgJiYgIXV0aWxzXzIuaXNVbmRlZmluZWQoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9uZVtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobWFzayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNsb25lRGVlcChzb3VyY2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIH1cbiAgICByZXR1cm4gY2xvbmU7XG59XG5leHBvcnRzLmNsb25lT2JqZWN0V2l0aE1hc2sgPSBjbG9uZU9iamVjdFdpdGhNYXNrO1xuLyoqXG4gKiBHZW5lcmF0ZXMgYSB1bmlxdWUgaGFzaCBmb3IgYW4gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZU9iamVjdEhhc2goZGF0YSkge1xuICAgIHJldHVybiBtZDVfMS5tZDUoSlNPTi5zdHJpbmdpZnkoZ2VuZXJhdGVIYXNoRGF0YShkYXRhKSkpO1xufVxuZXhwb3J0cy5nZW5lcmF0ZU9iamVjdEhhc2ggPSBnZW5lcmF0ZU9iamVjdEhhc2g7XG4vKipcbiAqIEdlbmVyYXRlcyBhIGNvcHkgb2YgYW4gb2JqZWN0IHRoYXQgd2lsbCBhbHdheXMgcHJvZHVjdCB0aGUgc2FtZSBKU09OIHdoZW4gZW5jb2RlZC5cbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVIYXNoRGF0YShkYXRhKSB7XG4gICAgaWYgKHV0aWxzXzEuaXNBcnJheShkYXRhKSkge1xuICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgZGF0YV8xID0gZGF0YTsgX2kgPCBkYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGRhdGFfMVtfaV07XG4gICAgICAgICAgICBvdXRwdXQucHVzaChnZW5lcmF0ZUhhc2hEYXRhKGl0ZW0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICBlbHNlIGlmICh1dGlsc18yLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgICAgICAga2V5cy5zb3J0KCk7XG4gICAgICAgIGZvciAodmFyIF9hID0gMCwga2V5c18yID0ga2V5czsgX2EgPCBrZXlzXzIubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c18yW19hXTtcbiAgICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICAgIG9ialtrZXldID0gZ2VuZXJhdGVIYXNoRGF0YShkYXRhW2tleV0pO1xuICAgICAgICAgICAgb3V0cHV0LnB1c2gob2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgICBpZiAodXRpbHNfMi5pc1N0cmluZyhkYXRhKSkge1xuICAgICAgICByZXR1cm4gc3RyaW5nXzEuc2x1Z2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59XG5leHBvcnRzLmdlbmVyYXRlSGFzaERhdGEgPSBnZW5lcmF0ZUhhc2hEYXRhO1xuLyoqXG4gKiBUcnkgdG8gZmluZCBhIHZhbHVlIGluIGFuIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWVJbk9iamVjdChkYXRhLCBzZWFyY2gsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHZvaWQgMCkgeyBkZWZhdWx0VmFsdWUgPSBudWxsOyB9XG4gICAgaWYgKCF1dGlsc18yLmlzT2JqZWN0KGRhdGEpIHx8IHV0aWxzXzIuaXNVbmRlZmluZWQoZGF0YVtzZWFyY2hbMF1dKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICBpZiAoc2VhcmNoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIGdldFZhbHVlSW5PYmplY3QoZGF0YVtzZWFyY2hbMF1dLCBzZWFyY2guc2xpY2UoMSkpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YVtzZWFyY2hbMF1dO1xufVxuZXhwb3J0cy5nZXRWYWx1ZUluT2JqZWN0ID0gZ2V0VmFsdWVJbk9iamVjdDtcbi8qKlxuICogQWRkIGEgdmFsdWUgdG8gYW4gb2JqZWN0IGlmIGl0J3Mgbm90IHVuZGVmaW5lZC5cbiAqL1xuZnVuY3Rpb24gYWRkVG9PYmplY3RJZkRlZmluZWQob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKCF1dGlsc18yLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH1cbn1cbmV4cG9ydHMuYWRkVG9PYmplY3RJZkRlZmluZWQgPSBhZGRUb09iamVjdElmRGVmaW5lZDtcbi8qKlxuICogUmVwbGFjZSBhbGwgdmFyaWFibGVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHN5bnRheCBcIiV2YXJpYWJsZU5hbWUlIGluIHRoZSBpbnB1dCB3aXRoIHRoZSBjb3JyZXNwb25kaW5nXG4gKiB2YWx1ZSBpbiB0aGUgcmVwbGFjZW1lbnRzIHBhcmFtZXRlci5cbiAqXG4gKiBUaGlzIHdvcmtzIG9uIGFueSBudW1iZXIgb2YgbGV2ZWxzLlxuICpcbiAqIEZvciBleGFtcGxlIHRoZSBzdHJpbmc6XG4gKiAgIFwiSGVsbG8gJWNvbmZpZy53aG8lIVwiXG4gKiAgIHdpdGggYSByZXBsYWNlbWVudCBvYmplY3Qgb2Y6IHtjb25maWc6IHt3aG86IFwiV29ybGRcIn19XG4gKiAgIHdpbGwgb3V0cHV0OiBcIkhlbGxvIFdvcmxkIVwiLlxuICpcbiAqIFZhcmlhYmxlcyBuYW1lcyBhcmUgbGltaXRlZCB0byB0aGUgZm9sbG93aW5nIHJhbmdlIG9mIGNoYXJhY3RlcnM6XG4gKiAgIFthLXpBLVowLTkqXy1dXG4gKiAod2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIFwiLlwiIChkb3QpIHRvIHNlcGFyYXRlIGxldmVscyBpbiB0aGUgaGllcmFyY2h5KVxuICpcbiAqIFlvdSBjYW4gYWxzbyBjaG9zZSB0aGUgc3RhcnRpbmcgYW5kIGVuZGluZyBjaGFyYWN0ZXJzLlxuICovXG5mdW5jdGlvbiByZXBsYWNlU3RyaW5nVmFyaWFibGVzKGlucHV0LCByZXBsYWNlbWVudHMsIHN0YXJ0Q2hhciwgZW5kQ2hhcikge1xuICAgIGlmIChzdGFydENoYXIgPT09IHZvaWQgMCkgeyBzdGFydENoYXIgPSAnJSc7IH1cbiAgICBpZiAoZW5kQ2hhciA9PT0gdm9pZCAwKSB7IGVuZENoYXIgPSAnJSc7IH1cbiAgICBpZiAodXRpbHNfMi5pc1N0cmluZyhpbnB1dCkpIHtcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoc3RhcnRDaGFyICsgJyhbYS16MC05Ki5fLV0rKScgKyBlbmRDaGFyLCAnZ2knKTtcbiAgICAgICAgdmFyIHJlcGxhY2VtZW50c1Jlc3VsdHMgPSB7fTtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSB2b2lkIDA7XG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnQgKi9cbiAgICAgICAgd2hpbGUgKChtYXRjaGVzID0gcmVnLmV4ZWMoaW5wdXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHV0aWxzXzEuaXNBcnJheShtYXRjaGVzKSAmJiBtYXRjaGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBtYXRjaGVzWzFdLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZ2V0VmFsdWVJbk9iamVjdChyZXBsYWNlbWVudHMsIHBhcnRzKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRG8gbm90IHJlcGxhY2UgdGhlIHZhbHVlIGltbWVkaWF0ZWx5IGJlY2F1c2UgaWYgeW91IGRvIHNvIGFuZCB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RyaW5nIGF1dG8gcmVmZXJlbmNlIGl0c2VsZiB5b3UgaGF2ZSBhbiBpbmZpbml0ZSBsb29wLlxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudHNSZXN1bHRzW21hdGNoZXNbMF1dID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gc2FmZWx5IHJlcGxhY2UgdGhlIHJlc3VsdHMuXG4gICAgICAgIGZvciAodmFyIHRvUmVwbGFjZSBpbiByZXBsYWNlbWVudHNSZXN1bHRzKSB7XG4gICAgICAgICAgICBpZiAocmVwbGFjZW1lbnRzUmVzdWx0cy5oYXNPd25Qcm9wZXJ0eSh0b1JlcGxhY2UpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5ldyBSZWdFeHAodG9SZXBsYWNlLCAnZycpLCByZXBsYWNlbWVudHNSZXN1bHRzW3RvUmVwbGFjZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh1dGlsc18xLmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlucHV0W2ldID0gcmVwbGFjZVN0cmluZ1ZhcmlhYmxlcyhpbnB1dFtpXSwgcmVwbGFjZW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodXRpbHNfMi5pc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBpbnB1dCkge1xuICAgICAgICAgICAgaWYgKGlucHV0Lmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRba10gPSByZXBsYWNlU3RyaW5nVmFyaWFibGVzKGlucHV0W2tdLCByZXBsYWNlbWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnB1dDtcbn1cbmV4cG9ydHMucmVwbGFjZVN0cmluZ1ZhcmlhYmxlcyA9IHJlcGxhY2VTdHJpbmdWYXJpYWJsZXM7XG4vKipcbiAqIFRha2UgYW55IGlucHV0IGFuZCBwcmVwYXJlIGl0IHNvIGl0IGNhbiBzYWZlbHkgYmUgZW5jb2RlZCBpbnRvIGEgc3RyaW5nIHNvIGl0IGNhbiBiZSB0cmFuc2ZlcnJlZCBvciBkdW1wZWQuXG4gKlxuICogVGhpcyBpcyBhIGxvc3N5IG9wZXJhdGlvbiwgdGhlIHJlc3VsdGluZyBvYmplY3QgaXMgbm90IGludGVuZGVkIHRvIGJlIHVzZWQgYXMgdGhlIG9yaWdpbmFsIG9uZS5cbiAqXG4gKiBUaGUgb3JpZ2luYWwgb2JqZWN0IGlzIG5vdCBhZmZlY3RlZCwgYSBjbG9uZSBpcyBtYWRlLlxuICovXG5mdW5jdGlvbiBwcmVwYXJlT2JqZWN0Rm9yRHVtcChpbnB1dCwgbWF4RGVwdGgsIFxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmFsaWduXG4vKiBpbnRlcm5hbCAqLyBvYmplY3RzU3RhY2ssIFxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmFsaWduXG4vKiBpbnRlcm5hbCAqLyBkZXB0aCkge1xuICAgIGlmIChtYXhEZXB0aCA9PT0gdm9pZCAwKSB7IG1heERlcHRoID0gNTsgfVxuICAgIGlmIChvYmplY3RzU3RhY2sgPT09IHZvaWQgMCkgeyBvYmplY3RzU3RhY2sgPSBbXTsgfVxuICAgIGlmIChkZXB0aCA9PT0gdm9pZCAwKSB7IGRlcHRoID0gMDsgfVxuICAgIGlmICh1dGlsc18yLmlzVW5kZWZpbmVkKGlucHV0KSkge1xuICAgICAgICByZXR1cm4gJ1t1bmRlZmluZWRdJztcbiAgICB9XG4gICAgaWYgKGlucHV0ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnW251bGxdJztcbiAgICB9XG4gICAgaWYgKHV0aWxzXzIuaXNTdHJpbmcoaW5wdXQpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwgNTEyKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzXzIuaXNQcm9taXNlTGlrZShpbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuICdbcHJvbWlzZV0nO1xuICAgIH1cbiAgICBpZiAodXRpbHNfMS5pc0FycmF5KGlucHV0KSkge1xuICAgICAgICB2YXIgY2xvbmUgPSBbXTtcbiAgICAgICAgaWYgKG1heERlcHRoIDw9IDAgfHwgZGVwdGggPCBtYXhEZXB0aCkge1xuICAgICAgICAgICAgdmFyIG1heE51bWJlck9mSXRlbXMgPSA1MDtcbiAgICAgICAgICAgIHZhciBpdGVtSW5kZXggPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBpbnB1dF8xID0gaW5wdXQ7IF9pIDwgaW5wdXRfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGlucHV0XzFbX2ldO1xuICAgICAgICAgICAgICAgIGNsb25lLnB1c2gocHJlcGFyZU9iamVjdEZvckR1bXAoaXRlbSwgbWF4RGVwdGgsIG9iamVjdHNTdGFjaywgZGVwdGggKyAxKSk7XG4gICAgICAgICAgICAgICAgKytpdGVtSW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1JbmRleCA+PSBtYXhOdW1iZXJPZkl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbG9uZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ1thcnJheSBvZiAnICsgaW5wdXQubGVuZ3RoICsgJyBlbGVtZW50JyArIChpbnB1dC5sZW5ndGggPiAxID8gJ3MnIDogJycpICsgJ10nO1xuICAgIH1cbiAgICBpZiAodXRpbHNfMi5pc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBvYmplY3RzU3RhY2tfMSA9IG9iamVjdHNTdGFjazsgX2EgPCBvYmplY3RzU3RhY2tfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciBjYW5kaWRhdGUgPSBvYmplY3RzU3RhY2tfMVtfYV07XG4gICAgICAgICAgICBpZiAoY2FuZGlkYXRlID09PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnW3JlY3Vyc2l2ZSBvYmplY3QgcmVmZXJlbmNlXSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNsb25lID0ge307XG4gICAgICAgIHZhciBrZXlzQ291bnQgPSBPYmplY3Qua2V5cyhpbnB1dCkubGVuZ3RoO1xuICAgICAgICB2YXIgbWF4TnVtYmVyT2ZLZXlzID0gMzA7XG4gICAgICAgIGlmIChtYXhEZXB0aCA8PSAwIHx8IGRlcHRoIDwgbWF4RGVwdGgpIHtcbiAgICAgICAgICAgIHZhciBrZXlJbmRleCA9IDA7XG4gICAgICAgICAgICBvYmplY3RzU3RhY2sucHVzaChpbnB1dCk7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlmICghdXRpbHNfMi5pc1VuZGVmaW5lZChpbnB1dC5oYXNPd25Qcm9wZXJ0eSkgJiYgaW5wdXQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhdXRpbHNfMi5pc0Z1bmN0aW9uKGlucHV0W2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb25lW2tleV0gPSBwcmVwYXJlT2JqZWN0Rm9yRHVtcChpbnB1dFtrZXldLCBtYXhEZXB0aCwgb2JqZWN0c1N0YWNrLCBkZXB0aCArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICArK2tleUluZGV4O1xuICAgICAgICAgICAgICAgIGlmIChrZXlJbmRleCA+PSBtYXhOdW1iZXJPZktleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqZWN0c1N0YWNrLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdbb2JqZWN0IG9mICcgKyBrZXlzQ291bnQgKyAnIGtleScgKyAoa2V5c0NvdW50ID4gMSA/ICdzJyA6ICcnKSArICddJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuICAgIHJldHVybiBpbnB1dDtcbn1cbmV4cG9ydHMucHJlcGFyZU9iamVjdEZvckR1bXAgPSBwcmVwYXJlT2JqZWN0Rm9yRHVtcDtcbi8qKlxuICogRmxhdHRlbiBhIE4gZGltZW5zaW9uIG9iamVjdCBpbnRvIGEgc2luZ2xlIGRpbWVuc2lvbiBvbmUuXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW4ob2JqLCBjb25jYXRlbmF0b3IpIHtcbiAgICBpZiAoY29uY2F0ZW5hdG9yID09PSB2b2lkIDApIHsgY29uY2F0ZW5hdG9yID0gJy4nOyB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2Fzc2lnbih0c2xpYl8xLl9fYXNzaWduKHt9LCBhY2MpLCAoX2EgPSB7fSwgX2Fba2V5XSA9IG9ialtrZXldLCBfYSkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmbGF0dGVuZWRDaGlsZCA9IGZsYXR0ZW4ob2JqW2tleV0sIGNvbmNhdGVuYXRvcik7XG4gICAgICAgIHJldHVybiB0c2xpYl8xLl9fYXNzaWduKHRzbGliXzEuX19hc3NpZ24oe30sIGFjYyksIE9iamVjdC5rZXlzKGZsYXR0ZW5lZENoaWxkKS5yZWR1Y2UoZnVuY3Rpb24gKGNoaWxkQWNjLCBjaGlsZEtleSkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgcmV0dXJuICh0c2xpYl8xLl9fYXNzaWduKHRzbGliXzEuX19hc3NpZ24oe30sIGNoaWxkQWNjKSwgKF9hID0ge30sIF9hW1wiXCIgKyBrZXkgKyBjb25jYXRlbmF0b3IgKyBjaGlsZEtleV0gPSBmbGF0dGVuZWRDaGlsZFtjaGlsZEtleV0sIF9hKSkpO1xuICAgICAgICB9LCB7fSkpO1xuICAgIH0sIHt9KTtcbn1cbmV4cG9ydHMuZmxhdHRlbiA9IGZsYXR0ZW47XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmFuZG9tU3RyaW5nID0gZXhwb3J0cy5zbHVnaWZ5ID0gZXhwb3J0cy5yZW1vdmVBY2NlbnRzID0gZXhwb3J0cy5ub3JtYWxpemVVcmwgPSBleHBvcnRzLmlzVXJsID0gZXhwb3J0cy5pc0VtcHR5U3RyaW5nID0gZXhwb3J0cy5BTFBIQUJFVFMgPSB2b2lkIDA7XG52YXIgdHJpbSA9IHJlcXVpcmUoXCJsb2Rhc2gvdHJpbVwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgdXRpbHNfMiA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIERJQUNSSVRJQ1NfTUFQID0geyBcIkFcIjogXCJBXCIsIFwi4pK2XCI6IFwiQVwiLCBcIu+8oVwiOiBcIkFcIiwgXCLDgFwiOiBcIkFcIiwgXCLDgVwiOiBcIkFcIiwgXCLDglwiOiBcIkFcIiwgXCLhuqZcIjogXCJBXCIsIFwi4bqkXCI6IFwiQVwiLCBcIuG6qlwiOiBcIkFcIiwgXCLhuqhcIjogXCJBXCIsIFwiw4NcIjogXCJBXCIsIFwixIBcIjogXCJBXCIsIFwixIJcIjogXCJBXCIsIFwi4bqwXCI6IFwiQVwiLCBcIuG6rlwiOiBcIkFcIiwgXCLhurRcIjogXCJBXCIsIFwi4bqyXCI6IFwiQVwiLCBcIsimXCI6IFwiQVwiLCBcIsegXCI6IFwiQVwiLCBcIsOEXCI6IFwiQVwiLCBcIseeXCI6IFwiQVwiLCBcIuG6olwiOiBcIkFcIiwgXCLDhVwiOiBcIkFcIiwgXCLHulwiOiBcIkFcIiwgXCLHjVwiOiBcIkFcIiwgXCLIgFwiOiBcIkFcIiwgXCLIglwiOiBcIkFcIiwgXCLhuqBcIjogXCJBXCIsIFwi4bqsXCI6IFwiQVwiLCBcIuG6tlwiOiBcIkFcIiwgXCLhuIBcIjogXCJBXCIsIFwixIRcIjogXCJBXCIsIFwiyLpcIjogXCJBXCIsIFwi4rGvXCI6IFwiQVwiLCBcIuqcslwiOiBcIkFBXCIsIFwiw4ZcIjogXCJBRVwiLCBcIse8XCI6IFwiQUVcIiwgXCLHolwiOiBcIkFFXCIsIFwi6py0XCI6IFwiQU9cIiwgXCLqnLZcIjogXCJBVVwiLCBcIuqcuFwiOiBcIkFWXCIsIFwi6py6XCI6IFwiQVZcIiwgXCLqnLxcIjogXCJBWVwiLCBcIkJcIjogXCJCXCIsIFwi4pK3XCI6IFwiQlwiLCBcIu+8olwiOiBcIkJcIiwgXCLhuIJcIjogXCJCXCIsIFwi4biEXCI6IFwiQlwiLCBcIuG4hlwiOiBcIkJcIiwgXCLJg1wiOiBcIkJcIiwgXCLGglwiOiBcIkJcIiwgXCLGgVwiOiBcIkJcIiwgXCJDXCI6IFwiQ1wiLCBcIuKSuFwiOiBcIkNcIiwgXCLvvKNcIjogXCJDXCIsIFwixIZcIjogXCJDXCIsIFwixIhcIjogXCJDXCIsIFwixIpcIjogXCJDXCIsIFwixIxcIjogXCJDXCIsIFwiw4dcIjogXCJDXCIsIFwi4biIXCI6IFwiQ1wiLCBcIsaHXCI6IFwiQ1wiLCBcIsi7XCI6IFwiQ1wiLCBcIuqcvlwiOiBcIkNcIiwgXCJEXCI6IFwiRFwiLCBcIuKSuVwiOiBcIkRcIiwgXCLvvKRcIjogXCJEXCIsIFwi4biKXCI6IFwiRFwiLCBcIsSOXCI6IFwiRFwiLCBcIuG4jFwiOiBcIkRcIiwgXCLhuJBcIjogXCJEXCIsIFwi4biSXCI6IFwiRFwiLCBcIuG4jlwiOiBcIkRcIiwgXCLEkFwiOiBcIkRcIiwgXCLGi1wiOiBcIkRcIiwgXCLGilwiOiBcIkRcIiwgXCLGiVwiOiBcIkRcIiwgXCLqnblcIjogXCJEXCIsIFwix7FcIjogXCJEWlwiLCBcIseEXCI6IFwiRFpcIiwgXCLHslwiOiBcIkR6XCIsIFwix4VcIjogXCJEelwiLCBcIkVcIjogXCJFXCIsIFwi4pK6XCI6IFwiRVwiLCBcIu+8pVwiOiBcIkVcIiwgXCLDiFwiOiBcIkVcIiwgXCLDiVwiOiBcIkVcIiwgXCLDilwiOiBcIkVcIiwgXCLhu4BcIjogXCJFXCIsIFwi4bq+XCI6IFwiRVwiLCBcIuG7hFwiOiBcIkVcIiwgXCLhu4JcIjogXCJFXCIsIFwi4bq8XCI6IFwiRVwiLCBcIsSSXCI6IFwiRVwiLCBcIuG4lFwiOiBcIkVcIiwgXCLhuJZcIjogXCJFXCIsIFwixJRcIjogXCJFXCIsIFwixJZcIjogXCJFXCIsIFwiw4tcIjogXCJFXCIsIFwi4bq6XCI6IFwiRVwiLCBcIsSaXCI6IFwiRVwiLCBcIsiEXCI6IFwiRVwiLCBcIsiGXCI6IFwiRVwiLCBcIuG6uFwiOiBcIkVcIiwgXCLhu4ZcIjogXCJFXCIsIFwiyKhcIjogXCJFXCIsIFwi4bicXCI6IFwiRVwiLCBcIsSYXCI6IFwiRVwiLCBcIuG4mFwiOiBcIkVcIiwgXCLhuJpcIjogXCJFXCIsIFwixpBcIjogXCJFXCIsIFwixo5cIjogXCJFXCIsIFwiRlwiOiBcIkZcIiwgXCLikrtcIjogXCJGXCIsIFwi77ymXCI6IFwiRlwiLCBcIuG4nlwiOiBcIkZcIiwgXCLGkVwiOiBcIkZcIiwgXCLqnbtcIjogXCJGXCIsIFwiR1wiOiBcIkdcIiwgXCLikrxcIjogXCJHXCIsIFwi77ynXCI6IFwiR1wiLCBcIse0XCI6IFwiR1wiLCBcIsScXCI6IFwiR1wiLCBcIuG4oFwiOiBcIkdcIiwgXCLEnlwiOiBcIkdcIiwgXCLEoFwiOiBcIkdcIiwgXCLHplwiOiBcIkdcIiwgXCLEolwiOiBcIkdcIiwgXCLHpFwiOiBcIkdcIiwgXCLGk1wiOiBcIkdcIiwgXCLqnqBcIjogXCJHXCIsIFwi6p29XCI6IFwiR1wiLCBcIuqdvlwiOiBcIkdcIiwgXCJIXCI6IFwiSFwiLCBcIuKSvVwiOiBcIkhcIiwgXCLvvKhcIjogXCJIXCIsIFwixKRcIjogXCJIXCIsIFwi4biiXCI6IFwiSFwiLCBcIuG4plwiOiBcIkhcIiwgXCLInlwiOiBcIkhcIiwgXCLhuKRcIjogXCJIXCIsIFwi4bioXCI6IFwiSFwiLCBcIuG4qlwiOiBcIkhcIiwgXCLEplwiOiBcIkhcIiwgXCLisadcIjogXCJIXCIsIFwi4rG1XCI6IFwiSFwiLCBcIuqejVwiOiBcIkhcIiwgXCJJXCI6IFwiSVwiLCBcIuKSvlwiOiBcIklcIiwgXCLvvKlcIjogXCJJXCIsIFwiw4xcIjogXCJJXCIsIFwiw41cIjogXCJJXCIsIFwiw45cIjogXCJJXCIsIFwixKhcIjogXCJJXCIsIFwixKpcIjogXCJJXCIsIFwixKxcIjogXCJJXCIsIFwixLBcIjogXCJJXCIsIFwiw49cIjogXCJJXCIsIFwi4biuXCI6IFwiSVwiLCBcIuG7iFwiOiBcIklcIiwgXCLHj1wiOiBcIklcIiwgXCLIiFwiOiBcIklcIiwgXCLIilwiOiBcIklcIiwgXCLhu4pcIjogXCJJXCIsIFwixK5cIjogXCJJXCIsIFwi4bisXCI6IFwiSVwiLCBcIsaXXCI6IFwiSVwiLCBcIkpcIjogXCJKXCIsIFwi4pK/XCI6IFwiSlwiLCBcIu+8qlwiOiBcIkpcIiwgXCLEtFwiOiBcIkpcIiwgXCLJiFwiOiBcIkpcIiwgXCJLXCI6IFwiS1wiLCBcIuKTgFwiOiBcIktcIiwgXCLvvKtcIjogXCJLXCIsIFwi4biwXCI6IFwiS1wiLCBcIseoXCI6IFwiS1wiLCBcIuG4slwiOiBcIktcIiwgXCLEtlwiOiBcIktcIiwgXCLhuLRcIjogXCJLXCIsIFwixphcIjogXCJLXCIsIFwi4rGpXCI6IFwiS1wiLCBcIuqdgFwiOiBcIktcIiwgXCLqnYJcIjogXCJLXCIsIFwi6p2EXCI6IFwiS1wiLCBcIuqeolwiOiBcIktcIiwgXCJMXCI6IFwiTFwiLCBcIuKTgVwiOiBcIkxcIiwgXCLvvKxcIjogXCJMXCIsIFwixL9cIjogXCJMXCIsIFwixLlcIjogXCJMXCIsIFwixL1cIjogXCJMXCIsIFwi4bi2XCI6IFwiTFwiLCBcIuG4uFwiOiBcIkxcIiwgXCLEu1wiOiBcIkxcIiwgXCLhuLxcIjogXCJMXCIsIFwi4bi6XCI6IFwiTFwiLCBcIsWBXCI6IFwiTFwiLCBcIsi9XCI6IFwiTFwiLCBcIuKxolwiOiBcIkxcIiwgXCLisaBcIjogXCJMXCIsIFwi6p2IXCI6IFwiTFwiLCBcIuqdhlwiOiBcIkxcIiwgXCLqnoBcIjogXCJMXCIsIFwix4dcIjogXCJMSlwiLCBcIseIXCI6IFwiTGpcIiwgXCJNXCI6IFwiTVwiLCBcIuKTglwiOiBcIk1cIiwgXCLvvK1cIjogXCJNXCIsIFwi4bi+XCI6IFwiTVwiLCBcIuG5gFwiOiBcIk1cIiwgXCLhuYJcIjogXCJNXCIsIFwi4rGuXCI6IFwiTVwiLCBcIsacXCI6IFwiTVwiLCBcIk5cIjogXCJOXCIsIFwi4pODXCI6IFwiTlwiLCBcIu+8rlwiOiBcIk5cIiwgXCLHuFwiOiBcIk5cIiwgXCLFg1wiOiBcIk5cIiwgXCLDkVwiOiBcIk5cIiwgXCLhuYRcIjogXCJOXCIsIFwixYdcIjogXCJOXCIsIFwi4bmGXCI6IFwiTlwiLCBcIsWFXCI6IFwiTlwiLCBcIuG5ilwiOiBcIk5cIiwgXCLhuYhcIjogXCJOXCIsIFwiyKBcIjogXCJOXCIsIFwixp1cIjogXCJOXCIsIFwi6p6QXCI6IFwiTlwiLCBcIuqepFwiOiBcIk5cIiwgXCLHilwiOiBcIk5KXCIsIFwix4tcIjogXCJOalwiLCBcIk9cIjogXCJPXCIsIFwi4pOEXCI6IFwiT1wiLCBcIu+8r1wiOiBcIk9cIiwgXCLDklwiOiBcIk9cIiwgXCLDk1wiOiBcIk9cIiwgXCLDlFwiOiBcIk9cIiwgXCLhu5JcIjogXCJPXCIsIFwi4buQXCI6IFwiT1wiLCBcIuG7llwiOiBcIk9cIiwgXCLhu5RcIjogXCJPXCIsIFwiw5VcIjogXCJPXCIsIFwi4bmMXCI6IFwiT1wiLCBcIsisXCI6IFwiT1wiLCBcIuG5jlwiOiBcIk9cIiwgXCLFjFwiOiBcIk9cIiwgXCLhuZBcIjogXCJPXCIsIFwi4bmSXCI6IFwiT1wiLCBcIsWOXCI6IFwiT1wiLCBcIsiuXCI6IFwiT1wiLCBcIsiwXCI6IFwiT1wiLCBcIsOWXCI6IFwiT1wiLCBcIsiqXCI6IFwiT1wiLCBcIuG7jlwiOiBcIk9cIiwgXCLFkFwiOiBcIk9cIiwgXCLHkVwiOiBcIk9cIiwgXCLIjFwiOiBcIk9cIiwgXCLIjlwiOiBcIk9cIiwgXCLGoFwiOiBcIk9cIiwgXCLhu5xcIjogXCJPXCIsIFwi4buaXCI6IFwiT1wiLCBcIuG7oFwiOiBcIk9cIiwgXCLhu55cIjogXCJPXCIsIFwi4buiXCI6IFwiT1wiLCBcIuG7jFwiOiBcIk9cIiwgXCLhu5hcIjogXCJPXCIsIFwix6pcIjogXCJPXCIsIFwix6xcIjogXCJPXCIsIFwiw5hcIjogXCJPXCIsIFwix75cIjogXCJPXCIsIFwixoZcIjogXCJPXCIsIFwixp9cIjogXCJPXCIsIFwi6p2KXCI6IFwiT1wiLCBcIuqdjFwiOiBcIk9cIiwgXCLGolwiOiBcIk9JXCIsIFwi6p2OXCI6IFwiT09cIiwgXCLIolwiOiBcIk9VXCIsIFwiUFwiOiBcIlBcIiwgXCLik4VcIjogXCJQXCIsIFwi77ywXCI6IFwiUFwiLCBcIuG5lFwiOiBcIlBcIiwgXCLhuZZcIjogXCJQXCIsIFwixqRcIjogXCJQXCIsIFwi4rGjXCI6IFwiUFwiLCBcIuqdkFwiOiBcIlBcIiwgXCLqnZJcIjogXCJQXCIsIFwi6p2UXCI6IFwiUFwiLCBcIlFcIjogXCJRXCIsIFwi4pOGXCI6IFwiUVwiLCBcIu+8sVwiOiBcIlFcIiwgXCLqnZZcIjogXCJRXCIsIFwi6p2YXCI6IFwiUVwiLCBcIsmKXCI6IFwiUVwiLCBcIlJcIjogXCJSXCIsIFwi4pOHXCI6IFwiUlwiLCBcIu+8slwiOiBcIlJcIiwgXCLFlFwiOiBcIlJcIiwgXCLhuZhcIjogXCJSXCIsIFwixZhcIjogXCJSXCIsIFwiyJBcIjogXCJSXCIsIFwiyJJcIjogXCJSXCIsIFwi4bmaXCI6IFwiUlwiLCBcIuG5nFwiOiBcIlJcIiwgXCLFllwiOiBcIlJcIiwgXCLhuZ5cIjogXCJSXCIsIFwiyYxcIjogXCJSXCIsIFwi4rGkXCI6IFwiUlwiLCBcIuqdmlwiOiBcIlJcIiwgXCLqnqZcIjogXCJSXCIsIFwi6p6CXCI6IFwiUlwiLCBcIlNcIjogXCJTXCIsIFwi4pOIXCI6IFwiU1wiLCBcIu+8s1wiOiBcIlNcIiwgXCLhup5cIjogXCJTXCIsIFwixZpcIjogXCJTXCIsIFwi4bmkXCI6IFwiU1wiLCBcIsWcXCI6IFwiU1wiLCBcIuG5oFwiOiBcIlNcIiwgXCLFoFwiOiBcIlNcIiwgXCLhuaZcIjogXCJTXCIsIFwi4bmiXCI6IFwiU1wiLCBcIuG5qFwiOiBcIlNcIiwgXCLImFwiOiBcIlNcIiwgXCLFnlwiOiBcIlNcIiwgXCLisb5cIjogXCJTXCIsIFwi6p6oXCI6IFwiU1wiLCBcIuqehFwiOiBcIlNcIiwgXCJUXCI6IFwiVFwiLCBcIuKTiVwiOiBcIlRcIiwgXCLvvLRcIjogXCJUXCIsIFwi4bmqXCI6IFwiVFwiLCBcIsWkXCI6IFwiVFwiLCBcIuG5rFwiOiBcIlRcIiwgXCLImlwiOiBcIlRcIiwgXCLFolwiOiBcIlRcIiwgXCLhubBcIjogXCJUXCIsIFwi4bmuXCI6IFwiVFwiLCBcIsWmXCI6IFwiVFwiLCBcIsasXCI6IFwiVFwiLCBcIsauXCI6IFwiVFwiLCBcIsi+XCI6IFwiVFwiLCBcIuqehlwiOiBcIlRcIiwgXCLqnKhcIjogXCJUWlwiLCBcIlVcIjogXCJVXCIsIFwi4pOKXCI6IFwiVVwiLCBcIu+8tVwiOiBcIlVcIiwgXCLDmVwiOiBcIlVcIiwgXCLDmlwiOiBcIlVcIiwgXCLDm1wiOiBcIlVcIiwgXCLFqFwiOiBcIlVcIiwgXCLhubhcIjogXCJVXCIsIFwixapcIjogXCJVXCIsIFwi4bm6XCI6IFwiVVwiLCBcIsWsXCI6IFwiVVwiLCBcIsOcXCI6IFwiVVwiLCBcIsebXCI6IFwiVVwiLCBcIseXXCI6IFwiVVwiLCBcIseVXCI6IFwiVVwiLCBcIseZXCI6IFwiVVwiLCBcIuG7plwiOiBcIlVcIiwgXCLFrlwiOiBcIlVcIiwgXCLFsFwiOiBcIlVcIiwgXCLHk1wiOiBcIlVcIiwgXCLIlFwiOiBcIlVcIiwgXCLIllwiOiBcIlVcIiwgXCLGr1wiOiBcIlVcIiwgXCLhu6pcIjogXCJVXCIsIFwi4buoXCI6IFwiVVwiLCBcIuG7rlwiOiBcIlVcIiwgXCLhu6xcIjogXCJVXCIsIFwi4buwXCI6IFwiVVwiLCBcIuG7pFwiOiBcIlVcIiwgXCLhubJcIjogXCJVXCIsIFwixbJcIjogXCJVXCIsIFwi4bm2XCI6IFwiVVwiLCBcIuG5tFwiOiBcIlVcIiwgXCLJhFwiOiBcIlVcIiwgXCJWXCI6IFwiVlwiLCBcIuKTi1wiOiBcIlZcIiwgXCLvvLZcIjogXCJWXCIsIFwi4bm8XCI6IFwiVlwiLCBcIuG5vlwiOiBcIlZcIiwgXCLGslwiOiBcIlZcIiwgXCLqnZ5cIjogXCJWXCIsIFwiyYVcIjogXCJWXCIsIFwi6p2gXCI6IFwiVllcIiwgXCJXXCI6IFwiV1wiLCBcIuKTjFwiOiBcIldcIiwgXCLvvLdcIjogXCJXXCIsIFwi4bqAXCI6IFwiV1wiLCBcIuG6glwiOiBcIldcIiwgXCLFtFwiOiBcIldcIiwgXCLhuoZcIjogXCJXXCIsIFwi4bqEXCI6IFwiV1wiLCBcIuG6iFwiOiBcIldcIiwgXCLisbJcIjogXCJXXCIsIFwiWFwiOiBcIlhcIiwgXCLik41cIjogXCJYXCIsIFwi77y4XCI6IFwiWFwiLCBcIuG6ilwiOiBcIlhcIiwgXCLhuoxcIjogXCJYXCIsIFwiWVwiOiBcIllcIiwgXCLik45cIjogXCJZXCIsIFwi77y5XCI6IFwiWVwiLCBcIuG7slwiOiBcIllcIiwgXCLDnVwiOiBcIllcIiwgXCLFtlwiOiBcIllcIiwgXCLhu7hcIjogXCJZXCIsIFwiyLJcIjogXCJZXCIsIFwi4bqOXCI6IFwiWVwiLCBcIsW4XCI6IFwiWVwiLCBcIuG7tlwiOiBcIllcIiwgXCLhu7RcIjogXCJZXCIsIFwixrNcIjogXCJZXCIsIFwiyY5cIjogXCJZXCIsIFwi4bu+XCI6IFwiWVwiLCBcIlpcIjogXCJaXCIsIFwi4pOPXCI6IFwiWlwiLCBcIu+8ulwiOiBcIlpcIiwgXCLFuVwiOiBcIlpcIiwgXCLhupBcIjogXCJaXCIsIFwixbtcIjogXCJaXCIsIFwixb1cIjogXCJaXCIsIFwi4bqSXCI6IFwiWlwiLCBcIuG6lFwiOiBcIlpcIiwgXCLGtVwiOiBcIlpcIiwgXCLIpFwiOiBcIlpcIiwgXCLisb9cIjogXCJaXCIsIFwi4rGrXCI6IFwiWlwiLCBcIuqdolwiOiBcIlpcIiwgXCJhXCI6IFwiYVwiLCBcIuKTkFwiOiBcImFcIiwgXCLvvYFcIjogXCJhXCIsIFwi4bqaXCI6IFwiYVwiLCBcIsOgXCI6IFwiYVwiLCBcIsOhXCI6IFwiYVwiLCBcIsOiXCI6IFwiYVwiLCBcIuG6p1wiOiBcImFcIiwgXCLhuqVcIjogXCJhXCIsIFwi4bqrXCI6IFwiYVwiLCBcIuG6qVwiOiBcImFcIiwgXCLDo1wiOiBcImFcIiwgXCLEgVwiOiBcImFcIiwgXCLEg1wiOiBcImFcIiwgXCLhurFcIjogXCJhXCIsIFwi4bqvXCI6IFwiYVwiLCBcIuG6tVwiOiBcImFcIiwgXCLhurNcIjogXCJhXCIsIFwiyKdcIjogXCJhXCIsIFwix6FcIjogXCJhXCIsIFwiw6RcIjogXCJhXCIsIFwix59cIjogXCJhXCIsIFwi4bqjXCI6IFwiYVwiLCBcIsOlXCI6IFwiYVwiLCBcIse7XCI6IFwiYVwiLCBcIseOXCI6IFwiYVwiLCBcIsiBXCI6IFwiYVwiLCBcIsiDXCI6IFwiYVwiLCBcIuG6oVwiOiBcImFcIiwgXCLhuq1cIjogXCJhXCIsIFwi4bq3XCI6IFwiYVwiLCBcIuG4gVwiOiBcImFcIiwgXCLEhVwiOiBcImFcIiwgXCLisaVcIjogXCJhXCIsIFwiyZBcIjogXCJhXCIsIFwi6pyzXCI6IFwiYWFcIiwgXCLDplwiOiBcImFlXCIsIFwix71cIjogXCJhZVwiLCBcIsejXCI6IFwiYWVcIiwgXCLqnLVcIjogXCJhb1wiLCBcIuqct1wiOiBcImF1XCIsIFwi6py5XCI6IFwiYXZcIiwgXCLqnLtcIjogXCJhdlwiLCBcIuqcvVwiOiBcImF5XCIsIFwiYlwiOiBcImJcIiwgXCLik5FcIjogXCJiXCIsIFwi772CXCI6IFwiYlwiLCBcIuG4g1wiOiBcImJcIiwgXCLhuIVcIjogXCJiXCIsIFwi4biHXCI6IFwiYlwiLCBcIsaAXCI6IFwiYlwiLCBcIsaDXCI6IFwiYlwiLCBcIsmTXCI6IFwiYlwiLCBcImNcIjogXCJjXCIsIFwi4pOSXCI6IFwiY1wiLCBcIu+9g1wiOiBcImNcIiwgXCLEh1wiOiBcImNcIiwgXCLEiVwiOiBcImNcIiwgXCLEi1wiOiBcImNcIiwgXCLEjVwiOiBcImNcIiwgXCLDp1wiOiBcImNcIiwgXCLhuIlcIjogXCJjXCIsIFwixohcIjogXCJjXCIsIFwiyLxcIjogXCJjXCIsIFwi6py/XCI6IFwiY1wiLCBcIuKGhFwiOiBcImNcIiwgXCJkXCI6IFwiZFwiLCBcIuKTk1wiOiBcImRcIiwgXCLvvYRcIjogXCJkXCIsIFwi4biLXCI6IFwiZFwiLCBcIsSPXCI6IFwiZFwiLCBcIuG4jVwiOiBcImRcIiwgXCLhuJFcIjogXCJkXCIsIFwi4biTXCI6IFwiZFwiLCBcIuG4j1wiOiBcImRcIiwgXCLEkVwiOiBcImRcIiwgXCLGjFwiOiBcImRcIiwgXCLJllwiOiBcImRcIiwgXCLJl1wiOiBcImRcIiwgXCLqnbpcIjogXCJkXCIsIFwix7NcIjogXCJkelwiLCBcIseGXCI6IFwiZHpcIiwgXCJlXCI6IFwiZVwiLCBcIuKTlFwiOiBcImVcIiwgXCLvvYVcIjogXCJlXCIsIFwiw6hcIjogXCJlXCIsIFwiw6lcIjogXCJlXCIsIFwiw6pcIjogXCJlXCIsIFwi4buBXCI6IFwiZVwiLCBcIuG6v1wiOiBcImVcIiwgXCLhu4VcIjogXCJlXCIsIFwi4buDXCI6IFwiZVwiLCBcIuG6vVwiOiBcImVcIiwgXCLEk1wiOiBcImVcIiwgXCLhuJVcIjogXCJlXCIsIFwi4biXXCI6IFwiZVwiLCBcIsSVXCI6IFwiZVwiLCBcIsSXXCI6IFwiZVwiLCBcIsOrXCI6IFwiZVwiLCBcIuG6u1wiOiBcImVcIiwgXCLEm1wiOiBcImVcIiwgXCLIhVwiOiBcImVcIiwgXCLIh1wiOiBcImVcIiwgXCLhurlcIjogXCJlXCIsIFwi4buHXCI6IFwiZVwiLCBcIsipXCI6IFwiZVwiLCBcIuG4nVwiOiBcImVcIiwgXCLEmVwiOiBcImVcIiwgXCLhuJlcIjogXCJlXCIsIFwi4bibXCI6IFwiZVwiLCBcIsmHXCI6IFwiZVwiLCBcIsmbXCI6IFwiZVwiLCBcIsedXCI6IFwiZVwiLCBcImZcIjogXCJmXCIsIFwi4pOVXCI6IFwiZlwiLCBcIu+9hlwiOiBcImZcIiwgXCLhuJ9cIjogXCJmXCIsIFwixpJcIjogXCJmXCIsIFwi6p28XCI6IFwiZlwiLCBcImdcIjogXCJnXCIsIFwi4pOWXCI6IFwiZ1wiLCBcIu+9h1wiOiBcImdcIiwgXCLHtVwiOiBcImdcIiwgXCLEnVwiOiBcImdcIiwgXCLhuKFcIjogXCJnXCIsIFwixJ9cIjogXCJnXCIsIFwixKFcIjogXCJnXCIsIFwix6dcIjogXCJnXCIsIFwixKNcIjogXCJnXCIsIFwix6VcIjogXCJnXCIsIFwiyaBcIjogXCJnXCIsIFwi6p6hXCI6IFwiZ1wiLCBcIuG1uVwiOiBcImdcIiwgXCLqnb9cIjogXCJnXCIsIFwiaFwiOiBcImhcIiwgXCLik5dcIjogXCJoXCIsIFwi772IXCI6IFwiaFwiLCBcIsSlXCI6IFwiaFwiLCBcIuG4o1wiOiBcImhcIiwgXCLhuKdcIjogXCJoXCIsIFwiyJ9cIjogXCJoXCIsIFwi4bilXCI6IFwiaFwiLCBcIuG4qVwiOiBcImhcIiwgXCLhuKtcIjogXCJoXCIsIFwi4bqWXCI6IFwiaFwiLCBcIsSnXCI6IFwiaFwiLCBcIuKxqFwiOiBcImhcIiwgXCLisbZcIjogXCJoXCIsIFwiyaVcIjogXCJoXCIsIFwixpVcIjogXCJodlwiLCBcImlcIjogXCJpXCIsIFwi4pOYXCI6IFwiaVwiLCBcIu+9iVwiOiBcImlcIiwgXCLDrFwiOiBcImlcIiwgXCLDrVwiOiBcImlcIiwgXCLDrlwiOiBcImlcIiwgXCLEqVwiOiBcImlcIiwgXCLEq1wiOiBcImlcIiwgXCLErVwiOiBcImlcIiwgXCLDr1wiOiBcImlcIiwgXCLhuK9cIjogXCJpXCIsIFwi4buJXCI6IFwiaVwiLCBcIseQXCI6IFwiaVwiLCBcIsiJXCI6IFwiaVwiLCBcIsiLXCI6IFwiaVwiLCBcIuG7i1wiOiBcImlcIiwgXCLEr1wiOiBcImlcIiwgXCLhuK1cIjogXCJpXCIsIFwiyahcIjogXCJpXCIsIFwixLFcIjogXCJpXCIsIFwialwiOiBcImpcIiwgXCLik5lcIjogXCJqXCIsIFwi772KXCI6IFwialwiLCBcIsS1XCI6IFwialwiLCBcIsewXCI6IFwialwiLCBcIsmJXCI6IFwialwiLCBcImtcIjogXCJrXCIsIFwi4pOaXCI6IFwia1wiLCBcIu+9i1wiOiBcImtcIiwgXCLhuLFcIjogXCJrXCIsIFwix6lcIjogXCJrXCIsIFwi4bizXCI6IFwia1wiLCBcIsS3XCI6IFwia1wiLCBcIuG4tVwiOiBcImtcIiwgXCLGmVwiOiBcImtcIiwgXCLisapcIjogXCJrXCIsIFwi6p2BXCI6IFwia1wiLCBcIuqdg1wiOiBcImtcIiwgXCLqnYVcIjogXCJrXCIsIFwi6p6jXCI6IFwia1wiLCBcImxcIjogXCJsXCIsIFwi4pObXCI6IFwibFwiLCBcIu+9jFwiOiBcImxcIiwgXCLFgFwiOiBcImxcIiwgXCLEulwiOiBcImxcIiwgXCLEvlwiOiBcImxcIiwgXCLhuLdcIjogXCJsXCIsIFwi4bi5XCI6IFwibFwiLCBcIsS8XCI6IFwibFwiLCBcIuG4vVwiOiBcImxcIiwgXCLhuLtcIjogXCJsXCIsIFwixb9cIjogXCJsXCIsIFwixYJcIjogXCJsXCIsIFwixppcIjogXCJsXCIsIFwiyatcIjogXCJsXCIsIFwi4rGhXCI6IFwibFwiLCBcIuqdiVwiOiBcImxcIiwgXCLqnoFcIjogXCJsXCIsIFwi6p2HXCI6IFwibFwiLCBcIseJXCI6IFwibGpcIiwgXCJtXCI6IFwibVwiLCBcIuKTnFwiOiBcIm1cIiwgXCLvvY1cIjogXCJtXCIsIFwi4bi/XCI6IFwibVwiLCBcIuG5gVwiOiBcIm1cIiwgXCLhuYNcIjogXCJtXCIsIFwiybFcIjogXCJtXCIsIFwiya9cIjogXCJtXCIsIFwiblwiOiBcIm5cIiwgXCLik51cIjogXCJuXCIsIFwi772OXCI6IFwiblwiLCBcIse5XCI6IFwiblwiLCBcIsWEXCI6IFwiblwiLCBcIsOxXCI6IFwiblwiLCBcIuG5hVwiOiBcIm5cIiwgXCLFiFwiOiBcIm5cIiwgXCLhuYdcIjogXCJuXCIsIFwixYZcIjogXCJuXCIsIFwi4bmLXCI6IFwiblwiLCBcIuG5iVwiOiBcIm5cIiwgXCLGnlwiOiBcIm5cIiwgXCLJslwiOiBcIm5cIiwgXCLFiVwiOiBcIm5cIiwgXCLqnpFcIjogXCJuXCIsIFwi6p6lXCI6IFwiblwiLCBcIseMXCI6IFwibmpcIiwgXCJvXCI6IFwib1wiLCBcIuKTnlwiOiBcIm9cIiwgXCLvvY9cIjogXCJvXCIsIFwiw7JcIjogXCJvXCIsIFwiw7NcIjogXCJvXCIsIFwiw7RcIjogXCJvXCIsIFwi4buTXCI6IFwib1wiLCBcIuG7kVwiOiBcIm9cIiwgXCLhu5dcIjogXCJvXCIsIFwi4buVXCI6IFwib1wiLCBcIsO1XCI6IFwib1wiLCBcIuG5jVwiOiBcIm9cIiwgXCLIrVwiOiBcIm9cIiwgXCLhuY9cIjogXCJvXCIsIFwixY1cIjogXCJvXCIsIFwi4bmRXCI6IFwib1wiLCBcIuG5k1wiOiBcIm9cIiwgXCLFj1wiOiBcIm9cIiwgXCLIr1wiOiBcIm9cIiwgXCLIsVwiOiBcIm9cIiwgXCLDtlwiOiBcIm9cIiwgXCLIq1wiOiBcIm9cIiwgXCLhu49cIjogXCJvXCIsIFwixZFcIjogXCJvXCIsIFwix5JcIjogXCJvXCIsIFwiyI1cIjogXCJvXCIsIFwiyI9cIjogXCJvXCIsIFwixqFcIjogXCJvXCIsIFwi4budXCI6IFwib1wiLCBcIuG7m1wiOiBcIm9cIiwgXCLhu6FcIjogXCJvXCIsIFwi4bufXCI6IFwib1wiLCBcIuG7o1wiOiBcIm9cIiwgXCLhu41cIjogXCJvXCIsIFwi4buZXCI6IFwib1wiLCBcIserXCI6IFwib1wiLCBcIsetXCI6IFwib1wiLCBcIsO4XCI6IFwib1wiLCBcIse/XCI6IFwib1wiLCBcIsmUXCI6IFwib1wiLCBcIuqdi1wiOiBcIm9cIiwgXCLqnY1cIjogXCJvXCIsIFwiybVcIjogXCJvXCIsIFwixqNcIjogXCJvaVwiLCBcIsijXCI6IFwib3VcIiwgXCLqnY9cIjogXCJvb1wiLCBcInBcIjogXCJwXCIsIFwi4pOfXCI6IFwicFwiLCBcIu+9kFwiOiBcInBcIiwgXCLhuZVcIjogXCJwXCIsIFwi4bmXXCI6IFwicFwiLCBcIsalXCI6IFwicFwiLCBcIuG1vVwiOiBcInBcIiwgXCLqnZFcIjogXCJwXCIsIFwi6p2TXCI6IFwicFwiLCBcIuqdlVwiOiBcInBcIiwgXCJxXCI6IFwicVwiLCBcIuKToFwiOiBcInFcIiwgXCLvvZFcIjogXCJxXCIsIFwiyYtcIjogXCJxXCIsIFwi6p2XXCI6IFwicVwiLCBcIuqdmVwiOiBcInFcIiwgXCJyXCI6IFwiclwiLCBcIuKToVwiOiBcInJcIiwgXCLvvZJcIjogXCJyXCIsIFwixZVcIjogXCJyXCIsIFwi4bmZXCI6IFwiclwiLCBcIsWZXCI6IFwiclwiLCBcIsiRXCI6IFwiclwiLCBcIsiTXCI6IFwiclwiLCBcIuG5m1wiOiBcInJcIiwgXCLhuZ1cIjogXCJyXCIsIFwixZdcIjogXCJyXCIsIFwi4bmfXCI6IFwiclwiLCBcIsmNXCI6IFwiclwiLCBcIsm9XCI6IFwiclwiLCBcIuqdm1wiOiBcInJcIiwgXCLqnqdcIjogXCJyXCIsIFwi6p6DXCI6IFwiclwiLCBcInNcIjogXCJzXCIsIFwi4pOiXCI6IFwic1wiLCBcIu+9k1wiOiBcInNcIiwgXCLDn1wiOiBcInNcIiwgXCLFm1wiOiBcInNcIiwgXCLhuaVcIjogXCJzXCIsIFwixZ1cIjogXCJzXCIsIFwi4bmhXCI6IFwic1wiLCBcIsWhXCI6IFwic1wiLCBcIuG5p1wiOiBcInNcIiwgXCLhuaNcIjogXCJzXCIsIFwi4bmpXCI6IFwic1wiLCBcIsiZXCI6IFwic1wiLCBcIsWfXCI6IFwic1wiLCBcIsi/XCI6IFwic1wiLCBcIuqeqVwiOiBcInNcIiwgXCLqnoVcIjogXCJzXCIsIFwi4bqbXCI6IFwic1wiLCBcInRcIjogXCJ0XCIsIFwi4pOjXCI6IFwidFwiLCBcIu+9lFwiOiBcInRcIiwgXCLhuatcIjogXCJ0XCIsIFwi4bqXXCI6IFwidFwiLCBcIsWlXCI6IFwidFwiLCBcIuG5rVwiOiBcInRcIiwgXCLIm1wiOiBcInRcIiwgXCLFo1wiOiBcInRcIiwgXCLhubFcIjogXCJ0XCIsIFwi4bmvXCI6IFwidFwiLCBcIsWnXCI6IFwidFwiLCBcIsatXCI6IFwidFwiLCBcIsqIXCI6IFwidFwiLCBcIuKxplwiOiBcInRcIiwgXCLqnodcIjogXCJ0XCIsIFwi6pypXCI6IFwidHpcIiwgXCJ1XCI6IFwidVwiLCBcIuKTpFwiOiBcInVcIiwgXCLvvZVcIjogXCJ1XCIsIFwiw7lcIjogXCJ1XCIsIFwiw7pcIjogXCJ1XCIsIFwiw7tcIjogXCJ1XCIsIFwixalcIjogXCJ1XCIsIFwi4bm5XCI6IFwidVwiLCBcIsWrXCI6IFwidVwiLCBcIuG5u1wiOiBcInVcIiwgXCLFrVwiOiBcInVcIiwgXCLDvFwiOiBcInVcIiwgXCLHnFwiOiBcInVcIiwgXCLHmFwiOiBcInVcIiwgXCLHllwiOiBcInVcIiwgXCLHmlwiOiBcInVcIiwgXCLhu6dcIjogXCJ1XCIsIFwixa9cIjogXCJ1XCIsIFwixbFcIjogXCJ1XCIsIFwix5RcIjogXCJ1XCIsIFwiyJVcIjogXCJ1XCIsIFwiyJdcIjogXCJ1XCIsIFwixrBcIjogXCJ1XCIsIFwi4burXCI6IFwidVwiLCBcIuG7qVwiOiBcInVcIiwgXCLhu69cIjogXCJ1XCIsIFwi4butXCI6IFwidVwiLCBcIuG7sVwiOiBcInVcIiwgXCLhu6VcIjogXCJ1XCIsIFwi4bmzXCI6IFwidVwiLCBcIsWzXCI6IFwidVwiLCBcIuG5t1wiOiBcInVcIiwgXCLhubVcIjogXCJ1XCIsIFwiyolcIjogXCJ1XCIsIFwidlwiOiBcInZcIiwgXCLik6VcIjogXCJ2XCIsIFwi772WXCI6IFwidlwiLCBcIuG5vVwiOiBcInZcIiwgXCLhub9cIjogXCJ2XCIsIFwiyotcIjogXCJ2XCIsIFwi6p2fXCI6IFwidlwiLCBcIsqMXCI6IFwidlwiLCBcIuqdoVwiOiBcInZ5XCIsIFwid1wiOiBcIndcIiwgXCLik6ZcIjogXCJ3XCIsIFwi772XXCI6IFwid1wiLCBcIuG6gVwiOiBcIndcIiwgXCLhuoNcIjogXCJ3XCIsIFwixbVcIjogXCJ3XCIsIFwi4bqHXCI6IFwid1wiLCBcIuG6hVwiOiBcIndcIiwgXCLhuphcIjogXCJ3XCIsIFwi4bqJXCI6IFwid1wiLCBcIuKxs1wiOiBcIndcIiwgXCJ4XCI6IFwieFwiLCBcIuKTp1wiOiBcInhcIiwgXCLvvZhcIjogXCJ4XCIsIFwi4bqLXCI6IFwieFwiLCBcIuG6jVwiOiBcInhcIiwgXCJ5XCI6IFwieVwiLCBcIuKTqFwiOiBcInlcIiwgXCLvvZlcIjogXCJ5XCIsIFwi4buzXCI6IFwieVwiLCBcIsO9XCI6IFwieVwiLCBcIsW3XCI6IFwieVwiLCBcIuG7uVwiOiBcInlcIiwgXCLIs1wiOiBcInlcIiwgXCLhuo9cIjogXCJ5XCIsIFwiw79cIjogXCJ5XCIsIFwi4bu3XCI6IFwieVwiLCBcIuG6mVwiOiBcInlcIiwgXCLhu7VcIjogXCJ5XCIsIFwixrRcIjogXCJ5XCIsIFwiyY9cIjogXCJ5XCIsIFwi4bu/XCI6IFwieVwiLCBcInpcIjogXCJ6XCIsIFwi4pOpXCI6IFwielwiLCBcIu+9mlwiOiBcInpcIiwgXCLFulwiOiBcInpcIiwgXCLhupFcIjogXCJ6XCIsIFwixbxcIjogXCJ6XCIsIFwixb5cIjogXCJ6XCIsIFwi4bqTXCI6IFwielwiLCBcIuG6lVwiOiBcInpcIiwgXCLGtlwiOiBcInpcIiwgXCLIpVwiOiBcInpcIiwgXCLJgFwiOiBcInpcIiwgXCLisaxcIjogXCJ6XCIsIFwi6p2jXCI6IFwielwiIH07XG5leHBvcnRzLkFMUEhBQkVUUyA9IHtcbiAgICBBTFBIQTogXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIsXG4gICAgQUxQSEFOVU1FUklDOiBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5XCIsXG4gICAgQUxQSEFOVU1FUklDX1NJTVBMSUZJRUQ6IFwiYWJjZGVmZ2hqa21ucHFyc3R1dnd4eXpBQkNERUZHSEpLTU5QUVJTVFVWV1hZWjEyMzQ1Njc4OVwiLFxuICAgIEJBU0VfNjQ6IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODkrL1wiLFxuICAgIENPTVBMRVg6IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODkrLyReLV8uKCl7fTo8Pj8sO3xbXSolIyshQH49XCIsXG4gICAgSEVYQURFQ0lNQUw6IFwiYWJjZGVmMDEyMzQ1Njc4OVwiLFxuICAgIE5VTUVSSUM6IFwiMDEyMzQ1Njc4OVwiLFxufTtcbi8qKlxuICogVGVzdCBpZiB0aGUgaW5wdXQgaXMgYW4gZW1wdHkgc3RyaW5nLlxuICogVGhpcyBmdW5jdGlvbiBtYWtlcyBhIGJhc2ljIGNhc3QgdG8gc3RyaW5nIHNvIHlvdSBjYW4gZ2l2ZSBpdCBudW1iZXJzIGZvciBleGFtcGxlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0VtcHR5U3RyaW5nKGlucHV0KSB7XG4gICAgaWYgKHV0aWxzXzIuaXNOdWxsT3JVbmRlZmluZWQoaW5wdXQpIHx8ICF1dGlsc18yLmlzU3RyaW5nKGlucHV0KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRyaW0oKFwiXCIgKyBpbnB1dCkpLmxlbmd0aCA9PT0gMDtcbn1cbmV4cG9ydHMuaXNFbXB0eVN0cmluZyA9IGlzRW1wdHlTdHJpbmc7XG4vKipcbiAqIFRlc3QgaWYgdGhlIGlucHV0IGxvb2tzIGxpa2UgYW4gVVJMIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gaXNVcmwoaW5wdXQpIHtcbiAgICByZXR1cm4gdXRpbHNfMi5pc1N0cmluZyhpbnB1dCkgJiYgL14oKCgoaHR0cHM/fGZ0cHxydHNwfG1tcyk6KT9cXC9cXC8pPygoWzAtOWEtel8hfionKCkuJj0rJCUtXSs6ICk/WzAtOWEtel8hfionKCkuJj0rJCUtXStAKT8oKFswLTldezEsM31cXC4pezN9WzAtOV17MSwzfXwoWzAtOWEtel8hfionKCktXStcXC4pKihbMC05YS16XVswLTlhLXotXXswLDYxfSk/WzAtOWEtel1cXC5bYS16XXsyLDZ9fGxvY2FsaG9zdCkpPyg6WzAtOV17MSw0fSk/KChcXC8/KXwoXFwvWzAtOWEtel8hfionKCkuOz86QCY9KyQsJSMtXSspK1xcLz8pJC9pLnRlc3QoaW5wdXQpO1xufVxuZXhwb3J0cy5pc1VybCA9IGlzVXJsO1xuLyoqXG4gKiBOb3JtYWxpemUgYW4gVVJMIGJ5IHJlbW92aW5nIG11bHRpcGxlIHNsYXNoZXMsIGJhY2tzbGFzaGVzLCBldGMuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVVybCh1cmwpIHtcbiAgICByZXR1cm4gdXJsLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpLnJlcGxhY2UoLyhbXjpdKShcXC9cXC8rKS9nLCBcIiQxL1wiKTtcbn1cbmV4cG9ydHMubm9ybWFsaXplVXJsID0gbm9ybWFsaXplVXJsO1xuLyoqXG4gKiBSZW1vdmUgYWNjZW50cyBmcm9tIGEgc3RyaW5nLlxuICovXG5mdW5jdGlvbiByZW1vdmVBY2NlbnRzKGlucHV0KSB7XG4gICAgdmFyIG91dHB1dCA9IFwiXCI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbGV0dGVyID0gaW5wdXQuY2hhckF0KGkpO1xuICAgICAgICBvdXRwdXQgKz0gbGV0dGVyIGluIERJQUNSSVRJQ1NfTUFQID8gRElBQ1JJVElDU19NQVBbbGV0dGVyXSA6IGxldHRlcjtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cbmV4cG9ydHMucmVtb3ZlQWNjZW50cyA9IHJlbW92ZUFjY2VudHM7XG4vKipcbiAqIEJhc2ljIHNsdWdpZnkuXG4gKlxuICogQHNlZSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9tYXRoZXdieXJuZS8xMjgwMjg2XG4gKi9cbmZ1bmN0aW9uIHNsdWdpZnkoaW5wdXQpIHtcbiAgICByZXR1cm4gcmVtb3ZlQWNjZW50cyhTdHJpbmcoaW5wdXQpKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiLVwiKSAvLyBSZXBsYWNlIHNwYWNlcyB3aXRoIC1cbiAgICAgICAgLnJlcGxhY2UoL1teXFx3XFwtXSsvZywgXCItXCIpIC8vIFJlbW92ZSBhbGwgbm9uLXdvcmQgY2hhcnNcbiAgICAgICAgLnJlcGxhY2UoL1xcLVxcLSsvZywgXCItXCIpIC8vIFJlcGxhY2UgbXVsdGlwbGUgLSB3aXRoIHNpbmdsZSAtXG4gICAgICAgIC5yZXBsYWNlKC9eLSsvLCBcIlwiKSAvLyBUcmltIC0gZnJvbSBzdGFydCBvZiB0ZXh0XG4gICAgICAgIC5yZXBsYWNlKC8tKyQvLCBcIlwiKTsgLy8gVHJpbSAtIGZyb20gZW5kIG9mIHRleHRcbn1cbmV4cG9ydHMuc2x1Z2lmeSA9IHNsdWdpZnk7XG4vKipcbiAqIEdlbmVyYXRlcyBhIHJhbmRvbSBzdHJpbmcuXG4gKiBBdmFpbGFibGUgYWxwaGFiZXRzIGFyZSA6XG4gKiAgIC0gQUxQSEFCRVRTLkFMUEhBTlVNRVJJQ1xuICogICAtIEFMUEhBQkVUUy5BTFBIQVxuICogICAtIEFMUEhBQkVUUy5BTFBIQU5VTUVSSUNcbiAqICAgLSBBTFBIQUJFVFMuQUxQSEFOVU1FUklDX1NJTVBMSUZJRURcbiAqICAgLSBBTFBIQUJFVFMuQkFTRV82NFxuICogICAtIEFMUEhBQkVUUy5DT01QTEVYXG4gKiAgIC0gQUxQSEFCRVRTLkhFWEFERUNJTUFMXG4gKiAgIC0gQUxQSEFCRVRTLk5VTUVSSUNcbiAqXG4gKiBZb3UgY2FuIGFsc28gcHJvdmlkZSB5b3VyIG93bi5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoXG4gKiBAcGFyYW0ge3N0cmluZ30gYWxwaGFiZXQgKG9wdGlvbmFsLCBkZWZhdWx0OiBBTFBIQUJFVFMuQUxQSEFOVU1FUklDKVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHJhbmRvbVN0cmluZyhsZW5ndGgsIGFscGhhYmV0KSB7XG4gICAgaWYgKGFscGhhYmV0ID09PSB2b2lkIDApIHsgYWxwaGFiZXQgPSBleHBvcnRzLkFMUEhBQkVUUy5BTFBIQU5VTUVSSUM7IH1cbiAgICBpZiAobGVuZ3RoIDwgMSB8fCAhdXRpbHNfMi5pc1N0cmluZyhhbHBoYWJldCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBvdXRwdXQgPSBcIlwiO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb3V0cHV0ICs9IGFscGhhYmV0W3V0aWxzXzEucmFuZG9tSW50KDAsIGFscGhhYmV0Lmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cbmV4cG9ydHMucmFuZG9tU3RyaW5nID0gcmFuZG9tU3RyaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVwZGF0ZVVybEZyYWdtZW50ID0gZXhwb3J0cy5wYXJzZVVybEZyYWdtZW50ID0gZXhwb3J0cy53YWl0Rm9yRGVsYXkgPSBleHBvcnRzLm9uTmV4dEN5Y2xlID0gZXhwb3J0cy5hcmVFcXVhbCA9IGV4cG9ydHMucmVtb3ZlRnJvbUFycmF5ID0gZXhwb3J0cy5nZXRGaXJzdE9mID0gZXhwb3J0cy5nZXRGdW5jdGlvbkFyZ3VtZW50cyA9IGV4cG9ydHMuaHVtYW5GaWxlU2l6ZSA9IGV4cG9ydHMudGhyb3R0bGUgPSBleHBvcnRzLmRlYm91bmNlID0gZXhwb3J0cy5wcm94eSA9IGV4cG9ydHMucmFuZG9tSW5BcnJheSA9IGV4cG9ydHMucmFuZG9tSW50ID0gZXhwb3J0cy5oYXNQcm9wZXJ0eU5lc3RlZCA9IGV4cG9ydHMudHJpbSA9IGV4cG9ydHMudHJpbUFycmF5ID0gZXhwb3J0cy5lbnN1cmVTYW1lVHlwZSA9IGV4cG9ydHMuZW5zdXJlSW50ZWdlciA9IGV4cG9ydHMuZW5zdXJlTnVtYmVyID0gZXhwb3J0cy5lbnN1cmVTdHJpbmcgPSBleHBvcnRzLmVuc3VyZU9iamVjdCA9IGV4cG9ydHMuZW5zdXJlQm9vbGVhbiA9IGV4cG9ydHMuZW5zdXJlQXJyYXkgPSBleHBvcnRzLmlzQ29uc3RydWN0b3IgPSBleHBvcnRzLmlzVmFsaWRNb21lbnREYXRlID0gZXhwb3J0cy5pc0VsZW1lbnQgPSBleHBvcnRzLmlzUG9qbyA9IGV4cG9ydHMuaXNTY2FsYXIgPSBleHBvcnRzLmlzUHJvbWlzZUxpa2UgPSBleHBvcnRzLmlzSW50ZWdlciA9IGV4cG9ydHMuaXNWYWxpZE51bWJlciA9IGV4cG9ydHMuaXNBcnJheSA9IGV4cG9ydHMuaXNCb29sZWFuID0gZXhwb3J0cy5pc0Jsb2IgPSBleHBvcnRzLmlzRmlsZSA9IGV4cG9ydHMuaXNSZWdFeHAgPSBleHBvcnRzLmlzRnVuY3Rpb24gPSBleHBvcnRzLmlzRGF0ZSA9IGV4cG9ydHMuaXNOdW1lcmljID0gZXhwb3J0cy5pc051bWJlciA9IGV4cG9ydHMuaXNTdHJpbmcgPSBleHBvcnRzLmlzQmxhbmtPYmplY3QgPSBleHBvcnRzLmlzT2JqZWN0ID0gZXhwb3J0cy5pc0RlZmluZWQgPSBleHBvcnRzLmlzVW5kZWZpbmVkID0gZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGV4cG9ydHMubm9vcCA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIG9iamVjdF8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvdXRpbHMvb2JqZWN0XCIpO1xudmFyIGxvZGFzaFRvU3RyaW5nID0gcmVxdWlyZShcImxvZGFzaC90b1N0cmluZ1wiKTtcbnZhciBsb2Rhc2hUcmltID0gcmVxdWlyZShcImxvZGFzaC90cmltXCIpO1xuLyoqXG4gKiBEdW1teSBmdW5jdGlvbiBkb2luZyBub3RoaW5nLlxuICovXG5mdW5jdGlvbiBub29wKCkge1xuICAgIC8vIERvIG5vdGhpbmcuXG59XG5leHBvcnRzLm5vb3AgPSBub29wO1xuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgcmVmZXJlbmNlIGlzIG51bGwgb3IgdW5kZWZpbmVkLlxuICovXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCI7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG4vKipcbiAqIERldGVybWluZXMgaWYgYSByZWZlcmVuY2UgaXMgdW5kZWZpbmVkLlxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCI7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG4vKipcbiAqIERldGVybWluZXMgaWYgYSByZWZlcmVuY2UgaXMgZGVmaW5lZC5cbiAqL1xuZnVuY3Rpb24gaXNEZWZpbmVkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIjtcbn1cbmV4cG9ydHMuaXNEZWZpbmVkID0gaXNEZWZpbmVkO1xuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgcmVmZXJlbmNlIGlzIGFuIGBPYmplY3RgLiBVbmxpa2UgYHR5cGVvZmAgaW4gSmF2YVNjcmlwdCwgYG51bGxgcyBhcmUgbm90XG4gKiBjb25zaWRlcmVkIHRvIGJlIG9iamVjdHMuIE5vdGUgdGhhdCBKYXZhU2NyaXB0IGFycmF5cyBhcmUgb2JqZWN0cy5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUsIHN0cmljdCkge1xuICAgIGlmIChzdHJpY3QgPT09IHZvaWQgMCkgeyBzdHJpY3QgPSBmYWxzZTsgfVxuICAgIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2lzb2JqZWN0NFxuICAgIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmICghc3RyaWN0IHx8ICFpc0FycmF5KHZhbHVlKSkpO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhIG51bGwgcHJvdG90eXBlXG4gKi9cbmZ1bmN0aW9uIGlzQmxhbmtPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmICFPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xufVxuZXhwb3J0cy5pc0JsYW5rT2JqZWN0ID0gaXNCbGFua09iamVjdDtcbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIHJlZmVyZW5jZSBpcyBhIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgcmVmZXJlbmNlIGlzIGEgbnVtYmVyLlxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCI7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG4vKipcbiAqIFRlc3QgaWYgYSB2YXJpYWJsZSByZXByZXNlbnQgbnVtYmVyIG9yIG5vdC5cbiAqL1xuZnVuY3Rpb24gaXNOdW1lcmljKHZhbHVlKSB7XG4gICAgcmV0dXJuICFpc09iamVjdCh2YWx1ZSkgJiYgIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSk7XG59XG5leHBvcnRzLmlzTnVtZXJpYyA9IGlzTnVtZXJpYztcbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGEgZGF0ZS5cbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IFwiW29iamVjdCBEYXRlXVwiO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG4vKipcbiAqIERldGVybWluZXMgaWYgdGhlIGlucHV0IGlzIGEgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCI7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24gb2JqZWN0LlxuICogVGhlIGlucHV0IG11c3QgYmUgYSBSZWdFeHAgb2JqZWN0IGluIG9yZGVyIHRvIHJldHVybiB0cnVlLCBOT1QgYSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGlzUmVnRXhwKHZhbHVlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IFwiW29iamVjdCBSZWdFeHBdXCI7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG4vKipcbiAqIFRlc3QgaWYgdGhlIGlucHV0IGlzIGEgRmlsZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGlzRmlsZSh2YWx1ZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgRmlsZV1cIjtcbn1cbmV4cG9ydHMuaXNGaWxlID0gaXNGaWxlO1xuLyoqXG4gKiBUZXN0IGlmIHRoZSBpbnB1dCBpcyBhIGJsb2Igb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpc0Jsb2IodmFsdWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gXCJbb2JqZWN0IEJsb2JdXCI7XG59XG5leHBvcnRzLmlzQmxvYiA9IGlzQmxvYjtcbi8qKlxuICogVGVzdCBpZiB0aGUgaW5wdXQgaXMgYSBib29sZWFuLlxuICovXG5mdW5jdGlvbiBpc0Jvb2xlYW4oaW5wdXQpIHtcbiAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSBcImJvb2xlYW5cIjtcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuLyoqXG4gKiBUZXN0IGlmIHRoZSBpbnB1dCBpcyBhIHJlYWwgYXJyYXkuXG4gKiBPYmplY3RzIHdpbGwgcmV0dXJuIGZhbHNlLlxuICovXG5mdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG4vKipcbiAqIFRlc3QgaWYgdGhlIGlucHV0IGlzIGEgbnVtYmVyLlxuICogVGhpcyBmdW5jdGlvbiBub3Qgb25seSBjaGVja3MgdGhlIHR5cGUgbGlrZSB0aGUgYW5ndWxhciBvbmUsIGl0IGFzbyBjaGVjayBpZiBpdCBpcyBhbiBpbnZhbGlkIG51bWJlci5cbiAqL1xuZnVuY3Rpb24gaXNWYWxpZE51bWJlcihpbnB1dCkge1xuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgIWlzTmFOKGlucHV0KTtcbn1cbmV4cG9ydHMuaXNWYWxpZE51bWJlciA9IGlzVmFsaWROdW1iZXI7XG4vKipcbiAqIFRlc3QgaWYgdGhlIGlucHV0IGlzIGFuIGludGVnZXIuXG4gKiBOb3RpY2U6IFwiMVwiIHdpbGwgcmV0dXJuIGZhbHNlIGJlY2F1c2UgaXQncyBhIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gaXNJbnRlZ2VyKGlucHV0KSB7XG4gICAgcmV0dXJuIGlzVmFsaWROdW1iZXIoaW5wdXQpICYmIGlucHV0ICUgMSA9PT0gMDtcbn1cbmV4cG9ydHMuaXNJbnRlZ2VyID0gaXNJbnRlZ2VyO1xuLyoqXG4gKiBUZXN0IGlmIHRoZSBpbnB1dCBsb29rcyBsaWtlIGEgcHJvbWlzZS5cbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlTGlrZShpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dCAmJiBpc0Z1bmN0aW9uKGlucHV0LnRoZW4pO1xufVxuZXhwb3J0cy5pc1Byb21pc2VMaWtlID0gaXNQcm9taXNlTGlrZTtcbi8qKlxuICogVGVzdCBpZiB0aGUgaW5wdXQgaXMgYSBzY2FsYXIgdHlwZS5cbiAqL1xuZnVuY3Rpb24gaXNTY2FsYXIoaW5wdXQpIHtcbiAgICByZXR1cm4gaXNTdHJpbmcoaW5wdXQpIHx8XG4gICAgICAgIGlzTnVtYmVyKGlucHV0KSB8fFxuICAgICAgICBpc0Jvb2xlYW4oaW5wdXQpIHx8XG4gICAgICAgIGlzTnVsbE9yVW5kZWZpbmVkKGlucHV0KTtcbn1cbmV4cG9ydHMuaXNTY2FsYXIgPSBpc1NjYWxhcjtcbi8qKlxuICogVGVzdCBpZiB0aGUgaW5wdXQgaXMgYSBwbGFpbiBvbGQgamF2YXNjcmlwdCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHthbnl9ICAgICBpbnB1dFxuICogQHBhcmFtIHtib29sZWFufSBkZWVwICAob3B0aW9uYWwsIGRlZmF1bHQ6IHRydWUpIGlmIHRydWUsIHRoZSBjaGVjayB3aWxsIGJlIGRvbmUgcmVjdXJzaXZlbHkgb24gYWxsIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdC5cbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1Bvam8oaW5wdXQsIGRlZXApIHtcbiAgICBpZiAoZGVlcCA9PT0gdm9pZCAwKSB7IGRlZXAgPSB0cnVlOyB9XG4gICAgaWYgKGlucHV0ID09PSBudWxsIHx8IHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5wdXQpICE9PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFkZWVwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB2YXIgdGVzdE9ialZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCB2YWx1ZV8xID0gdmFsdWU7IF9pIDwgdmFsdWVfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZhbHVlXzFbX2ldO1xuICAgICAgICAgICAgICAgIGlmICghdGVzdE9ialZhbHVlKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzU2NhbGFyKHZhbHVlKSAmJiAhaXNQb2pvKHZhbHVlLCB0cnVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IE9iamVjdC5rZXlzKGlucHV0KTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGtleSA9IF9hW19pXTtcbiAgICAgICAgaWYgKCF0ZXN0T2JqVmFsdWUoaW5wdXRba2V5XSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuaXNQb2pvID0gaXNQb2pvO1xuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgcmVmZXJlbmNlIGlzIGEgRE9NIGVsZW1lbnQgKG9yIHdyYXBwZWQgalF1ZXJ5IGVsZW1lbnQpLlxuICovXG5mdW5jdGlvbiBpc0VsZW1lbnQobm9kZSkge1xuICAgIHJldHVybiAhIShub2RlICYmXG4gICAgICAgIChub2RlLm5vZGVOYW1lIC8vIFdlIGFyZSBhIGRpcmVjdCBlbGVtZW50LlxuICAgICAgICAgICAgfHwgKG5vZGUucHJvcCAmJiBub2RlLmF0dHIgJiYgbm9kZS5maW5kKSkpOyAvLyBXZSBoYXZlIGFuIG9uIGFuZCBmaW5kIG1ldGhvZCBwYXJ0IG9mIGpRdWVyeSBBUEkuXG59XG5leHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbi8qKlxuICogVGVzdCBpZiB0aGUgaW5wdXQgaXMgYSB2YWxpZCBtb21lbnRqcyBkYXRlLlxuICovXG5mdW5jdGlvbiBpc1ZhbGlkTW9tZW50RGF0ZSh2YWx1ZSkge1xuICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiZcbiAgICAgICAgKCFpc1VuZGVmaW5lZCh2YWx1ZS5pc01vbWVudCkgfHwgIWlzVW5kZWZpbmVkKHZhbHVlLl9pc0FNb21lbnRPYmplY3QpKSAmJlxuICAgICAgICAoKGlzRnVuY3Rpb24odmFsdWUuaXNWYWxpZCkgJiYgdmFsdWUuaXNWYWxpZCgpKSB8fCB2YWx1ZS5faXNWYWxpZCA9PT0gdHJ1ZSk7XG59XG5leHBvcnRzLmlzVmFsaWRNb21lbnREYXRlID0gaXNWYWxpZE1vbWVudERhdGU7XG4vKipcbiAqIFRlc3QgaWYgdGhlIGlucHV0IHZhbHVlIGlzIGFuIG9iamVjdCBjb25zdHJ1Y3Rvci5cbiAqL1xuZnVuY3Rpb24gaXNDb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICAgIG5ldyBuZXcgUHJveHkodmFsdWUsIHsgY29uc3RydWN0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB7fTsgfSB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuaXNDb25zdHJ1Y3RvciA9IGlzQ29uc3RydWN0b3I7XG4vKipcbiAqIEVuc3VyZSB0aGUgaW5wdXQgaXMgYWx3YXlzIGEgdmFsaWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGVuc3VyZUFycmF5KGlucHV0KSB7XG4gICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKGlucHV0KSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmICghaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuIFtpbnB1dF07XG4gICAgfVxuICAgIHJldHVybiBpbnB1dDtcbn1cbmV4cG9ydHMuZW5zdXJlQXJyYXkgPSBlbnN1cmVBcnJheTtcbi8qKlxuICogRW5zdXJlIHRoZSBpbnB1dCBpcyBjb252ZXJ0ZWQgdG8gYSBib29sZWFuLlxuICovXG5mdW5jdGlvbiBlbnN1cmVCb29sZWFuKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0ID09PSB0cnVlIHx8IGlucHV0ID09PSBcIlwiIHx8IGlucHV0ID09PSBcInRydWVcIiB8fCBpbnB1dCA9PT0gXCJvblwiIHx8ICEhaW5wdXQ7XG59XG5leHBvcnRzLmVuc3VyZUJvb2xlYW4gPSBlbnN1cmVCb29sZWFuO1xuLyoqXG4gKiBFbnN1cmUgdGhlIGlucHV0IGlzIGNvbnZlcnRlZCB0byBhbiBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGVuc3VyZU9iamVjdChpbnB1dCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdm9pZCAwKSB7IGRlZmF1bHRWYWx1ZSA9IHt9OyB9XG4gICAgcmV0dXJuIGlzT2JqZWN0KGlucHV0KSA/IGlucHV0IDogZGVmYXVsdFZhbHVlO1xufVxuZXhwb3J0cy5lbnN1cmVPYmplY3QgPSBlbnN1cmVPYmplY3Q7XG4vKipcbiAqIEVuc3VyZSB0aGUgaW5wdXQgaXMgY29udmVydGVkIHRvIGEgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBlbnN1cmVTdHJpbmcoaW5wdXQpIHtcbiAgICByZXR1cm4gIWlzTnVsbE9yVW5kZWZpbmVkKGlucHV0KSA/IGxvZGFzaFRvU3RyaW5nKGlucHV0KSA6IFwiXCI7XG59XG5leHBvcnRzLmVuc3VyZVN0cmluZyA9IGVuc3VyZVN0cmluZztcbi8qKlxuICogRW5zdXJlIHRoZSBpbnB1dCBpcyBjb252ZXJ0ZWQgdG8gYSB2YWxpZCBudW1iZXIuXG4gKi9cbmZ1bmN0aW9uIGVuc3VyZU51bWJlcihpbnB1dCwgZGVmYXVsdFZhbHVlKSB7XG4gICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdm9pZCAwKSB7IGRlZmF1bHRWYWx1ZSA9IDA7IH1cbiAgICBpZiAoaXNTdHJpbmcoaW5wdXQpKSB7XG4gICAgICAgIGlmIChpbnB1dC5pbmRleE9mKFwiLlwiKSA8IDApIHtcbiAgICAgICAgICAgIGlucHV0ID0gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0ID0gcGFyc2VGbG9hdChpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzVmFsaWROdW1iZXIoaW5wdXQpID8gaW5wdXQgOiBkZWZhdWx0VmFsdWU7XG59XG5leHBvcnRzLmVuc3VyZU51bWJlciA9IGVuc3VyZU51bWJlcjtcbi8qKlxuICogRW5zdXJlIHRoZSBpbnB1dCBpcyBjb252ZXJ0ZWQgdG8gYSB2YWxpZCBudW1iZXIuXG4gKi9cbmZ1bmN0aW9uIGVuc3VyZUludGVnZXIoaW5wdXQsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHZvaWQgMCkgeyBkZWZhdWx0VmFsdWUgPSAwOyB9XG4gICAgaWYgKGlzU3RyaW5nKGlucHV0KSkge1xuICAgICAgICBpbnB1dCA9IHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgfVxuICAgIHJldHVybiBpc1ZhbGlkTnVtYmVyKGlucHV0KSA/IGlucHV0IDogZGVmYXVsdFZhbHVlO1xufVxuZXhwb3J0cy5lbnN1cmVJbnRlZ2VyID0gZW5zdXJlSW50ZWdlcjtcbi8qKlxuICogRW5zdXJlIHRoZSBpbnB1dCBpcyBjb252ZXJ0ZWQgdG8gYSB2YWxpZCBudW1iZXIuXG4gKi9cbmZ1bmN0aW9uIGVuc3VyZVNhbWVUeXBlKGlucHV0LCByZWZlcmVuY2VWYWx1ZSkge1xuICAgIHZhciB0YXJnZXRUeXBlID0gdHlwZW9mIChyZWZlcmVuY2VWYWx1ZSk7XG4gICAgc3dpdGNoICh0YXJnZXRUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6IHJldHVybiBlbnN1cmVTdHJpbmcoaW5wdXQpO1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBjYXNlICdiaWdpbnQnOiByZXR1cm4gZW5zdXJlTnVtYmVyKGlucHV0KTtcbiAgICAgICAgY2FzZSAnYm9vbGVhbic6IHJldHVybiBlbnN1cmVCb29sZWFuKGlucHV0KTtcbiAgICAgICAgY2FzZSAnb2JqZWN0Jzoge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkocmVmZXJlbmNlVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuc3VyZUFycmF5KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbnN1cmVPYmplY3QoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6IHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiBpbnB1dDtcbn1cbmV4cG9ydHMuZW5zdXJlU2FtZVR5cGUgPSBlbnN1cmVTYW1lVHlwZTtcbi8qKlxuICogVHJpbSBlYWNoIGVsZW1lbnQgb2YgYSBzdHJpbmcgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHRyaW1BcnJheShpbnB1dCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5wdXRbaV0gPSBsb2Rhc2hUcmltKGlucHV0W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xufVxuZXhwb3J0cy50cmltQXJyYXkgPSB0cmltQXJyYXk7XG4vKipcbiAqIFRyaW0gYSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIHRyaW0oKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHJldHVybiBsb2Rhc2hUcmltLmFwcGx5KG51bGwsIGFyZ3MpO1xufVxuZXhwb3J0cy50cmltID0gdHJpbTtcbi8qKlxuICogVGVzdCBpZiBhbiBvYmplY3QgY29udGFpbnMgYSBuZXN0ZWQgc2V0IG9mIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9ICAgIG9ialxuICogQHBhcmFtIHsuLi5zdHJpbmd9IGtleXMgYW55IG51bWJlciBvZiBrZXlzIHRoZSBjaGVjay5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgIENoZWNrcyBhcmUgbmVzdGVkLCBtZWFuaW5nIHRoZSBzZWNvbmQgcHJvcGVydHkgd2lsbCBoYXZlIHRvIGJlIGluIGFuIG9iamVjdFxuICogICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlZCBieSB0aGUgZmlyc3Qgb25lLCBhbmQgc28gb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGhhc1Byb3BlcnR5TmVzdGVkKG9iaikge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAga2V5c1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgaWYgKCFpc09iamVjdChvYmopKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yICh2YXIgX2EgPSAwLCBrZXlzXzEgPSBrZXlzOyBfYSA8IGtleXNfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNfMVtfYV07XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBvYmogPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLmhhc1Byb3BlcnR5TmVzdGVkID0gaGFzUHJvcGVydHlOZXN0ZWQ7XG4vKipcbiAqIEdlbmVyYXRlcyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gdHdvIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59XG5leHBvcnRzLnJhbmRvbUludCA9IHJhbmRvbUludDtcbi8qKlxuICogUmV0dXJuIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBhbiBhcnJheS5cbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW5BcnJheShhcnIpIHtcbiAgICByZXR1cm4gYXJyW3JhbmRvbUludCgwLCBhcnIubGVuZ3RoIC0gMSldO1xufVxuZXhwb3J0cy5yYW5kb21JbkFycmF5ID0gcmFuZG9tSW5BcnJheTtcbi8qKlxuICogQmluZCBhIGZ1bmN0aW9uIHRvIGEgY29udGV4dCwgb3B0aW9uYWxseSBwYXJ0aWFsbHkgYXBwbHlpbmcgYW55IGFyZ3VtZW50cy5cbiAqIEV4dHJhY3RlZCBmcm9tIGpRdWVyeSAzLjIuMSB3aXRoIG1pbm9yIG1vZGlmaWNhdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIHByb3h5KGZuLCBjb250ZXh0KSB7XG4gICAgdmFyIHRtcDtcbiAgICB2YXIgYXJncztcbiAgICBpZiAodHlwZW9mIGNvbnRleHQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdG1wID0gZm5bY29udGV4dF07XG4gICAgICAgIGNvbnRleHQgPSBmbjtcbiAgICAgICAgZm4gPSB0bXA7XG4gICAgfVxuICAgIC8vIFF1aWNrIGNoZWNrIHRvIGRldGVybWluZSBpZiB0YXJnZXQgaXMgY2FsbGFibGUsIGluIHRoZSBzcGVjXG4gICAgLy8gdGhpcyB0aHJvd3MgYSBUeXBlRXJyb3IsIGJ1dCB3ZSB3aWxsIGp1c3QgcmV0dXJuIHVuZGVmaW5lZC5cbiAgICBpZiAoIWlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFNpbXVsYXRlZCBiaW5kXG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQgfHwgdGhpcywgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG59XG5leHBvcnRzLnByb3h5ID0gcHJveHk7XG4vKipcbiAqIEVuc3VyZSBhIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkIGFmdGVyIG5vdCBiZWluZyBjYWxsZWQgZm9yIGEgY2VydGFpbiBhbW91bnQgb2YgdGltZS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jICAgICAgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtIHtudW1iZXJ9ICAgd2FpdCAgICAgIHRpbWUgd2l0aCBubyBjYWxsIHRvIHdhaXQgYmVmb3JlIGNhbGxpbmcgdGhlIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59ICBpbW1lZGlhdGUgKG9wdGlvbmFsLCBkZWZhdWx0OiB0cnVlKSBjYWxsIHRoZSBmdW5jdGlvbiBpbW1lZGlhdGx5IGFmdGVyIHRoZSBmaXJzdCBjYWxsIG9yIG5vdD9cbiAqXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmRlYm91bmNlID0gZGVib3VuY2U7XG4vKipcbiAqIFRocm90dGxlIGNhbGwgdG8gYSBmdW5jdGlvbiB0byBlbnN1cmUgaXQgaXMgbm90IGNhbGxlZCBtb3JlIGZyZXF1ZW50bHkgdGhhbiBhIHNwZWNpZmllZCB0aW1pbmcuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyAgICAgIGZ1bmN0aW9uIHRvIGNhbGxcbiAqIEBwYXJhbSB7bnVtYmVyfSAgIHRocmVzaG9sZCBtaW5pbXVtIHRpbWUgYmV0d2VlbiBjYWxscywgaW4gbXNcbiAqIEBwYXJhbSB7b2JqZWN0fSAgIHNjb3BlICAgICAob3B0aW9uYWwsIGRlZmF1bHQ6IHRoaXMpXG4gKlxuICogQHJldHVybnMge2Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB0aHJlc2hvbGQsIHNjb3BlKSB7XG4gICAgaWYgKHNjb3BlID09PSB2b2lkIDApIHsgc2NvcGUgPSBudWxsOyB9XG4gICAgdmFyIGxhc3Q7XG4gICAgdmFyIGRlZmVyVGltZXI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBzY29wZSB8fCB0aGlzO1xuICAgICAgICB2YXIgbm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGlmIChsYXN0ICYmIG5vdyA8IGxhc3QgKyB0aHJlc2hvbGQpIHtcbiAgICAgICAgICAgIC8vIGhvbGQgb24gdG8gaXRcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChkZWZlclRpbWVyKTtcbiAgICAgICAgICAgIGRlZmVyVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsYXN0ID0gbm93O1xuICAgICAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICB9LCB0aHJlc2hvbGQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGFzdCA9IG5vdztcbiAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy50aHJvdHRsZSA9IHRocm90dGxlO1xuLyoqXG4gKiBDb252ZXJ0IGEgc2l6ZSBpbiBieXRlcyB0byBhIGh1bWFuIGZyaWVuZGx5IHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gaHVtYW5GaWxlU2l6ZShieXRlcywgc2kpIHtcbiAgICBpZiAoc2kgPT09IHZvaWQgMCkgeyBzaSA9IHRydWU7IH1cbiAgICB2YXIgdGhyZXNoID0gc2kgPyAxMDAwIDogMTAyNDtcbiAgICBpZiAoTWF0aC5hYnMoYnl0ZXMpIDwgdGhyZXNoKSB7XG4gICAgICAgIHJldHVybiBieXRlcyArICcgQic7XG4gICAgfVxuICAgIHZhciB1bml0cyA9IHNpXG4gICAgICAgID8gWydrQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddXG4gICAgICAgIDogWydLaUInLCAnTWlCJywgJ0dpQicsICdUaUInLCAnUGlCJywgJ0VpQicsICdaaUInLCAnWWlCJ107XG4gICAgdmFyIHUgPSAtMTtcbiAgICBkbyB7XG4gICAgICAgIGJ5dGVzIC89IHRocmVzaDtcbiAgICAgICAgKyt1O1xuICAgIH0gd2hpbGUgKE1hdGguYWJzKGJ5dGVzKSA+PSB0aHJlc2ggJiYgdSA8IHVuaXRzLmxlbmd0aCAtIDEpO1xuICAgIHJldHVybiBieXRlcy50b0ZpeGVkKDEpICsgJyAnICsgdW5pdHNbdV07XG59XG5leHBvcnRzLmh1bWFuRmlsZVNpemUgPSBodW1hbkZpbGVTaXplO1xuLyoqXG4gKiBUcnkgdG8gZ2V0IGFyZ3VtZW50cyBuYW1lcyBvZiBhIGZ1bmN0aW9uIGF0IHJ1bnRpbWUuXG4gKiBAc291cmNlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85OTI0NDYzLzExMTA2MzVcbiAqL1xuZnVuY3Rpb24gZ2V0RnVuY3Rpb25Bcmd1bWVudHMoZnVuYykge1xuICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHZhciBTVFJJUF9DT01NRU5UUyA9IC8oXFwvXFwvLiokKXwoXFwvXFwqW1xcc1xcU10qP1xcKlxcLyl8KFxccyo9W14sXFwpXSooKCcoPzpcXFxcJ3xbXidcXHJcXG5dKSonKXwoXCIoPzpcXFxcXCJ8W15cIlxcclxcbl0pKlwiKSl8KFxccyo9W14sXFwpXSopKS9tZztcbiAgICB2YXIgQVJHVU1FTlRfTkFNRVMgPSAvKFteXFxzLF0rKS9nO1xuICAgIHZhciBzdHIgPSBmdW5jLnRvU3RyaW5nKCkucmVwbGFjZShTVFJJUF9DT01NRU5UUywgJycpO1xuICAgIHZhciByZXN1bHQgPSBzdHIuc2xpY2Uoc3RyLmluZGV4T2YoJygnKSArIDEsIHN0ci5pbmRleE9mKCcpJykpLm1hdGNoKEFSR1VNRU5UX05BTUVTKTtcbiAgICByZXR1cm4gcmVzdWx0ICE9PSBudWxsID8gcmVzdWx0IDogW107XG59XG5leHBvcnRzLmdldEZ1bmN0aW9uQXJndW1lbnRzID0gZ2V0RnVuY3Rpb25Bcmd1bWVudHM7XG4vKipcbiAqIEdldHMgdGhlIGZpcnN0IGRlZmluZWQgdmFsdWUgb2YgdGhlIGxpc3Qgb3IgYXJnLlxuICogSWYgYWxsIGFyZ3VtZW50cyBhcmUgdW5kZWZpbmVkLCB1bmRlZmluZWQgaXMgcmV0dXJuZWQuXG4gKi9cbmZ1bmN0aW9uIGdldEZpcnN0T2YoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBmb3IgKHZhciBfYSA9IDAsIGFyZ3NfMSA9IGFyZ3M7IF9hIDwgYXJnc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICB2YXIgYXJnID0gYXJnc18xW19hXTtcbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChhcmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG59XG5leHBvcnRzLmdldEZpcnN0T2YgPSBnZXRGaXJzdE9mO1xuLyoqXG4gKiBTZWFyY2ggdGhlIGZpcnN0IG1hdGNoIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXkgYW5kIHJlbW92ZXMgaXQuXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUZyb21BcnJheShhciwgaXRlbSkge1xuICAgIHZhciBwb3MgPSBhci5pbmRleE9mKGl0ZW0pO1xuICAgIGlmIChwb3MgPj0gMCkge1xuICAgICAgICBhci5zcGxpY2UocG9zLCAxKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMucmVtb3ZlRnJvbUFycmF5ID0gcmVtb3ZlRnJvbUFycmF5O1xuLyoqXG4gKiBUZXN0IGlmIHR3byB2YWx1ZXMgYXJlIHRoZSBzYW1lLCBubyBtYXR0ZXIgdGhlaXIgdHlwZS5cbiAqL1xuZnVuY3Rpb24gYXJlRXF1YWwoYSwgYikge1xuICAgIHZhciB0YSA9IGEgIT09IG51bGwgPyB0eXBlb2YgKGEpIDogJ251bGwnO1xuICAgIHZhciB0YiA9IGIgIT09IG51bGwgPyB0eXBlb2YgKGIpIDogJ251bGwnO1xuICAgIGlmICh0YSAhPT0gdGIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRhKSB7XG4gICAgICAgIGNhc2UgXCJ1bmRlZmluZWRcIjogcmV0dXJuIHRydWU7XG4gICAgICAgIGNhc2UgXCJvYmplY3RcIjogcmV0dXJuIG9iamVjdF8xLmFyZVNhbWVPYmplY3RzKGEsIGIpO1xuICAgICAgICBjYXNlIFwic3ltYm9sXCI6IHJldHVybiB0cnVlO1xuICAgICAgICAvLyBmdW5jdGlvbiwgYm9vbGVhbiwgbnVtYmVyLCBzdHJpbmcsIC4uLlxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuYXJlRXF1YWwgPSBhcmVFcXVhbDtcbi8qKlxuICogUmV0dXJuIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIG9uIHRoZSBuZXh0IHRoZSBuZXh0IHJlbmRlciBjeWNsZS5cbiAqL1xuZnVuY3Rpb24gb25OZXh0Q3ljbGUoKSB7XG4gICAgcmV0dXJuIHRzbGliXzEuX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0c2xpYl8xLl9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHdhaXRGb3JEZWxheSgwKV07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5vbk5leHRDeWNsZSA9IG9uTmV4dEN5Y2xlO1xuLyoqXG4gKiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgYWZ0ZXIgYSBjZXJ0YWluIGRlbGF5IChpbiBtcykuXG4gKi9cbmZ1bmN0aW9uIHdhaXRGb3JEZWxheShkdXJhdGlvbikge1xuICAgIHJldHVybiB0c2xpYl8xLl9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHNsaWJfMS5fX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChyZXNvbHZlLCBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfSldO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmV4cG9ydHMud2FpdEZvckRlbGF5ID0gd2FpdEZvckRlbGF5O1xuLyoqXG4gKiBDb252ZXJ0IHRoZSB1cmwgZnJhZ21lbnQgaW50byBhIGtleS92YWx1ZSBwYWlyIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VVcmxGcmFnbWVudCgpIHtcbiAgICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgICByZXR1cm4gaGFzaC5zcGxpdCgnJicpLnJlZHVjZShmdW5jdGlvbiAocmVzdWx0LCBpdGVtKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGl0ZW0uc3BsaXQoJz0nKTtcbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgcmVzdWx0W3BhcnRzWzBdXSA9IHBhcnRzWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwge30pO1xufVxuZXhwb3J0cy5wYXJzZVVybEZyYWdtZW50ID0gcGFyc2VVcmxGcmFnbWVudDtcbi8qKlxuICogVXBkYXRlIHRoZSBmcmFnbWVudCBvZiB0aGUgdXJsIHdpdGggYSBrZXkvdmFsdWUgcGFpciBvYmplY3QuXG4gKiBFeGlzdGluZyBlbGVtZW50cyBhcmUgb3ZlcnJpZGRlbi5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlVXJsRnJhZ21lbnQob2JqKSB7XG4gICAgdmFyIGZyYWdtZW50ID0gW107XG4gICAgb2JqID0gb2JqZWN0XzEubWVyZ2Uoe30sIHBhcnNlVXJsRnJhZ21lbnQoKSwgb2JqKTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmtleXMob2JqKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGtleSA9IF9hW19pXTtcbiAgICAgICAgZnJhZ21lbnQucHVzaChrZXkgKyAnPScgKyBvYmpba2V5XSk7XG4gICAgfVxuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gZnJhZ21lbnQuam9pbignJicpO1xufVxuZXhwb3J0cy51cGRhdGVVcmxGcmFnbWVudCA9IHVwZGF0ZVVybEZyYWdtZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFic3RyYWN0RGlyZWN0aXZlID0gdm9pZCAwO1xudmFyIG9iamVjdF8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvdXRpbHMvb2JqZWN0XCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy91dGlsc1wiKTtcbnZhciBBYnN0cmFjdERpcmVjdGl2ZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBYnN0cmFjdERpcmVjdGl2ZSgpIHtcbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVycyA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgIHRoaXMuYmluZGluZ1ZhbHVlc1dhdGNoZXJzID0ge307XG4gICAgICAgIHRoaXMubGFzdEJpbmRpbmdWYWx1ZVNuYXBzaG90ID0ge307XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0RG9jXG4gICAgICovXG4gICAgQWJzdHJhY3REaXJlY3RpdmUucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZURhdGEoZWwsIGJpbmRpbmcsIHZub2RlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBpbmhlcml0RG9jXG4gICAgICovXG4gICAgQWJzdHJhY3REaXJlY3RpdmUucHJvdG90eXBlLmluc2VydGVkID0gZnVuY3Rpb24gKGVsLCBiaW5kaW5nLCB2bm9kZSwgb2xkVm5vZGUpIHtcbiAgICAgICAgdGhpcy51cGRhdGVEYXRhKGVsLCBiaW5kaW5nLCB2bm9kZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdERvY1xuICAgICAqL1xuICAgIEFic3RyYWN0RGlyZWN0aXZlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZURhdGEoZWwsIGJpbmRpbmcsIHZub2RlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBpbmhlcml0RG9jXG4gICAgICovXG4gICAgQWJzdHJhY3REaXJlY3RpdmUucHJvdG90eXBlLmNvbXBvbmVudFVwZGF0ZWQgPSBmdW5jdGlvbiAoZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZURhdGEoZWwsIGJpbmRpbmcsIHZub2RlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBpbmhlcml0RG9jXG4gICAgICovXG4gICAgQWJzdHJhY3REaXJlY3RpdmUucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uIChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZub2RlKSB7XG4gICAgICAgIHRoaXMudXBkYXRlRGF0YShlbCwgYmluZGluZywgdm5vZGUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVHJ5IHRvIGdldCBhIHZhbHVlIGZyb20gdGhlIGRpcmVjdGl2ZSdzIGJpbmRpbmcuXG4gICAgICovXG4gICAgQWJzdHJhY3REaXJlY3RpdmUucHJvdG90eXBlLmZldGNoQmluZGluZ1ZhbHVlID0gZnVuY3Rpb24gKG5hbWUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBpZiAoZGVmYXVsdFZhbHVlID09PSB2b2lkIDApIHsgZGVmYXVsdFZhbHVlID0gbnVsbDsgfVxuICAgICAgICBpZiAodGhpcy5iaW5kaW5nICYmIHV0aWxzXzEuaXNPYmplY3QodGhpcy5iaW5kaW5nLnZhbHVlKSAmJiAhdXRpbHNfMS5pc1VuZGVmaW5lZCh0aGlzLmJpbmRpbmcudmFsdWVbbmFtZV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5iaW5kaW5nLnZhbHVlW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfTtcbiAgICBBYnN0cmFjdERpcmVjdGl2ZS5wcm90b3R5cGUud2F0Y2hCaWRpbmdWYWx1ZSA9IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodXRpbHNfMS5pc1VuZGVmaW5lZCh0aGlzLmJpbmRpbmdWYWx1ZXNXYXRjaGVyc1tuYW1lXSkpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZGluZ1ZhbHVlc1dhdGNoZXJzW25hbWVdID0geyBsYXN0VmFsdWU6IHVuZGVmaW5lZCwgY2FsbGJhY2tzOiBbXSB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmluZGluZ1ZhbHVlc1dhdGNoZXJzW25hbWVdLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEJpbmQgYW4gZXZlbnQgdG8gYW4gSFRNTCBlbGVtZW50IGFuZCBndWFyYW50ZWUgdGhlIGNvbnRleHQgdG8gYmUgdGhlIGRpcmVjdGl2ZSdzIGNsYXNzIGluc3RhbmNlLlxuICAgICAqL1xuICAgIEFic3RyYWN0RGlyZWN0aXZlLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGVsLCBuYW1lLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnMuaGFzKGVsKSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudExpc3RlbmVycy5zZXQoZWwsIHt9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWFwID0gdGhpcy5ldmVudExpc3RlbmVycy5nZXQoZWwpO1xuICAgICAgICBpZiAoIXV0aWxzXzEuaXNVbmRlZmluZWQobWFwW25hbWVdKSkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGVsLCBuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgd3JhcHBlZENhbGxiYWNrID0gdXRpbHNfMS5wcm94eShjYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgd3JhcHBlZENhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgICAgbWFwW25hbWVdID0gd3JhcHBlZENhbGxiYWNrO1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnNldChlbCwgbWFwKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFVuYmluZCBhbiBldmVudCBwcmV2aW91c2x5IGJvdW5kIHVzaW5nIHRoZSBhZGRFdmVudExpc3RlbmVyKCkgbWV0aG9kLlxuICAgICAqL1xuICAgIEFic3RyYWN0RGlyZWN0aXZlLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGVsLCBuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVycy5oYXMoZWwpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1hcCA9IHRoaXMuZXZlbnRMaXN0ZW5lcnMuZ2V0KGVsKTtcbiAgICAgICAgaWYgKCF1dGlsc18xLmlzVW5kZWZpbmVkKG1hcFtuYW1lXSkpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgbWFwW25hbWVdKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgbWFwW25hbWVdO1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnNldChlbCwgbWFwKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERpc3BhdGNoIGFuIGV2ZW50IHRvIHRoZSBwYXJlbnQuXG4gICAgICovXG4gICAgQWJzdHJhY3REaXJlY3RpdmUucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBldmVudERhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMudm5vZGUuY29tcG9uZW50SW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMudm5vZGUuY29tcG9uZW50SW5zdGFuY2UuJGVtaXQoZXZlbnROYW1lLCBldmVudERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52bm9kZS5lbG0uZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGRldGFpbDogZXZlbnREYXRhIH0pKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQWJzdHJhY3REaXJlY3RpdmUucHJvdG90eXBlLnVwZGF0ZURhdGEgPSBmdW5jdGlvbiAoZWwsIGJpbmRpbmcsIHZub2RlKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5iaW5kaW5nID0gYmluZGluZztcbiAgICAgICAgdGhpcy52bm9kZSA9IHZub2RlO1xuICAgICAgICB0aGlzLmNoZWNrQW5kTm90aWZ5Rm9yQmluZGluZ1ZhbHVlQ2hhbmdlcygpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgY2hhbmdlcyBhcmUgZm91bmQgYmV0d2VlbiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgYmluZGluZyBhbmQgdGhlIGxhdGVzdCBzYXZlZC5cbiAgICAgKi9cbiAgICBBYnN0cmFjdERpcmVjdGl2ZS5wcm90b3R5cGUuY2hlY2tBbmROb3RpZnlGb3JCaW5kaW5nVmFsdWVDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXV0aWxzXzEuaXNPYmplY3QodGhpcy5iaW5kaW5nLnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkaWZmZXJlbmNlcyA9IG9iamVjdF8xLmNvbXBhcmVPYmplY3RzKHRoaXMubGFzdEJpbmRpbmdWYWx1ZVNuYXBzaG90LCB0aGlzLmJpbmRpbmcudmFsdWUpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmtleXMoZGlmZmVyZW5jZXMpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmICghdXRpbHNfMS5pc1VuZGVmaW5lZCh0aGlzLmJpbmRpbmdWYWx1ZXNXYXRjaGVyc1twcm9wZXJ0eU5hbWVdKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9iID0gMCwgX2MgPSB0aGlzLmJpbmRpbmdWYWx1ZXNXYXRjaGVyc1twcm9wZXJ0eU5hbWVdLmNhbGxiYWNrczsgX2IgPCBfYy5sZW5ndGg7IF9iKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gX2NbX2JdO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBbdGhpcy5iaW5kaW5nLnZhbHVlW3Byb3BlcnR5TmFtZV0sIHRoaXMubGFzdEJpbmRpbmdWYWx1ZVNuYXBzaG90W3Byb3BlcnR5TmFtZV1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0QmluZGluZ1ZhbHVlU25hcHNob3QgPSBvYmplY3RfMS5leHRlbmQoe30sIHRoaXMuYmluZGluZy52YWx1ZSwgdHJ1ZSk7XG4gICAgfTtcbiAgICByZXR1cm4gQWJzdHJhY3REaXJlY3RpdmU7XG59KCkpO1xuZXhwb3J0cy5BYnN0cmFjdERpcmVjdGl2ZSA9IEFic3RyYWN0RGlyZWN0aXZlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRpcmVjdGl2ZUZhY3RvcnkgPSB2b2lkIDA7XG52YXIgRGlyZWN0aXZlRmFjdG9yeSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBEaXJlY3RpdmVGYWN0b3J5KCkge1xuICAgIH1cbiAgICBEaXJlY3RpdmVGYWN0b3J5LkNyZWF0ZSA9IGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgICAgIGlmIChEaXJlY3RpdmVGYWN0b3J5Lkluc3RhbmNlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgRGlyZWN0aXZlRmFjdG9yeS5JbnN0YW5jZXMgPSBuZXcgV2Vha01hcCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kOiBmdW5jdGlvbiAoZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjdG9yKCk7XG4gICAgICAgICAgICAgICAgRGlyZWN0aXZlRmFjdG9yeS5JbnN0YW5jZXMuc2V0KGVsLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuYmluZChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZub2RlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnNlcnRlZDogZnVuY3Rpb24gKGVsLCBiaW5kaW5nLCB2bm9kZSwgb2xkVm5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoRGlyZWN0aXZlRmFjdG9yeS5JbnN0YW5jZXMuaGFzKGVsKSkge1xuICAgICAgICAgICAgICAgICAgICBEaXJlY3RpdmVGYWN0b3J5Lkluc3RhbmNlcy5nZXQoZWwpLmluc2VydGVkKGVsLCBiaW5kaW5nLCB2bm9kZSwgb2xkVm5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKERpcmVjdGl2ZUZhY3RvcnkuSW5zdGFuY2VzLmhhcyhlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgRGlyZWN0aXZlRmFjdG9yeS5JbnN0YW5jZXMuZ2V0KGVsKS51cGRhdGUoZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBvbmVudFVwZGF0ZWQ6IGZ1bmN0aW9uIChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKERpcmVjdGl2ZUZhY3RvcnkuSW5zdGFuY2VzLmhhcyhlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgRGlyZWN0aXZlRmFjdG9yeS5JbnN0YW5jZXMuZ2V0KGVsKS5jb21wb25lbnRVcGRhdGVkKGVsLCBiaW5kaW5nLCB2bm9kZSwgb2xkVm5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1bmJpbmQ6IGZ1bmN0aW9uIChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKERpcmVjdGl2ZUZhY3RvcnkuSW5zdGFuY2VzLmhhcyhlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgRGlyZWN0aXZlRmFjdG9yeS5JbnN0YW5jZXMuZ2V0KGVsKS51bmJpbmQoZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG4gICAgRGlyZWN0aXZlRmFjdG9yeS5JbnN0YW5jZXMgPSBudWxsO1xuICAgIHJldHVybiBEaXJlY3RpdmVGYWN0b3J5O1xufSgpKTtcbmV4cG9ydHMuRGlyZWN0aXZlRmFjdG9yeSA9IERpcmVjdGl2ZUZhY3Rvcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGVyZmVjdFNjcm9sbGJhciA9IGV4cG9ydHMuUGVyZmVjdFNjcm9sbGJhckRpcmVjdGl2ZSA9IHZvaWQgMDtcbnZhciB0c2xpYl8xID0gcmVxdWlyZShcInRzbGliXCIpO1xudmFyIHZ1ZV9hcHBfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2pxdWVyeS9tb2R1bGVzL3Z1ZS1hcHBcIik7XG52YXIgYWJzdHJhY3RfZGlyZWN0aXZlXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy92dWVqcy9kaXJlY3RpdmVzL2Fic3RyYWN0LWRpcmVjdGl2ZVwiKTtcbnZhciBkaXJlY3RpdmVfZmFjdG9yeV8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvdnVlanMvZGlyZWN0aXZlcy9kaXJlY3RpdmUtZmFjdG9yeVwiKTtcbnZhciB2dWVfMSA9IHJlcXVpcmUoXCJ2dWVcIik7XG4vKipcbiAqIFJlcXVpcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9tZGJvb3RzdHJhcC9wZXJmZWN0LXNjcm9sbGJhclxuICogbnBtIGkgcGVyZmVjdC1zY3JvbGxiYXIgLS1zYXZlXG4gKi9cbi8vIEB0cy1pZ25vcmVcbnZhciBwZXJmZWN0X3Njcm9sbGJhcl8xID0gcmVxdWlyZShcInBlcmZlY3Qtc2Nyb2xsYmFyXCIpO1xucmVxdWlyZShcInBlcmZlY3Qtc2Nyb2xsYmFyL2Nzcy9wZXJmZWN0LXNjcm9sbGJhci5jc3NcIik7XG52YXIgUGVyZmVjdFNjcm9sbGJhckRpcmVjdGl2ZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlIHBlcmZlY3Qgc2Nyb2xsYmFyIGZvciBhIGdpdmVuIEhUTUwgZWxlbWVudC5cbiAgICAgKi9cbiAgICBQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLlVwZGF0ZUZvckVsZW1lbnQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgdmFyIHBzID0gUGVyZmVjdFNjcm9sbGJhckRpcmVjdGl2ZS5JbnN0YW5jZXMuZ2V0KGVsKTtcbiAgICAgICAgaWYgKHBzKSB7XG4gICAgICAgICAgICBwcy51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQGluaGVyaXREb2NcbiAgICAgKi9cbiAgICBQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGVsLCBiaW5kaW5nLCB2bm9kZSwgb2xkVm5vZGUpIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5iaW5kLmNhbGwodGhpcywgZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYWNrIGJlY2F1c2Ugb2YgYSBwZXJmZWN0IHNjcm9sbGJhciBidWcuXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21kYm9vdHN0cmFwL3BlcmZlY3Qtc2Nyb2xsYmFyL2lzc3Vlcy83OTJcbiAgICAgICAgICovXG4gICAgICAgIHZ1ZV8xLmRlZmF1bHQubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBzID0gbmV3IHBlcmZlY3Rfc2Nyb2xsYmFyXzEuZGVmYXVsdChlbCwgT2JqZWN0LmFzc2lnbihQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLkRlZmF1bHRzLCBiaW5kaW5nLnZhbHVlKSk7XG4gICAgICAgICAgICBQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLkluc3RhbmNlcy5zZXQoZWwsIHBzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdERvY1xuICAgICAqL1xuICAgIFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZub2RlKSB7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUudXBkYXRlLmNhbGwodGhpcywgZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSk7XG4gICAgICAgIFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUuVXBkYXRlRm9yRWxlbWVudChlbCk7XG4gICAgfTtcbiAgICBQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLnByb3RvdHlwZS5jb21wb25lbnRVcGRhdGVkID0gZnVuY3Rpb24gKGVsLCBiaW5kaW5nLCB2bm9kZSwgb2xkVm5vZGUpIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5jb21wb25lbnRVcGRhdGVkLmNhbGwodGhpcywgZWwsIGJpbmRpbmcsIHZub2RlLCBvbGRWbm9kZSk7XG4gICAgICAgIFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUuVXBkYXRlRm9yRWxlbWVudChlbCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdERvY1xuICAgICAqL1xuICAgIFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUucHJvdG90eXBlLnVuYmluZCA9IGZ1bmN0aW9uIChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZub2RlKSB7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUuY29tcG9uZW50VXBkYXRlZC5jYWxsKHRoaXMsIGVsLCBiaW5kaW5nLCB2bm9kZSwgb2xkVm5vZGUpO1xuICAgICAgICB2YXIgcHMgPSBQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLkluc3RhbmNlcy5nZXQoZWwpO1xuICAgICAgICBpZiAocHMpIHtcbiAgICAgICAgICAgIHBzLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBQZXJmZWN0U2Nyb2xsYmFyRGlyZWN0aXZlLkluc3RhbmNlcy5kZWxldGUoZWwpO1xuICAgIH07XG4gICAgUGVyZmVjdFNjcm9sbGJhckRpcmVjdGl2ZS5JbnN0YW5jZXMgPSBuZXcgV2Vha01hcCgpO1xuICAgIFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUuRGVmYXVsdHMgPSB7XG4gICAgICAgIHdoZWVsUHJvcGFnYXRpb246IHRydWUsXG4gICAgICAgIHN1cHByZXNzU2Nyb2xsWDogZmFsc2UsXG4gICAgfTtcbiAgICByZXR1cm4gUGVyZmVjdFNjcm9sbGJhckRpcmVjdGl2ZTtcbn0oYWJzdHJhY3RfZGlyZWN0aXZlXzEuQWJzdHJhY3REaXJlY3RpdmUpKTtcbmV4cG9ydHMuUGVyZmVjdFNjcm9sbGJhckRpcmVjdGl2ZSA9IFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmU7XG5leHBvcnRzLlBlcmZlY3RTY3JvbGxiYXIgPSBkaXJlY3RpdmVfZmFjdG9yeV8xLkRpcmVjdGl2ZUZhY3RvcnkuQ3JlYXRlKFBlcmZlY3RTY3JvbGxiYXJEaXJlY3RpdmUpO1xudnVlX2FwcF8xLlZ1ZUFwcC5SZWdpc3Rlckdsb2JhbERpcmVjdGl2ZSgncGVyZmVjdC1zY3JvbGxiYXInLCBleHBvcnRzLlBlcmZlY3RTY3JvbGxiYXIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlRJUFBZX0RFRkFVTFRfT1BUSU9OUyA9IHZvaWQgMDtcbmV4cG9ydHMuVElQUFlfREVGQVVMVF9PUFRJT05TID0ge1xuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgaWYgY29udGVudCBzdHJpbmdzIGFyZSBwYXJzZWQgYXMgSFRNTCBpbnN0ZWFkIG9mIHRleHQuXG4gICAgICogTWFrZSBzdXJlIHlvdSBhcmUgc2FuaXRpemluZyBhbnkgdXNlciBkYXRhIGlmIHJlbmRlcmluZyBIVE1MIHRvIHByZXZlbnQgWFNTIGF0dGFja3MuXG4gICAgICovXG4gICAgYWxsb3dIVE1MOiBmYWxzZSxcbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIGlmIHRoZSB0aXBweSBoYXMgYW4gYXJyb3cuXG4gICAgICovXG4gICAgYXJyb3c6IHRydWUsXG4gICAgLyoqXG4gICAgICogRGVsYXkgaW4gbXMgb25jZSBhIHRyaWdnZXIgZXZlbnQgaXMgZmlyZWQgYmVmb3JlIGEgdGlwcHkgc2hvd3Mgb3IgaGlkZXMuXG4gICAgICovXG4gICAgZGVsYXk6IDAsXG4gICAgLyoqXG4gICAgICogSG93IGZhciBpbiBwaXhlbHMgdGhlIHRpcHB5IGVsZW1lbnQgaXMgZnJvbSB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZGlzdGFuY2U6IDQsXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyBpZiB0aGUgdGlwcHkgc2hvdWxkIGhpZGUgaWYgYSBtb3VzZWRvd24gZXZlbnQgd2FzIGZpcmVkIG91dHNpZGUgb2YgaXRcbiAgICAgKiAoaS5lLiBjbGlja2luZyBvbiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgb3IgdGhlIGJvZHkgb2YgdGhlIHBhZ2UpLlxuICAgICAqL1xuICAgIGhpZGVPbkNsaWNrOiB0cnVlLFxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgaWYgdGhlIHRpcHB5IGlzIGludGVyYWN0aXZlLCBpLmUuIGl0IGNhbiBiZSBob3ZlcmVkIG92ZXIgb3IgY2xpY2tlZCB3aXRob3V0IGhpZGluZy5cbiAgICAgKi9cbiAgICBpbnRlcmFjdGl2ZTogdHJ1ZSxcbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHRoZSBtYXhpbXVtIHdpZHRoIG9mIHRoZSB0aXBweS5cbiAgICAgKi9cbiAgICBtYXhXaWR0aDogMzUwLFxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgdGhlIG9mZnNldCBvZiB0aGUgdGlwcHkgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIFVubGlrZSBkaXN0YW5jZSwgaXQgY2FuIHdvcmsgb24gYm90aCBheGVzIGJ5IHVzaW5nIGEgc3RyaW5nIGluIHRoZSBmb3JtIFwieCwgeVwiLCBzdWNoIGFzIFwiNTAsIDIwXCIuXG4gICAgICpcbiAgICAgKiBBdm9pZCB1c2luZyBhbiBvZmZzZXQgYWxvbmcgdGhlIHNhbWUgYXhpcyBhcyB0aGUgcGxhY2VtZW50IHByb3AgaWYgdXNpbmcgaW50ZXJhY3RpdmU6IHRydWUuXG4gICAgICogSWYgdXNpbmcgYSBudW1iZXIsIHRoZXJlIHdvbid0IGJlIGFueSBwcm9ibGVtcy5cbiAgICAgKi9cbiAgICBvZmZzZXQ6IDAsXG4gICAgLyoqXG4gICAgICogUG9zaXRpb25zIHRoZSB0aXBweSByZWxhdGl2ZSB0byBpdHMgcmVmZXJlbmNlIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBVc2UgdGhlIHN1ZmZpeCAtc3RhcnQgb3IgLWVuZCB0byBzaGlmdCB0aGUgdGlwcHkgdG8gdGhlIHN0YXJ0IG9yIGVuZCBvZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQsXG4gICAgICogaW5zdGVhZCBvZiBjZW50ZXJpbmcgaXQuIEZvciBleGFtcGxlLCBcInRvcC1zdGFydFwiIG9yIFwibGVmdC1lbmRcIi5cbiAgICAgKi9cbiAgICBwbGFjZW1lbnQ6IFwidG9wXCIsXG4gICAgLyoqXG4gICAgICogVGhlIGV2ZW50cyAoZWFjaCBzZXBhcmF0ZWQgYnkgYSBzcGFjZSkgd2hpY2ggY2F1c2UgYSB0aXBweSB0byBzaG93LlxuICAgICAqXG4gICAgICogUG9zc2libGUgdmFsdWVzOiBcIm1vdXNlZW50ZXJcIiwgXCJmb2N1c1wiLCBcImNsaWNrXCIsIFwibWFudWFsXCIuXG4gICAgICpcbiAgICAgKiBVc2UgXCJtYW51YWxcIiB0byBvbmx5IHRyaWdnZXIgdGhlIHRpcHB5IHByb2dyYW1tYXRpY2FsbHkuXG4gICAgICovXG4gICAgdHJpZ2dlcjogXCJtb3VzZWVudGVyIGZvY3VzXCIsXG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2YgdHJhbnNpdGlvbiBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBBdmFpbGFibGUgYW5pbWF0aW9ucyBhcmUgOlxuICAgICAqICAtIHNoaWZ0LWF3YXlcbiAgICAgKiAgLSBzaGlmdC10b3dhcmRcbiAgICAgKiAgLSBzY2FsZVxuICAgICAqICAtIHBlcnNwZWN0aXZlXG4gICAgICovXG4gICAgYW5pbWF0aW9uOiAnc2hpZnQtYXdheScsXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyBpZiB0aGUgYmFja2dyb3VuZCBmaWxsIGNvbG9yIG9mIHRoZSB0aXBweSBzaG91bGQgYmUgYW5pbWF0ZWQuXG4gICAgICpcbiAgICAgKiBZb3UgbXVzdCBpbXBvcnQgdGhlIGRpc3QvYmFja2Ryb3AuY3NzICYgYW5pbWF0aW9ucy9zaGlmdC1hd2F5LmNzcyBzdHlsZXNoZWV0cyBmb3Igc3R5bGluZyB0byB3b3JrLlxuICAgICAqIFlvdSBtdXN0IGFsc28gaW1wb3J0IHRoZSBcImFuaW1hdGVGaWxsXCIgcGx1Z2luLlxuICAgICAqL1xuICAgIGFuaW1hdGVGaWxsOiB0cnVlLFxuICAgIC8qKlxuICAgICAqIFdoaWNoIGVsZW1lbnQocykgdGhlIHRyaWdnZXIgZXZlbnQgbGlzdGVuZXJzIGFyZSBhcHBsaWVkIHRvIGluc3RlYWQgb2YgdGhlIHJlZmVyZW5jZSBlbGVtZW50LlxuICAgICAqXG4gICAgICogUG9zc2libGUgdmFsdWVzOiBudWxsLCBFbGVtZW50LCBvciBFbGVtZW50W10uXG4gICAgICovXG4gICAgdHJpZ2dlclRhcmdldDogbnVsbCxcbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHRoZSB6LWluZGV4IG9mIHRoZSB0aXBweS5cbiAgICAgKi9cbiAgICB6SW5kZXg6IDk5OTksXG4gICAgLyoqXG4gICAgICogU2lsZW5jZXMga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eSB3YXJuaW5nIHdoZW4gdXNlZCBvbiBhbiBpbmxpbmUgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9hdG9taWtzLmdpdGh1Yi5pby90aXBweWpzL2FjY2Vzc2liaWxpdHkvI2ludGVyYWN0aXZpdHlcbiAgICAgKi9cbiAgICBhcHBlbmRUbzogZG9jdW1lbnQuYm9keSxcbiAgICAvKipcbiAgICAgKiBJZiB0cnVlLCBmb3JjZSB0aGUgdG9vbHRpcCB0byBzdGF5IHZpc2libGUuXG4gICAgICogSWYgZmFsc2UsIGZvcmNlIHRoZSB0b29sdGlwIHRvIHJlbWFpbiBoaWRkZW4uXG4gICAgICpcbiAgICAgKiBPbmx5IHVzZWQgaWYgXCJ0cmlnZ2VyXCIgaXMgc2V0IHRvIFwibWFudWFsXCIuXG4gICAgICovXG4gICAgdmlzaWJsZTogZmFsc2Vcbn07XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVG9vbHRpcCA9IHZvaWQgMDtcbi8qKlxuICogUmVxdWlyZTogaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHlqc1xuICogbnBtIGkgdGlwcHkuanMgLS1zYXZlXG4gKi9cbnZhciB2dWVfYXBwXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9qcXVlcnkvbW9kdWxlcy92dWUtYXBwXCIpO1xuLy8gQHRzLWlnbm9yZVxudmFyIHRpcHB5X2pzXzEgPSByZXF1aXJlKFwidGlwcHkuanNcIik7XG5yZXF1aXJlKFwidGlwcHkuanMvZGlzdC90aXBweS5jc3NcIik7XG5yZXF1aXJlKFwidGlwcHkuanMvZGlzdC9iYWNrZHJvcC5jc3NcIik7XG5yZXF1aXJlKFwidGlwcHkuanMvdGhlbWVzL2xpZ2h0LmNzc1wiKTtcbnJlcXVpcmUoXCJ0aXBweS5qcy9hbmltYXRpb25zL3NoaWZ0LWF3YXkuY3NzXCIpO1xucmVxdWlyZShcIi4vdG9vbHRpcC5jc3NcIik7XG52YXIgdnVlXzEgPSByZXF1aXJlKFwidnVlXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy91dGlsc1wiKTtcbnZhciBvYmplY3RfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL3V0aWxzL29iamVjdFwiKTtcbnZhciB0aXBweV9kZWZhdWx0X29wdGlvbnNfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL3Z1ZWpzL2RpcmVjdGl2ZXMvdG9vbHRpcC90aXBweS1kZWZhdWx0LW9wdGlvbnNcIik7XG52YXIgY3VycmVudFRpcHB5T3B0aW9ucyA9IHt9O1xuZnVuY3Rpb24gYnVpbGRPcHRpb25zKGRlZmF1bHRPcHRpb25zLCBlbCwgYmluZGluZykge1xuICAgIHZhciBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMpO1xuICAgIGlmICh1dGlsc18xLmlzU3RyaW5nKGJpbmRpbmcudmFsdWUpKSB7XG4gICAgICAgIG9wdGlvbnMuY29udGVudCA9IGJpbmRpbmcudmFsdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxzXzEuaXNPYmplY3QoYmluZGluZy52YWx1ZSkpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9iamVjdF8xLmV4dGVuZChvcHRpb25zLCBiaW5kaW5nLnZhbHVlLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKHV0aWxzXzEuaXNVbmRlZmluZWQob3B0aW9ucy5jb250ZW50KSkge1xuICAgICAgICBpZiAoZWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpKSB7XG4gICAgICAgICAgICBvcHRpb25zLmNvbnRlbnQgPSBlbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsLmdldEF0dHJpYnV0ZSgnY29udGVudCcpKSB7XG4gICAgICAgICAgICBvcHRpb25zLmNvbnRlbnQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cbmZ1bmN0aW9uIGZpbHRlck9wdGlvbnMob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICBpZiAoIXV0aWxzXzEuaXNVbmRlZmluZWQob3B0aW9ucy52aXNpYmxlKSkge1xuICAgICAgICBkZWxldGUgb3B0aW9ucy52aXNpYmxlO1xuICAgIH1cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cbi8qKlxuICogQ3JlYXRlIGEgdGlwcHkgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRpcHB5KGVsLCBiaW5kaW5nLCB2bm9kZSkge1xuICAgIHZhciBoYW5kbGVycyA9ICh2bm9kZS5kYXRhICYmIHZub2RlLmRhdGEub24pIHx8XG4gICAgICAgICh2bm9kZS5jb21wb25lbnRPcHRpb25zICYmIHZub2RlLmNvbXBvbmVudE9wdGlvbnMubGlzdGVuZXJzKTtcbiAgICB2YXIgb3B0cyA9IHRpcHB5X2RlZmF1bHRfb3B0aW9uc18xLlRJUFBZX0RFRkFVTFRfT1BUSU9OUztcbiAgICBpZiAoaGFuZGxlcnMgJiYgaGFuZGxlcnNbJ3Nob3cnXSkge1xuICAgICAgICBvcHRzLm9uU2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoX2EgPSBoYW5kbGVyc1snc2hvdyddKS5mbnMuYXBwbHkoX2EsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoaGFuZGxlcnMgJiYgaGFuZGxlcnNbJ3Nob3duJ10pIHtcbiAgICAgICAgb3B0cy5vblNob3duID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKF9hID0gaGFuZGxlcnNbJ3Nob3duJ10pLmZucy5hcHBseShfYSwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmIChoYW5kbGVycyAmJiBoYW5kbGVyc1snaGlkZGVuJ10pIHtcbiAgICAgICAgb3B0cy5vbkhpZGRlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChfYSA9IGhhbmRsZXJzWydoaWRkZW4nXSkuZm5zLmFwcGx5KF9hLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGhhbmRsZXJzICYmIGhhbmRsZXJzWydoaWRlJ10pIHtcbiAgICAgICAgb3B0cy5vbkhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKF9hID0gaGFuZGxlcnNbJ2hpZGUnXSkuZm5zLmFwcGx5KF9hLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGhhbmRsZXJzICYmIGhhbmRsZXJzWydtb3VudCddKSB7XG4gICAgICAgIG9wdHMub25Nb3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChfYSA9IGhhbmRsZXJzWydtb3VudCddKS5mbnMuYXBwbHkoX2EsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBjdXJyZW50VGlwcHlPcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdHMsIGVsLCBiaW5kaW5nKTtcbiAgICB0aXBweV9qc18xLmRlZmF1bHQoZWwsIG9iamVjdF8xLmV4dGVuZChmaWx0ZXJPcHRpb25zKGN1cnJlbnRUaXBweU9wdGlvbnMpLCB7IHBsdWdpbnM6IFt0aXBweV9qc18xLmZvbGxvd0N1cnNvciwgdGlwcHlfanNfMS5hbmltYXRlRmlsbF0gfSkpO1xuICAgIGlmIChvcHRzLnNob3dPbkxvYWQpIHtcbiAgICAgICAgZWwuX3RpcHB5LnNob3coKTtcbiAgICB9XG4gICAgdnVlXzEuZGVmYXVsdC5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChoYW5kbGVycyAmJiBoYW5kbGVyc1snaW5pdCddKSB7XG4gICAgICAgICAgICBoYW5kbGVyc1snaW5pdCddLmZucyhlbC5fdGlwcHksIGVsKTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVNYW51YWxWaXNpYmlsaXR5KGVsKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGhhbmRsZU1hbnVhbFZpc2liaWxpdHkoZWwpIHtcbiAgICBpZiAoY3VycmVudFRpcHB5T3B0aW9ucy50cmlnZ2VyID09PSAnbWFudWFsJykge1xuICAgICAgICBpZiAoY3VycmVudFRpcHB5T3B0aW9ucy52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBlbC5fdGlwcHkuc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWwuX3RpcHB5LmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuVG9vbHRpcCA9IHtcbiAgICBpbnNlcnRlZDogZnVuY3Rpb24gKGVsLCBiaW5kaW5nLCB2bm9kZSkge1xuICAgICAgICB2dWVfMS5kZWZhdWx0Lm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNyZWF0ZVRpcHB5KGVsLCBiaW5kaW5nLCB2bm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgY29tcG9uZW50VXBkYXRlZDogZnVuY3Rpb24gKGVsLCBiaW5kaW5nLCB2bm9kZSkge1xuICAgICAgICBpZiAoIXV0aWxzXzEuaXNVbmRlZmluZWQoZWwuX3RpcHB5KSkge1xuICAgICAgICAgICAgY3VycmVudFRpcHB5T3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhjdXJyZW50VGlwcHlPcHRpb25zLCBlbCwgYmluZGluZyk7XG4gICAgICAgICAgICBlbC5fdGlwcHkuc2V0UHJvcHMoZmlsdGVyT3B0aW9ucyhjdXJyZW50VGlwcHlPcHRpb25zKSk7XG4gICAgICAgICAgICB2dWVfMS5kZWZhdWx0Lm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVNYW51YWxWaXNpYmlsaXR5KGVsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1bmJpbmQ6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBpZiAodXRpbHNfMS5pc09iamVjdChlbC5fdGlwcHkpKSB7XG4gICAgICAgICAgICBlbC5fdGlwcHkuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZ1ZV9hcHBfMS5WdWVBcHAuUmVnaXN0ZXJHbG9iYWxEaXJlY3RpdmUoJ3Rvb2x0aXAnLCBleHBvcnRzLlRvb2x0aXApO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiaW1wb3J0ICdlc3NlbnRpYWxzLXJvb3QvdmVuZG9yL2ZvbnQtYXdlc29tZS1wcm8vZm9udC1hd2Vzb21lLXByby1hbGwuc2Nzcyc7XG5pbXBvcnQgJy4uLy4uL3N0eWxlcy9jc3MvbWFpbi5jc3MnO1xuaW1wb3J0ICcuLi90cy9tYWluLnRzJztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqXG4gKiBUaGlzIGZpbGUgaW5jbHVkZXMgZXZlcnl0aGluZyB0aGF0IHNob3VsZCBiZSBnbG9iYWxseSBhdmFpbGFibGUgaW4gdGhlIGFwcC5cbiAqL1xucmVxdWlyZShcImVzc2VudGlhbHMvZGVwZW5kZW5jaWVzXCIpO1xuLyoqXG4gKiBUaGlzIHNlY3Rpb24gZGVmaW5lcyBhbGwgbW9kdWxlcyB1c2VkIGJ5IHRoZSBhcHAuXG4gKlxuICogSXQncyBwYXJ0aWN1bGFybHkgaW1wb3J0YW50IHRvIGltcG9ydCBtb2R1bGVzIGhlcmUgYmVjYXVzZSB0aGVyZSBtYXkgYmUgbm8gb3RoZXIgcmVmZXJlbmNlXG4gKiBpbiB0aGUgdHlwZXNjcmlwdCBjb2RlIGJhc2UgaWYgdGhleSBhcmUgb25seSB1c2VkIHVzaW5nIGh0bWwgZGF0YSBhdHRyaWJ1dGVzLlxuICpcbiAqIEVhY2ggbW9kdWxlIE1VU1QgZGVjbGFyZSBpdHNlbGYgdG8gdGhlIGNvbnRhaW5lciB3aGVuIGltcG9ydGVkLCBzbyB5b3UgaGF2ZSBub3RoaW5nIGVsc2UgdG8gZG9cbiAqIHRoYW4gaW1wb3J0IHRoZSBtb2R1bGUgaGVyZS5cbiAqXG4gKiBJbXBvcnQgZXhhbXBsZTpcbiAqXG4gKiAgIGltcG9ydCBcIndlYmVhay1uYXRpdmUvc2VydmljZXMvZXhhbXBsZS1zZXJ2aWNlXCI7XG4gKi9cbnJlcXVpcmUoXCJlc3NlbnRpYWxzL3Z1ZWpzL2RpcmVjdGl2ZXMvcGVyZmVjdC1zY3JvbGxiYXJcIik7XG5yZXF1aXJlKFwiZXNzZW50aWFscy92dWVqcy9kaXJlY3RpdmVzL3Rvb2x0aXAvdG9vbHRpcFwiKTtcbnJlcXVpcmUoXCJhbGVydGlmeWpzL2J1aWxkL2Nzcy9hbGVydGlmeS5jc3NcIik7XG5yZXF1aXJlKFwiYWxlcnRpZnlqcy9idWlsZC9jc3MvdGhlbWVzL2RlZmF1bHQuY3NzXCIpO1xucmVxdWlyZShcImVzc2VudGlhbHMvZGlhbG9nL2FsZXJ0aWZ5L2FsZXJ0aWZ5LnNlcnZpY2VcIik7XG5yZXF1aXJlKFwiLi92dWVqcy9jb21wb25lbnRzL21hbmFnZXIvbWFuYWdlci5jb21wb25lbnRcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogQ2xpZW50IHNpZGUgZW50cnkgcG9pbnQuXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBCZWZvcmUgYW55dGhpbmcgZWxzZSwgaW1wb3J0IHRoZSBkZXBlbmRlbmNpZXMgZmlsZS5cbiAqIFRoZSByb2xlIG9mIHRoaXMgZmlsZSBpcyB0byBpbXBvcnQgYWxsIG1vZHVsZXMgaW4gdXNlIGluIHRoZSBhcHAuXG4gKi9cbnJlcXVpcmUoXCIuL2RlcGVuZGVuY2llc1wiKTtcbnZhciBhcHBfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2FwcFwiKTtcbnZhciBjb250YWluZXJfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2ludmVyc2lmeS9jb250YWluZXJcIik7XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFwcCA9IGNvbnRhaW5lcl8xLkNvbnRhaW5lci5nZXRDb250YWluZXIoKS5nZXQoYXBwXzEuQXBwU3ltYm9sKTtcbiAgICB3aW5kb3cuYXBwID0gYXBwO1xuICAgIGFwcC5zdGFydCgpO1xufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBNb2R1bGVcbnZhciBjb2RlID0gXCI8ZGl2IGNsYXNzPVxcXCJ2Yy1oZWF2eS10YXNrLW1hbmFnZXIgZmxleCBmbGV4LWNvbCBvdmVyZmxvdy1oaWRkZW5cXFwiPiA8ZGl2IGNsYXNzPVxcXCJmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXIgYm9yZGVyLWIgYm9yZGVyLXByaW1hcnktNDAwIHAtMiB0ZXh0LXdoaXRlXFxcIj4gPGgxPkJhY2tncm91bmQgam9icyB2aWV3ZXI8L2gxPiA8ZGl2IGNsYXNzPVxcXCJwci0yIHRleHQtZ3JlZW4tNTAwIGZvbnQtYm9sZFxcXCI+IDxpIGNsYXNzPVxcXCJmYXMgZmEtY2lyY2xlIGJsaW5rXFxcIj48L2k+IExpc3RlbmluZyA8L2Rpdj4gPC9kaXY+IDx1bCBjbGFzcz1cXFwiZmxleCB0ZXh0LWNlbnRlclxcXCI+IDxsaSBjbGFzcz1cXFwidy0xLzIgcHktMiBib3JkZXItcHJpbWFyeS01MDBcXFwiIDpjbGFzcz1cXFwiYWN0aXZlVGFiID09PSAnYWN0aXZlJyA/ICdiZy1wcmltYXJ5LTYwMCBmb250LWJvbGQgdGV4dC1ncmF5LTMwMCcgOiAnYm9yZGVyLWIgYmctcHJpbWFyeS03MDAgdGV4dC1ncmF5LTQwMCBjdXJzb3ItcG9pbnRlcidcXFwiIEBjbGljaz1cXFwiYWN0aXZlVGFiID0gJ2FjdGl2ZSdcXFwiPkFjdGl2ZTwvbGk+IDxsaSBjbGFzcz1cXFwidy0xLzIgcHktMiBib3JkZXItcHJpbWFyeS01MDBcXFwiIDpjbGFzcz1cXFwiYWN0aXZlVGFiID09PSAnaGlzdG9yeScgPyAnYmctcHJpbWFyeS02MDAgZm9udC1ib2xkIHRleHQtZ3JheS0zMDAnIDogJ2JvcmRlci1iIGJnLXByaW1hcnktNzAwIHRleHQtZ3JheS00MDAgY3Vyc29yLXBvaW50ZXInXFxcIiBAY2xpY2s9XFxcImFjdGl2ZVRhYiA9ICdoaXN0b3J5J1xcXCI+SGlzdG9yeTwvbGk+IDwvdWw+IDxkaXYgcmVmPXNjcm9sbENvbnRhaW5lciBjbGFzcz1cXFwicmVsYXRpdmUgZmxleC0xIHRleHQtZ3JheS0zMDBcXFwiIHYtcGVyZmVjdC1zY3JvbGxiYXI+IDxkaXYgdi1pZj0hcmVhZHkgY2xhc3M9XFxcInRleHQtY2VudGVyIHB0LTNcXFwiPjxpIGNsYXNzPVxcXCJmYXMgZmEtY29nIGZhLXNwaW5cXFwiPjwvaT4gTG9hZGluZy4uLjwvZGl2PiA8dGVtcGxhdGUgdi1lbHNlPiA8ZGl2IHYtaWY9XFxcImFjdGl2ZVRhYiA9PT0gJ2FjdGl2ZSdcXFwiPiA8dGVtcGxhdGUgdi1pZj1cXFwiYWN0aXZlVGFza3MubGVuZ3RoID4gMFxcXCI+IDx0YXNrIHYtZm9yPVxcXCJ0YXNrIGluIGFjdGl2ZVRhc2tzXFxcIiA6c3RhdGU9dGFzaz48L3Rhc2s+IDwvdGVtcGxhdGU+IDxkaXYgY2xhc3M9XFxcInRleHQtY2VudGVyIHB0LTNcXFwiIHYtZWxzZT4gTm8gYmFja2dyb3VuZCBqb2IgY3VycmVudGx5IHJ1bm5pbmcuPGJyLz4gVGhlIGxpc3Qgd2lsbCB1cGRhdGUgYXV0b21hdGljYWxseSB3aGVuIGEgam9iIGlzIGNyZWF0ZWQuIDwvZGl2PiA8L2Rpdj4gPGRpdiB2LWVsc2U+IDx0ZW1wbGF0ZSB2LWlmPVxcXCJoaXN0b3J5VGFza3MubGVuZ3RoID4gMFxcXCI+IDx0YXNrIHYtZm9yPVxcXCJ0YXNrIGluIGhpc3RvcnlUYXNrc1xcXCIgOnN0YXRlPXRhc2s+PC90YXNrPiA8L3RlbXBsYXRlPiA8ZGl2IGNsYXNzPVxcXCJ0ZXh0LWNlbnRlciBwdC0zXFxcIiB2LWVsc2U+IE5vIGJhY2tncm91bmQgam9iIGhhcyBiZWVuIGFyY2hpdmVkIHlldC4gPC9kaXY+IDwvZGl2PiA8L3RlbXBsYXRlPiA8L2Rpdj4gPC9kaXY+IFwiO1xuLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSBjb2RlOyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5NYW5hZ2VyQ29tcG9uZW50ID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgbW9tZW50ID0gcmVxdWlyZShcIm1vbWVudFwiKTtcbnZhciBjb250YWluZXJfMSA9IHJlcXVpcmUoXCJlc3NlbnRpYWxzL2ludmVyc2lmeS9jb250YWluZXJcIik7XG52YXIgdnVlX2FwcF8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvanF1ZXJ5L21vZHVsZXMvdnVlLWFwcFwiKTtcbnZhciBuZXR3b3JrXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy9uZXR3b3JrXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiZXNzZW50aWFscy91dGlscy91dGlsc1wiKTtcbnZhciB2dWVfMSA9IHJlcXVpcmUoXCJ2dWVcIik7XG52YXIgdnVlX2NsYXNzX2NvbXBvbmVudF8xID0gcmVxdWlyZShcInZ1ZS1jbGFzcy1jb21wb25lbnRcIik7XG52YXIgdGFza19jb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL3Rhc2suY29tcG9uZW50XCIpO1xucmVxdWlyZShcIi4vbWFuYWdlci5jb21wb25lbnQuY3NzXCIpO1xudmFyIE1hbmFnZXJDb21wb25lbnQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgdHNsaWJfMS5fX2V4dGVuZHMoTWFuYWdlckNvbXBvbmVudCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNYW5hZ2VyQ29tcG9uZW50KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgLy8gVGVtcGxhdGUgdmFyc1xuICAgICAgICBfdGhpcy5odHRwUmVzcG9uc2UgPSBudWxsO1xuICAgICAgICBfdGhpcy5hY3RpdmVUYXNrcyA9IFtdO1xuICAgICAgICBfdGhpcy5oaXN0b3J5VGFza3MgPSBbXTtcbiAgICAgICAgX3RoaXMuYWN0aXZlVGFiID0gJ2FjdGl2ZSc7XG4gICAgICAgIF90aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgIC8vIExvZ2ljIHZhcnNcbiAgICAgICAgX3RoaXMuaHR0cCA9IGNvbnRhaW5lcl8xLkNvbnRhaW5lci5nZXRDb250YWluZXIoKS5nZXQobmV0d29ya18xLkh0dHBTZXJ2aWNlU3ltYm9sKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBNYW5hZ2VyQ29tcG9uZW50LnByb3RvdHlwZS5tb3VudGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwodXRpbHNfMS5wcm94eSh0aGlzLnVwZGF0ZSwgdGhpcyksIDIwMDApO1xuICAgIH07XG4gICAgTWFuYWdlckNvbXBvbmVudC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5odHRwUmVzcG9uc2UgJiYgdGhpcy5odHRwUmVzcG9uc2UuaXNQZW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5odHRwUmVzcG9uc2UgPSB0aGlzLmh0dHAuZ2V0KCcvaGVhdnktdGFzay9hamF4L3N1cGVydmlzb3Itc3RhdHVzJyk7XG4gICAgICAgIHRoaXMuaHR0cFJlc3BvbnNlLnByb21pc2UudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBfdGhpcy5hY3RpdmVUYXNrcyA9IHJlc3VsdC5hY3RpdmU7XG4gICAgICAgICAgICBfdGhpcy5oaXN0b3J5VGFza3MgPSByZXN1bHQuaGlzdG9yeTtcbiAgICAgICAgICAgIHZhciBtZXJnZWQgPSBbXS5jb25jYXQoX3RoaXMuYWN0aXZlVGFza3MsIF90aGlzLmhpc3RvcnlUYXNrcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIG1lcmdlZF8xID0gbWVyZ2VkOyBfaSA8IG1lcmdlZF8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbWVyZ2VkXzFbX2ldO1xuICAgICAgICAgICAgICAgIGl0ZW0uc3RhcnRUaW1lID0gbW9tZW50LnVuaXgoaXRlbS5zdGFydFRpbWUpLmZvcm1hdCgnTU0vREQvWVlZWSBISDptbTpzcycpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYWN0aXZlID0gIXV0aWxzXzEuaXNVbmRlZmluZWQoaXRlbS5wcm9ncmVzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTWFuYWdlckNvbXBvbmVudCA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgIHZ1ZV9jbGFzc19jb21wb25lbnRfMS5kZWZhdWx0KHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL21hbmFnZXIuY29tcG9uZW50Lmh0bWwnKSxcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgICAgICAgICAndGFzayc6IHRhc2tfY29tcG9uZW50XzEuVGFza0NvbXBvbmVudFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIF0sIE1hbmFnZXJDb21wb25lbnQpO1xuICAgIHJldHVybiBNYW5hZ2VyQ29tcG9uZW50O1xufSh2dWVfMS5kZWZhdWx0KSk7XG5leHBvcnRzLk1hbmFnZXJDb21wb25lbnQgPSBNYW5hZ2VyQ29tcG9uZW50O1xudnVlX2FwcF8xLlZ1ZUFwcC5SZWdpc3RlckNvbXBvbmVudCgnbWFuYWdlcicsIE1hbmFnZXJDb21wb25lbnQpO1xuIiwiLy8gTW9kdWxlXG52YXIgY29kZSA9IFwiPGRpdiBjbGFzcz1cXFwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIGJvcmRlci1iIGJvcmRlci1wcmltYXJ5LTUwMCB0ZXh0LXByaW1hcnktMTAwIHB5LTIgcHgtMyBob3ZlcjpiZy1wcmltYXJ5LTUwMFxcXCI+IDxkaXYgY2xhc3M9XFxcImZsZXggaXRlbXMtY2VudGVyIHctZnVsbFxcXCI+IDxkaXYgc3R5bGU9bWluLXdpZHRoOjkwcHg7d2lkdGg6OTBweCBjbGFzcz1cXFwidGV4dC1jZW50ZXIgdGV4dC13aGl0ZSB0ZXh0LXNtIGZvbnQtbWVkaXVtIG1yLTNcXFwiPiA8ZGl2IGNsYXNzPVxcXCJiZy10ZWFsLTUwMCBweC0yIHB5LTEgcm91bmRlZC1zbSB0ZXh0LWJvbGRcXFwiIHYtaWY9XFxcInN0YXRlLnN0YXR1cyA9PT0gJ3J1bm5pbmcnXFxcIj4gPGkgY2xhc3M9XFxcImZhcyBmYS1jb2cgZmEtc3BpblxcXCI+PC9pPiBSdW5uaW5nIDxzcGFuIGNsYXNzPVxcXCJibG9jayB0ZXh0LXhzXFxcIiB2LWlmPXN0YXRlLnByb2dyZXNzPiAoe3sgc3RhdGUucHJvZ3Jlc3MgfX0pPC9zcGFuPiA8L2Rpdj4gPGRpdiBjbGFzcz1cXFwiYmctb3JhbmdlLTUwMCBweC0yIHB5LTEgcm91bmRlZC1zbSB0ZXh0LWJvbGRcXFwiIHYtZWxzZS1pZj1cXFwic3RhdGUuc3RhdHVzID09PSAnd2FpdGluZydcXFwiPldhaXRpbmc8L2Rpdj4gPGRpdiBjbGFzcz1cXFwiYmctcHVycGxlLTQwMCBweC0yIHB5LTEgcm91bmRlZC1zbSB0ZXh0LWJvbGRcXFwiIHYtZWxzZS1pZj1cXFwic3RhdGUuc3RhdHVzID09PSAnc2NoZWR1bGVkJ1xcXCI+U2NoZWR1bGVkPC9kaXY+IDxkaXYgY2xhc3M9XFxcImJnLXJlZC03MDAgcHgtMiBweS0xIHJvdW5kZWQtc21cXFwiIHYtZWxzZS1pZj1cXFwic3RhdGUuc3RhdHVzID09PSAnY3Jhc2hlZCdcXFwiPkNyYXNoZWQ8L2Rpdj4gPGRpdiBjbGFzcz1cXFwiYmctZ3JlZW4tNTAwIHB4LTIgcHktMSByb3VuZGVkLXNtXFxcIiB2LWVsc2UtaWY9XFxcInN0YXRlLnN0YXR1cyA9PT0gJ2ZpbmlzaGVkJ1xcXCI+RmluaXNoZWQ8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9ZmxleC0xPiB7eyBzdGF0ZS5uYW1lIH19IDxkaXYgY2xhc3M9XFxcInRleHQtc20gZm9udC1pdGFsaWMgdGV4dC1wcmltYXJ5LTQwMFxcXCI+e3sgc3RhdGUuZGVzY3JpcHRpb24gfX08L2Rpdj4gPGRpdiB2LWlmPVxcXCJzdGF0ZS5zdGF0dXMgPT09ICdjcmFzaGVkJ1xcXCIgY2xhc3M9XFxcInB4LTIgcHktMSBiZy1yZWQtNzAwIHRleHQtd2hpdGUgcm91bmRlZC1zbSB0ZXh0LXhzXFxcIj4gPHNwYW4gdi1pZj1zdGF0ZS5sYXN0RXJyb3I+e3sgc3RhdGUubGFzdEVycm9yIH19PC9zcGFuPiA8c3BhbiB2LWVsc2U+VW5rbm93biBlcnJvcjwvc3Bhbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPGRpdiBjbGFzcz1cXFwidGV4dC1zbSB0ZXh0LWl0YWxpYyB0ZXh0LXByaW1hcnktNDAwIG1sLTIgd2hpdGVzcGFjZS1uby13cmFwXFxcIj4ge3sgc3RhdGUuc3RhcnRUaW1lIH19IHwgPHNwYW4gY2xhc3M9XFxcImJnLXByaW1hcnktNzAwIHB4LTIgcHktMSB0ZXh0LXhzIHJvdW5kZWQtc21cXFwiPnt7IHN0YXRlLmlkIH19PC9zcGFuPiA8L2Rpdj4gPC9kaXY+IFwiO1xuLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSBjb2RlOyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UYXNrQ29tcG9uZW50ID0gdm9pZCAwO1xudmFyIHRzbGliXzEgPSByZXF1aXJlKFwidHNsaWJcIik7XG52YXIgdnVlX2FwcF8xID0gcmVxdWlyZShcImVzc2VudGlhbHMvanF1ZXJ5L21vZHVsZXMvdnVlLWFwcFwiKTtcbnZhciB2dWVfMSA9IHJlcXVpcmUoXCJ2dWVcIik7XG52YXIgdnVlX2NsYXNzX2NvbXBvbmVudF8xID0gcmVxdWlyZShcInZ1ZS1jbGFzcy1jb21wb25lbnRcIik7XG52YXIgdnVlX3Byb3BlcnR5X2RlY29yYXRvcl8xID0gcmVxdWlyZShcInZ1ZS1wcm9wZXJ0eS1kZWNvcmF0b3JcIik7XG52YXIgVGFza0NvbXBvbmVudCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICB0c2xpYl8xLl9fZXh0ZW5kcyhUYXNrQ29tcG9uZW50LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFRhc2tDb21wb25lbnQoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgdnVlX3Byb3BlcnR5X2RlY29yYXRvcl8xLlByb3AoeyB0eXBlOiBPYmplY3QsIHJlcXVpcmVkOiB0cnVlIH0pLFxuICAgICAgICB0c2xpYl8xLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXG4gICAgXSwgVGFza0NvbXBvbmVudC5wcm90b3R5cGUsIFwic3RhdGVcIiwgdm9pZCAwKTtcbiAgICBUYXNrQ29tcG9uZW50ID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgdnVlX2NsYXNzX2NvbXBvbmVudF8xLmRlZmF1bHQoe1xuICAgICAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vdGFzay5jb21wb25lbnQuaHRtbCcpXG4gICAgICAgIH0pXG4gICAgXSwgVGFza0NvbXBvbmVudCk7XG4gICAgcmV0dXJuIFRhc2tDb21wb25lbnQ7XG59KHZ1ZV8xLmRlZmF1bHQpKTtcbmV4cG9ydHMuVGFza0NvbXBvbmVudCA9IFRhc2tDb21wb25lbnQ7XG52dWVfYXBwXzEuVnVlQXBwLlJlZ2lzdGVyQ29tcG9uZW50KCdtYW5hZ2VyLXRhc2snLCBUYXNrQ29tcG9uZW50KTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsInZhciBtYXAgPSB7XG5cdFwiLi9mclwiOiBcIi4vbm9kZV9tb2R1bGVzL21vbWVudC9sb2NhbGUvZnIuanNcIixcblx0XCIuL2ZyLmpzXCI6IFwiLi9ub2RlX21vZHVsZXMvbW9tZW50L2xvY2FsZS9mci5qc1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL25vZGVfbW9kdWxlcy9tb21lbnQvbG9jYWxlIHN5bmMgcmVjdXJzaXZlIFsvXFxcXFxcXFxdKGZyKFxcXFwuanMpPykkXCI7Il0sInNvdXJjZVJvb3QiOiIifQ==