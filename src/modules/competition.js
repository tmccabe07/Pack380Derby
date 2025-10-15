class Competition {
    constructor() {
        this.numLanes = 4; // Default number of lanes
    }

    setNumLanes(lanes) {
        if (lanes < 1 || lanes > 10) {
            throw new Error('Number of lanes must be between 1 and 10');
        }
        this.numLanes = lanes;
        return this.numLanes;
    }

    getNumLanes() {
        return this.numLanes;
    }

    updateNumLanes(lanes) {
        return this.setNumLanes(lanes);
    }
}

// Singleton instance
const competition = new Competition();

module.exports = competition;
