# Popup and Options Pages

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