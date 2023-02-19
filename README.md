## How to enable auto fix code issues:

VSCode settings.json

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```


## Commands

### Generate code

```
yarn cmd -a demo2 -c generate
```

### Build everything in production mode

```
yarn cmd -a demo2 -c build
```

### Build everything in production mode and start electron

```
yarn cmd -a demo2 -c start
```

### Release the app

```
yarn cmd -a demo2 -c release
```

### Watch the renderer code

```
yarn cmd -a demo2 -c watch
```

I will watch and re-compile the renderer code.
You may cmd-R to refresh electron.


## Todo

- Avoid manual rebuild. Hot reload
- https://www.electronforge.io/core-concepts/why-electron-forge
- App menu
- Content menu


## Notes

### `yarn parcel watch` doesn't work

```
Unable to load preload script
cannot find module 'electron'
```

Don't know why in dev mode 'electron' cannot be found

Todo: try again

### global.d.ts scope

Put it in demo1, demo2 can get its types too. Which is not good. Because we don't want one app's types to pollute the other one.

Solution is to put an `tsconfig.json` file in the root of each app. Even an empty file works.


## Ref

- https://www.debugandrelease.com/the-ultimate-electron-guide/
- https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-3-main-to-renderer
