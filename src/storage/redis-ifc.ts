import {Redis} from "ioredis"
import * as LogDump from "../utils/log-dump";

type Task = {
    url:string,
    links:string[],
    data:string
};
export default class RedisIfc{

    private static instance:RedisIfc = null;
    
    private redis:any;

    private ready:boolean = false;
    
    private static connection_data:{host:string, port:number, retry_strategy:(options:any)=>any} = {
        host:"localhost",
        port:6379,
        retry_strategy: (options)=>{
            if(options.error){
                LogDump.logDump(`${options.error.code}`, LogDump.Kind.ERROR);
                return new Error(`${options.error.code}`);
            }
            
            return Math.min(options.attempt * 100, 20000);
        }
    }


    static getInstance(){
        if(this.instance){
            return this.instance;
        } else {
            this.instance = new RedisIfc();
            return this.instance;
        }

    }
    private constructor(){

        this.connectToRedis(RedisIfc.connection_data);
    }

    async insertTask(task:Task):Promise<{result:boolean, key:string}>{
        let url:string = task.url;

        // check for redis connection
        if(!this.ready){
            LogDump.logDump("No Redis Connection", LogDump.Kind.ERROR);
            return {result:false, key:""};
        }

        // standard result
        let result:{result:boolean, key:string} = {result:true, key:url};

        try{
            result.result = await this.redis.set(url, JSON.stringify(task));
        }
        catch(e){
            // in case redis db is not there!!!!
            
            LogDump.logDump(JSON.stringify(e), LogDump.Kind.ERROR);

            result.result = false;
        }
        return result;
    }

    async getTask(url:string):Promise<string>{
        // check for redis connection
        let result:string = "";

        try {
            if(!this.ready){
                LogDump.logDump("No Redis Connection", LogDump.Kind.ERROR);
                return "";
            }

            result = await this.redis.get(url);
        }catch(e){
            LogDump.logDump(JSON.stringify(e), LogDump.Kind.ERROR);
            result = "";
        }

        return result;
    }
   
    private async connectToRedis(connection_data:{host:string, port:number}){
    //    todo make redis auto-reconnect in case connection is not from start
        try{
            // in case we want to reconnect
            if(this.redis != null){
                LogDump.logDump("reconnecting to redis", LogDump.Kind.INFO);
                this.redis = null;
            }

            this.redis = new Redis(
                connection_data
            );

            // on connect
            this.redis.on('connecting', ()=>{
                LogDump.logDump('try connecting to redis',LogDump.Kind.INFO);
                // this.ready = false;
            })
            // on ready
            this.redis.on('ready', ()=>{
                LogDump.logDump('connected to redis',LogDump.Kind.INFO);
                this.ready = true;
            });

            // on error
            this.redis.on('error', ()=>{
                LogDump.logDump('redis : error occured',LogDump.Kind.ERROR);
                this.ready = false;
            });
            // on reconnecting
            // this.redis.on('reconnecting', ()=>{
            //     LogDump.logDump('trying to reconnect to redis',LogDump.Kind.WARNING);
            //     this.ready = false;
            // });

            // on end
            this.redis.on('end', ()=>{
                LogDump.logDump('ending connection to redis',LogDump.Kind.INFO);
                this.ready = false;
            });


        }catch(e){
                
                // console.warn(`[Error] : ${JSON.stringify(e)}`);
                LogDump.logDump(JSON.stringify(e), LogDump.Kind.ERROR);
                this.redis = null;
        }
    }

};