# Documentation 

For full documentation visit [https://beta.extento.org](https://beta.extento.org)



- [Quick Start](#a-idquick-startquick-starta)
- [Extento CLI](#a-idextento-cliextento-clia)
  * [Create](#a-idextento-cli-createcreatea)
  * [Workspace](#a-idextento-cli-workspaceworkspacea)
- [Workspace](#a-idworkspaceworkspacea)
  * [UI](#a-idworkspace-uiuia)
  * [Config Management](#a-idworkspace-config-managementconfig-managementa)
  * [Continuous Content Script Processes](#a-idworkspace-continuous-content-script-processescontinuous-content-script-processesa)
  * [Onload Hook](#a-idworkspace-onload-hookonload-hooka)
  * [Manifest](#a-idworkspace-manifestmanifesta)
  * [Background API](#a-idworkspace-background-apibackground-apia)
- [Testing](#a-idworkspacetestinga)
- [Popup and Options Pages](#a-idpopup-and-options-pagespopup-and-options-pagesa)
- [Application Configuration](#a-idapplication-configurationapplication-configurationa)
  * [Selective Builds](#a-idapplication-configuration-selective-buildsselective-buildsa)
  * [UI Ordering](#a-idapplication-configuration-ui-orderingui-orderinga)
  * [Manifest V3](#a-idapplication-configuration-manifest-v3manifest-v3a)
  * [TypeScript](#a-idapplication-configuration-typescripttypescripta)
  * [Webpack](#a-idapplication-configuration-webpackwebpacka)
- [Styles](#a-idstylesstylesa)
  * [TailwindCSS](#a-idstyles-tailwindcsstailwindcssa)
  * [Assets](#a-idstyles-assetsassetsa)
- [Run, Build, and Deploy](#a-idrun-build-and-deployrun-build-and-deploya)
  * [Development](#a-idrun-build-and-deploy-developmentdevelopmenta)
  * [Release](#a-idrun-build-and-deploy-releasereleasea)
  * [Distribution](#a-idrun-build-and-deploy-distributiondistributiona)

# <a id="quick-start">Quick Start</a>

**TODO**

# <a id="extento-cli">Extento CLI</a>

> An NPM package to scaffold new Extento projects and workspaces.

:warning: *Always use **npx** unless you really know what you're doing.*

## <a id="extento-cli-create">Create</a>

This command will download and modify the [extento-app](https://github.com/extento-org/extento-app) repo under the hood to set up your new project. 

```bash
> npx @extento/cli create my_app
> cd my_app
> npm i
> npm run start
```

## <a id="extento-cli-workspace">Workspace</a>

Must be run inside of an existing Extento project. It will download more code from the [extento-app](https://github.com/extento-org/extento-app) repo and prepare some files for you to write your application logic inside of.

:warning: *If you're getting strange compile errors after using this command, try restarting webpack*

```bash
> npx @extento/cli workspace my_workspace
> npm run start
```

# <a id="workspace">Workspace</a>

> Think of a workspace directory as a "micro-service" (kinda) for your Chrome Extension.

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

## <a id="workspace-ui">UI</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

## <a id="workspace-config-management">Config Management</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

## <a id="workspace-continuous-content-script-processes">Continuous Content Script Processes</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

## <a id="workspace-onload-hook">Onload Hook</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

## <a id="workspace-manifest">Manifest</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

## <a id="workspace-background-api">Background API</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

# <a id="workspace">Testing</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

# <a id="popup-and-options-pages">Popup and Options Pages</a>

> Customize your extension's popup and options UI.

Within your project there is a folder: **browser/** with two files: **popup.tsx**, **options.tsx**. Use React and TailwindCSS to customize these however you would like. 

```
$EXTENTO_BROWSER_DIR_STRUCTURE
├── browser
│   ├── options.tsx
│   └── popup.tsx
$EXTENTO_BROWSER_DIR_STRUCTURE
```

These files will have access to certain portions of the [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/) not available in regular content scripts. For more information on what these files will compile down to see Chrome's official documentation: 

- Options: https://developer.chrome.com/docs/extensions/mv3/options/
- Popup: https://developer.chrome.com/docs/extensions/reference/action/

# <a id="application-configuration">Application Configuration</a>

## <a id="application-configuration-selective-builds">Selective Builds</a>

> Allow developers to specify a subset of workspaces they want to include in a given webpack build. 

One problem with Extento's workspace model is that it encourages over-priviledged extensions if the developer is not careful. Each workspace requires it's [own set of permissions and site access rules](#workspace-manifest), which means adding workspaces will cause the entire set of required permissions and access rules in our final manifest to build up. In conclusion: **too many workspaces = not enough security**. By giving developers the ability to release only a subset of workspaces to different users, this is no longer a problem.

## <a id="application-configuration-ui-ordering">UI Ordering</a>

**TODO**

## <a id="application-configuration-manifest-v3">Manifest V3</a>

**TODO**

## <a id="application-configuration-typescript">TypeScript</a>

**TODO**

## <a id="application-configuration-webpack">Webpack</a>

**TODO**

# <a id="styles">Styles</a>

## <a id="styles-tailwindcss">TailwindCSS</a>

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

## <a id="styles-assets">Assets</a>

**TODO**

# <a id="run,-build,-and-deploy">Run, Build, and Deploy</a>

## <a id="run,-build,-and-deploy-development">Development</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

## <a id="run,-build,-and-deploy-release">Release</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```

## <a id="run,-build,-and-deploy-distribution">Distribution</a>

- **TODO**: explain
- **TODO**: add code examples

```
 



```