# Pinewood Derby Web Service

Built with NestJS

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Testing

### Competition Management

#### Lane Configuration

##### Get complete lane configuration
GET /api/competition/configuration
Returns: { numLanes: 6, usableLanes: [1, 2, 3, 4, 5, 6], usableLaneCount: 6 }

##### Set complete lane configuration
POST /api/competition/configuration
{
    "numLanes": 6,
    "usableLanes": [1, 2, 3, 4, 5, 6]
}

##### Update complete lane configuration
PUT /api/competition/configuration
{
    "numLanes": 4,
    "usableLanes": [1, 3, 5, 6]
}

#### Total Lanes Management

##### Get total number of lanes
GET /api/competition/total-lanes
Returns: { numLanes: 6 }

##### Set total number of lanes
POST /api/competition/total-lanes
{
    "numLanes": 6
}

##### Update total number of lanes
PUT /api/competition/total-lanes
{
    "numLanes": 4
}

#### Usable Lanes Management

##### Get usable lanes
GET /api/competition/usable-lanes
Returns: { usableLanes: [1, 2, 3, 4], usableLaneCount: 4 }

##### Set usable lanes
POST /api/competition/usable-lanes
{
    "usableLanes": [1, 2, 5, 6]
}

##### Update usable lanes
PUT /api/competition/usable-lanes
{
    "usableLanes": [1, 3, 5]
}

#### Race Multipliers

##### Get all multipliers
GET /api/competition/multipliers
Returns: { semifinalMultiplier: 2, finalMultiplier: 1 }

##### Get semifinal multiplier
GET /api/competition/semifinal-multiplier
Returns: { semifinalMultiplier: 2 }

##### Set semifinal multiplier
POST /api/competition/semifinal-multiplier
{
    "multiplier": 2
}

##### Update semifinal multiplier
PUT /api/competition/semifinal-multiplier
{
    "multiplier": 3
}

##### Get final multiplier
GET /api/competition/final-multiplier
Returns: { finalMultiplier: 1 }

##### Set final multiplier
POST /api/competition/final-multiplier
{
    "multiplier": 1
}

##### Update final multiplier
PUT /api/competition/final-multiplier
{
    "multiplier": 1
}

### Racer Management

#### Get all racers
GET /api/racer

#### Get racer by ID
GET /api/racer/:id

#### Create new racer
POST /api/racer
```json
{
    "name": "Jane Doe",
    "den": "Den 8",
    "rank": "tiger",
    "racerType": "cub"
}
```

**Fields:**
- `name` (required): The name of the racer
- `den` (optional): Den number or identifier
- `rank` (required): Valid values are: lion, tiger, wolf, bear, webelos, aol, sibling, adult
- `racerType` (optional): Valid values are: cub, sibling, adult. Defaults to 'cub' if not provided

#### Update racer
PATCH /api/racer/:id
```json
{
    "name": "John Doe",
    "den": "Den 7",
    "rank": "webelos",
    "racerType": "cub"
}
```

#### Delete racer
DELETE /api/racer/:id

### Car Management

#### Get all cars
GET /api/car

**Query Parameters:**
- `racerId` (optional): Filter cars by racer ID
- `include` (optional): When set to `racer`, includes the racer object in the response

**Examples:**
- `GET /api/car` - Returns all cars without racer objects
- `GET /api/car?include=racer` - Returns all cars with racer objects included
- `GET /api/car?racerId=25` - Returns cars filtered by racer ID

#### Get car by ID
GET /api/car/:id

#### Create new car
POST /api/car
```json
{
    "name": "Speed Demon",
    "weight": "5.0",
    "racerId": 25,
    "year": 2025,
    "image": "somebase64encodedstringhere"
}
```

**Fields:**
- `name` (required): The name of the car
- `weight` (required): The official weight of the car as a string (e.g., "5.0")
- `racerId` (required): The ID of the racer who owns this car
- `year` (optional): The 4 digit year that this car raced
- `image` (optional): Base64 encoded string of the car image

