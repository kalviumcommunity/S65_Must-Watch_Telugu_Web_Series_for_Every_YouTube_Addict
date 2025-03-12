import { WebSeries } from "../models/webSeries.model.js";

const addWebSeries = async (req, res) => {
    const { name, channel, episodes, genre, rating, link, description, cast } = req.body;

    if (!(name && channel && episodes && rating && link && description && cast)) {
        return res.status(400).send({ "message": "ALL FIELDS ARE REQUIRED" });
    }

    if (episodes < 1) {
        return res.status(409).send({ "message": "Episodes cannot be less than 1" });
    }

    if (genre.length < 1) {
        return res.status(409).send({ "message": "Genre is required" });
    }

    const formattedCast = Array.isArray(cast)
        ? cast.map(actor => (typeof actor === "string" ? { actor } : actor))
        : [];

    if (formattedCast.length === 0) {
        return res.status(400).send({ "message": "Cast should be an array of actor names" });
    }

    if (!req.user || !req.user.id) {
        return res.status(401).send({ "message": "Unauthorized: User ID required" });
    }


    const newWebSeries = new WebSeries({ name, channel, episodes, genre, rating, link, description, cast: formattedCast, created_by: req.user.id  });
    try {
        await newWebSeries.save();
        return res.status(201).send({ "message": "Web series added successfully" });
    } catch (error) {
        console.error("Error in adding web series", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};


const getAllWebSeries = async (req, res) => {
    try {
        const webSeriesList = await WebSeries.find();
        return res.status(200).json(webSeriesList);
    } catch (error) {
        console.error("Error in fetching web series", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};


const updateWebSeries = async (req, res) => {
    try {
        const updatedWebSeries = await WebSeries.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedWebSeries) {
            return res.status(404).send({ "message": "Web series not found" });
        }
        // console.log(updatedWebSeries)
        return res.status(200).json({ "message": "Web series updated successfully", updatedWebSeries });
    } catch (error) {
        console.error("Error in updating web series", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const deleteWebSeries = async (req, res) => {
    try {
        const deletedWebSeries = await WebSeries.findByIdAndDelete(req.params.id);

        if (!deletedWebSeries) {
            return res.status(404).send({ "message": "Web series not found" });
        }
        return res.status(200).json({ "message": "Web series deleted successfully" });
    } catch (error) {
        console.error("Error in deleting web series", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

export { addWebSeries, getAllWebSeries, updateWebSeries, deleteWebSeries };
