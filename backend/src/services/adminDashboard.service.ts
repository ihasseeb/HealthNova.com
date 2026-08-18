import prisma from "../lib/prisma";

const prismaAny = prisma as any;

// Get Dashboard Stats
export const getDashboardStatsService = async () => {
  // Run all queries in parallel
  const [
    totalUsers,
    totalDoctors,
    totalPatients,
    totalAppointments,
    pendingAppointments,
    completedAppointments,
    totalRevenue,
    pendingDoctorVerifications,
    recentUsers,
    recentAppointments,
  ] = await Promise.all([
    // Total counts
    prisma.user.count(),
    prisma.user.count({ where: { role: "DOCTOR" } }),
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),

    // Revenue
    prismaAny.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    }),

    // Pending verifications
    prisma.doctorProfile.count({ where: { isVerified: false } }),

    // Recent users (last 10)
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    // Recent appointments (last 10)
    prisma.appointment.findMany({
      include: {
        patient: { select: { name: true, email: true } },
        doctor: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return {
    stats: {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingDoctorVerifications,
    },
    recentUsers,
    recentAppointments,
  };
};

// Get All Users (with filters)
export const getAllUsersService = async (
  role?: string,
  page: number = 1,
  limit: number = 20,
) => {
  const skip = (page - 1) * limit;
  const where = role ? { role: role as any } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Revenue Analytics
export const getRevenueAnalyticsService = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalRevenue, monthlyRevenue, weeklyRevenue, recentPayments] =
    await Promise.all([
      // All time
      prismaAny.payment.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }),

      // Last 30 days
      prismaAny.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: "COMPLETED",
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      // Last 7 days
      prismaAny.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: "COMPLETED",
          createdAt: { gte: sevenDaysAgo },
        },
      }),

      // Recent payments
      prismaAny.payment.findMany({
        where: { status: "COMPLETED" },
        include: {
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    weeklyRevenue: weeklyRevenue._sum.amount || 0,
    recentPayments,
  };
};

// Get Appointment Analytics
export const getAppointmentAnalyticsService = async () => {
  const [byStatus, byType, todayCount] = await Promise.all([
    // Group by status
    prisma.appointment.groupBy({
      by: ["status"],
      _count: true,
    }),

    // Group by type
    prisma.appointment.groupBy({
      by: ["type"],
      _count: true,
    }),

    // Today's appointments
    prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);

  return {
    byStatus,
    byType,
    todayCount,
  };
};
