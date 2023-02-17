## How to enable auto fix code issues:

VSCode settings.json

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```


## Commands

### Build everything in production mode and start electron

```
yarn start
```

### Build everything in production mode


```
yarn build
```

### Release the app

```
yarn release
```


## Todo

- Avoid manual rebuild. Hot reload
- easier way to get preload code done
  - auto code generation?
- monorepo


## Notes

### `yarn parcel watch` doesn't work

```
Unable to load preload script
cannot find module 'electron'
```

Don't know why in dev mode 'electron' cannot be found


## Ref

- https://www.debugandrelease.com/the-ultimate-electron-guide/
