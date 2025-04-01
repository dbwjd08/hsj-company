## Getting Started

### Install dependancies
```bash
$ yarn
```

### Run the development server
```bash
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the page.

You can start editing the page by modifying `pages/index.page.tsx`. The page auto-updates as you edit the file.

## Generate API code
```bash
$ yarn codegen
```

### How to change API server
1. Edit the swagger json url in **/openapi-codegen.config.ts** file.
2. Edit the baseUrl in **/src/api/yuppieFetcher.ts** file.

### How to force to use 'useQuery' for a specific api
* Use **forceReactQueryComponent()** in **/openapi-codegen.config.ts** file.  
SEE: https://github.com/fabien0102/openapi-codegen/tree/main/plugins/typescript

## How to deploy

### Install firebase cli and login
```bash
$ yarn add global firebase-tools
$ firebase login
$ firebase deploy
```

### Deploy on firebase
```bash
$ yarn deploy
```
