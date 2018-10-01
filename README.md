# github-pr-reporting

## Running locally

To use this download the repo and run the following, replacing "your-github-token" with a valid github token.

Test

```
yarn
yarn test
```

Running query

```
yarn
yarn start owner:facebook repo:react token:your-github-token
```

## Experimental Docker Support

You can test and run the code in Docker using the `bin` scripts.

Run tests

`./bin/test`

Run query

`./bin/run owner:facebook repo:react token:your-github-token`

## VSCode Debugging

Visual Studio Code debugging is supported via the `launch` and `task` definitions in `.vscode`.

To run the project you will need to define environment variables for the parameters. Create a `.env` file in the root of the project similar to this.

```
owner=facebook
repo=react
pages=6
token=your-github-token
```

