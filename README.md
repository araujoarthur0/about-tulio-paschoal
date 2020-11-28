## Quick start

- `npm install`
- `npm start`


## Documentation
When running npm start, you'll start a browser-sync server, with hot reload for html, js and scss files.
The index.html file is built up from the /partials folder, and should not be committed (it's ignored by default).

## Changing contents of Blog, Career and Projects Sections
These three sections are built dynamically from the respective JSON files assets/blog.json, assets/career.json and assets/projects/projects.json.
Editing those JSON files should make the page change its contents.
Each JSON file has a correspondent .schema.json file in the same folder, describing how you should fill the files.