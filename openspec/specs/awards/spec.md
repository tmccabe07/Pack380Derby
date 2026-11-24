# Awards Specification

## Purpose

Which results the app computes for awards and which decisions are left to organizers. This describes what the app does today (baseline, November 2026).

Known gaps, each tracked as an issue: the rule that a scout receives only one award is applied by hand, and there is no awards screen or announcer sheet generated from one source (#97); ties for a podium place or a design award are settled by organizers at the table (#87, #91). One defect is not yet tracked: a car that ran in a dead heat and did not advance can be ranked above a semifinalist in "best of the rest".

## Requirements

### Requirement: Speed results per division
The system SHALL show the final standings for each division (cub, sibling, adult) on the results page.

#### Scenario: Viewing results after the finals
- **WHEN** anyone opens the results page after the finals are scored
- **THEN** they see the finalists of each division in finishing order

### Requirement: Best of the rest for each Cub Scout rank
The system SHALL identify, for each Cub Scout rank (Lion, Tiger, Wolf, Bear, Webelos, Arrow of Light), the best car of that rank that did not reach the final. The best car is the one that reached the furthest stage, and among those, the one with the lowest total at that stage.

#### Scenario: A rank with a semifinalist
- **WHEN** one Wolf car reached the semifinal but not the final and the other Wolf cars went out in the preliminaries
- **THEN** that semifinalist is the Wolf best of the rest

#### Scenario: Finalists are excluded
- **WHEN** the fastest Bear car is in the final
- **THEN** it is not eligible for the Bear best of the rest, and the next best Bear car is named

#### Scenario: Tie
- **WHEN** two cars of the same rank reached the same stage with the same total
- **THEN** both are listed and organizers decide

### Requirement: Design awards come from vote tallies
The system SHALL show organizers the number of votes each car received in each voting category. Organizers choose the winners from those tallies.

#### Scenario: Reviewing a category
- **WHEN** an organizer opens the voting results
- **THEN** each category lists its cars in order of votes received

### Requirement: Award policy is applied by organizers
The system SHALL leave the following to organizers: limiting a scout to one award, the order of precedence between speed and design awards, and breaking ties. The app does not enforce or record these decisions.

#### Scenario: A scout qualifies for two awards
- **WHEN** the same scout tops a rank and a design category
- **THEN** the app shows both results unchanged
- **AND** organizers decide which award the scout receives and who receives the other

### Requirement: Results are visible to everyone as they happen
The system SHALL show leaderboards and results to all signed-in participants as soon as results are entered, without a separate publishing step.

#### Scenario: Following along during the race
- **WHEN** a heat is scored
- **THEN** any participant who reloads the leaderboard sees the updated standings
