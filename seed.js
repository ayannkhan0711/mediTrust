import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./server/models/userModel.js";
import bcrypt from "bcrypt";
import Product from "./server/models/productModel.js";
import Pathologist from "./server/models/pathologistModel.js";

dotenv.config();

const users = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "9876543210",
    password: "Password@123",
    age: "24",
    gender: "MALE",
    address: "Vijay Nagar, Indore",
    userType: "USER",
    isActive: true,
  },
  {
    name: "Priya Patel",
    email: "priya.patel@gmail.com",
    phone: "9876543211",
    password: "Password@123",
    age: "27",
    gender: "FEMALE",
    address: "Palasia, Indore",
    userType: "USER",
    isActive: true,
  },
  {
    name: "Rahul Verma",
    email: "rahul.verma@gmail.com",
    phone: "9876543212",
    password: "Password@123",
    age: "31",
    gender: "MALE",
    address: "Bhawarkua, Indore",
    userType: "USER",
    isActive: true,
  },
  {
    name: "Dr. Ankit Mehta",
    email: "ankit.mehta@hospital.com",
    phone: "9876543213",
    password: "Doctor@123",
    age: "42",
    gender: "MALE",
    address: "Rau, Indore",
    userType: "DOCTOR",
    isActive: true,
  },
  {
    name: "Dr. Sneha Kapoor",
    email: "sneha.kapoor@hospital.com",
    phone: "9876543214",
    password: "Doctor@123",
    age: "38",
    gender: "FEMALE",
    address: "Scheme No. 54, Indore",
    userType: "DOCTOR",
    isActive: true,
  },
  {
    name: "Dr. Rohan Joshi",
    email: "rohan.joshi@hospital.com",
    phone: "9876543215",
    password: "Doctor@123",
    age: "45",
    gender: "MALE",
    address: "MG Road, Indore",
    userType: "DOCTOR",
    isActive: true,
  },
  {
    name: "Admin User",
    email: "admin@medai.com",
    phone: "9876543218",
    password: "Admin@123",
    age: "30",
    gender: "MALE",
    address: "Indore, Madhya Pradesh",
    userType: "ADMIN",
    isActive: true,
  },
  {
    name: "Kavya Singh",
    email: "kavya.singh@gmail.com",
    phone: "9876543219",
    password: "Password@123",
    age: "22",
    gender: "FEMALE",
    address: "Geeta Bhawan, Indore",
    userType: "USER",
    isActive: false,
  },
];

const products = [
  {
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer, strip of 10 tablets.",
    price: 25,
    stock: 200,
    expiresOn: new Date("2027-06-30"),
  },
  {
    name: "Vitamin C Effervescent",
    description: "Immunity booster, 20 tablets per tube.",
    price: 150,
    stock: 100,
    expiresOn: new Date("2027-12-31"),
  },
  {
    name: "Digital Thermometer",
    description: "Fast and accurate digital thermometer.",
    price: 199,
    stock: 50,
    expiresOn: new Date("2030-01-01"),
  },
  {
    name: "N95 Face Mask (Pack of 5)",
    description: "5-layer protection, comfortable fit.",
    price: 249,
    stock: 300,
    expiresOn: new Date("2028-03-15"),
  },
  {
    name: "ORS Powder Sachets",
    description: "Rehydration salts, pack of 10 sachets.",
    price: 60,
    stock: 150,
    expiresOn: new Date("2027-09-20"),
  },
];

