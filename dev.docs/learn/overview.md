# Extento - <small>Your Friendly Internal Chrome Extension</small>

Extento is a local-first Chrome Extension framework that makes it easy to build and distribute all kinds of browser extensions within your organization. 

Extento comes with [@extento/cli](/docs/cli.md) which scaffolds new projects (similar to [create-react-app](https://create-react-app.dev/)). Newly scaffolded Extento projects come with pre-built abstractions and make use of developer friendly technologies: **TypeScript**, **React**, and **TailwindCSS**. No more having to inject a script into the dom to render UI overlays, handle bi-directional communication between embedded UIs and a background service worker, keep a manifest.json up to date, or deal with the quirks of Webpack and TypeScript amongst other tedious tasks.

 ## Use Case

 > If you're planning to publish your extension on the Chrome Web Store **this isn't the tool for you.**

 For public extensions we recommend a powerful framework, [Plasmo](https://docs.plasmo.com/). Extento was built specifically for organizations that want to create a single internal extension and it's feature set reflects this. For example, Extento's [workspace](/docs/workspace.md) model makes it easy for different teams to own different slices of functionality within the codebase. Or its [selective builds](/docs/config?id=selective-builds) feature, which makes it trivial to create several distributions, each bundling different combinations of workspaces. All framework development is tightly focused on the local-first use-case.

 ## Architecture

 **TODO**

 ## Browser Support

 At this stage in the project we can only guarantee support for Chrome [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/). That said, any browser that supports Manifest V3 will likely support Extento extensions. Full FireFox and Safari support could occur on a demand-basis. 


