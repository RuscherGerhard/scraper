import * as Puppeteer from 'puppeteer'
import * as LogDump from '../../utils/log-dump'

export async function consent(page:Puppeteer.Page):Promise<boolean>{
    let result:boolean = false;
    try{
    let btns:any[] = await page.$$('.cl-consent__btn');
    for(let btn of btns){
            
            let data_role:string = await page.evaluate(btn => btn.getAttribute('data-role'), btn);

            if(data_role =='b_agree'){
                await btn.click();
                result = true;
            }
        }
        
    } catch(e){
        console.log(`[Error] : ${e}`);
        LogDump.logDump(`${e}`, LogDump.Kind.ERROR);
        return result;
    }

    return result;
}