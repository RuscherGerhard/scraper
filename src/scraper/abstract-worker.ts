
// TODO Do we need this class??????
export enum WorkerKind{
    Scraper,
    Downloader
}
export default abstract class Worker{

    protected abstract taskDeQueue:()=>string;
    private work:boolean = true;
    private iD:number;
    private kind:WorkerKind;

    private timeOutId:any;

    constructor(id:number, kind:WorkerKind){
        this.iD = id;
        this.kind = kind;
    }

    //start the worker thread!
    startWorker(){
        this.work = true;
        this.worker();
    }

    //stop worker thread!
    stopWorker(){
        this.work=false;
    }


    protected abstract workerFunction(task:any, self:Worker):Promise<boolean>;

    async worker(){
        console.log(`[Info] : Starting worker with id ${this.iD} and kind ${this.kind}`);
        while(this.work)
        {
            // check for the next task!
            let next_task:any = this.taskDeQueue(); //try to tequeue
            if(next_task != null) {
                // call workerFunction with the next task!
                let result:boolean = await this.workerFunction(next_task, this);
                console.log(`[Info] : succes ${result} kind ${this.kind}`);
            } else {
                // wait for 5 ms before checking the queue again!!!
                await new Promise((resolve) => {setTimeout(resolve,100)});
            }
        }
        console.log(`[Info] : Stopped worker with id ${this.iD} and kind ${this.kind}`);
    }
};