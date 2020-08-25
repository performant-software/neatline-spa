# neatline-3
###### Front-end for neatline-omeka-s plugin

## Development
To run the neatline-3 app as a independent single page application, use:
```
yarn start
```
This will start a new development server at `http://localhost:3000`.

***

To run the neatline-3 app integrated with Omeka S, set the `NODE_BUILD_DESTINATION` environment variable to the location of the `build` folder within your neatline-omeka-s project (i.e. `path/to/neatline-omeka-s/asset/neatline/build`), then use:
```
yarn run build && yarn run deploy
```
This will create a new production build within the neatline-omeka-s project. Each time you make a change to one of the source files, this will need to be re-run.