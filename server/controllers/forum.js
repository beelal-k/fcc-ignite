import Forum from "../models/forum.js";

export const createForum = async (req, res) => {
    const { title, content, userId } = req.body;
    try {
        const forum = await Forum.create({
            title,
            content,
            userId,
        });
        res.status(200).send(forum);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getForums = async (req, res) => {
    try {
        const forums = await Forum.find();
        res.status(200).send(forums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getForum = async (req, res) => {
    try {
        const { id } = req.params;
        const forum = await Forum.findById(id).populate({
            path: "replies",
            populate: {
                path: "userId",
            },
        }).populate('userId');
        if (!forum) {
            return res.status(500).json({ error: "Forum not found!" });
        }
        res.status(200).send(forum);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const updateForum = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No forum with id: ${id}`);
        }
        const forum = Forum.findById(id);
        if (!forum) {
            return res.status(404).send("Forum not found");
        }
        forum.title = title;
        forum.content = content;
        await forum.save();
        res.json(forum);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteForum = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No forum with id: ${id}`);
        }
        await Forum.findByIdAndRemove(id);
        res.json({ message: "Forum deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const likeForum = async (req, res) => {
    try {
        const forum = await Forum.findByIdAndUpdate(req.params.id, {
            $push: { likes: req.userId },
        },
            { new: true }
        );
        res.status(200).json(forum);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const dislikeForum = async (req, res) => {
    try {
        const forum = await Forum.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.userId },
        },
            { new: true }
        );
        res.status(200).json(forum);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
