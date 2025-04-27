# Pack380Derby
Cub Scouts Pack 380 Pinewood Derby application

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