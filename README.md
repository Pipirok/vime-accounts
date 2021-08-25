# Vime Accounts

A WIP project in [Next.js](https://nextjs.org) for managing accounts on [vimeworld.ru](https://vimeworld.ru)

## Features:

- Displaying all acounts and their levels
- A route to recache all accounts
- Select a random account
- View all acounts with level less than 5
- Distributed database - [GUN](https://gun.eco)

Huge thanks to [Mark Nadal](https://github.com/amark) and [GUN](https://gun.eco) community for creating such an amazing database!

## How to use:

Clone the repo and install all dependencies:

`npm install`

If you want your own system, then just change `accs` in Gun initialiser to whatever you want, or add your own relay peers!
You can add your own GunDB peer, by replacing the Gun arguments list with your own GunDB relay peer address.
