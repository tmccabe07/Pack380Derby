# Test Data CSV Files

This folder contains CSV files for testing the import functionality of the Pinewood Derby application.

## Files

### racers-import.csv
Contains 11 test racers across different dens and ranks:
- 2 Lions (Den 1)
- 2 Tigers (Den 2)
- 2 Wolves (Den 3)
- 2 Bears (Den 4)
- 2 Webelos (Den 5)
- 1 Arrow of Light (Den 5)

**Format:** `name,den,rank`

### cars-import.csv
Contains 11 test cars, one for each racer (racerIds 1-11).

**Format:** `name,weight,racerid,year,image`

### races-import.csv
Contains 3 preliminary races for all cub ranks combined.

**Format:** `racename,numlanes,racetype,rank`

- `racetype`: 10 = PRELIMINARY, 20 = SEMIFINAL, 30 = FINAL
- `numlanes`: 6 lanes per race
- `rank`: cub (all cub scouts compete together)
- With 11 cars and 6 lanes, races will have some empty lanes
- Top 2 finishers from each race (6 total) can advance to semifinals

### heatlanes-import.csv
Contains heat lane assignments and results for the 3 preliminary races.

**Format:** `lane,result,carid,heatid,raceid,racetype,rank`

- 18 total entries (6 lanes × 3 races)
- Results are place order (1=1st place, 2=2nd place, etc.)
- Race 1 (raceId=1): Cars 1-6, Heat 1
- Race 2 (raceId=2): Cars 7-11 + 1 empty lane, Heat 1
- Race 3 (raceId=3): Cars 1-6 (second heat), Heat 1
- Top 2 from each race advance: Cars 5, 2 (Race 1), Cars 9, 10 (Race 2), Cars 5, 3 (Race 3)

## Usage

1. **Import Racers First:**
   - Use the racer import endpoint with `racers-import.csv`
   - This will create 11 racers with IDs 1-11

2. **Import Cars Second:**
   - Use the car import endpoint with `cars-import.csv`
   - The racerIds in the CSV reference the racers created in step 1

3. **Import Races Third:**
   - Use the race import endpoint with `races-import.csv`
   - This will create 3 preliminary races for all cubs (rank: cub)
   - Each race has 6 lanes to accommodate multiple cars
   - Top 2 cars from each race (6 total) can advance to semifinals

4. **Import Heat Lanes Fourth:**
   - Use the heat lane import endpoint with `heatlanes-import.csv`
   - This populates race results for all 3 preliminary races
   - Results determine which 6 cars advance to semifinals

## Race Configuration & Results

The 11 cars from `cars-import.csv` compete in 3 preliminary races:

**Race 1 (raceId=1)** - Cars 1-6:
- Lane 1: Car 1 - 3rd place
- Lane 2: Car 2 - 2nd place ⭐ (advances)
- Lane 3: Car 3 - 4th place
- Lane 4: Car 4 - 6th place
- Lane 5: Car 5 - 1st place ⭐ (advances)
- Lane 6: Car 6 - 5th place

**Race 2 (raceId=2)** - Cars 7-11:
- Lane 1: Car 7 - 4th place
- Lane 2: Car 8 - 3rd place
- Lane 3: Car 9 - 1st place ⭐ (advances)
- Lane 4: Car 10 - 2nd place ⭐ (advances)
- Lane 5: Car 11 - 5th place
- Lane 6: Empty (result=0, carId=0)

**Race 3 (raceId=3)** - Cars 1-6 (second heat):
- Lane 1: Car 1 - 6th place
- Lane 2: Car 2 - 4th place
- Lane 3: Car 3 - 2nd place ⭐ (advances)
- Lane 4: Car 4 - 5th place
- Lane 5: Car 5 - 1st place ⭐ (advances)
- Lane 6: Car 6 - 3rd place

**Advancing to Semifinals (6 cars):** Cars 5, 2, 9, 10, 3 (Car 5 advances from both Race 1 and 3)

## Testing Notes

- All weights are between 4.8 and 5.0 ounces (typical pinewood derby range)
- Year is set to 2025 for all cars
- Each racer has exactly one car
- Dens are distributed to show variety
- All ranks follow the Cub Scout progression
