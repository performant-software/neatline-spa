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

## Staging
The staging server setup process is documented in the [neatline-omeka-s](http://github.com/performant-software/neatline-omeka-s) repository.

#### Git
The staging server is also setup as a Git server. This will allow developers to push changes to a remote repo and use Git hooks to update and deploy (much like Heroku).

Create the repository, we'll use a "bare" repository to allow pushes.
```
git init --bare neatline-3.git
```

Create the working directory, will be empty until a push is made.
```
git clone neatline-3.git neatline-3
```

Setup the hooks directory
```
git configre core.hooksPath /root/neatline-3/hooks
```

Create a file for environment variables and populate `NODE_ENV`, `NODE_BUILD_DIR`, and `NODE_BUILD_DESTINATION`. These variables will be used in the post-receive hook to deploy the build. The .env file should be kept __outside__ of the neatline-3 directory so that it is not removed during hook execution.
```
touch .env
nano .env
```

Git will use the hooks feature to deploy the app after a push is made. See [post-recieve](hooks/post-receive) hook.

#### Deployment

After the initial setup of the staging server has been done, deployments can be done directly via Github.

First, add the remote respository:
```
git remote add staging root@142.93.114.34:neatline-3.git
```

Then, push your changes:
```
git push staging <local-branch>:<remote-branch>
git push staging my_awesome_feature:master
```