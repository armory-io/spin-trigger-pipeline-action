<p align="center">
  <a href="https://github.com/armory-io/spin-trigger-pipeline-action/actions"><img alt="typescript-action status" src="https://github.com/armory-io/spin-trigger-pipeline-action/workflows/build-test/badge.svg"></a>
</p>

# Spin Trigger Pipeline

This action allows you to trigger a pipeline in Spinnaker sending a POST request to a webhook configured in Spinnaker and pass parameters to the pipeline context. It lso support Cert auth for restricted environments.

## Usage

Add the following entry to your Github workflow YAML file with the required inputs: 

```yaml
uses: armory-io/spin-trigger-pipeline-action@master
with:
  baseUrl: 'http://exampleUrl'
  source: 'source-word'
  parameters: 'param1:value1,param2:value2'
  crtFile: 'SGVsbG8sIFdvcmxkIQ=='
  keyFile: 'SGVsbG8sIFdvcmxkIQ=='
  passphrase: 'passphrase'
  isEnconded: 'false'
```
### Required Inputs
The following inputs are required to use this action:

| Input | Description |
| --- | --- |
| `baseUrl` | Specifies the Spinnaker base url where you want to trigger the webhook. |
| `source` | Specifies the webhook source to trigger. |

### Optional Inputs
The following inputs are optional in this action:

| Input | Description |
| --- | --- |
| `parameters` | Comma separated key value pairs representing parameters that would be included in the pipeline context of Spinnaker |
| `crtFile` | Specifies client.crt in base64. |
| `keyFile` | Specifies client.key in base64. |
| `passphrase` | Specifies passphrase to auth. |
| `isEncoded` | if set to true, it will decode the crtFile & keyFile before use them. |

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