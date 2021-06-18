import express from 'express';
import { YcScraper } from './lib/service/yc-scraper';

const app = express();
const port = 8080;

app.use(function (req, res, next) {
    res.header("Content-Type",'application/json');
    next();
  });

const ycScraper: YcScraper = new YcScraper();

app.get('/posts', async (req, res, next) => {
    let pageNumber = 1;
    if (req.query.pageNumber) {
        pageNumber = parseInt(<string> req.query.pageNumber);
    }
    ycScraper.getPosts(pageNumber)
        .then(scrapeResult => {
            if (!scrapeResult.success) {
                res.sendStatus(500)
                res.send(JSON.stringify({errorMessage: scrapeResult.errorMessage}))
                return;
            }
            res.send(JSON.stringify(scrapeResult.results));
        })
        .catch(next);    
});

app.get('/posts/:id', async (req,res) => {

});

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
