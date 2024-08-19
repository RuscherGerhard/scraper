import * as fs from 'fs';

export function mkDir(dirName:string):boolean{
    let result = true;
    
    try{
        if(!fs.existsSync(dirName)){
        
                fs.mkdirSync(dirName);
                console.log(`[Info] : dir ${dirName} created!`); 
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

        console.log(`opening file with name ${file_name}`);
        
        fs.writeFileSync(file_name, content);
        return true;
    }catch(e){
        console.error(`[Error] : ${e}`);
        return false;
    }
}
