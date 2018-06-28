# Reuseable components for Jumbo NodeJS projects

For this library it has been decided that all the dependencies are installed as dev dependencies 
(as much as possible). Because if you don't use a helper component in this library you need the 
dependencies that component needs.

In this README the components are described and the dependencies that need to be installed.

## Components

### Typescript & TSLint

To use the same rules as this project for Typescript & TSLint create the following tsconfig.json file:
```json
{
   "extends": "./node_modules/jumbo-common/tsconfig-base.json",
   // Project specific rules:
   "compilerOptions": {
     "outDir": "./dist"
   },

   "exclude": [
       "node_modules"
   ],
   "include": [
       "bin/**/*",
       "docs/**/*",
       "lib/**/*",
       "src/**/*",
       "spec/**/*",
       "index.ts"
   ]
}
```
And the following tslint.json file:
```json
{
    "extends": "jumbo-common/tslint"
}
```

And install the following dependencies:
* typescript
* tslib
* tslint
* tslint-microsoft-contrib

### HTTP request classes

Reusable classes for basic HTTP Requests

Install following dependencies in main project
* request
* request-promise-native
* @types/request
* @types/request-promise-native

### Hapi

#### Bunyan TID Logger
To use the bunyan logger you need to install `uuid` in your main project