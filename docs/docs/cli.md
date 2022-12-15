# Extento CLI

> Scaffolds new Extento projects and layers.

:warning: *use **npx** unless you really know what you're doing.*

 ## Create

 This command will download and modify the [extento-app](https://github.com/extento-org/extento-app) repo under the hood to set up your new project. 

 ```bash
 > npx @extento/cli create my_app
 > cd my_app
 > npm i
 > npm run start
 ```
 
 ## Layer
 
 Must be run inside of an existing Extento project. It will download more code from the [extento-app](https://github.com/extento-org/extento-app) repo and prepare some files for you to write your application logic inside of.
 
 :warning: *If you're getting strange compile errors after using this command, try restarting webpack*
 
 ```bash
 > npx @extento/cli layer my_layer
 > npm run start
 ```