import * as fs from 'fs'
import * as LogDump from "./log-dump"

export function mkDir(dirName:string):boolean{
    let result = true;
    
    try{
        if(!fs.existsSync(dirName)){
        
                fs.mkdirSync(dirName);
                LogDump.logDump(`dir ${dirName} created!`, LogDump.Kind.INFO);
        }
    }catch(e){
        result = false;
    }

    return result;
}

export function dirExists(dirName:string):boolean{
    try {
        let result:boolean = fs.existsSync(dirName);
        return result;
    }catch(e){
        return false;
    }
}


export function writeToFile(content:any, file_name:string):boolean{
    try{
        LogDump.logDump(`opening file with name ${file_name}`, LogDump.Kind.INFO);
        fs.writeFileSync(file_name, content);
        return true;
    }catch(e){
        
        LogDump.logDump(`${e}`, LogDump.Kind.ERROR);
        return false;
    }
}
