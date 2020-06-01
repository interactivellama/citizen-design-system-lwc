import lwc from "@lwc/rollup-plugin";

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

import copy from "rollup-plugin-copy";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";

import glob from "glob";

const plugins = [
  babel({
    babelrc: false,
    plugins: [
      // We can't use the actual TypeScript rollup plugin because it needs to run before lwc
      // and there is no option to disable decorator transforms.
      // plugin-transform-typescript only transforms type information and leaves
      // the decorators in place for @lwc/babel-plugin-component to transform
      ["@babel/plugin-transform-typescript"],
      ["@lwc/babel-plugin-component"]
    ],
    extensions: [".ts", ".js"]
  }),
  lwc({
    // Because we are using TypeScript, only transform css and html
    // TypeScript and LWC will be converted by Babel (see above)
    include: ["**/*.css", "**/*.html"],
    rootDir: "./src/elements",
    sourcemap: true,
    stylesheetConfig: {
      // By default, LWC disables custom property definitions
      customProperties: {
        allowDefinition: true
      }
    }
  }),
  resolve(),
  commonjs(),
  replace({
    values: { ...env() }
  }),
  // After LWC has been transformed, transform any syntax isn't supported
  // by all browsers that support modules
  babel({
    babelrc: false,
    presets: ["@babel/preset-modules"],
    extensions: [".ts", ".js"]
  }),
  HACK_importMeta(),
  HACK_namespaceLWC()
];

if (process.env.NODE_ENV !== "production") {
  plugins.push(
    visualizer({
      filename: "./.dist/stats.html"
    })
  );
}

if (process.env.NODE_ENV === "production") {
  plugins.push(
    copy({
      targets: [{ src: "public/*", dest: ".dist" }]
    }),
    terser({
      ecma: 8,
      safari10: true
    })
  );
}

export default [
  {
    input: glob.sync("./src/modules/*.ts"),
    output: {
      dir: ".dist/modules",
      chunkFileNames: "[name]-[hash].chunk.js",
      format: "esm",
      sourcemap: true
    },
    treeshake: {
      moduleSideEffects: true
    },
    manualChunks: {
      cds: glob.sync("./src/modules/cds-*"),
      vendor: ["immer", "lwc"]
    },
    plugins
  }
];

function env() {
  return {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
    "process.env.API_URL": JSON.stringify(process.env.API_URL || "")
  };
}

// Babel requires a plugin to understand this syta
// but we can't control the lwc related babel transforms
function HACK_importMeta() {
  return replace({
    values: {
      "process.env.IMPORT_META_URL": "import.meta.url"
    }
  });
}

/*
 From Trailhead Design System project:

 When the LWC engine adds child components, it calls document.createElement()
 with a tag name that matches the namespace/name of the component,
 even though it's not actually a custom element.

 https://github.com/salesforce/lwc/blob/master/packages/%40lwc/engine/src/framework/api.ts#L146

 This causes problems when the engine tries to mount a component
 that is also a registed custom element.

 This hack goes through the source code and adds a prefix to the lwc
 elements so they don't collide with registed custom elements.

 Compiled templates look like this when creating a custom component:
 ```js
 api_custom_element("th-header-desktop", _thHeaderDesktop, {})
 ```
*/
function HACK_namespaceLWC() {
  return {
    renderChunk: (code, chunk, options) => {
      return {
        code: code.replace(
          /api_custom_element\(\"/g,
          'api_custom_element("lwc-'
        ),
        map: null
      };
    }
  };
}
