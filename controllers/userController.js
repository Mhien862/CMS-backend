
export const getOne = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    return res.status(200).json({
        message: "Get user successfully",
    });
};