#### Update car
PATCH /api/car/:id
```json
{
    "name": "Lightning Bolt",
    "weight": "4.9",
    "racerId": 25,
    "year": 2025,
    "image": "updatedbase64string"
}
```

#### Delete car
DELETE /api/car/:id

#### Get cars by racer ID
GET /api/car/racer/:racerId

#### Get race history for a car
GET /api/car/:id/races
Returns race history for a specific car including race ID, heat ID, lane, result, and race name.

### Race Management

#### To create races

POST /api/race 
{
    "raceType": 10,
    "racerType": "cub"
}

This will create a preliminary race with a unique race id and as many heats as necessary to race all of the cars associated with the cub with the number of lanes specified per heat based on the competition configuration. The raceType parameter now specifies which stage you want to CREATE (not the current stage).

numLanes: number of lanes that are active in a race.  Max is 6.

Note: The numLanes parameter is no longer required as it uses the usable lanes configured via the competition API.

raceType mapping:
10 = preliminary - creates preliminary races from all cars
20 = semifinal - creates semifinal races based on preliminary results (or prelim-deadheat if ties need resolution)
30 = final - creates final races based on semifinal results (or semi-deadheat if ties need resolution)

Note: Deadheat races (40=prelim-deadheat, 50=semi-deadheat) are automatically created when needed to resolve ties. After completing deadheat races, call the same endpoint again with the same raceType to create the intended stage.

Example workflow:
1. POST /api/race with raceType=10 to create preliminary races
2. Complete preliminary races and record results
3. POST /api/race with raceType=20 to create semifinals (may create prelim-deadheat if there are ties)
4. If deadheat was created, complete it and call POST /api/race with raceType=20 again to create semifinals
5. Complete semifinal races and record results
6. POST /api/race with raceType=30 to create finals (may create semi-deadheat if there are ties)
7. If deadheat was created, complete it and call POST /api/race with raceType=30 again to create finals

racerType: 
cub = all cub ranks, inclusive of lion, tiger, wolf, bear, webelos, aol
sibling = all siblings
adult = all adults

All heats are stored in table "public"."HeatLane".  Race metadata is stored in "public"."Race".

#### Get all races
GET /api/race

Retrieves race metadata

#### Get race by ID
GET /api/race/:id

Retrieves race metadata

#### Delete race
DELETE /api/race/:id

#### Clear all races
DELETE /api/race/deleteall/clear

Note, clearing heatlanes needs to be done separately.

#### Import races from CSV
POST /api/race/import
Upload CSV file with header: racename,numlanes,racetype,rank

#### Get all heats for a race
GET /api/race/:id/heats
Returns all heat lanes for a specific race including car and racer information.

#### Get heat lanes for specific heat and race
GET /api/race/:raceId/heat/:heatId
Returns heat lanes for a specific heat within a race.

#### Get races by race type (round)
GET /api/race/round/:raceType
Returns all races for a specific race type (e.g., all preliminaries, semifinals, etc.).

#### Get races by race type and rank (round)
GET /api/race/round/:raceType/:rank
Returns all races for a specific race type and rank combination (e.g., all cub preliminaries).

### Heat Lane Management

#### Get all heat lanes
GET /api/heat-lane

#### Get heat lane by ID
GET /api/heat-lane/:id

#### Update heat lane result
POST /api/heat-lane/:id/:result
e.g. POST /api/heat-lane/1/2

This will update the heat-lane row id of 1 with the result of 2 (where lower numbers are better positions)

This is the key API to use to update scores. 

#### Get heat lanes by race ID
GET /api/heat-lane/race/:raceId

#### Get heat lanes by heat ID
GET /api/heat-lane/heat/:heatId

### Voting Management

#### Get all votes
GET /api/voting

#### Get vote by ID
GET /api/voting/:id

#### Create new vote
POST /api/voting
{
    "carId": 1,
    "category": "Most Creative",
    "voterIdentifier": "user123"
}

