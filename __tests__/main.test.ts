import {constructParameters} from '../src/main'

test('validate parameters are construct correctly', async () => {
  const payload = constructParameters(
    'param1:value1,param2:value2,param3:value3'
  )
  expect(payload).toMatchObject({
    parameters: {
      param1: 'value1',
      param2: 'value2',
      param3: 'value3'
    }
  })
})

test('parameters object is empty when input is empty', async () => {
  const payload = constructParameters('')
  expect(payload).toMatchObject({
    parameters: {}
  })
})
