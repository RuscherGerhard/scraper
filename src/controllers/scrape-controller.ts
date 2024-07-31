import ScraperManager from '../scraper/scraper-manager'

export default class ScrapeController{

    private scraperMan:ScraperManager;

    constructor(app:any, scraper_man:ScraperManager){

        this.scraperMan = scraper_man;

        app.get('/scrape-site', async (req:any, res:any)=>{
            const address_regex_1:RegExp = new RegExp(/^http:\/\/www.[A-z]*[0-9]*.[a-z][a-z]+$/gm);
            const address_regex_2:RegExp = new RegExp(/^https:\/\/www.[A-z]*[0-9]*.[a-z][a-z]+$/gm);

            let url:string = req.query.param1;
            url = this.urlSanitise(url);

            if(url === ""){
                res.status(403).send(address_regex_1.test(url)||address_regex_2.test(url));
                return;
            }

            // in case of incomming of several requests in parallel this is inappropriate
            const is_there = this.scraperMan.enqueueTask(url); //await this.scraperMan.scrapeSite(param1);
            if(!is_there){
                res.status(403).send(`site cannot be reached : ${url}`);
                return;    
            }
            res.status(200).send(is_there);
            
        });
    }

    private urlSanitise(url:string): string {
        let resultString:string = "";/// the resultstring

        // define the sanity regexes!
        const address_regex_1:RegExp = new RegExp(/^http:\/\/www.[A-z]*[0-9]*.[a-z][a-z]+$/gm);
        const address_regex_2:RegExp = new RegExp(/^https:\/\/www.[A-z]*[0-9]*.[a-z][a-z]+$/gm);
        const address_regex_3:RegExp = new RegExp(/^www.[A-z]*[0-9]*.[a-z][a-z]+$/gm);
                 
        //check iff we are ok, iff so, set result to url
        if(address_regex_1.test(url)||address_regex_2.test(url)){
            resultString = url;
        }
        else if(address_regex_3.test(url)){
            // if we don't have an actual url
            resultString = "http://"+url;
        }

        // return the url!
        return resultString;
    }

}