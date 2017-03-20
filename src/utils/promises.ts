
    
    export class Promise {
        private _resolvers: Array<Function>;
        private _rejectors: Array<Function>;

        private _payload: any;
        private _isResolved: Boolean;
        private _isRejected: Boolean;

        constructor() {
            this._rejectors = [];
            this._resolvers = []
        }

        done(callback: Function): Promise {
            this._resolvers.push(callback);

            if (this._isResolved)
                callback(this._payload);

            return this;

        }
        
        fail (callback:Function): Promise {
            this._rejectors.push(callback);
            if (this._isRejected)
                callback(this._payload);

            return this;
        }

        resolve(data?: any): Promise {
            this._payload = data;
            this._isResolved = true;
            this._resolvers.forEach((fn) => {
                fn(data);
            })
            return this;
        }
        reject(data?: any): Promise {
            this._payload = data;
            this._isRejected = true;
            this._rejectors.forEach((fn) => {
                fn(data);
            })
            return this;
        }
    }


    export class When  {
        private expexted: number;
        private actual: number;
        private collectedPayloads: Array<any>;
        private subscribers: Array<Function>;
        private _isResolved: boolean;
        private progressSubscribers: Array<Function>;

        constructor(promises: Array<Promise>) {
            this._isResolved = false;
            this.subscribers = [];
            this.progressSubscribers = [];
            this.collectedPayloads = [];
            this.actual = 0;
            this.expexted = promises.length;

            promises.forEach((p) => {
                p.done((data?: any) => { this.countCompleted(data) });
            })      

            return this;   
        }

        then (callback: Function): When {
            this.subscribers.push(callback)
            if (this._isResolved)
                callback(this.collectedPayloads)

            return this
        }

        progress(callback: Function): When {
            this.progressSubscribers.push(callback);
            if (this._isResolved)
                callback(100);

            return this

        }

        private countCompleted(data?: any) {
            this.collectedPayloads.push(data);
        
            this.actual++;

            this.progressSubscribers.forEach((fn) => {
                fn( Math.round((this.actual / this.expexted) * 100), data);
            })
        
            if (this.actual >= this.expexted)
                this.resolve();
        }

        private resolve() {
            this._isResolved = true;
            this.subscribers.forEach((fn) => {
                fn(this.collectedPayloads);
            })
        }
    }


