import * as core from '@actions/core'
import axios from 'axios'
import https from 'https'

const SPINNAKER_WEBHOOK_URL = '/webhooks/webhook'

interface SpinnakerResponse {
  eventProcessed: boolean
  eventId: string
}

const run = async (): Promise<void> => {
  let baseURL,
    source,
    parameters,
    httpsAgent = undefined
  try {
    baseURL = core.getInput('baseUrl', {required: true})
    source = core.getInput('source', {required: true})
    parameters = core.getInput('parameters')
  } catch (error) {
    core.setFailed(error.message)
    return
  }

  if (
    !!core.getInput('crtFile') ||
    !!core.getInput('keyFile') ||
    !!core.getInput('passphrase')
  ) {
    core.info('Adding client certificate config')

    let cert, key

    if (core.getInput('isEncoded')) {
      const certBuff = Buffer.from(core.getInput('crtFile'), 'base64')
      cert = certBuff.toString('utf-8').replace(/\\n/gm, '\n')

      const keyBuff = Buffer.from(core.getInput('keyFile'), 'base64')
      key = keyBuff.toString('utf-8').replace(/\\n/gm, '\n')
    } else {
      cert = core.getInput('crtFile').replace(/\\n/gm, '\n')
      key = core.getInput('keyFile').replace(/\\n/gm, '\n')
    }

    httpsAgent = new https.Agent({
      cert,
      key,
      passphrase: core.getInput('passphrase'),
      rejectUnauthorized: false
    })
  }

  const instanceConfig = {
    baseURL,
    headers: {'Content-Type': 'application/json'},
    httpsAgent
  }
  //TODO: We need to validate format of input before construct parameters
  const requestData = constructParameters(parameters)
  const instance = axios.create(instanceConfig)

  try {
    core.debug(`Request Data: ${JSON.stringify(requestData)}`)
    const response = await instance.post<SpinnakerResponse>(
      `${SPINNAKER_WEBHOOK_URL}/${source}`,
      requestData
    )
    core.debug(`Response Data: ${JSON.stringify(response.data)}`)
    if (response.data.eventProcessed) {
      core.setOutput('eventId', response.data.eventId)
    } else {
      core.setFailed(
        'Request sent to Spinnaker using webhook was not processed.'
      )
    }
  } catch (error) {
    if (error.response) {
      core.setFailed(
        `got error from Spinnaker, status:${error.response.status}, data: ${error.response.data}`
      )
    } else {
      core.setFailed(`got error from Spinnaker, error: ${error.message}`)
    }
  }
}

export interface Parameters {
  parameters: object
}

export function constructParameters(rawParameters: string): Parameters {
  const parametersAsJson = rawParameters.split(',').reduce(function (acc, cur) {
    const key = cur.substring(0, cur.indexOf(':'))
    const value = cur.substring(cur.indexOf(':') + 1, cur.length)
    return {...acc, [key]: value}
  }, {})
  return {
    parameters: {
      ...parametersAsJson
    }
  }
}

run()
