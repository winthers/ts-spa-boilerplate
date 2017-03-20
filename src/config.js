(function () {

    /*
        Define configuration below, only the section matching the 
        env (isDevEnviroment) will be avaliable to the app.
    */
    var config = {

        development: {
            "env": "dev"
        },
        production:  {
            "env": "prod"
        }
    };


    /* Global exposure. */
    window.config = config[window.isDevEnviroment ? "development" : "production"]  
}());