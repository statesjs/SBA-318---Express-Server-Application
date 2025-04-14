# SBA318

## Description

- This Express application is a prototype backend of DevLink, my full-stack portfolio project (Capstone 🎉). It focuses on REST architecture, logical routing, and server-side rendering using EJS templates. This version uses file-based storage instead of a database and does not include full authentication, which will be implemented in the final product. Many safety features and practical applications were not applied here in order to make the mock database interactable to test connectivity...and also because I have a busy weekend.

## Dependencies

- Nodemon
- Express
- EJS
- Joi - for input validation (also used regex in the resources route for posting + patching)

## Folder Structure

```bash
SBA318
├── public/         # Static files (CSS, images etc)
│   └── styles.css
├── views/      # EJS templates
│   ├── index.ejs
│   ├── postResource.ejs
│   └── postUser.ejs
├── routes/
│   ├── resources.js
│   ├── users.js
│   └── comments.js
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
