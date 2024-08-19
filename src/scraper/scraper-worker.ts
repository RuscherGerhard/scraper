import Worker from "./abstract-worker"
import {WorkerKind} from "./abstract-worker"
import puppeteer from 'puppeteer'
import RedisIfc from "../storage/redis-ifc"

export default class ScraperWorker extends Worker{

    protected taskDeQueue: ()=>string;// is the scrape task queue
    protected taskEnqueue: (task:string)=>void;
    // private downloadTaskQueue: string[];
    private browser:any;
    private redisIFC:RedisIfc = null;

    // C-Tor
    constructor(id:number,kind:WorkerKind, scrape_task_dequeue_cb:()=>string, downloader_task_enqueue_cb:(task:string)=>void){
        super(id, kind);

        //set the task queue
        this.taskDeQueue = scrape_task_dequeue_cb;
        this.taskEnqueue = downloader_task_enqueue_cb;
        this.redisIFC = RedisIfc.getInstance();
    }

    // the scraper, the tasls should be strings!
    protected async workerFunction(task:string): Promise<boolean> {
        let result = true;

        // scraping with puppeteer here!
        
            console.log(`Scraping ${task}`);
            try
            {
                // init browser!!
                if(this.browser == null){
                    try{
                        this.browser = await puppeteer.launch({headless:true, defaultViewport:null});
                    }catch(e){throw(e);}
                }

                // init page!!!
                const page = await this.browser.newPage();
                let HTTP_res:any = await page.goto(task);
                await page.waitForFunction(
                    'window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500'
                );

                // copying html
                let html_string:string = await page.content();
                
                if(HTTP_res != null && HTTP_res.ok())
                {
                    // scraping stuff here 
                    let imgs = await page.$$('img')??[];
                    let links:string[] = [];
            
                    // get the links
                    for(let a_img_h of imgs){
                        let link:string = await page.evaluate(a_img => a_img.getAttribute('src'), a_img_h);
                        links.push(link);
            
                        await a_img_h.dispose();
                    }
            
                    // making task and pushing in redis!
                    let key:{url:string, links:string[], data:string} = {url:task, links:links, data:html_string};
                    let result:any = await this.redisIFC.insertTask(key);
                    this.taskEnqueue(task);
                }

                // close page and browser!
                await page.close();
                await this.browser.close();    
            }
            catch(e:any){
                result = false;
            }
        return result;
    }
}