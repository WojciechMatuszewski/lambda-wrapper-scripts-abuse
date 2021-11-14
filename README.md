# Executing Node.js in _AWS Lambda wrapper scripts_

This repo contains example of how one might use [_wrapper scripts_](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-modify.html) to push the expensive computations to [_AWS Lambda_ `Init` phase](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-context.html).

Please keep in mind that the **`Init` phase is constrained to ten seconds**.

## Deployment

1. `npm run bootstrap`
2. `npm run deploy`
