
export const getMe = (req, res) => {
    res.status(200).json(req.user);
}

