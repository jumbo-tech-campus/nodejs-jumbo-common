# Reuseable components for Jumbo NodeJS projects

## Typescript & TSLint

To use the same rules as this project for Typescript & TSLint create the following tsconfig.json file:
```
{
   "extends": "./node_modules/jumbo-common/tsconfig-base.json",
   // Project specific rules:
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
```
{
    "extends": "jumbo-common/tslint"
}
```

And install the following dependencies:
* typescript
* tslint
* tslint-microsoft-contrib

## HTTP request classes
Reusable classes for basic HTTP Requests

Install following dependencies in main project
* request
* request-promise-native
* @types/request
* @types/request-promise-native
