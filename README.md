<p align="center">
  <a href="https://github.com/armory-io/spin-trigger-pipeline-action/actions"><img alt="typescript-action status" src="https://github.com/armory-io/spin-trigger-pipeline-action/workflows/build-test/badge.svg"></a>
</p>

# Spin Trigger Pipeline

This action allows you to trigger a pipeline in Spinnaker sending a POST request to a webhook configured in Spinnaker.
It helps us to trigger a CD for a Spinnaker services.

## Usage

Add the following entry to your Github workflow YAML file with the required inputs: 

```yaml
uses: armory-io/spin-trigger-pipeline-action@v1
with:
  baseUrl: 'http://exampleUrl'
  source: 'source-word'
  serviceName: 'spinnaker-service-name'
  tag: 'service-tag'
  secret: 'secret'
  crtFile: 'client.crt to auth'
  keyFile: 'client.key to auth'
  passphrase: 'passphrase to auth'
```
### Required Inputs
The following inputs are required to use this action:

| Input | Description |
| --- | --- |
| `baseUrl` | Specifies the Spinnaker base url where you want to trigger the webhook. |
| `source` | Specifies the webhook source to trigger. |
| `serviceName` | Specifies the Spinnaker service name to deploy. |
| `tag` | Specifies the tag to deploy. |

### Optional Inputs
The following inputs are optional in this action:

| Input | Description |
| --- | --- |
| `secret` | Secret word to allow execution in spinnaker webhook. |
| `crtFile` | Specifies client.crt to auth. |
| `keyFile` | Specifies client.key to auth. |
| `passphrase` | Specifies passphrase to auth. |

## Build and Test this Action Locally

1. Install the dependencies: 

```bash
$ npm install
```

2. Build the typescript and package it for distribution: 

```bash
$ npm run build && npm run package
```

3. Run the tests:

```bash
$ npm test

 PASS  ./index.test.js

...
```