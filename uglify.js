// File System
const fs = require('fs');
// Uglify JS
const uglifyJs = require('uglify-js');

// Files to minify
let result = uglifyJs.minify([/* array of files to minify */])

// View the output
console.log(result.code);

fs.writeFile('output.min.js', result.code, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('File was succesfully saved!');
    }
})

