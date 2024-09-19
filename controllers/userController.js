
export const getOne = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    return res.status(200).json({
        message: "Get user successfully",
    });
};

export const getListUser = async (req, res) => {
    console.log("getListUser function called");
    try {
        console.log("Attempting to fetch users from database");
        const users = await User.find({});
        console.log("Users fetched:", users);
        if (users.length === 0) {
            console.log("No users found in database");
        }
        return res.status(200).json({
            message: "Get list user successfully",
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            message: "An error occurred while fetching users",
            error: error.message
        });
    }
};


