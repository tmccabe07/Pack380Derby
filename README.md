# Pack380Derby
Cub Scouts Pack 380 Pinewood Derby application

## Architecture

- [Web Service](./server)
- [Web Application](./client)

## Development

### Getting Started

```bash
cd server
npm install
npm run db:migrate
npm run server:start:dev
```

visit API Docs at https://localhost:3000/api/docs

## API Testing

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

# To create races
POST /api/race 
{
    "raceName": "quarterfinals",
    "raceId": 3,
    "numLanes": 6,
    "role": "Cub"
}
This will create quarterfinals race with id 3.  Repeat this with different raceIds to create multiple quarterfinals races. 

POST /api/race/semiorfinal
{
    "raceName": "quarterfinals",
    "raceId": 1,
    "numLanes": 6,
    "role": "Cub"
}
This will try to create a semi final race from the quarterfinals race results for Cubs.  
'deadheat' gets appended to raceName if deadheats are needed, e.g. "quarterfinalsdeadHeat".  
If a deadheat is generated, re-run this with raceName = "quarterfinalsdeadHeat".
Note: not elegant, but deadheat will get appended again if there is more than one deadHeat.  

{
    "raceName": "semi",
    "raceId": 1,
    "numLanes": 6,
    "role": "Cub"
}
This will try to create a final race from the semi race results for Cubs. 
'deadheat' gets appended to raceName if deadheats are needed, e.g. "semideadHeat".

All races are stored in table "public"."HeatLane".
