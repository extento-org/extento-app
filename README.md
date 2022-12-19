# Interview Notes

## About **Extento**

At a high level it's a personal experiment to allow organizations that want to logically maintain a single browser extension but distribute subsets of the extension's features to different members of their organization. Quick example: Imagine you have have the following feature sets that could each be their own extension and we call these extensions: QA Scripts, QA Helper, AWS Resource Manager, AWS Log Helper, Onboarding Helper, QA Feedback, Dev Productivity, etc, etc. Under a simple model we can release each of these extension seperately and distribute to your members according to their roles. However, with Extento we code each of these as a "layer" (see layers/ folder) under a single extension. At build time we then specify which layers we want to combine based on roles, rather than features. So for the above extensions we might have 4 roles: Product Manager, QA Engineer, Junior Dev, Devops Manager. We would then configure each role to make use of some subset of our above layers likeso:

 * Product Manager: [AWS Log Helper, QA Helper, QA Feedback]
 * QA Engineer: [Dev Productivity, AWS Log Helper, QA Scripts, QA Helper, QA Feedback]
 * Junior Dev: [Dev Productivity, AWS Log Helper, Onboarding Helper]
 * DevOps Manager: [Dev Productivity, AWS Log Helper, AWS Resource Manager]

Taking the idea further, each "layer" comes with some built in abstractions to make developing extension a little easier. The code in ./.extento houses a lot of the experimental logic to make the above stuff possible but it is messy and unproven right now. A lot of stuff happens with webpack to make some of the abstractions and build model possible.

## About **Badger** (Interview Specific Demo)

Badger is a single layer, that doesn't benefit from anything I talked about in the section above. I figured it would be a good way to test some of my assumptions with a single extension and display my React skills. You'll see a handful of empty meaningless files, which is because Extento doesn't yet support optionality in the interfaces it expects a layer to contain. I'll describe the relevant files/features below:
* This layer makes use of TailwindCSS and DaisyUI for it's visual interface
* ./shared/tasks.ts: contains logic for task storage and retrieval
* ./shared/store.ts: chrome storage api wrapper
* ./shared/ReachQueryProvider.tsx: ensures react-query cache is shared across components
* ./shared/hooks.ts: mostly houses react-query hooks that make calls to our service worker
* ./shared/blacklist.ts: logic for storing/retrieving lists of sites we shouldn't be allowed to view while a task is in progress
* ./shared/alarm.ts: logic for managing the chrome alarm that causes our task to "fail" if it times out
* ./shared/components/Countdown.tsx: a small widget that renders in different contexts to display time remaining on active task
* ./pages/Tab.tsx: React page that renders whenever we open a new tab. Where most task management occurs
* ./pages/Popup.tsx: React widget that displays when we click out icon button. Allows pausing/resuming work
* ./layers/badger: Contains our service worker and injected UI. The service worker is defined at worker.ts and workerApi.ts.
* ./layers/badger/worker: A single function that can define event handlers for badger. In our case it defines the event that fires when our alarm reaches it's "due date"
* ./layers/badger/workerApi: Contains exported functions that can be called from any script context via @extent.browser/worker (this is part of the Extento abstractions I was referring to). Useful because the service worker has no permission restrictions in regards to the chrome extension api. Without it, we couldn't do anything useful with the injected UI
* ./layers/ui: Contains the popup that displays when you travel to a blacklisted URL and the countdown timer widget which renders on all pages