// ---- PATHOLOGISTS (User + Profile data combined) ----
const pathologistsData = [
  {
    name: "Dr. Ayaan Khan",
    email: "ayaan.khan@meditrust.com",
    phone: "9876543220",
    laboratoryName: "MediTrust Diagnostics Lab",
    laboratoryAddress: "MP Nagar, Bhopal, MP",
    qualification: "MD Pathology",
    registrationNumber: "MP-PATH-2024-001",
    experience: 8,
    specialization: ["Hematology", "Microbiology"],
    consultationFee: 500,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@meditrust.com",
    phone: "9876543221",
    laboratoryName: "City Path Labs",
    laboratoryAddress: "Arera Colony, Bhopal, MP",
    qualification: "MD Pathology, DNB",
    registrationNumber: "MP-PATH-2024-002",
    experience: 12,
    specialization: ["Histopathology", "Cytology"],
    consultationFee: 600,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Rahul Verma",
    email: "rahul.verma.path@meditrust.com",
    phone: "9876543222",
    laboratoryName: "LifeCare Diagnostics",
    laboratoryAddress: "Kolar Road, Bhopal, MP",
    qualification: "MBBS, MD Pathology",
    registrationNumber: "MP-PATH-2024-003",
    experience: 5,
    specialization: ["Clinical Pathology"],
    consultationFee: 400,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Sneha Patel",
    email: "sneha.patel@meditrust.com",
    phone: "9876543223",
    laboratoryName: "Sunshine Labs",
    laboratoryAddress: "New Market, Bhopal, MP",
    qualification: "MD Pathology",
    registrationNumber: "MP-PATH-2024-004",
    experience: 10,
    specialization: ["Hematology", "Biochemistry"],
    consultationFee: 550,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Vikram Singh",
    email: "vikram.singh@meditrust.com",
    phone: "9876543224",
    laboratoryName: "Apex Diagnostics",
    laboratoryAddress: "Hoshangabad Road, Bhopal, MP",
    qualification: "MD Pathology, PhD",
    registrationNumber: "MP-PATH-2024-005",
    experience: 15,
    specialization: ["Microbiology", "Immunology"],
    consultationFee: 700,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Anjali Mehta",
    email: "anjali.mehta@meditrust.com",
    phone: "9876543225",
    laboratoryName: "Trust Path Labs",
    laboratoryAddress: "Shahpura, Bhopal, MP",
    qualification: "MD Pathology",
    registrationNumber: "MP-PATH-2024-006",
    experience: 7,
    specialization: ["Cytology", "Histopathology"],
    consultationFee: 500,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Karan Malhotra",
    email: "karan.malhotra@meditrust.com",
    phone: "9876543226",
    laboratoryName: "Wellness Diagnostics",
    laboratoryAddress: "Bittan Market, Bhopal, MP",
    qualification: "MBBS, MD Pathology",
    registrationNumber: "MP-PATH-2024-007",
    experience: 6,
    specialization: ["Clinical Pathology", "Hematology"],
    consultationFee: 450,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Neha Gupta",
    email: "neha.gupta@meditrust.com",
    phone: "9876543227",
    laboratoryName: "Precision Path Lab",
    laboratoryAddress: "Kohefiza, Bhopal, MP",
    qualification: "MD Pathology, DNB",
    registrationNumber: "MP-PATH-2024-008",
    experience: 9,
    specialization: ["Microbiology"],
    consultationFee: 500,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Rohan Kapoor",
    email: "rohan.kapoor@meditrust.com",
    phone: "9876543228",
    laboratoryName: "Metro Diagnostics",
    laboratoryAddress: "TT Nagar, Bhopal, MP",
    qualification: "MD Pathology",
    registrationNumber: "MP-PATH-2024-009",
    experience: 11,
    specialization: ["Biochemistry", "Hematology"],
    consultationFee: 600,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Kavita Joshi",
    email: "kavita.joshi@meditrust.com",
    phone: "9876543229",
    laboratoryName: "HealthFirst Labs",
    laboratoryAddress: "Bagh Sewaniya, Bhopal, MP",
    qualification: "MD Pathology",
    registrationNumber: "MP-PATH-2024-010",
    experience: 4,
    specialization: ["Cytology"],
    consultationFee: 400,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Aditya Rao",
    email: "aditya.rao@meditrust.com",
    phone: "9876543230",
    laboratoryName: "Elite Diagnostics",
    laboratoryAddress: "Ayodhya Nagar, Bhopal, MP",
    qualification: "MD Pathology, PhD",
    registrationNumber: "MP-PATH-2024-011",
    experience: 14,
    specialization: ["Histopathology", "Microbiology"],
    consultationFee: 650,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Pooja Nair",
    email: "pooja.nair@meditrust.com",
    phone: "9876543231",
    laboratoryName: "CarePlus Labs",
    laboratoryAddress: "Piplani, Bhopal, MP",
    qualification: "MBBS, MD Pathology",
    registrationNumber: "MP-PATH-2024-012",
    experience: 8,
    specialization: ["Clinical Pathology"],
    consultationFee: 500,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Manish Tiwari",
    email: "manish.tiwari@meditrust.com",
    phone: "9876543232",
    laboratoryName: "Prime Diagnostics",
    laboratoryAddress: "Habibganj, Bhopal, MP",
    qualification: "MD Pathology",
    registrationNumber: "MP-PATH-2024-013",
    experience: 13,
    specialization: ["Hematology", "Immunology"],
    consultationFee: 600,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Shruti Agarwal",
    email: "shruti.agarwal@meditrust.com",
    phone: "9876543233",
    laboratoryName: "Advanced Path Labs",
    laboratoryAddress: "Gulmohar Colony, Bhopal, MP",
    qualification: "MD Pathology, DNB",
    registrationNumber: "MP-PATH-2024-014",
    experience: 6,
    specialization: ["Biochemistry"],
    consultationFee: 450,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Deepak Chauhan",
    email: "deepak.chauhan@meditrust.com",
    phone: "9876543234",
    laboratoryName: "Reliable Diagnostics",
    laboratoryAddress: "Chuna Bhatti, Bhopal, MP",
    qualification: "MD Pathology",
    registrationNumber: "MP-PATH-2024-015",
    experience: 10,
    specialization: ["Microbiology", "Clinical Pathology"],
    consultationFee: 550,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Ritu Bansal",
    email: "ritu.bansal@meditrust.com",
    phone: "9876543235",
    laboratoryName: "Golden Path Labs",
    laboratoryAddress: "Lalghati, Bhopal, MP",
    qualification: "MBBS, MD Pathology",
    registrationNumber: "MP-PATH-2024-016",
    experience: 5,
    specialization: ["Cytology", "Hematology"],
    consultationFee: 400,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Suresh Iyer",
    email: "suresh.iyer@meditrust.com",
    phone: "9876543236",
    laboratoryName: "National Diagnostics",
    laboratoryAddress: "Bawadiya Kalan, Bhopal, MP",
    qualification: "MD Pathology, PhD",
    registrationNumber: "MP-PATH-2024-017",
    experience: 16,
    specialization: ["Histopathology", "Biochemistry"],
    consultationFee: 700,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Meera Desai",
    email: "meera.desai@meditrust.com",
    phone: "9876543237",
    laboratoryName: "Sunrise Path Labs",
    laboratoryAddress: "Ashoka Garden, Bhopal, MP",
    qualification: "MD Pathology",
    registrationNumber: "MP-PATH-2024-018",
    experience: 7,
    specialization: ["Immunology"],
    consultationFee: 500,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Arjun Reddy",
    email: "arjun.reddy@meditrust.com",
    phone: "9876543238",
    laboratoryName: "Diamond Diagnostics",
    laboratoryAddress: "Indrapuri, Bhopal, MP",
    qualification: "MBBS, MD Pathology",
    registrationNumber: "MP-PATH-2024-019",
    experience: 9,
    specialization: ["Clinical Pathology", "Microbiology"],
    consultationFee: 550,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
  {
    name: "Dr. Isha Kulkarni",
    email: "isha.kulkarni@meditrust.com",
    phone: "9876543239",
    laboratoryName: "Fortune Path Labs",
    laboratoryAddress: "Karond, Bhopal, MP",
    qualification: "MD Pathology, DNB",
    registrationNumber: "MP-PATH-2024-020",
    experience: 8,
    specialization: ["Hematology", "Cytology"],
    consultationFee: 500,
    workingHours : {
      start : "09:00",
      end: "10:00"
    }, 
    availableDays: [
      "Monday",
      "tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",

    ],

  isVerified: true,
  isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // ---- USERS ----
    await User.deleteMany();

    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          password: await bcrypt.hash(user.password, 10),
        };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`${createdUsers.length} users seeded successfully`);

    // ---- PRODUCTS ----
    await Product.deleteMany();

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products seeded successfully`);

    // ---- PATHOLOGISTS (User + linked Pathologist profile) ----
    await Pathologist.deleteMany();

    const pathologistUserDocs = await Promise.all(
      pathologistsData.map(async (path) => {
        const hashedPassword = await bcrypt.hash("Pathology@123", 10);
        return {
          name: path.name,
          email: path.email,
          phone: path.phone,
          password: hashedPassword,
          age: String(30 + Math.floor(Math.random() * 20)),
          gender: Math.random() > 0.5 ? "MALE" : "FEMALE",
          address: path.laboratoryAddress,
          userType: "PATHOLOGIST",
          isActive: true,
        };
      })
    );

    // Remove old pathologist users too, then insert fresh
    await User.deleteMany({ userType: "PATHOLOGIST" });
    const createdPathologistUsers = await User.insertMany(pathologistUserDocs);
    console.log(`${createdPathologistUsers.length} pathologist users seeded successfully`);

    // Build Pathologist profiles linked to their User._id via email match
    const pathologistProfiles = createdPathologistUsers.map((userDoc) => {
      const data = pathologistsData.find((p) => p.email === userDoc.email);
      return {
        user: userDoc._id,
        laboratoryName: data.laboratoryName,
        laboratoryAddress: data.laboratoryAddress,
        qualification: data.qualification,
        registrationNumber: data.registrationNumber,
        experience: data.experience,
        specialization: data.specialization,
        phone: data.phone,
        email: data.email,
        consultationFee: data.consultationFee,
        workingHours: {
          startTime: "09:00 AM",
          endTime: "06:00 PM",
        },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        isVerified: true,
        isActive: true,
      };
    });

    const createdPathologistProfiles = await Pathologist.insertMany(pathologistProfiles);
    console.log(`${createdPathologistProfiles.length} pathologist profiles seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();