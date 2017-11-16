# gulp-react-boilerplate
Boilerplate for React projects.

## Main Technologies

- [Gulp](https://gulpjs.com/)
- [Webpack](https://webpack.js.org/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Babel for ES6](https://babeljs.io/)

## Installation

Clone the repo and run:
```javascript
npm install
```
If not done yet, install the [gulp cli](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) to run gulp tasks.

## Gulp and Webpack options

Every gulp and webpack related task and option can be found in gulpfile.js. 

## Gulp Tasks

```
gulp
```
Default task. 
Starts the development watchers and serves the current app via connect. Generates development files in /dev.

```
gulp deploy
```
Deployment task.
Generates production files in /dist

## Folders and Files

### /src
Here you can find all uncompiled source files like scss or js. This is the main folder for development.

### /static
Folder for static files like video, audio or image which are not affected by compilation.

### /dev
Generated development files.

### /dist
Generated production files.


More info comming soon...
