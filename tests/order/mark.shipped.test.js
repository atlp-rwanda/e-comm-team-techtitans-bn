import request from 'supertest';
import app from '../../src/app';
import { expect, describe, test } from '@jest/globals';
import { Sequelize } from '../../src/database/models';
import {execSync} from 'child_process'
import db from '../../src/database/models';
import passwordReminder from '../../src/controllers/user/password.reminder';



describe('sellers will be able to mark an order as shipped', () => {
    beforeAll(async () => {
      // run the migrations and seeds before running the tests
      //await Sequelize.sync({ force: true }); // this will run all pending migrations
     
      execSync('npx sequelize-cli db:seed --seed 20230415092102-create-order.js');
    });
   
    test('changing order status to shipped', async () => {
        const Order = db.orders;
        const order = await Order.findOne({ where: { id:1 } });
        let uuid=order.uuid;
        const path=`/api/v1/order/updatestatus/${uuid}`
        const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzZWxsZXJAZ21haWwuY29tIiwicm9sZUlkIjoyLCJpYXQiOjE2ODE4MTA4NjAsImV4cCI6NDgzNzU3MDg2MH0.KrM9LIVX1Yh8RBbQbwRqV_HpbOxq-7_sGXICWgmNK28'
      const response = await request(app)
      .put(path)
      .set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200);
      expect(response.body.data.status).toBe("shipped");
    });
   
    afterAll(() => {
        passwordReminder.stop(); // Stop the passwordReminder service
        // Stop any other asynchronous tasks that are still running
        // ...
      });
  });