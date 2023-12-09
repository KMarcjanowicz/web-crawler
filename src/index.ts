import * as path from 'node:path'

import {crawlPage, normalizeURL} from "./crawl.js";
import {checkFolder, createFile} from "./raport.js";

//emtry point to the application
async function main():Promise<void>{
    if(process.argv.length < 3){
        console.log("❗ No website provided!");
        process.exit(1);
    }

    if(process.argv.length > 4){
        console.log("❗ Too many commandline arguments!");
        process.exit(1);
    }

    for(const arg of process.argv){
        console.log(arg);
    }

    const baseURL:string = process.argv[2];

    const depth:number = Number(process.argv[3]);

    const res:number = await checkFolder('raports');
    if(res == 1){
        const pages:Map<string, number> = await crawlPage(baseURL, baseURL, new Map(), 0, depth);
        await createFile('raports', normalizeURL(process.argv[2]), pages);
    }
}

main();