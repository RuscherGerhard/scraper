
import Worker from './abstract-worker'
import { WorkerKind } from './abstract-worker'
import DownloaderWorker from './downloader-worker'
import ScraperWorker from './scraper-worker'



export default class PipelineManager{

    private scraperWorkerAmmount:number = 4;
    private downloaderWorkerAmmount:number = 4;
    // worker and task queues!
    private static scraperWorkerQueue:Worker[]     = [];
    private static downloaderWorkerQueue:Worker[]  = [];
    private static scraperTaskQueue:string[]       = [];
    private static downloaderTaskQueue:string[]    = [];

    // private redisIFC:RedisIfc = null;

    // C-Tor
    constructor(){
        //init the workers
        for(let i:number = 0; i < this.scraperWorkerAmmount; i++){
            PipelineManager.scraperWorkerQueue.push(new ScraperWorker(i, WorkerKind.Scraper,this.dequeueTaskCB, this.enqueueDownloaderTask));
            PipelineManager.scraperWorkerQueue[i].startWorker();
        }
        for(let j:number = 0; j < this.downloaderWorkerAmmount; j++ ){
            PipelineManager.downloaderWorkerQueue.push(new DownloaderWorker(j, WorkerKind.Downloader, this.dequeueDownloadTaskCB));
            PipelineManager.downloaderWorkerQueue[j].startWorker();
        }
    }


    // enque the next scraper task
    public enqueueTask(task:string):boolean{

        PipelineManager.scraperTaskQueue.push(task);
        return true;
    }

    protected enqueueDownloaderTask(task:string){
        PipelineManager.downloaderTaskQueue.push(task);
        console.log(PipelineManager.downloaderTaskQueue);
    }

    protected dequeueTaskCB():string{
        if(PipelineManager.scraperTaskQueue.length > 0)
            return PipelineManager.scraperTaskQueue.shift();
        else
            return null;// when queue empty, no next task!
    }

    protected dequeueDownloadTaskCB():string{
        if(PipelineManager.downloaderTaskQueue.length > 0)
            return PipelineManager.downloaderTaskQueue.shift();
        else
            return null;// when queue empty, no next task!
    }
};