import {Redis} from "ioredis"

type Task = {
    url:string,
    links:string[],
    data:string
};
export default class RedisIfc{
    private static instance:RedisIfc = null;
    // private redis:fakeRedis;
    private redis:any;
    private static connection_data:{host:string, port:number} = {
        host:"localhost",
        port:6379
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
        // try{
        // this.redis = new Redis(
        //     {
        //         host:"localhost",
        //         port: 6379
        //     }
        // );
        // }catch(e){
        //     console.warn(`[Error] : ${JSON.stringify(e)}`);
        // }
        this.connectToRedis(RedisIfc.connection_data);
    }

    async insertTask(task:Task):Promise<{result:boolean, key:string}>{
        let url:string = task.url;

        // standard result
        let result:{result:boolean, key:string} = {result:true, key:url};

        try{
            result.result = await this.redis.set(url, JSON.stringify(task));
        }
        catch(e){
            // in case redis db is not there!!!!
            console.warn(`[Error] : ${JSON.stringify(e)}`);

            result.result = false;
        }
        return result;
    }

    async getTask(url:string):Promise<string>{
        return await this.redis.get(url);
    }
   
    private async connectToRedis(connection_data:{host:string, port:number}){
    //    todo make redis auto-reconnect in case connection is not from start
        try{
            // in case we want to reconnect
            if(this.redis != null){
                console.log('[Info] : reconnecting to redis!');
                this.redis = null;
            }

            this.redis = new Redis(
                connection_data 
            );
            }catch(e){
                
                console.warn(`[Error] : ${JSON.stringify(e)}`);
                // setTimeout(()=>{this.connectToRedis(connection_data)}, 1000)
            }
    }

};