## How to enable auto fix code issues:

VSCode settings.json

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```


## Commands

### Start the renderer code as a website

```
yarn serve
```

### Build everything in production mode and start electron

```
yarn start
```

### Build everything in production mode


```
yarn build
```


## Todo

- Fix all warnings and errors
- Avoid manual rebuild. Hot reload
- preload code complete
  - easier way to get preload code done
    - auto code generation?
- validate release process


## Notes

### `yarn parcel watch` doesn't work

```
Unable to load preload script
cannot find module 'electron'
```

Don't know why in dev mode 'electron' cannot be found
