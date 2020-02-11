import SplunkEvents from 'splunk-events'
import axios from 'axios'

const splunkEvents = new SplunkEvents()

splunkEvents.config({
  endpoint: 'https://splunk-heavyforwarder-public.vtex.com:8088',
  token: '50fe94b0-30b6-442a-9cb1-a476c97ba917',
  request: axios,
})

interface Runtime {
  workspace: string
  account: string
}

interface LogConfig {
  level: 'Critical' | 'Important' | 'Debug'
  type: 'Error' | 'Warn' | 'Info'
  workflowType: string
  workflowInstance: string
  event: any
}

declare let window: {
  __RUNTIME__: Runtime
}

const isMasterWorkspace = () => window?.__RUNTIME__?.workspace === 'master'
const getAccount = () => window?.__RUNTIME__?.account

export const logSplunk = (config: LogConfig) => {
  const { level, type, workflowType, workflowInstance, event } = config

  if (isMasterWorkspace()) {
    splunkEvents.logEvent(
      level,
      type,
      workflowType,
      workflowInstance,
      event,
      getAccount()
    )
  }
}
