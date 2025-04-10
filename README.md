# SBA318

## Description

- This application is a standalone Express-based prototype for the backend of DevLink, my full-stack portfolio project. It focuses on data modeling, REST architecture, and server-side rendering using EJS templates. This version uses file-based storage instead of a database and does not include full authentication. It represents the foundational logic powering DevLink’s resource-sharing system.

## Folder Structure

```bash
SBA318
├── public/             # Static files (CSS, images etc)
├── views/              # EJS templates
├── routes/
│   ├── resourceRoutes.js
│   └── userRoutes.js
├── utilities/
│   ├── logger.js
│   └── error.js
├── data/
│   ├── resources.json  # Simulate a database
│   ├── users.json
│   └── comments.json
├── app.js
├── package.json
└── README.md
```
