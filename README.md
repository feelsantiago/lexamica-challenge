# Lexamica Challenge

### Project Overview
Create a scalable, configurable bi-directional synchronization system between two services using Node.js, MongoDB, and Redis. The architecture should support both webhooks and polling mechanisms while allowing for organization-specific customizations.

I've made a small project to sync music data between two servers.

### Architecture

![lexamica](https://github.com/user-attachments/assets/936c2124-90c4-4d0a-aae8-3fa049977044)

For each `Organization` that is added to the system, we register its polling strategy with recurring jobs in the `PollingQueue`, also we register webhooks for output synchronization in the `OutputQueue`.

This project uses the following dependencies:

- [Node](https://nodejs.org/en) - Javascritp Runtime Environment
- [Express](https://expressjs.com/) - Web Framework
- [BullMQ](https://docs.bullmq.io/) - Queue System
- [Redis](https://redis.io/) - Cache/Queue Database
- [Nx](https://nx.dev/) - Build/Monorepo Platform
- [TSyringe](https://www.npmjs.com/package/tsyringe) - Dependency Injection Container
- [Winston](https://www.npmjs.com/package/winston) - Logger
- [Sapphire Result](https://www.npmjs.com/package/@sapphire/result) - Rust-Like error handler
- [Zod](https://zod.dev/) - Schema validation
- [Validator](https://www.npmjs.com/package/validator) - String sanitizer
- [Passport](https://www.passportjs.org/) - Authentication

### Setup

This project is built with _Nx_ (make sure to have Redis running on localhost:6379)

```bash
-- It will run the config server on localhost:3000
$ npx nx serve music-config

-- It will run the auth server on localhost:3001
$ npx nx serve music-auth

-- It will run the inventory server on localhost:3002
$ npx nx serve music-inventory

-- It will run the integration server on localhost:3000
$ npx nx serve music-integration

-- It will run the faker server on localhost:5000
$ npx nx serve music-faker
```

### Working example

After running all the servers, we can dispatch a simple sync example

1. Create a user

```bash
curl --request POST \
  --url http://localhost:3001/auth/sign-up \
  --header 'content-type: application/json' \
  --data '{
  "email": "user@test.com",
  "password": "12345678"
}'
```

2. Create an organization with a simple mapping schema

```bash
curl --request POST \
  --url http://localhost:3000/organization \
  --header 'authorization: Bearer {{token}}' \
  --header 'content-type: application/json' \
  --data '{
  "synchronization": "two-way",
  "webhook": [
    {
      "type": "input",
      "url": "http://localhost:3000/sync?orgId=",
      "method": "DELETE"
    },
    {
      "type": "output",
      "url": "http://localhost:3004/sync/create",
      "method": "POST"
    }
  ],
  "polling": [
    {
      "endpoint": "http://localhost:3004/music",
      "interval": 1,
      "type": "minute"
    }
  ],
  "mappings": {
    "externalId": {
      "type": "string",
      "source": "id",
      "required": true
    },
    "name": {
      "type": "string",
      "source": "name",
      "required": true
    },
    "artist": {
      "type": "string",
      "source": "artist",
      "required": "true"
    },
    "album": {
      "type": "string",
      "source": "album",
      "required": "true"
    }
  },
  "transforms": []
}'
```

3. Set up the  faker server config to call the integration server webhook when deleting data with the organization Id

```bash
curl --request PUT \
  --url http://localhost:5000/config \
  --header 'content-type: application/json' \
  --data '{
  "create": [],
  "remove": [
    "http://localhost:3003/sync?orgId={{ orgId }}"
  ]
}'
```

4. Generate some fake data

```bash
curl --request POST \
  --url http://localhost:5000/music/generate \
  --header 'content-type: application/json' \
  --data '{
  "count": 5
}'
```

The system will start polling data each minute. If you delete some data from the `faker` server, it will send that information to the integration layer, which will sync the inventory. If you create an inventory for the organization, it will be sent over to the faker server.

### API

- **Auth**

#### Create a user
endpoint: `/auth/sign-up`
method: POST
body 
```ts
{
  email: string;
  password: string; // min(8) 
}
```

#### Signin
endpoint: `/auth/sign-in`
body 
```ts
{
  email: string;
  password: string;  
}
```

- **Organization**

#### Create Organization
endpoint: `/organization`
method: POST
auth: `Authorization: Beare: {{ token }}
body
```ts
{
  synchronization: "one-way" - "two-way";
  webhooks: [{
    type: "input" | "output";
    url: string;
    method: "POST" | "DELETE"
  }];
  polling: [{
    endpoint: string;
    interval: number;
    type: "minute" | "hour" | "day";
  }];
  mappings: {
    // dynamic keys mapped to our domain
    [key]: {
      type: "string" | "number" | "boolean" | "array" | "object";
      source: string; // Third party source property;
      required: boolean;
      //in case of array
      items: {
        [key]: ...
      }
      // in case of objects
      properties: {
        [key]: ...
      }
    }
  }
}
```

#### Fetch Organization
endpoint: `/organization/:id`
method: GET
auth: `Authorization: Beare {{ token }}`

#### Delete Organization
endpoint: `/organization/:id`
method: DELETE
auth: `Authorization: Beare {{ token }}`

- **Inventory**

#### Create an inventory
endpoint: `/inventory`
method: POST
auth: `Authorization: Beare {{ token }`
headers: `x-organization-id: {{ orgId }}`
body

```ts
{
  externalId: string;
  name: string;
  artist: string;
  album: string;
}
```

#### Fetch an inventory
endpoint: `/inventory/organization/:orgId`
method: GET
auth: `Authorization: Beare {{ token }`

#### Fetch all inventories
endpoint: `/inventory`
method: GET
auth: `Authorization: Beare {{ token }`

#### Delete an inventory
endpoint: `/inventory/:id`
method: DELETE
auth: `Authorization: Beare {{ token }`

- **Faker**

#### Generate fake data
endpoint: `/music/generate`
method: POST
body

```ts
{
  count: number // min(1) - max(100)
}
```

#### Fetch one fake item
endpoint: `/music/:id`
method: GET

#### Fetch all fake items
endpoint: `/music`
method: GET

#### Delete a fake item
endpoint: `/music/:id`
method: DELETE

#### Change fake webhook configs
endpoint: `/music/config`
method: PUT
body
```ts
{
  create: string[], //webhook's url to be called when items are generated
  remove: string[], // webhooks url to be called when items are deleted
}
```

