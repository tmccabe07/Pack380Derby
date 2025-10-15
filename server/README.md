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

#### Set number of lanes
POST /api/competition/lanes
{
    "numLanes": 6
}

#### Get number of lanes
GET /api/competition/lanes

#### Update number of lanes
PUT /api/competition/lanes
{
    "numLanes": 4
}

### To register
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

### To create races
POST /api/raceandheats 
{
    "raceType": "1",
    "numLanes": 6,
    "role": "cub"
}

This will create quarternfinals race with a unique race id and as many heats as necessary to race all of the cars associated with the role of cub with the number of lanes specified as 6 per heat.  Repeat this with different raceType to create multiple races with heats. 

Note: The numLanes parameter will now use the value set via the competition API if not specified.

raceType mapping:
1 = prelim, which will generate a quarterfinal
10 = quarterfinal, which will generate a semi or quarterfinaldeadheat
20 = semi, which will generate a final or semideadheat
30 = final, not used
40 = quarterfinaldeadheat, which will generate a semi
50 = semideadheat, which will generate final

All heats are stored in table "public"."HeatLane".  Race metadata is stored in "public"."Race".

### To update results
POST /api/heat-lane/:id/:result
e.g. POST /api/heat-lane/1/2

This will update the heat-lane row id of 1 with the result of 2 

### To calculate results
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


