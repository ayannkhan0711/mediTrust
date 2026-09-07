import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../../models/userModel.js";


const registerUser = async (req, res) => {
  // check if all feilds are coming

  const { name, email, phone, password, age, gender, address, userType } =
    req.body;

  if (!name || !email || !phone || !password || !age) {
    res.status(409);
    throw new Error("Please fill all details..");
  }

  const emailExist = await User.findOne({ email });
  const phoneExist = await User.findOne({ phone });

  // check if user exist
  if (emailExist || phoneExist) {
    res.status(409);
    throw new Error("User Already Exists");
  }

  // hash pssword

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    age,
    gender,
    address,
    userType,
  });

  if (!user) {
    res.status(409);
    throw new Error("User Not Registered..");
  }

  res.status(201).json(user);
};

const loginUser = async (req, res) => {
  // check if all feilds are coming

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(409);
    throw new Error("Please fill all details..");
  }

  // check if user exist
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials ");
  }
};

const getMyprofile = async (req, res) => {
  res.status(200).json(req.user);
};


const updateProfile = async (req, res) => {


  const {userType} = req.body

  if(userType) {
    res.status(401)
    throw new Error("only admin can change user type");
    
  }



  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(404)
    throw new Error("No User Found");
  }

  const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true })

  if (!updatedUser) {
    res.status(409)
    throw new Error("User Not Updated");
  }

  res.status(200).json(updatedUser)
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10d' })
}

const authService = {
  registerUser,
  loginUser,
  getMyprofile,
  updateProfile
};

export default authService;
