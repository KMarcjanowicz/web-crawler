import {JSDOM} from 'jsdom'

export async function crawlPage(baseURL:string, currentURL:string, pages:Map<string, number>, depth:number, maxDepth:number):Promise<Map<string, number>>{
    const baseURLObject:URL = new URL(baseURL);
    const currentURLObject:URL = new URL(currentURL);

    if(baseURLObject.hostname !== currentURLObject.hostname){
        return pages;
    }

    const normalizedCurrentURL:string = normalizeURL(currentURL);

    //how many times the link was seen by the crawler
    if(pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++;
        return pages;
    }

    const _depth:number = depth++;

    //page is being seen right now by the crawler
    pages[normalizedCurrentURL] = 1;
    
    console.log(`🐛 Actively crawling: ${currentURL}`);

    try {
        const res:any = await fetch(currentURL);
        
        //check status code
        if(res.status > 399){
            console.log(`❗ Error in fetch with status code: ${res.status} on page: ${currentURL}`);
            return pages;
        }

        const contentType:string = res.headers.get('content-type');

        //check content-type
        if(!contentType.includes("text/html")){
            console.log(`❗ Non html response, content-type: ${contentType}, on page: ${currentURL}`);
            return pages; 
        }

        const htmlBody:string = await res.text();

        const nextURLs:string[] = getURLsFromHTML(htmlBody, baseURL);

        for(const nextURL of nextURLs){
            if(depth <= maxDepth){
                crawlPage(baseURL, nextURL, pages, _depth, maxDepth); 
            }    
        }

    } catch (error) {
        console.log(`❗ Error in fetch: ${error.message} on page: ${currentURL}`);
    };

    return pages;
};

/**
 * 
 * @param htmlBody - html body retrieved from fetch
 * @param baseURL - check if the link can be made with the hostname of the crawl
 * @returns -array of URL strings
 */
export function getURLsFromHTML(htmlBody:string, baseURL:string):string[] {

    let URLs:string[] = [];

    const dom:JSDOM = new JSDOM(htmlBody);

    const linkElements:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll('a');

    for(const linkElement of linkElements){
        if(linkElement.href.slice(0,1) === '/'){
            //relative
            try {
                const URLObject:URL = new URL(`${baseURL}${linkElement.href}`);
                console.log(`Relative URL:  ${URLObject.href}`);
                URLs.push(URLObject.href);
            } catch (error) {
                console.log(`❗ Error with relative URL: ${error.message}`)
            };    
        }else{
            //absolute
            try {
                const URLObject:URL = new URL(linkElement.href);
                console.log(`Absolute URL: ${URLObject.href}`);
                URLs.push(URLObject.href);
            } catch (error) {
                console.log(`❗ Error with absolute URL: ${error.message}`)
            };   
        };
    };

    return URLs;
};

/**
 * 
 * @param URLString - string with the website address
 * @returns -normalised string, HTTP(s) removed, to lower case, removed '/' at the end
 */
export function normalizeURL(URLString:string ):string {

    const URLObject:URL = new URL(URLString);

    const hostPath:string = `${URLObject.hostname}${URLObject.pathname}`.toLowerCase();

    if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, hostPath.length-1);
    };

    return hostPath;
};