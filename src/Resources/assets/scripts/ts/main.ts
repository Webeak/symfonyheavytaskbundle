/**
 * Client side entry point.
 * ------------------------
 *
 * Before anything else, import the dependencies file.
 * The role of this file is to import all modules in use in the app.
 */
import "./dependencies";
import { App, AppSymbol } from "essentials/app";
import { Container } from "essentials/inversify/container";

$(document).ready(() => {
    const app: App = Container.getContainer().get<App>(AppSymbol);

    (window as any).app = app;
    app.start();
});
