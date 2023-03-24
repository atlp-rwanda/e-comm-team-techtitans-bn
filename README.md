[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

<!-- TABLE OF CONTENTS -->

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#live-demo">Live Demo</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This is an e-commerce platform with essential commerce features, having a backend built with Node, Sequelize, Postgres and fully customizable.

### Folder Structure

    .
    ├── node_modules             # Packages folder (ignored)
    ├── /src                     # Source files
    ├── .env                     # Environment variables (ignored)
    ├── .env.example             # Environment variables schema
    ├── .eslintrc.json
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    └── README.md                # Documentation

#### src

    ./src
    ├── /controllers                   # Functions executed when hitting a route
    ├── /database
    │   ├── /schemas                   # Schema definitions
    │   └── config                     # db connection configuration
    ├── /middleware
    │   ├── /auth
    │   └── /validation
    ├── /routes                        # All endpoints
    ├── /services                      # Communication with the db
    ├── app.js                         # Configuration for required packages
    └── server.js

#### tests

     ./test                             # Entry point
    ├── /routes
    ├── /utils

### Folder structure

This is the structure for any folder. The same applies for next folders.

    ./folder
    ├── index.js                     # Handles all exports of that folder
    └── file.js                      # All its exports, but handled by its index.js

### Tech Stack

- []() Node.js
- []() Javascript
- []() Express
- []() Postgres DB
- []() Sequelize ORM
- []() Jest

<!-- LIVE DEMO -->

## Live Demo

Not yet live 😬

<!-- GETTING STARTED -->

## Getting Started

To get a local duplicate up and running, follow these simple steps:

### Prerequisites

- []() Node.js
- []() Package manager. We are using [npm](https://www.npmjs.com/)
- []() Postgres DB

### Installation

1. Clone the repo ⚡️
   ```sh
   git clone https://github.com/atlp-rwanda/e-comm-team-techtitans-bn.git
   ```
2. Install packages 📦.
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following keys ,or, just grab the content in `.env.example` :
   ```sh
    PORT =
    DB_USER =
    DB_HOST =
    DB_NAME =
    DB_PASSWORD =
    DB_PORT =
   ```
4. Start your local development server

```sh
npm dev
```

5. Start your Tests

npm run test

6. Start your Tests with code coverage

npm run coverage

<!-- CONTRIBUTING -->

## Contributing

To make contributions...

1. Clone the repo
1. Create your Feature Branch (`git checkout -b ft-some-feature`)
1. Commit your Changes (`git commit -m 'ft: add some feature'`)
1. Push to the Branch (`git push origin ft-some-feature`)
1. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License.

<!-- CONTACT -->

## Contact

You can reach out to the Team Leader, [David](mailto:tuyishmirend@gmail.com)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- []() The Andela Team
