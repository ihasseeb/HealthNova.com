import { PrismaClient } from "@prisma/client";

declare const process: {
  exit(code?: number): never;
  env: Record<string, string | undefined>;
};

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Extended Products & Lab Tests...");

  // 1. Seed Products (Medicines, Supplements & Medical Equipment)
  const products = [
    // --- MEDICINES ---
    {
      id: "prod-1",
      name: "Paracetamol 500mg",
      description: "Fast-acting pain reliever and fever reducer.",
      price: 5.99,
      category: "MEDICINE",
      requiresRx: false,
      stock: 500,
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    },
    {
      id: "prod-2",
      name: "Amoxicillin 250mg",
      description:
        "Antibiotic used to treat broad-spectrum bacterial infections.",
      price: 15.5,
      category: "MEDICINE",
      requiresRx: true,
      stock: 150,
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500",
    },
    {
      id: "prod-3",
      name: "Ibuprofen 400mg",
      description:
        "Nonsteroidal anti-inflammatory drug (NSAID) for pain and inflammation.",
      price: 8.99,
      category: "MEDICINE",
      requiresRx: false,
      stock: 300,
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-edf792549202?w=500",
    },
    {
      id: "prod-4",
      name: "Omeprazole 20mg",
      description:
        "Proton pump inhibitor for heartburn and acid reflux relief.",
      price: 14.2,
      category: "MEDICINE",
      requiresRx: false,
      stock: 200,
      imageUrl:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500",
    },
    {
      id: "prod-5",
      name: "Cetirizine 10mg",
      description:
        "24-hour allergy relief for sneezing, runny nose, and itchy eyes.",
      price: 9.99,
      category: "MEDICINE",
      requiresRx: false,
      stock: 400,
      imageUrl:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500",
    },
    {
      id: "prod-6",
      name: "Azithromycin 500mg",
      description: "Effective antibiotic for respiratory and skin infections.",
      price: 22.0,
      category: "MEDICINE",
      requiresRx: true,
      stock: 80,
      imageUrl:
        "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500",
    },

    // --- SUPPLEMENTS ---
    {
      id: "prod-7",
      name: "Optimum Nutrition Whey Protein",
      description:
        "Gold standard 100% whey protein powder for muscle recovery.",
      price: 45.0,
      category: "SUPPLEMENT",
      requiresRx: false,
      stock: 60,
      imageUrl:
        "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
    },
    {
      id: "prod-8",
      name: "Vitamin C 1000mg + Zinc",
      description: "High-potency daily immune system support chewables.",
      price: 12.99,
      category: "SUPPLEMENT",
      requiresRx: false,
      stock: 250,
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    },
    {
      id: "prod-9",
      name: "Omega-3 Fish Oil 1000mg",
      description:
        "Supports heart, brain, joint, and eye health with EPA & DHA.",
      price: 24.5,
      category: "SUPPLEMENT",
      requiresRx: false,
      stock: 180,
      imageUrl:
        "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500",
    },
    {
      id: "prod-10",
      name: "Vitamin D3 5000 IU",
      description: "Essential for bone strength, mood, and immune health.",
      price: 14.99,
      category: "SUPPLEMENT",
      requiresRx: false,
      stock: 350,
      imageUrl:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500",
    },
    {
      id: "prod-11",
      name: "Ashwagandha Root Extract",
      description:
        "Natural herbal supplement for stress relief and energy balance.",
      price: 16.99,
      category: "SUPPLEMENT",
      requiresRx: false,
      stock: 120,
      imageUrl:
        "https://images.unsplash.com/photo-1616671285428-98448375e2f7?w=500",
    },

    // --- EQUIPMENT ---
    {
      id: "prod-12",
      name: "Digital Blood Pressure Monitor",
      description: "Automatic upper arm BP monitor with memory storage.",
      price: 39.99,
      category: "EQUIPMENT",
      requiresRx: false,
      stock: 45,
      imageUrl:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500",
    },
    {
      id: "prod-13",
      name: "Fingertip Pulse Oximeter",
      description:
        "Measures blood oxygen saturation (SpO2) and pulse rate instantly.",
      price: 21.99,
      category: "EQUIPMENT",
      requiresRx: false,
      stock: 90,
      imageUrl:
        "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=500",
    },
    {
      id: "prod-14",
      name: "Infrared Forehead Thermometer",
      description: "Non-contact instant digital fever reading device.",
      price: 28.5,
      category: "EQUIPMENT",
      requiresRx: false,
      stock: 75,
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    },
    {
      id: "prod-15",
      name: "Blood Glucose Meter Kit",
      description:
        "Includes glucose monitor, 50 test strips, and lancing device.",
      price: 32.0,
      category: "EQUIPMENT",
      requiresRx: false,
      stock: 65,
      imageUrl:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500",
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: prod,
      create: prod,
    });
  }

  // 2. Seed Lab Tests
  const labTests = [
    {
      id: "test-1",
      name: "Complete Blood Count (CBC)",
      description:
        "A comprehensive blood test to evaluate overall health and detect disorders.",
      price: 25.0,
      category: "BLOOD_TEST",
      homeSample: true,
    },
    {
      id: "test-2",
      name: "Full Body Health Checkup",
      description:
        "Includes CBC, Lipid Profile, Thyroid, Kidney, and Liver Function tests.",
      price: 150.0,
      category: "FULL_BODY",
      homeSample: true,
    },
    {
      id: "test-3",
      name: "Diabetes Screening (HbA1c & Fasting)",
      description:
        "Measures average blood sugar levels over the past 3 months.",
      price: 30.0,
      category: "BLOOD_TEST",
      homeSample: true,
    },
    {
      id: "test-4",
      name: "Lipid Profile (Cholesterol Panel)",
      description: "Measures Total Cholesterol, HDL, LDL, and Triglycerides.",
      price: 35.0,
      category: "BLOOD_TEST",
      homeSample: true,
    },
    {
      id: "test-5",
      name: "Thyroid Function Test (TSH, T3, T4)",
      description: "Evaluates how well your thyroid gland is working.",
      price: 45.0,
      category: "BLOOD_TEST",
      homeSample: true,
    },
    {
      id: "test-6",
      name: "Vitamin D3 & B12 Panel",
      description:
        "Detects essential vitamin deficiencies affecting energy and bones.",
      price: 55.0,
      category: "BLOOD_TEST",
      homeSample: true,
    },
    {
      id: "test-7",
      name: "Chest X-Ray",
      description:
        "Radiology imaging to examine heart, lungs, and chest bones.",
      price: 80.0,
      category: "XRAY",
      homeSample: false,
    },
  ];

  for (const test of labTests) {
    await prisma.labTest.upsert({
      where: { id: test.id },
      update: test,
      create: test,
    });
  }

  console.log("Seeding complete! 15 Products & 7 Lab Tests inserted. 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
