"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _notification = require("../controllers/notification/notification.service");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const notifyRouter = _express.default.Router();
notifyRouter.get('/vendor/all', _notification.getNotificationForVendor);
notifyRouter.get('/vendor/all/:id', _notification.getNotificationById);
notifyRouter.delete('/vendor/all/delete/:id', _notification.deleteNotificationById);
notifyRouter.delete('/vendor/all/1/delete', _notification.deleteAllNotificationsForVendor);
var _default = notifyRouter;
exports.default = _default;