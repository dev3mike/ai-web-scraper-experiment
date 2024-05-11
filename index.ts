import { ScraperService } from "./services/scraperService";


// const server = Bun.serve({
//     port: 3000,
//     async fetch(req) {
//         await ScraperService.Start();
//         return new Response("Scraper is running!");
//     },
// });

// console.log(`Listening on http://localhost:${server.port} ...`);

await ScraperService.Start();