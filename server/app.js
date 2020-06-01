const connect = require("connect");
const cors = require("cors");
const superstatic = require("superstatic");

module.exports = () => {
  const app = connect();

  let corsConfig = null;
  if (process.env.RESTRICT_CORS === "true") {
    corsConfig = {
      origin: [/salesforce\.com$/]
    };
  }

  app.use(cors(corsConfig));

  app.use(
    superstatic({
      config: {
        cleanUrls: true,
        public: ".dist",
        headers: [
          {
            source: "**/*",
            headers: [
              {
                key: "Cache-Control",
                value: "max-age=3600, public"
              }
            ]
          },
          {
            source: "**/*.chunk.{css,js}",
            headers: [
              {
                key: "Cache-Control",
                value: "max-age=10080, public"
              }
            ]
          }
        ]
      }
    })
  );

  if (process.env.STORYBOOK === "true") {
    app.use(
      superstatic({
        config: {
          cleanUrls: true,
          public: ".storybook-static"
        }
      })
    );
  }

  return app;
};
