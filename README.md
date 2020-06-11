## Neatline Single Page Application (Neatline SPA)

This repository contains the front end components of Neatline, a suite of tools for scholars, students, and curators to tell stories with maps and timelines. Neatline SPA is in active development. This application relies on a separate back end adapter, called [Neatline Omeka S](https://github.com/scholarslab/neatline-omeka-s) to provide API endpoints for its data storage and retrieval. That adapter can also include a bundled build of this SPA, to make it easy to install Neatline for Omeka S in one step.

### Development Setup
~~For development purposes, this repository is included as a git submodule in the Neatline adapter for Omeka S. To use an Omeka S instance as the environment for Neatline SPA installation and/or development, please see the instructions at https://github.com/scholarslab/neatline-omeka-s.~~

1) Clone repo
2) Run  `yarn` or `npm install`
    - If you recieve node-gyp errors, running `rm -rf node_modules/` and then `npm install --build-from-resource` seems to work.
3) Run `npm start` to start dev enviromnent*

*You will recieve a CORS error until we address the issue on the api server. A work around for local development is to use a proxy or install a browser extension (see [here](https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9) for more info)