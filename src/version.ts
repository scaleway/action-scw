// https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#get-the-latest-release
type latestPayload = {
    tag_name: unknown
}

const latestUrl = 'https://api.github.com/repos/scaleway/scaleway-cli/releases/latest';
export const getLatest = async (): Promise<string> => {
    const resp = await fetch(latestUrl);

    if (!resp.ok) {
        throw new Error(`Failed to fetch latest version (status: ${resp.status})`);
    }

    const body = await resp.json() as latestPayload;

    if (body.tag_name === undefined) {
        throw new Error(`Missing tag_name in response when fetching latest version`);
    } else if (typeof body.tag_name !== "string") {
        throw new Error(`Invalid tag_name in response when fetching latest version`);
    } else {
        return body.tag_name;
    }
};
