# web-crawler
 Simple web crawler stub project.
 Currently can crawl modern pages, has issue on pages using php files.
 Written in TS-Node.js, TDD moethodology, Jest for testing



## How to init:
> npm install

Installs packages required for the project

> npm run build

This will build the project using tsc command

**Create "reports" directory in the main directory where the ts code has been built.**

 ## How to run
 >npm run \<website name\> \<depth-level\>

 This is the command that will run the crawler

After the command exetutes, you will be able to find a report in the aforementioned "reports" directory with the page counts and the pages thast the crawler had visited/seen.


