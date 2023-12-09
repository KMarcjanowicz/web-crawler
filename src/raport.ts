import { error } from 'node:console';
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function checkFolder(folderName:string):Promise<number> {

    console.log(path.join(__dirname, folderName));

    try{
        const res = await fs.access(path.join(__dirname, folderName));
        //Ok folder exists
        return 1;
    }
    catch(err){
        console.log(err);
        return -1;
    }
}

export async function createFile(folderName:string, fileName:string, message:Map<string, number>):Promise<number> {
    
    const parsedName:string = parseName(fileName);
    const parsedMessage:string = parseMessage(message);

    try{
        const res = await fs.writeFile(path.join(__dirname, folderName, `${parsedName}.txt`), parsedMessage);
        return 1;
    }
    catch(err){
        console.log(err);
        return -1; 
    }
}

export function parseName(fileName:string):string {

    if(fileName.length == 0 || typeof fileName !== 'string'){
        throw new Error("fileName is required! Input website name")
    }

    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    return `${fileName} ${date}-${month}-${year}`;
}

function parseMessage(pages:Map<string, number>):string{

    var sorted:Map<string, number>;
    if(pages.size <= 0){
        sorted = pages;
    }else{
        sorted = new Map([...pages.entries()].sort((a, b) => b[1] - a[1]));
    } 
    console.log(sorted);

    var parsed:string = 'PAGE COUNT:';

    for(const page of Object.entries(sorted)){
        parsed += ` \n${page[1]}:\t${page[0]}`;
    }

    return parsed;
}