import Worker from "./abstract-worker"
import { WorkerKind } from "./abstract-worker"
import RedisIfc from "../storage/redis-ifc"
import * as fileOps from "../utils/file-ops"
import {logDump, Kind} from "../utils/log-dump";


export default class DownloaderWorker extends Worker{

    protected taskDeQueue:()=>string; // task dequeue function
    private browser:any;
    private redisIFC:RedisIfc = null;
    private downloadResult:boolean;

    constructor(id:number, kind:WorkerKind, download_task_dequeue_cb:()=>string){
        super(id, kind);

        //set the task queue
        this.taskDeQueue = download_task_dequeue_cb;
        this.redisIFC = RedisIfc.getInstance();
    }

    protected async workerFunction(task:string): Promise<boolean> {
        // signalize, that no download hat toook place yet, nor it was successful
        this.downloadResult = false;

        // make project folder names
        let name:string = `Project_${task}`.replace('://', '-');
        let proj_dir_name:string = __dirname + name;
        let proj_pics_dir_name:string = `${proj_dir_name}/pics`;

        // make directories!
        if(!fileOps.mkDir(proj_dir_name)){
            return false;
        }
        if(!fileOps.mkDir(proj_pics_dir_name)){
            return false;
        }
        
        
        try{
            logDump(`Downloading from ${task}`, Kind.INFO)
            let redis_content: any = JSON.parse(await this.redisIFC.getTask(task));

            if(redis_content == ""){
                return false;
            }

            // save html
            if(!fileOps.writeToFile(redis_content.data, proj_dir_name+'/'+name+'.html')){
                return false;
            }

            // compile an array out of the redis data
            let downloads:Promise<boolean>[] = [];

            /**  
             * TODO 
             * split up the download into chunks, or else we risk mem overflow!
             * */
            let link_array:string[] = redis_content.links.slice(0,4); // inhibit the download to the fst 4 images!
            
            // make promisses and push them
            for(let url of link_array){
                downloads.push(this.downloadR(url, proj_pics_dir_name));
            }
                
            // await all the promisses!!!!
            await Promise.allSettled(downloads);

            this.downloadResult = this.downloadResult || true;
        }catch(e){
            // catch all errors
            console.log(`[ERROR] : Download fail : ${e}`)
            logDump(`Download fail : ${e}`, Kind.ERROR);
            this.downloadResult = this.downloadResult||false;
        }
        return this.downloadResult;
    }

    private async downloadR (url:string, download_dir_name:string):Promise<boolean>{

        // get the filename from the url
        let start_idx:number = url.lastIndexOf('/');
        // combine download dir name with actual file name(path to file on hd)
        let file_name:string = download_dir_name+url.slice(start_idx);

        // load the correct module!
        let htt:any = require('http');
        if(url.indexOf('https') > -1){
            htt = require('https');
        }
        
        try{
            // the buffer to save the downloaded data!
            let buffer:Buffer;
            
            // promisify the request
            let request:any;
            await new Promise<void>((resolve)=>{

                // perform the request 
                request = htt.get(url, function (response:any) {

                    response.on('data', function (chunk:Buffer){
                        if(buffer != null)
                        // add a new chunk to the data buffer
                            buffer= Buffer.concat([buffer,chunk]);
                        else 
                            buffer = chunk;
                    });
                    response.on('end',function (){
                        logDump(`Download of ${url} successful`, Kind.INFO);
                        request.end();
                        resolve();
                    });
                });

            });
        
            let result:boolean = fileOps.writeToFile(buffer, file_name);
            
            return result;
        }catch(e){
            console.error(`[Error] : ${e}`);
            logDump(`${e}`,Kind.ERROR);
            return false;
        }
    }
}