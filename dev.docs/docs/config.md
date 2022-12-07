# Application Configuration

## Selective Builds

> Allow developers to specify a subset of workspaces they want to include in a given webpack build. 

One problem with Extento's workspace model is that it encourages over-priviledged extensions if the developer is not careful. Each workspace requires it's [own set of permissions and site access rules](docs/workspace?id=manifest), which means adding workspaces will cause the entire set of required permissions and access rules in our final manifest to build up. In conclusion: **too many workspaces = not enough security**. By giving developers the ability to release only a subset of workspaces to different users, this is no longer a problem.

## UI Ordering

**TODO**

## Manifest V3

**TODO**

## TypeScript

**TODO**

## Webpack

**TODO**