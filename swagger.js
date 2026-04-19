const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Bancaire API304",
      version: "1.0.0",
      description: "Documentation de ton API bancaire"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./routes/*.js"] // il va lire tes routes automatiquement
});

module.exports = { swaggerUi, swaggerSpec };