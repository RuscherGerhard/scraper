import Worker from "./abstract-worker"
import puppeteer from 'puppeteer'
import RedisIfc from "../storage/redis-ifc"

export default class ScraperWorker extends Worker{

    protected taskQeue: string[];
    private browser:any;
    private redisIFC:RedisIfc = null;

    constructor(id:number, global_scrape_task_queue:string[]){
        super(id);

        //set the task queue
        this.taskQeue = global_scrape_task_queue
        this.redisIFC = RedisIfc.getInstance();
    }

    // the scraper, the tasls should be strings!
    protected async workerFunction(task: any, self: Worker): Promise<boolean> {
        let result = true;
        
        // scraping here!
        if(typeof(task) == 'string'){
            console.log(`Scraping ${task}`);
            try{
                // init browser!!
                if(this.browser == null){
                    try{
                        this.browser = await puppeteer.launch({headless:true, defaultViewport:null});
                    }catch(e){throw(e);}
                }

                // init page!!!
                const page = await this.browser.newPage();
                await page.goto(task);
                await page.waitForFunction(
                    'window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500'
                );

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
                let key:{url:string, data:string[]} = {url:task, data:links};
                let result:any = await this.redisIFC.insertTask(key);
        

                await page.close();
                await this.browser.close();
                
            } catch(e:any){result = false;}
    }else{
        // if the task has the wrong type, then bad!!!!
            result = false;
    }

        return result;
    }

}