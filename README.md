## Running a build:

`npm run build`

## Publishing to NPM:

1. `npm login` (login credentials can be found in AWS Secrets Manager > Secrets  > Credentials)
2. Update version in package.json
3. `npm publish --access public`


## Local development
Run `./scripts/local.sh -g ckeditor-link` command to test the latest build against the application