# starter-environment
A development environment that includes Node.js, NPM, Gulp, Bootstrap, SASS, JQuery and GSAP..

## Checking out the repo
Open VSCode and clone this GitHub repo: Inside VSCode select Git: Clone command in the Command Palette (Ctrl+Shift+P). And paste repo url. For more info checkout "Cloning a repository" https://code.visualstudio.com/docs/editor/versioncontrol

## How this starter kit was made
Checkout this video: https://www.youtube.com/watch?v=QgMQeLymAdU

And this Gulp tutorial as well: https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885

**1. Create a folder structure**
- dist
- src 

**2. Create folder structure for src**
- css
- scss
- js
- img
index.html

**3. Install Node.js**

https://nodejs.org/en/
To check version installed: node -v

**4. Install NPM**

Via command line: npm install npm -g
To check version installed: npm -v
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

**5. Install gulp-cli globally**

Via command line: npm install gulp-cli g
To check version installed: gulp -v

**6. Initialize npm (this will create a package.json file on root)**

Via command line: npm init
! Answer the questions for installation.

**7. Install gulp locally into the project**

Via command line: npm install --save-dev gulp

**8. Install all this dev dependencies:**
- browser-sync
- browserlist
- gulp-autoprefixer
- gulp-concat
- gulp-csso
- gulp-minify-html
- gulp-sass
- gulp-uglify
- gulp-useref

Via command line: npm install --save-dev browser-sync browserlist gulp-autoprefixer gulp-csso gulp-minify-html gulp-sass gulp-uglify gulp-useref

**9. Install all this dependencies:**
- bootstrap
- greensock
- jquery

Via command line: npm install --save bootstrap greensock jquery popper.js

**10. Create gulpfile.js and tasks**

Checkout this tutorial https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885