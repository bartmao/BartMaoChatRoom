
import fs = require('fs')

export function getfilecontent(path:string){
    return fs.exists(path);
}