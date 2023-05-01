"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const client = require("@mailchimp/mailchimp_marketing");
const email = (req, res) => {
  const run = async () => {
    client.setConfig({
      apiKey: "012817ba2d849fb5c041738fc6d20475-us10",
      server: "us10"
    });
    const response = await client.root.getRoot();
    console.log(response);
  };
  run();
};
var _default = email;
exports.default = _default;