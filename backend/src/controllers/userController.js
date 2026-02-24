// Returns currently authenticated user profile.
export const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: {
        _id: req.user._id,
        user_type: req.user.user_type,
        full_name: req.user.full_name,
        email: req.user.email,
        nic: req.user.nic,
        phone: req.user.phone,
        date_of_birth: req.user.date_of_birth,
        gender: req.user.gender,
        blood_type: req.user.blood_type,
        location: req.user.location
      }
    }
  });
};
