import {consent} from './publi24-consent'

export async function cookyConsent(site:string, page:any):Promise<boolean>{
    if(site.indexOf('publi24') > 0){
        return await consent(page);
    }
    return false;
}
