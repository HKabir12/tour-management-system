import dbConnect from "@/lib/dbConnect";

export async function GET() {
  // const client = await clientPromise;
  // const db = client.db("tour_management"); // replace with your actual DB name

  const bookings = await dbConnect("bookings").find().toArray();
  const tours = await dbConnect("tours").find().toArray();
  const users = await dbConnect("user").find().toArray();
  const discounts = await dbConnect("discounts").find().toArray();

  // 🧮 Totals
  const totalTours = tours.length;
  const totalBookings = bookings.length;
  const totalUsers = users.length;
  const activeDiscounts = discounts.filter(d => d.status === "active").length;

  // 💰 Total Revenue (only approved bookings)
  const totalRevenue = bookings
    .filter(b => b.status === "approved")
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  // 📅 Bookings by Month
  const bookingsByMonth = [];
  bookings.forEach(b => {
    const date = new Date(b.bookingDate);
    const month = date.toLocaleString("default", { month: "short" });
    const found = bookingsByMonth.find(item => item.month === month);
    if (found) found.count += 1;
    else bookingsByMonth.push({ month, count: 1 });
  });

  // 🏆 Top Tours by Revenue
  const revenueByTour = {};
  bookings.forEach(b => {
    if (b.status === "approved") {
      revenueByTour[b.tourId] = (revenueByTour[b.tourId] || 0) + (Number(b.amount) || 0);
    }
  });
  const topTours = tours
    .map(t => ({ title: t.title, revenue: revenueByTour[t.id] || 0 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return Response.json({
    totalTours,
    totalBookings,
    totalUsers,
    activeDiscounts,
    totalRevenue,
    bookingsByMonth,
    topTours,
  });
}

