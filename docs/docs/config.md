# Application Configuration

 ## Selective Builds

 > Allow developers to specify a subset of layers they want to include in a given webpack build. 

 One problem with Extento's layer model is that it encourages over-priviledged extensions if the developer is not careful. Each layer requires it's [own set of permissions and site access rules](docs/layer?id=manifest), which means adding layers will cause the entire set of required permissions and access rules in our final manifest to build up. In conclusion: **too many layers = not enough security**. By giving developers the ability to release only a subset of layers to different users, this is no longer a problem.

 ## UI Ordering
 
 **TODO**
 
 ## Manifest V3
 
 **TODO**
 
 ## TypeScript
 
 **TODO**
 
 ## Webpack
 
 **TODO**