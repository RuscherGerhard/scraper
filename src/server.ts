'use strict'

import * as express from 'express';
import {utils} from './utils';
import * as LogDump from './utils/log-dump'
import { TestController } from './controllers/test-controller';
import ScrapeController  from './controllers/scrape-controller';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import ScraperManager from './scraper/pipeline-manager'

var server:Server;

export default class Server{
    app:any;
    server:any;
    private static instance:Server;

    static getInstance():Server{
        
        if(server == null){
            Server.instance =  new Server();
        }
        return Server.instance;
    }

    private constructor(){
        this.setUpServer();
    }

    private setUpServer(){
        
        //initialize
        this.app = express();
        

        // set port to listen
        this.server = this.app.listen(utils.app_port, 
            ()=>{LogDump.logDump(` => server listens on ${utils.app_port}`, LogDump.Kind.INFO);
        }
        );

        

        //setup the controllers!
        this.updateServerRoutes(new ScraperManager());

        // swagger init!
        this.makeSwagger();
    }

    private updateServerRoutes(scraper_man:ScraperManager){
        LogDump.logDump(` => firing up controllers`, LogDump.Kind.INFO);

        new TestController(this.app);
        new ScrapeController(this.app, scraper_man);
    }

    private makeSwagger(){
        
        LogDump.logDump(` => ${process.cwd()}`, LogDump.Kind.INFO);

        let path:string = process.cwd()+'/api-docs/api-docs.yaml';

        let swagger_json:any = YAML.load(path);

        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swagger_json));

        LogDump.logDump(` => swagger endpoint docs under hostip:3000/swagger`, LogDump.Kind.INFO); // TODO : this should be host ip not hardcoded localhost!!!!!
    }
}