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

## Usage

1. **Import Racers First:**
   - Use the racer import endpoint with `racers-import.csv`
   - This will create 11 racers with IDs 1-11

2. **Import Cars Second:**
   - Use the car import endpoint with `cars-import.csv`
   - The racerIds in the CSV reference the racers created in step 1


## Race Configuration & Results

Create 3 preliminary races. 
Each preliminary race should have 2 heats, with 1 blank car added in one of them. 

To test happy path:
Update the results such that 6 cars advance without a deadheat. 

To test deadheat:
Update the results such that there is a tie for position 6, and a deadheat should be created.
Then update deadheat and see if semi can get created properly.
Then update semi to make a deadheat from semis.
Then update semi deadheat and see if final can get created properly. 

## Testing Notes

- All weights are between 4.8 and 5.0 ounces (typical pinewood derby range)
- Year is set to 2025 for all cars
- Each racer has exactly one car
- Dens are distributed to show variety
- All ranks follow the Cub Scout progression
