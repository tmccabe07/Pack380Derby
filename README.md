# Pack380Derby
Cub Scouts Pack 380 Pinewood Derby application

## Infrastructure

Copy `iac/terraform.tfvars.example` to `iac/terraform.tfvars` and replace the
placeholders with the appropriate AWS resource IDs and credentials. Configure
AWS credentials separately, then run `terraform init` and `terraform plan`
from `iac/`. Do not commit variable files or Terraform state.

Before planning against an existing deployment, securely obtain its current
state or configure the agreed remote backend. Planning without the existing
state may propose creating duplicate resources. Maintainers must rotate any
credentials previously committed in state or variable files, update the running
deployment, coordinate removal of those files from Git history, and decide
whether to use remote state.

## Architecture

- [Web Service](./server)
- [Web Application](./client)

## Development

### Setup Database

If using postgres. Setup with `brew` on a Mac or similar on Windows.


### Getting Started server

```bash
cd server
npm install
cp env.example .env
```

modify the `.env` for your configuration

```bash
npm run db:migrate
npm run start:dev
```


visit API Docs at https://localhost:3000/api/docs

### Getting started with app

```bash
cd app
npm install
cp env.example .env
```

modify the `.env` for your configuration

```bash
npm run start:dev
```


## Testing

### Playwright
