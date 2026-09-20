import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Products & Lab Tests...");

  // 1. Seed Products (Medicines & Supplements)
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "prod-1",
        name: "Paracetamol 500mg",
        description: "Pain reliever and fever reducer.",
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
        description: "Antibiotic used to treat bacterial infections.",
        price: 15.5,
        category: "MEDICINE",
        requiresRx: true,
        stock: 100,
        imageUrl:
          "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500",
      },
      {
        id: "prod-3",
        name: "Optimum Nutrition Whey Protein",
        description: "Gold standard 100% whey protein powder.",
        price: 45.0,
        category: "SUPPLEMENT",
        requiresRx: false,
        stock: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
      },
      {
        id: "prod-4",
        name: "Vitamin C 1000mg",
        description: "Immunity booster tablets.",
        price: 12.99,
        category: "SUPPLEMENT",
        requiresRx: false,
        stock: 200,
        imageUrl:
          "https://images.unsplash.com/photo-1550572017-edb7fd507202?w=500",
      },
    ],
  });

  // 2. Seed Lab Tests
  await prisma.labTest.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "test-1",
        name: "Complete Blood Count (CBC)",
        description: "A comprehensive blood test to evaluate overall health.",
        price: 25.0,
        category: "BLOOD_TEST",
        homeSample: true,
      },
      {
        id: "test-2",
        name: "Full Body Health Checkup",
        description:
          "Includes CBC, Lipid Profile, Thyroid, and Liver Function tests.",
        price: 150.0,
        category: "FULL_BODY",
        homeSample: true,
      },
      {
        id: "test-3",
        name: "Chest X-Ray",
        description: "Radiology imaging of the chest area.",
        price: 80.0,
        category: "XRAY",
        homeSample: false,
      },
    ],
  });

  console.log("Seeding complete! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
