
// import puppeteer from 'puppeteer'
// import RedisIfc from "../storage/redis-ifc"
import Worker from './abstract-worker'
import ScraperWorker from './scraper-worker';


export default class ScraperManager{

    private scraperWorkerAmmount:number = 4;
    private scraperWorkerQueue:Worker[] = [];
    private scraperTaskQueue:string[] = [];
    

    private browser:any = null;

    // private redisIFC:RedisIfc = null;

    // C-Tor
    constructor(){
        //init the workers
        for(let i:number = 0; i < this.scraperWorkerAmmount; i++){
            this.scraperWorkerQueue.push(new ScraperWorker(i, this.scraperTaskQueue));
            this.scraperWorkerQueue[i].startWorker();
        }
    }

    // enque the next task
    public enqueueTask(url:string):boolean{
        this.scraperTaskQueue.push(url);
        return true;
    }
};