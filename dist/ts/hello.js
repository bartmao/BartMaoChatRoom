define(["require", "exports", 'fs'], function (require, exports, fs) {
    "use strict";
    function getfilecontent(path) {
        return fs.exists(path);
    }
    exports.getfilecontent = getfilecontent;
});
