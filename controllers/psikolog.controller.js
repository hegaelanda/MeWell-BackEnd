const User = require("../models/user");
const Psikolog = require("../models/psikolog");

module.exports = {
  getAllPsikologRegis: async (req, res) => {
    try {
      // const psikologs = await Psikolog.find().populate("user_id");
      const psikologs = await Psikolog.aggregate([
        {
          $lookup: {
            from: "users", // Nama koleksi (plural) dari model User
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user", // Jika setiap Psikolog hanya memiliki satu User, lewati langkah ini
        },
        {
          $project: {
            _id: 0, // Menghilangkan field _id dari hasil
            psikolog_id: "$_id",
            status: 1,
            ijazah: 1,
            ktp: 1,
            univ: 1,
            created_at: 1,
            updated_at: 1,
            user: {
              user_id: "$user._id",
              name: "$user.name",
              role: "$user.role",
              gender: "$user.gender",
              place_birth: "$user.place_birth",
              date_birth: "$user.date_birth",
              email: "$user.email",
              is_verified: "$user.is_verified",
              profile: "$user.profile",
            },
          },
        },
      ]);
      res.json(psikologs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
