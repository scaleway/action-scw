# GitHub action for Scaleway CLI

This action install [scaleway-cli](https://github.com/scaleway/scaleway-cli) and allows you to run commands as well as install and export your config.

## Usage

### Config

- `save_config`: save your config to scaleway's config file, useful to use it with other tools like terraform or SDKs
- `export_config`: export your config to the environment to use the same action in the next steps

Checkout CLI's [config documentation](https://github.com/scaleway/scaleway-cli/blob/master/docs/commands/config.md)

```yml
- name: Use CLI
  uses: scaleway/action-scw@v0
  with:
    save_config: true
    export_config: true
    version: v2.13.0
    access-key: ${{ secrets.SCW_ACCESS_KEY }}
    secret-key: ${{ secrets.SCW_SECRET_KEY }}
    default-project-id: ${{ secrets.SCW_DEFAULT_PROJECT_ID }}
    default-organization-id: ${{ secrets.SCW_DEFAULT_ORGANIZATION_ID }}
```

### Commands

- `args`: when arguments are given, a command will be executed and the json output will be in the `json` output

```yml
- name: Use CLI
  uses: scaleway/action-scw@v0
  id: cli
  with:
    args: instance server get ${{ env.SERVER_ID }}
- run: echo ${{ steps.cli.outputs.json }}
```

### Others

- `version`: default to latest, must be exact version. Fetched from exported config if available
- `access-key`
- `secret-key`
- `default-project-id`
- `default-organization-id`
