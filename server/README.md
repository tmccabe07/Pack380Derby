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
{
    "name": "Jane Doe",
    "den": "8",
    "rank": "Tiger",
    "role": "Cub"
}

#### Update racer
PATCH /api/racer/:id
{
    "name": "John Doe",
    "den": "7",
    "rank": "Webelos",
    "role": "Cub"
}

#### Delete racer
DELETE /api/racer/:id

### Car Management

#### Get all cars
GET /api/car

#### Get car by ID
GET /api/car/:id

#### Create new car
POST /api/car
{
    "name": "Speed Demon",
    "weight": "5.0",
    "year": 2025,
    "image": "somebase64encodedstringhere",
    "racerId": 25
}

#### Update car
PATCH /api/car/:id
{
    "name": "Lightning Bolt",
    "weight": "4.9",
    "year": 2025,
    "image": "updatedbase64string",
    "racerId": 25
}

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
    "raceType": 1,
    "rank": "cub",
    "groupByRank": false
}

This will create a preliminary race with a unique race id and as many heats as necessary to race all of the cars associated with the cub with the number of lanes specified as 6 per heat.  Repeat this with different raceType to create multiple races with heats. 

numLanes: number of lanes that are active in a race.  Max is 6.

Note: The numLanes parameter is no longer required as it uses the usable lanes configured via the competition API.

raceType mapping:
1 = initialize, which will generate a preliminary
10 = preliminary, which will generate a semifinal or prelim-deadheat
20 = semifinal, which will generate a final or semi-deadheat
30 = final, not used
40 = prelim-deadheat, which will generate a semi
50 = semi-deadheat, which will generate final

rank: 
cub = all cub ranks, inclusive of lion, tiger, wolf, bear, webelos, aol
lion = specific to lion rank (includes all lion dens)
tiger = specific to tiger rank (includes all tiger dens)
wolf = specific to wolf rank (includes all wolf dens)
bear = specific to bear rank (includes all bear dens)
webelos = specific to webelos rank (includes all webelos dens)
aol = specific to aol rank (includes all aol dens)
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
### To register
#Create person, then create a car linked to that person

#POST /api/person
{
    "name": "Jane Doe",
    "den": "8",
    "rank": "Tiger",
    "role": "Cub"
}

#POST /api/car
{
        "name": "25 Car",
        "weight": "5.0",
        "year": 2025,
        "image": "somebase64encodedstringhere",
        "racerId": 25
}
racerId is the unique id of the racer that was created. 



### Results Management

#### Update results
POST /api/heat-lane/:id/:result
e.g. POST /api/heat-lane/1/2

This will update the heat-lane row id of 1 with the result of 2 

#### Calculate results
By Car ID and Race Type:

POST /api/results
{
     "sumBy": 10,    
     "carId": 1, 
     "raceType: 10,
     "role": "cub"
}

This will calculate the results of all heat-lane rows matching carId of 1 and raceType of 10 (aka quarterfinals).  In other words, sums up the car's results for all heats in cub quarterfinals.  

All Cars By Race Type:
POST /api/results
{
     "sumBy": 20,    
     "carId": 0, 
     "raceType: 10,
     "role": "cub"
}

This will calculate the results of all heat-lane rows matching raceType of 10 (aka quarterfinals) and role of cub.  In other words, sums up results for each car in all cub quarterfinals.

All Cars in All races by Role:
POST /api/results
{
     "sumBy": 30,    
     "carId": 0, 
     "raceType: 0,
     "role": "cub"
}

This will calculate the results of all heat-lane rows matching role of cub.  In other words, sums up results for each car in all cub races. 

sumBy mapping:
10 = sum by carId AND raceType
20 = sum all cars by raceType
30 = sum all cars by all races by role

## Competition Configuration Notes

- **Total Lanes**: Defines the physical number of lanes on the track (1-6)
- **Usable Lanes**: Array of lane numbers that are actually usable for racing
- **Semifinal Multiplier**: Determines how many cars advance from quarterfinals to semifinals (multiplier × lanes per heat)
- **Final Multiplier**: Determines how many cars advance from semifinals to finals (multiplier × lanes per heat)

The race generation system automatically uses the configured usable lanes and multipliers, so races will only use the lanes specified in the usable lanes configuration and advancement will follow the configured multipliers.


