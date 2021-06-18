import cheerio from 'cheerio'
import { YcPost } from "../model/yc-post";
import { YcScrapeResult } from '../model/yc-scrape-result';

import { YcHttpClient } from "./yc-http-client";

export class YcScraper {
    readonly httpClient = new YcHttpClient();

    public getPosts(pageNumber: number): Promise<YcScrapeResult<YcPost[]>> {
        return this.httpClient.getNewsPage(pageNumber)
            .then(response => {
                return this.parseHttpResponse(response.data);
            })
            .catch(error => {
                return {success: false, errorMessage: 'Failed to communicate with hacker news'}
            })
    }

    private parseHttpResponse(htmlContent: string): YcScrapeResult<YcPost[]> {
        const $ = cheerio.load(htmlContent);
        const postRows = $('table.itemlist tbody tr.athing');
        if (postRows.length === 0) {
            return {success: false, errorMessage: 'Could not find any posts'};
        }
        const posts: YcPost[] = [];
        postRows.each((i, postRow) => {
            posts.push(this.extractPostFromRow(postRow, $));
        })
        return {success: true, results: posts};
    }

    private extractPostFromRow(postRow: cheerio.Element, $: cheerio.Root): YcPost {
        const postTitleElement = $(postRow).find('td.title a.storylink')
        const postTitle = postTitleElement.text();
        const link = postTitleElement.attr()['href'];
        const detailsRow = postRow.next;
        let score = 0;
        const scoreElement = $(detailsRow).find('span.score');
        if(scoreElement.length != 0) {
            try {
                score = parseInt(scoreElement.text().split(' ')[0]);
            } catch(error) {
                console.log(error)
            }            
        }
        const author = $(detailsRow).find('a.hnuser').text();
        const commentsText = $(detailsRow).find('a').last().text();
        let numberOfComments = 0;
        if (commentsText.includes('comments')) {
            try {
                numberOfComments = parseInt(commentsText.split(' ')[0])
            } catch(error) {
                console.log(error)
            }
        }

        return {
            title: postTitle,
            linkUrl: link,
            points: score,
            author: author,
            numberOfComments: numberOfComments
        };
    }
}