#### Update vote
PUT /api/voting/:id
{
    "carId": 2,
    "category": "Best Paint Job",
    "voterIdentifier": "user123"
}

#### Delete vote
DELETE /api/voting/:id

#### Get votes by car ID
GET /api/voting/car/:carId

#### Get votes by category
GET /api/voting/category/:category

#### Get voting results summary
GET /api/voting/results

### Registration

Create racer, then create a car linked to that person

POST /api/racer
```json
{
    "name": "Jane Doe",
    "den": "Den 8",
    "rank": "tiger",
    "racerType": "cub"
}
```

POST /api/car
```json
{
    "name": "Speed Racer",
    "weight": "5.0",
    "racerId": 25,
    "year": 2025,
    "image": "somebase64encodedstringhere"
}
```

**Note:** `racerId` is the unique id of the racer that was created in the first POST request. 



### Results Management

#### Update results
POST /api/heat-lane/:id/:result
e.g. POST /api/heat-lane/1/2

This will update the heat-lane row id of 1 with the result of 2 

#### Calculate results

/api/results/by-rank/:raceType/:rank

For example:
/api/results/by-rank/10/cub

will return the weighted score of total place for each car that has heatlanes that match that racetype and rank, which in this case is racetype = 10 for preliminary and rank = cub.  So all cub prelims. 

#### Get results by rank and race type
GET /api/results/by-rank/:raceType/:rank

Returns summed places (weighted by 100) for all cars by rank and race type.

Example: GET /api/results/by-rank/10/cub
Returns results for all cub rank cars in preliminary races (raceType 10)
Note: rank in this context is cub, sibling or adult, which is the rank value in the heatlane table. 

#### Get final results by rank (excluding finalists)
GET /api/results/final-by-rank/:rank

Returns the top result(s) for the specified rank across all race types, excluding any cars that made it to the finals race (raceType 30). If multiple cars are tied for the best score, all tied cars are returned.

Example: GET /api/results/final-by-rank/lion
Returns the best performing lion rank car(s) that did not make it to finals

This endpoint is useful for determining "best of the rest" or consolation awards for cars that performed well but didn't advance to finals. The score aggregates weighted results (result × 100) across all preliminary, semifinal, and deadheat races.

Note: This endpoint uses the rank stored in the Racer table (via car.racer.rank), not the rank field in HeatLane.

#### Get results by rank and race type
GET /api/results/by-rank/:raceType/:rank

Returns summed places (weighted by 100) for all cars by rank and race type.

Example: GET /api/results/by-rank/10/cub
Returns results for all cub rank cars in preliminary races (raceType 10)
Note: rank in this context is cub, sibling or adult, which is the rank value in the heatlane table. 

#### Get final results by rank (excluding finalists)
GET /api/results/final-by-rank/:rank

Returns the top result(s) for the specified rank across all race types, excluding any cars that made it to the finals race (raceType 30). If multiple cars are tied for the best score, all tied cars are returned.

Example: GET /api/results/final-by-rank/lion
Returns the best performing lion rank car(s) that did not make it to finals

This endpoint is useful for determining "best of the rest" or consolation awards for cars that performed well but didn't advance to finals. The score aggregates weighted results (result × 100) across all preliminary, semifinal, and deadheat races.

Note: This endpoint uses the rank stored in the Racer table (via car.racer.rank), not the rank field in HeatLane.

## Competition Configuration Notes

- **Total Lanes**: Defines the physical number of lanes on the track (1-6)
- **Usable Lanes**: Array of lane numbers that are actually usable for racing
- **Semifinal Multiplier**: Determines how many cars advance from quarterfinals to semifinals (multiplier × lanes per heat)
- **Final Multiplier**: Determines how many cars advance from semifinals to finals (multiplier × lanes per heat)

The race generation system automatically uses the configured usable lanes and multipliers, so races will only use the lanes specified in the usable lanes configuration and advancement will follow the configured multipliers.


