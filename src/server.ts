'use strict'

import * as express from 'express';
import {utils, log, LOG_LEVEL} from './utils';
import { TestController } from './controllers/test-controller';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';

export default class Server{
    server:any;

    constructor(){
        this.setUpServer();
    }

    private setUpServer(){
        
        //initialize
        this.server = express();
        

        // set port to listen
        this.server.listen(utils.app_port, 
            ()=>{log(`server listens on ${utils.app_port}`, LOG_LEVEL.INFO)}
        );

        //setup the controllers!
        this.updateServerRoutes();

        // swagger init!
        this.makeSwagger();
    }

    private updateServerRoutes(){
        log(`firing up controllers`, LOG_LEVEL.INFO);

        new TestController(this.server);
    }

    private makeSwagger(){
        
        console.log(process.cwd());

        let path:string = process.cwd()+'/api-docs/api-docs.yaml';

        let swagger_json:any = YAML.load(path);

        this.server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swagger_json));

        log(`swagger endpoint docs under localhost:3000/swagger`, LOG_LEVEL.INFO);
    }
}