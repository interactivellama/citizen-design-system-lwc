import { makeDecorator } from "@storybook/addons";
import {
  configure,
  addDecorator,
  addParameters
} from "@storybook/web-components";
import fetchMock from "fetch-mock";
import { html } from "lit-html";
import { until } from "lit-html/directives/until";

fetchMock.config.fallbackToNetwork = true;

// Custom decorator that loads browser modules based on the "modules" parameter
addDecorator(
  makeDecorator({
    name: "withModules",
    parameterName: "modules",
    skipIfNoParametersOrOptions: true,
    wrapper: (storyFn, context, { parameters: modules }) => {
      let promises = Promise.all(
        modules.map(m => import(/* webpackIgnore: true */ m))
      );
      return html`
        ${until(promises.then(() => storyFn(context)))}
      `;
    }
  })
);

// Custom decorator that resets and installs fetch mocks
addDecorator(
  makeDecorator({
    name: "resetMocks",
    parameterName: "installMocks",
    skipIfNoParametersOrOptions: false,
    wrapper: (storyFn, context, { parameters: installMocks }) => {
      fetchMock.restore();
      if (installMocks) installMocks();
      return storyFn(context);
    }
  })
);

addParameters({
  docs: {
    iframeHeight: "200px"
  }
});
