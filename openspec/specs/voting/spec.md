# Voting Specification

## Purpose

How scouts vote for car design awards. This describes what the app does today (baseline, November 2026).

Known gaps, tracked in #91 and #75: a voter's identity is chosen from a list and not verified; a scout can vote for their own car; the flow on a phone and on a shared tablet confused most voters; votes spread thinly across categories.

## Requirements

### Requirement: Organizers define the voting categories
The system SHALL let organizers create, rename and remove voting categories, each with a name and an optional description.

#### Scenario: Adding a category
- **WHEN** an organizer adds a category called "Most Creative"
- **THEN** it appears as a tab on the voting page

### Requirement: Only Cub Scout racers vote
The system SHALL allow voting only after the voter has selected which registered racer they are, and only if that racer is in the cub division.

#### Scenario: No racer selected
- **WHEN** someone opens the voting page without selecting a racer
- **THEN** they are asked to select one and told that voting is open to Cub Scout racers only

#### Scenario: Sibling or adult
- **WHEN** the selected racer is a sibling or an adult
- **THEN** voting is not offered

### Requirement: Only Cub Scout cars are candidates
The system SHALL offer only cars from the cub division as choices in every category.

#### Scenario: Choosing a car
- **WHEN** a voter opens a category
- **THEN** sibling and adult cars are not shown

### Requirement: One vote per voter per category
The system SHALL keep at most one vote from each voter in each category. Voting again in a category replaces the earlier choice.

#### Scenario: Changing a vote
- **WHEN** a voter who chose car 12 for "Most Creative" submits again with car 30
- **THEN** their vote for that category is car 30 and car 12 loses that vote

#### Scenario: Returning voter
- **WHEN** a voter who has already voted opens the voting page
- **THEN** their earlier choices are shown as selected

### Requirement: Votes are submitted together
The system SHALL submit a voter's choices for all categories when they press Submit, and then show a thank-you message.

#### Scenario: Submitting
- **WHEN** a voter has chosen a car in each category and presses Submit
- **THEN** one vote per category is recorded and a confirmation is shown

### Requirement: Each vote counts once
The system SHALL count every vote as one point and total the points per car in each category.

#### Scenario: Tally
- **WHEN** nine voters choose car 12 in a category
- **THEN** car 12 has a total of 9 in that category

### Requirement: Tallies are for organizers
The system SHALL show vote tallies on a separate results page intended for organizers, not on the public leaderboards.

#### Scenario: Participant view
- **WHEN** a participant views the dashboard or results page
- **THEN** no vote counts are shown there
