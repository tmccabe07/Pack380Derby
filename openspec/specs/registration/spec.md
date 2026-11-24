# Registration and Check-in Specification

## Purpose

How racers and cars are entered before racing, and how participants get into the app. This describes what the app does today (baseline, November 2026).

Known gaps, each tracked as an issue: families cannot enter their own details ahead of time and there is no check-in status (#96); the number on a car is the internal record number, so deleting a car leaves a gap (#93); weight is recorded but no limit is checked; organizer and participant access are not separated (#75); there is no pack field for multi-pack events (#103).

## Requirements

### Requirement: Racer details
The system SHALL record for each racer a name and a division (cub, sibling or adult). Cub racers also have a rank (Lion, Tiger, Wolf, Bear, Webelos or Arrow of Light) and may have a den.

#### Scenario: Registering a Cub Scout
- **WHEN** a volunteer registers a scout as a Wolf in den 3
- **THEN** the racer is in the cub division with rank Wolf and den 3

#### Scenario: Registering a sibling or adult
- **WHEN** a volunteer registers a sibling or an adult
- **THEN** no Cub Scout rank or den is required

### Requirement: One car per racer
The system SHALL allow each racer one car. A car has a name and a weight, and may have a photo.

#### Scenario: Racer already has a car
- **WHEN** a volunteer opens registration for a racer who already has a car this year
- **THEN** the existing car is loaded for editing rather than a second car being created

### Requirement: Registration at the check-in table
The system SHALL let a volunteer register a car in one form: find an existing racer by name or add a new one, then enter the car name, weight and photo.

#### Scenario: Scout already on the roster
- **WHEN** a volunteer types part of a scout's name
- **THEN** matching racers are listed with rank and den, and one can be selected

#### Scenario: New racer
- **WHEN** the racer is not on the roster
- **THEN** the volunteer can add them by name and division in the same form

### Requirement: Car photos
The system SHALL accept a photo taken or chosen on the volunteer's device, reduce it to at most 800 by 600 pixels, and show it wherever the car appears. Cars without a photo show a placeholder.

#### Scenario: Photo from a phone
- **WHEN** a volunteer takes a photo of a car during registration
- **THEN** the reduced photo is saved with the car and shown on its card

### Requirement: Car numbers
The system SHALL give each car a number when it is registered and show that number on heat sheets and results. Numbers are assigned in order of registration and are not reused.

#### Scenario: A car is deleted
- **WHEN** car 28 is deleted and its owner is registered again
- **THEN** the new car receives the next unused number and 28 stays unused

### Requirement: Roster import
The system SHALL let an organizer load racers and cars from a spreadsheet file before the event.

#### Scenario: Importing the pack roster
- **WHEN** an organizer imports a file of racers
- **THEN** each valid row becomes a racer and rows with errors are reported

### Requirement: Shared event password
The system SHALL require a shared event password before showing any page. The same password is used by families, volunteers and organizers.

#### Scenario: First visit
- **WHEN** someone opens the app on a new device
- **THEN** they are asked for the event password before anything else is shown

### Requirement: Racers can mark which car is theirs
The system SHALL let a participant select which racer they are, without a password, and then highlight that racer's car on heat lists and leaderboards on their device.

#### Scenario: Following your own car
- **WHEN** a participant selects their racer
- **THEN** the dashboard shows that racer's car and results, and the car's row is highlighted in heat lists
