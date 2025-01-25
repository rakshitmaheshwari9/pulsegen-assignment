Review Scraper

This project is a web scraper designed to fetch reviews from multiple sources, including G2, Capterra, and TrustRadius. The scraper allows users to specify a company name, date range, and source to extract relevant reviews efficiently.

Features

    Scrapes reviews from G2, Capterra, and TrustRadius.
    Filters reviews based on a specified date range.
    Pagination support to fetch reviews across multiple pages.
    Handles dynamic URLs based on company name and source.
    Supports TypeScript for better development experience.

Prerequisites

    Node.js: Ensure Node.js (v16 or higher) is installed.
    npm: Installed alongside Node.js.

Installation

    Clone the repository:

git clone <repository-url>
cd <repository-name>

Install dependencies:

    npm install

Scripts and Commands
1. Running with TypeScript (ts-node)

For debugging and running directly in TypeScript:

npx ts-node src/index.ts 

2. Building and Running with Node.js

Build the TypeScript code into JavaScript and execute with Node.js:

npx tsc
node dist/index.js 

Required Parameters in index.ts
Parameter	Type	Description
--companyName	string	The name of the company to scrape reviews for.
--startDate	string	The start date for filtering reviews (format: YYYY-MM-DD).
--endDate	string	The end date for filtering reviews (format: YYYY-MM-DD).
--source	string	The source to scrape reviews from (e.g., G2, Capterra, TrustRadius).
--companyCode string The company code assigned by capterra for the company(eg:- 144239)(Optional)
Example Commands

    Scraping reviews from G2:

npx ts-node src/index.ts 

Debugging

For debugging purposes, use ts-node to directly run and inspect TypeScript files:

npx ts-node --inspect

Folder Structure

/project-root
│
├── /src               # Source files (TypeScript)
│   ├── index.ts       # Entry point
│   ├── utils/         # Helper functions and utilities
│   ├── scrapers/      # Scraper logic for G2, Capterra, TrustRadius
│
├── /dist              # Compiled JavaScript files
│
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation

Dependencies

    axios: For making HTTP requests.
    cheerio: For parsing and traversing HTML content.
    typescript: TypeScript support for development.
    ts-node: Running TypeScript directly during development.

Install all dependencies:

npm install axios cheerio typescript ts-node

Notes

    Ensure that the source website URLs are updated in the respective scraper files.
    This project assumes that the reviews follow a predictable HTML structure for parsing.
    This project is only working for capterra.
    The date format in capterra is years ago , for which the filter is not implemented
    Use a valid date range to filter reviews; otherwise, the scraper may fetch irrelevant data.
    