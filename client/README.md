# Pinewood Derby client

Web Application for running a Pinewood Derby

## Steps to use

1. install dependencies `npm install`
1. run the server `npm run start`


## Publish to Github Pages

When you are ready to create a Github Page (Github action already present) you need to enable the Page and action permissions. After this all pushes to _main_ will rebuild the page.

1. push to github `git push origin main`
1. in Github Repo UI, under **Settings > Actions > General_ in **Workflow Permissions** change to **Read and Write Permissions**
1. in Github Repo UI, under **Settings > Pages** in _Build and Deployment > Branch_ choose _gh-pages_ and **Save**
1. Re-run the job. 

The first push will fail because the _gh-pages_ branch does not exist until after you push.