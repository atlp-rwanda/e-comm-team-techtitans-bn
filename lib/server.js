"use strict";

var _app = _interopRequireDefault(require("./app.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  PORT
} = process.env;
const start = () => {
  try {
    _app.default.listen(PORT, () => {
      console.log(`🍏 Server is running on: http://localhost:${PORT} ... 🌊`);
    });
    // Catch all routes that were not found and send this response
    _app.default.use((req, res) => {
      res.status(404).json({
        status: 404,
        success: false,
        message: "🍎 Route doesn't exist.😬"
      });
    });
  } catch (error) {
    if (error) {
      console.log(`🍎 Error occurred when starting server: ${error.message}`);
    } else {
      return error.message;
    }
  }
};
start();

// "scripts": {
//     "start": "nodemon src/server.js",
//     "lint:fix": "eslint src --fix --cache",
//     "test": "jest",
//     "dev": "nodemon --exec babel-node src/server.js"
//   },

// "build": "babel src --out-dir lib",
// "start": "npm run build && node lib/server.js"