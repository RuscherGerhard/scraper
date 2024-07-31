import * as request from 'supertest';
import * as assert from 'assert';
import Server from '../server';

let error_msg = function(msg:string):string{
   return `[ERROR]: ${msg}`;
}

describe(">>> Test controller",async function (){
   
   let app:Server = Server.getInstance();
   
   
   // before(">>> Instantiating app server!", function serverInit(){
   //    app = Server.getServer();
   // });

   it("- it should call /test_get successfully", async function (){
      
      let res = await request(app.server)
      .get('/test_get')
      .query({param1:"Hallo World"})
      .expect(200);
      
      assert.equal(res.body.param, "Hallo World", error_msg('res.body equals undefined!'));
      
   });
   
   it("- it should call /test_post successfully",async function postRouteTest(){

      let payload:any = {param1:"hallo", param2:"world"}
      
      let res = await request(app.server)
      .post("/test_post")
      .send(payload)
      .expect(200);
      
      let req_body = JSON.parse(res.body.req_body);

      assert.equal(req_body.param1, payload.param1, error_msg(`param1: ${res.body.req_body.param1}, and not: ${payload.param1}!`));
      assert.equal(req_body.param2, payload.param2, error_msg(`param2: ${res.body.req_body.param1}, and not: ${payload.param2}!`));
   });

   await app.server.close();
});
