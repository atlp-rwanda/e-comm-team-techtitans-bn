import request from 'supertest';
import app from '../../src/app';
import { expect, describe, test } from '@jest/globals';
import {
  successRegistration,
  theSuccessLoginCredentials,
  unSuccessfullLoginCredentials,
  profile,enableDisableUser
} from '../mocks/user.mock';
import db from '../../src/database/models';

const User = db.users;

let uuid = User.id;
// const api="http://localhost:3030/api/v1";


 //update account status
//  describe("enable disable status",()=>{
//     it(" update account status", async()=>{
      
//   const res=await request(app).put(`${app}/user/updateAccountStatus/14f8d546-42e3-4413-a4c9-27fe1640f01e`,{
//     accountStatus:"inactive",
//     reason:"you are not following rules and regletion"
//       });

//       expect(res.status).toBe(200);
    
//     });

//    });

 

// describe(' account Status', () => {
//   test('enable disable account status', async () => {
//     const response = await request(app).put(`/api/v1/user/updateAccountStatus/${userUuid}`);
//     expect(response.status).toBe(200);
   
//   });
// });

test('account status', async () => {
  const response = await request(app)
    .put(`/api/v1/user/updateAccountStatus/${uuid}`)
    .send(enableDisableUser);
  
  expect(response.status).toBe(401);
});
