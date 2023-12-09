import {normalizeURL, getURLsFromHTML} from "./../src/crawl";
import {test, expect} from '@jest/globals'

test('📫 normalizeURL: Strip \'http://\' from URL', () => {
    const input:string = 'http://blog.boot.dev/path';
    const actual:string = normalizeURL(input);
    const expected:string = 'blog.boot.dev/path';

    expect(actual).toEqual(expected);
})

test('📫 normalizeURL: Strip \'https://\' from URL', () => {
    const input:string = 'https://blog.boot.dev/path';
    const actual:string = normalizeURL(input);
    const expected:string = 'blog.boot.dev/path';

    expect(actual).toEqual(expected);
})

test('📫 normalizeURL: Remove trailing (at the end) slashes \'/\' from URL', () => {
    const input:string = 'https://blog.boot.dev/path/';
    const actual:string = normalizeURL(input);
    const expected:string = 'blog.boot.dev/path';

    expect(actual).toEqual(expected);
})

test('📫 normalizeURL: Remove capitals from URL', () => {
    const input:string = 'https://Blog.BooT.dev/PATH/';
    const actual:string = normalizeURL(input);
    const expected:string = 'blog.boot.dev/path';

    expect(actual).toEqual(expected);
})

test('📃 getURLsFromHTML: scrape absolute URLs from HTML page', () => {
    const inputHtmlBody:string = `
    <html>
        <head>   
        </head>
        <body>
            <a href='https://blog.boot.dev/path/'>Boot.Dev</a>
        </body>
    </html>
    `;
    const inputBaseURL:string = "https://blog.boot.dev";
    const actual:string[] = getURLsFromHTML(inputHtmlBody, inputBaseURL);
    const expected:string[] = ['https://blog.boot.dev/path/'];

    expect(actual).toEqual(expected);
})

test('📃 getURLsFromHTML: scrape relative URLs from HTML page', () => {
    const inputHtmlBody:string = `
    <html>
        <head>   
        </head>
        <body>
            <a href='/path/'>Boot.Dev</a>
        </body>
    </html>
    `;
    const inputBaseURL:string = "https://blog.boot.dev";
    const actual:string[] = getURLsFromHTML(inputHtmlBody, inputBaseURL);
    const expected:string[] = ['https://blog.boot.dev/path/'];

    expect(actual).toEqual(expected);
})

test('📃 getURLsFromHTML: scrape both (absolute & relative) URLs from HTML page', () => {
    const inputHtmlBody:string = `
    <html>
        <head>   
        </head>
        <body>
            <a href='/eksde/'>Boot.Dev</a>
        </body>
        <body>
            <a href='https://blog.boot.dev/path/'>Boot.Dev</a>
        </body>
    </html>
    `;
    const inputBaseURL:string = "https://blog.boot.dev";
    const actual:string[] = getURLsFromHTML(inputHtmlBody, inputBaseURL);
    const expected:string[] = ['https://blog.boot.dev/eksde/', 'https://blog.boot.dev/path/'];

    expect(actual).toEqual(expected);
})

test('📃 getURLsFromHTML: omit bad URLs on the HTML page', () => {
    const inputHtmlBody:string = `
    <html>
        <head>   
        </head>
        <body>
            <a href='invalid'>Invalid URL</a>
        </body>
        <body>
            <a href='https://blog.boot.dev/path/'>Boot.Dev</a>
        </body>
    </html>
    `;
    const inputBaseURL:string = "https://blog.boot.dev";
    const actual:string[] = getURLsFromHTML(inputHtmlBody, inputBaseURL);
    const expected:string[] = ['https://blog.boot.dev/path/'];

    expect(actual).toEqual(expected);
})

//🐛