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
    "usableLanes": [1, 2, 3, 4]
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
    "usableLanes": [1, 2, 3, 4]
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

### Registration

Create person, then create a car linked to that person

POST /api/person
{
    "name": "Jane Doe",
    "den": "8",
    "rank": "Tiger",
    "role": "Cub"
}

POST /api/car
{
        "name": "25 Car",
        "weight": "5.0",
        "year": 2025,
        "image": "someurlhere",
        "racerId": 25
}
racerId is the unique id of the person that was created. 

### Race Creation

POST /api/raceandheats 
{
    "raceType": "1",
    "role": "cub"
}

This will create quarternfinals race with a unique race id and as many heats as necessary to race all of the cars associated with the role of cub. The number of lanes per heat is automatically determined from the competition configuration.

Note: The numLanes parameter is no longer required as it uses the usable lanes configured via the competition API.

raceType mapping:
1 = prelim, which will generate a quarterfinal
10 = quarterfinal, which will generate a semi or quarterfinaldeadheat
20 = semi, which will generate a final or semideadheat
30 = final, not used
40 = quarterfinaldeadheat, which will generate a semi
50 = semideadheat, which will generate final

All heats are stored in table "public"."HeatLane".  Race metadata is stored in "public"."Race".

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


