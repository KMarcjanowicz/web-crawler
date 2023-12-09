import {checkFolder, createFile, parseName} from "../src/raport";
import {test, expect} from '@jest/globals'

test('📁 Check if non-existant folder can be accessed', async () => {
    const input:string = 'jestTestFolderX';
    const actual:number = await checkFolder(input);
    const expected:number = -1;

    expect(actual).toEqual(expected);
})

test('📁 Check if existing folder can be accessed', async () => {
    const input:string = 'jestTestFolder';
    const actual:number = await checkFolder(input);
    const expected:number = 1;

    expect(actual).toEqual(expected);
})

test('📄 Create document in test folder, add the contents', async () => {
    const input1:string = 'jestTestFolder';
    const input2:string = 'warhammer.com'
    const input3:string = `
    warhammer.com               : 3
    warhammer.com/about         : 2
    warhammer.com/about/lol     : 1
    warhammer.com/about/lol2    : 1
    `;
    const actual:number = await createFile(input1, input2, input3);
    const expected:number = 1;

    expect(actual).toEqual(expected);
})

test('📄 Correct file name: <website name> + <current date>', async () => {
    const input:string = 'warhammer.com';
    const actual:string = parseName(input);
    const expected:string = 'warhammer.com 08-12-2023';

    expect(actual).toEqual(expected);
})