import fs from 'fs';
import path from 'path'
import {exec} from 'child_process';
import util from 'util';

console.log("migration-all-table");


const asyncExec = util.promisify(exec);      //!!!!!중요!!!

(async() => {
  const migrationFiles : string[] = []
  fs.readdir(path.join(__dirname,"/"),async (err,files) => {
    if(err) console.log("err : ", err);
    if(files) {
      files.forEach(el=> {
        // console.log(el.substr(el.indexOf('.')+1,12));
        if(el.substr(el.indexOf('.')+1,12) === 'create-table') {
          migrationFiles.push(el);
        }
      })

      migrationFiles.sort((a,b) => {
        return Number(a.substr(0, a.indexOf('.'))) - Number(b.substr(0, b.indexOf('.')));
      });
      console.log("migrationFiles : ", migrationFiles);

      for (let el of migrationFiles) {
        console.log("Migration File Name : ", el);

        const { stdout, stderr } = await asyncExec(`./node_modules/.bin/ts-node "${__dirname}/${el}" ${process.argv.join(' ')}`)
        if (stdout) console.log(stdout);
        if (stderr) console.error("Std Err : ",stderr);
      }
    }
  })
})();
