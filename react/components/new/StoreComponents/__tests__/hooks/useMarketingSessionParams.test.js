import { renderHook, act } from '@testing-library/react-hooks'
import useMarketingSessionParams from '../../components/BuyButton/hooks/useMarketingSessionParams'

const fakeSessionWithData = {
  response: {
    namespaces: {
      public: {
        ['utm_source']: {
          value: 'utmSource'
        },
        ['utm_medium']: {
          value: 'utmMedium'
        },
        ['utm_campaign']: {
          value: 'utmCampaign'
        },
        ['utmi_cp']: {
          value: 'utmiCampaign'
        },
        ['utmi_p']: {
          value: 'utmiPage'
        },
        ['utmi_pc']: {
          value: 'utmiPart'
        },
      }
    }
  }
}

const fakeSessionNoData = {
  response: {
    namespaces: {
      public: {}
    }
  }
}

it('if session has correct data, get and format input correctly', async () => {
  window.__RENDER_8_SESSION__ = {}
  window.__RENDER_8_SESSION__.sessionPromise = new Promise(resolve => resolve(fakeSessionWithData))
  const { result } = renderHook(() => useMarketingSessionParams())
  
  await act(async () => await Promise.resolve())

  const { utmParams, utmiParams } = result.current
  expect(utmParams).toMatchObject({
    source: 'utmSource',
    medium: 'utmMedium',
    campaign: 'utmCampaign',
  })
  expect(utmiParams).toMatchObject({
    campaign: 'utmiCampaign',
    page: 'utmiPage',
    part: 'utmiPart',
  })
})

it('if session does not have data, leave object as undefined', async () => {
  window.__RENDER_8_SESSION__ = {}
  window.__RENDER_8_SESSION__.sessionPromise = new Promise(resolve => resolve(fakeSessionNoData))
  const { result } = renderHook(() => useMarketingSessionParams())

  await act(async () => await Promise.resolve())

  const { utmParams, utmiParams } = result.current
  expect(utmParams).toBe(undefined)
  expect(utmiParams).toBe(undefined)
})

it('if session promise rejects, everything still works, response is undefined', async () => {
  window.__RENDER_8_SESSION__ = {}
  window.__RENDER_8_SESSION__.sessionPromise = new Promise((_, reject) => reject())
  const { result } = renderHook(() => useMarketingSessionParams())

  await act(async () => await Promise.resolve())

  const { utmParams, utmiParams } = result.current
  expect(utmParams).toBe(undefined)
  expect(utmiParams).toBe(undefined)
})
