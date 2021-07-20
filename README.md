# Vime Accounts

A WIP project in [Next.js](https://nextjs.org) for managing accounts on [vimeworld.ru](https://vimeworld.ru)

## Features:

- Displaying all acounts and their levels
- A local database to cache information on all added accounts
- A route to recache all accounts in a local database
- Separate table for accounts that are yet to be registered
- Select a random account
- View all acounts with level less than 5
- Select a random account whose level is less than 5

You can add your own database (currently, only PostgreSQL is supported) by passing its URI to ``PG_CON_STRING``

## How to use:

Clone the repo and install all dependencies:

`` npm install ``

Then, configure server variables (next.config.js) and the system is ready for deployment!