import { HttpClient } from '@actions/http-client'

export const VERSION_LATEST = 'latest'
const USER_AGENT = 'scaleway/action-scw'

// https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#get-the-latest-release
type LatestPayload = {
  tag_name: unknown
}

const latestUrl =
  'https://api.github.com/repos/scaleway/scaleway-cli/releases/latest'
export const getLatest = async () => {
  const httpClient = new HttpClient(USER_AGENT)
  const resp = await httpClient.getJson<LatestPayload>(latestUrl)

  if (resp.statusCode !== 200) {
    throw new Error(
      `Failed to fetch latest version (status: ${resp.statusCode})`,
    )
  }

  const body = resp.result

  if (body === null) {
    throw new Error('Missing body')
  } else if (body.tag_name === undefined) {
    throw new Error(`Missing tag_name in response when fetching latest version`)
  } else if (typeof body.tag_name !== 'string') {
    throw new Error(`Invalid tag_name in response when fetching latest version`)
  } else {
    return body.tag_name
  }
}
