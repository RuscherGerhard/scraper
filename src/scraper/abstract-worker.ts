
// TODO Do we need this class??????
export default abstract class Worker{

    protected abstract taskQeue:string[];
    private work:boolean = true;
    private iD:number;

    private timeOutId:any;

    constructor(id:number){
        this.iD = id;
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
        console.log(`[Info] : Starting scraper worker with id ${this.iD}`);
        while(this.work)
        {
            // check for the next task!
            if(this.taskQeue.length > 1) {
                let next_task:string = this.taskQeue.shift();//dequeue

                let result:boolean = await this.workerFunction(next_task, this);
                
            } else {
                // wait for 5 ms before checking the queue again!!!
                await new Promise((resolve) => {setTimeout(resolve,100)});
            }
        }
        console.log(`[Info] : Stopping scraper worker with id ${this.iD}`);
    }
};