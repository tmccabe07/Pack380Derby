const competition = require('../modules/competition');

exports.getNumLanes = (req, res) => {
    try {
        const numLanes = competition.getNumLanes();
        res.json({ numLanes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setNumLanes = (req, res) => {
    try {
        const { numLanes } = req.body;
        const updatedLanes = competition.setNumLanes(numLanes);
        res.json({ numLanes: updatedLanes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateNumLanes = (req, res) => {
    try {
        const { numLanes } = req.body;
        const updatedLanes = competition.updateNumLanes(numLanes);
        res.json({ numLanes: updatedLanes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
