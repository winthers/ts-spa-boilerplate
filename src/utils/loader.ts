


/**
@example
EXAMPLE:

var imgLoader1 = new ImageLoader("img", "http://lorempixel.com/output/city-q-c-640-480-4.jpg");
var imgLoader2 = new ImageLoader("img", "http://lorempixel.com/output/city-q-c-640-480-4.jpg");
var imgLoader3 = new ImageLoader("img", "http://lorempixel.com/output/city-q-c-640-480-4.jpg");

var when = new When([imgLoader1.load(), imgLoader2.load(), imgLoader3.load()])
    .progress((n:number) => { 
        console.log("progress " + n + "%")
    })
    .then((data: Array<any>) => {
        console.log(data.toString())
    })
*/




import {Promise, When} from "./promises";


interface ILoaderType {
    load(): Promise;
}

export interface IAsset {
    id: string;
    url: string;

    /** Used to let the loader know what type of asset this is.. usefule if the url dont end i an file extention */
    type?: string;
    
    /** Allows the JSON Loader to use Basic authentication */
    authentication?: {username:string, password:string}

    hasOwnProperty (name:string): boolean;
}

interface ILoaderTypeDefinition {
    type: string;
    pattern():any;
}

export interface ILoader {
    load (assets:Array<IAsset>): Promise;
    get(id: string): any
    exists(id: string): boolean;
}

export class NullLoader implements ILoaderType {

    promis: Promise;

    id: string;
    url: string;
    
    constructor(options:IAsset) {
        this.id = options.id;
        this.url = options.url;
        this.promis = new Promise();
    }

    load():Promise {
        this.promis.resolve({ id:this.id, url: this.url, loaderType:"NullLoader"})
        return this.promis;
    }
}

export class IMGLoader extends NullLoader {

    load(): Promise {
        
        var img = new Image()

        img.onload = (e) => { this.promis.resolve(this.createPayload(e.target)); }
        img.onerror = (e) => {this.promis.reject(e);}
        img.onabort = (e) => {this.promis.reject(e);}

        img.src = this.url;

        return this.promis;
    }

   private createPayload (img:any):any {
       return {
           id: this.id,
           url: this.url,
           img: img,
           width: img.width,
           height: img.height,
           loaderType: "IMGLoader"
       }
   }
}

export class JSONLoader extends NullLoader {

    private doAuthentication: Boolean = false;
    private authentication: string;

    constructor(options: IAsset) {
        super(options);

        if (options.hasOwnProperty("authentication")) {
            this.doAuthentication = true;
            this.authentication = this.createBasicAuthenticationHeader(
                options.authentication.username,
                options.authentication.password
            )
        }
    }

    private createBasicAuthenticationHeader(username: string, password: string): string {
        return "Basic " + btoa(window.unescape(encodeURIComponent(username + ":" + password)));
    }

    load(): Promise {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.url, true);
        
        xhr.setRequestHeader("Accept", "application/json");

        if (this.doAuthentication)
            xhr.setRequestHeader("Authorization", this.authentication);
        
        xhr.onreadystatechange = () =>
        {
            if (xhr.readyState == 4)
            {
                if (xhr.status == 200) 
                {
                    var data = JSON.parse(xhr.responseText);
                    this.promis.resolve({ id: this.id, url:this.url, data: data, loaderType: "JSONLoader"});
                }
                else 
                {
                    this.promis.reject(xhr.status);
                }
            }
        };

        xhr.send();
    
        return this.promis;
    }
}

class LoaderTypeFactory {
    
    private types:Array<ILoaderTypeDefinition> = [
        {type: "image", pattern:():any => { return new RegExp("\\.jpg|\\.jpeg|\\.png|\\.gif", "g") }},
        {type: "json",  pattern:():any => { return new RegExp("\\.json", "g")} }
    ];

    create (asset:IAsset) : ILoaderType {

        let type:string = this.createLoaderType(asset);
        switch(type) {
            case "image": return new IMGLoader(asset); 
            case "json": return new JSONLoader(asset);
            default: return new NullLoader(asset);
        }
    }


    private createLoaderType (asset:IAsset):string {
        
        var type:string = "";
        var assetType:string = asset.hasOwnProperty("type") ? asset.type : null;

        this.types.forEach((o)=>{
              
            if (assetType == o.type || o.pattern().test(asset.url))
                type = o.type

        })       
        
        return type;
    }
}



export class Loader {

    private useCacheBuster;
    private assets:Array<IAsset>;
    private loaderFactory:LoaderTypeFactory;
    private loaders:Array<ILoaderType>;
    private loadedData:Array<{id:string}>;

    constructor(useCacheBuster: boolean = false) {
        this.useCacheBuster = useCacheBuster;   
        this.assets = []; 
        this.loaders = [];
        this.loadedData = [];
        this.loaderFactory = new LoaderTypeFactory();
    }

    public load(assets:Array<IAsset>): Promise {
        
        var def = new Promise();
        var promises:Array<Promise> = [];

        assets.forEach( (obj) => {
            this.loaders.push(this.createLoaderType(this.decorateUrl(obj)))
        })

        this.loaders.forEach((obj)=> {
            promises.push(obj.load());
        })

      
        var when = new When(promises);
        when.progress((n:number, data:any)=> { 
            data = data || {}
            console.log(n + "% loaded" + " - " + data.id + " (url: "+ data.url +")")
        });
        when.then((data:Array<any>) => {
            this.loadedData = data;
            def.resolve(this);
        })

        return def;
    }

    private decorateUrl(asset:IAsset):IAsset {
        if (this.useCacheBuster) {
            var o = asset;
            if(o.url.indexOf("?") < 0) {
                o.url += "?cb="
            }else {
                o.url += "&cb="
            }
            o.url += "" + (+new Date());

            return o;
        }
        return asset;
    }

    public createLoaderType (asset:IAsset):ILoaderType {
        return this.loaderFactory.create(asset);
    }

    /**
     * Get the asset by id.
     */
    public get(id: string): any /*use generics for loader types ? */{
        var result:any = false;
        this.loadedData.forEach((obj) => {
            if(obj.id == id) 
                result = obj;
            
        })
        return result;
    }

    /**
     * Have the asset been loaded
     */
    public exists(id: string): boolean {
        var result = false;
        this.loadedData.forEach((obj) => {
            if(obj.id == id)
                result = true;
        })
        return result;
    }

    public toString ():string {
        var result = "";
        this.loadedData.forEach((o)=> {
            result += o.id + "\n";
        })
        return result;
    }
}







