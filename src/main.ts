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
    serviceName,
    tag,
    secret = undefined,
    httpsAgent = undefined
  try {
    baseURL = core.getInput('baseUrl', {required: true})
    source = core.getInput('source', {required: true})
    serviceName = core.getInput('serviceName', {required: true})
    tag = core.getInput('tag', {required: true})
  } catch (error) {
    core.setFailed(error.message)
    return
  }

  if (core.getInput('secret')) {
    core.debug('Add secret in payload')
    secret = core.getInput('secret')
  }

  if (
    !!core.getInput('crtFile') ||
    !!core.getInput('keyFile') ||
    !!core.getInput('passphrase')
  ) {
    core.info('Add client certificate config')

    httpsAgent = new https.Agent({
      cert: core.getInput('crtFile').replace(/\\n/gm, '\n'),
      key: core.getInput('keyFile').replace(/\\n/gm, '\n'),
      passphrase: core.getInput('passphrase').replace(/\\n/gm, '\n'),
      rejectUnauthorized: false
    })
  }

  const instanceConfig = {
    baseURL,
    headers: {'Content-Type': 'application/json'},
    httpsAgent
  }
  const requestData = {
    secret,
    parameters: {
      serviceName,
      tag
    }
  }

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

run()
