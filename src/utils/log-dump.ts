export enum Kind{
    INFO,
    DEBUG,
    WARNING,
    ERROR,
};

export function logDump(msg:string, kind:Kind){
    switch(kind){
        case Kind.INFO : {
            console.log(`[Info] : ${msg}`);
            break;
        }
        case Kind.DEBUG :{
            break;
        }
        case Kind.WARNING :{
            console.warn(`[Warning] : ${msg}`)
            break;
        }
        case Kind.ERROR : {
            console.error(`[Error] : ${msg}`);
            break;
        }
    }
}