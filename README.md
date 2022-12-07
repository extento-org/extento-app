# Documentation 

For full documentation visit [https://beta.extento.org](https://beta.extento.org)

- [Quick Start](#quick-start)
- [Extento CLI](#extento-cli)
  * [Create](#create)
  * [Workspace](#workspace)
- [Workspace](#workspace)
  * [UI](#ui)
  * [Config Management](#config-management)
  * [Continuous Content Script Processes](#continuous-content-script-processes)
  * [Onload](#onload)
  * [Manifest](#manifest)
  * [Background API](#background-api)
- [Testing](#testing)
- [Popup and Options Pages](#popup-and-options-pages)
- [Application Configuration](#application-configuration)
  * [Selective Builds](#application-configuration-selective-builds)
  * [UI Ordering](#ui-ordering)
  * [Manifest V3](#manifest-v3)
  * [TypeScript](#typescript)
  * [Webpack](#webpack)
- [Styles](#styles)
  * [TailwindCSS](#tailwindcss)
  * [Assets](#assets)
- [Run, Build, and Deploy](#run-build-and-deploy)
  * [Development](#development)
  * [Release](#release)
  * [Distribution](#distribution)

# <h1 id="quick-start">Quick Start</h1>


# <h1 id="extento-cli">Extento CLI</h1>

> Scaffolds new Extento projects and workspaces.

:warning: *use **npx** unless you really know what you're doing.*

 ## Create

 This command will download and modify the [extento-app](https://github.com/extento-org/extento-app) repo under the hood to set up your new project. 

 ```bash
 > npx @extento/cli create my_app
 > cd my_app
 > npm i
 > npm run start
 ```
 
 ## Workspace
 
 Must be run inside of an existing Extento project. It will download more code from the [extento-app](https://github.com/extento-org/extento-app) repo and prepare some files for you to write your application logic inside of.
 
 :warning: *If you're getting strange compile errors after using this command, try restarting webpack*
 
 ```bash
 > npx @extento/cli workspace my_workspace
 > npm run start
 ```

# <h1 id="workspace">Workspace</h1>

> Think of a workspace directory as a mini extension.

After successfully running ```@extento/cli workspace <name>``` inside of your project repo, a new directory will appear: ```src/workspaces/<name>```. This is where you write your business logic.

```
$EXTENTO_WORKSPACE_DIR_STRUCTURE
├── <workspace_name>
│   ├── background_api.ts
│   ├── config.ts
│   ├── content_script_process.ts
│   ├── manifest.json
│   ├── onload.ts
│   ├── readme.md
│   ├── ui
│   │   ├── Example.tsx
│   │   ├── context.tsx
│   │   └── index.tsx
│   └── ui_states.ts
$EXTENTO_WORKSPACE_DIR_STRUCTURE
```

 ## UI
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```
 
 ## Config Management
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```
 
 ## Continuous Content Script Processes
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```
 
 ## Onload
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```
 
 ## Manifest
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```
 
 ## Background API
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```
 
 # Testing
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```

# <h1 id="popup-and-options-pages">Popup and Options Pages</h1>

> Customize your extension's popup and options UI.

Within your project there is a folder: **src/browser** with two files: **Popup.tsx**, **Options.tsx**. Use React and TailwindCSS to customize these however you would like. 

```
$EXTENTO_BROWSER_DIR_STRUCTURE
├── browser
│   ├── Options.tsx
│   └── Popup.tsx
$EXTENTO_BROWSER_DIR_STRUCTURE
```

These files will have access to certain portions of the [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/) not available in regular content scripts. For more information on what these files will compile down to see Chrome's official documentation: 

- Options: https://developer.chrome.com/docs/extensions/mv3/options/
- Popup: https://developer.chrome.com/docs/extensions/reference/action/

# <h1 id="application-configuration">Application Configuration</h1>

## <h2 id="application-configuration-selective-builds">Selective Builds</h2>

 > Allow developers to specify a subset of workspaces they want to include in a given webpack build. 

 One problem with Extento's workspace model is that it encourages over-priviledged extensions if the developer is not careful. Each workspace requires it's [own set of permissions and site access rules](#workspace-manifest), which means adding workspaces will cause the entire set of required permissions and access rules in our final manifest to build up. In conclusion: **too many workspaces = not enough security**. By giving developers the ability to release only a subset of workspaces to different users, this is no longer a problem.

 ## UI Ordering
 
 **TODO**
 
 ## Manifest V3
 
 **TODO**
 
 ## TypeScript
 
 **TODO**
 
 ## Webpack
 
 **TODO**

# <h1 id="styles">Styles</h1>

 ## TailwindCSS
 
 Extento uses TailwindCSS out of the box. Wherever you are able to write React code you will be able to use tailwind's built-in utility classes. For further customization there are 3 files available inside of src/styles: **plugins.js**, **theme-extension.js**, **theme.css**. These files make it possible to manage tailwind plugins, theme extensions, and custom stylesheets for a more custom look. 
 
 Don't want to use tailwind? Just avoid those utility classes and don't modify any files in src/styles.
 
 :warning: Support for other styling libraries will not be a part of Extento V1. Extento is run by a single developer at the moment.
 
 ```
 $EXTENTO_STYLES_DIR_STRUCTURE
 ├── styles
 │   ├── plugins.js
 │   ├── theme-extension.js
 │   └── theme.css
 $EXTENTO_STYLES_DIR_STRUCTURE
 ```
 
 [Tailwind's (very awesome and thorough) documentation](https://tailwindcss.com/docs/installation)
 
 ## Assets
 
 **TODO**

# <h1 id="run,-build,-and-deploy">Run, Build, and Deploy</h1>

 ## Development
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```
 
 ## Release
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```
 
 ## Distribution
 
 - **TODO**: explain
 - **TODO**: add code examples
 
 ```
  
 
 
 ```