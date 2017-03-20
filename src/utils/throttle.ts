

/**

* @description Throttler allows the throtteling of calls,
* by setting a delay by witch new call will be accepted.
* 
* @example

    var t = new Throttler(100, function () {
        console.log("complete")
    });

    $(window).on("resize", t.call.bind(t));

*/
export class Throttler {

    
    throttle:number;
    timeStart:number;
    timeElapsed:number;
    callback:Function;
    
   /**
    * @param throttle {number} the delay in milis
    * @param callback {Function} the callback
    */
    constructor (throttle:number, callback:Function) {
        this.throttle = throttle
        this.timeStart = 0;
        this.timeElapsed = 0;
        this.callback = callback;
    }

    /** 
    * @description the call proxy 
    */
    call():void {
        this.timeStart = +new Date();
        setTimeout(()=> {
            this.timeElapsed = +new Date() - this.timeStart;    
            if(this.timeElapsed>=this.throttle)
                this.callback();
        }, this.throttle);    
    }

}


