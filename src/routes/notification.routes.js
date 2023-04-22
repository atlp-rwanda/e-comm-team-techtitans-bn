import express from 'express';
import {getNotificationForVendor,getNotificationById,deleteNotificationById,deleteAllNotificationsForVendor} from '../controllers/notification/notification.service';

const notifyRouter= express.Router();

notifyRouter.get('/vendor/all', getNotificationForVendor);
notifyRouter.get('/vendor/all/:id', getNotificationById);
notifyRouter.delete('/vendor/all/:id', deleteNotificationById);
notifyRouter.delete('/vendor/all/1/delete', deleteAllNotificationsForVendor);

export default notifyRouter;
