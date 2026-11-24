# Race Format Specification

## Purpose

How cars are grouped into heats, how heats are scored, and how cars advance from the preliminary rounds to the final. This describes what the app does today (baseline, November 2026).

Known gaps, each tracked as an issue: lanes are drawn at random so a car can repeat a lane (#98); only places are recorded, not times (#99); the advancing count uses total lanes rather than usable lanes (#77); a heat that has not been run counts as a score of zero (#85); empty lanes are filled with placeholder cars (#86); a division that fits in one heat still has to run every stage (#87).

## Requirements

### Requirement: Divisions race separately
The system SHALL run a separate competition for each division: cub, sibling and adult. Cars only race against cars in their own division.

#### Scenario: Preliminary round for one division
- **WHEN** an organizer creates a preliminary round for the cub division
- **THEN** every registered cub car is placed in exactly one heat of that round
- **AND** no sibling or adult car appears in it

### Requirement: Track lanes are configurable
The system SHALL let an organizer set the number of lanes on the track, from 1 to 6, and mark which of those lanes are usable. Heats use only usable lanes.

#### Scenario: A lane is out of service
- **WHEN** the track has 6 lanes and lane 3 is marked unusable
- **THEN** each heat has 5 cars in lanes 1, 2, 4, 5 and 6

#### Scenario: Four-lane track
- **WHEN** the track is set to 4 lanes, all usable
- **THEN** each heat has up to 4 cars

### Requirement: Heats are drawn at random
The system SHALL assign cars to heats and lanes by random draw each time a round is created. Each round is drawn independently of earlier rounds.

#### Scenario: Two preliminary rounds
- **WHEN** an organizer creates a second preliminary round for a division
- **THEN** every car in the division runs once more
- **AND** its heat and lane are drawn again without regard to the first round

#### Scenario: Field does not fill the last heat
- **WHEN** the number of cars is not a multiple of the usable lanes
- **THEN** the remaining lanes are left without a competing car

### Requirement: Heats are scored by finishing place
The system SHALL record a finishing place for each car in a heat. Places run from 1 to the number of lanes in the heat and no two cars in a heat share a place.

#### Scenario: Recording a six-car heat
- **WHEN** the scorer enters places for a six-car heat
- **THEN** each car has a different place from 1 to 6
- **AND** the heat is shown as completed

#### Scenario: Duplicate place
- **WHEN** the scorer gives two cars in the same heat the same place
- **THEN** the heat cannot be saved until it is corrected

### Requirement: Stage score is the sum of places
The system SHALL rank cars within a stage by the sum of their finishing places across every heat they ran in that stage. A lower total ranks higher. Totals are shown multiplied by 100.

#### Scenario: Two preliminary runs
- **WHEN** a car finishes 1st and 2nd in its two preliminary heats
- **THEN** its preliminary score is 300

#### Scenario: Scores do not carry forward
- **WHEN** a car advances to the semifinal
- **THEN** its semifinal ranking starts from zero and uses semifinal heats only

### Requirement: Advancement to semifinal and final
The system SHALL advance the best-ranked cars of a division from the preliminary stage to the semifinal, and from the semifinal to the final. The number advancing is the number of lanes multiplied by a setting: by default two heats' worth to the semifinal and one heat's worth to the final.

#### Scenario: Six lanes, sixty cub cars
- **WHEN** the preliminary rounds are complete
- **THEN** the 12 cars with the lowest totals advance to the semifinal
- **AND** the 6 cars with the lowest semifinal totals advance to the final

#### Scenario: Small division
- **WHEN** a division has no more cars than the configured semifinal size
- **THEN** only one heat's worth of cars advances to the semifinal

### Requirement: Ties at the cutoff are settled by a dead heat
The system SHALL create a dead-heat race when more cars are tied at the advancement cutoff than there are places left. Only the tied cars race. Cars ranked above the tie advance regardless.

#### Scenario: Three cars tied for the last two places
- **WHEN** 10 cars are clearly inside the top 12 and 3 cars are tied for places 11 and 12
- **THEN** the system creates a dead heat for those 3 cars instead of the semifinal
- **AND** once it is scored, the 2 with the best dead-heat places advance along with the 10

#### Scenario: Tie that fits
- **WHEN** the cars tied at the cutoff exactly fill the remaining places
- **THEN** all of them advance and no dead heat is created

### Requirement: Final standings
The system SHALL rank the finalists of each division by their total in the final stage and show that ranking as the division's final result.

#### Scenario: Final complete
- **WHEN** every heat of the final has been scored
- **THEN** the results page lists the finalists in order of final total, lowest first
