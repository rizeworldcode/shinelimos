const Booking = require("../models/bookingModel");
const moment = require("moment");

exports.getDashboardStats = async () => {
    try {
        const now = moment();
        const startOfMonth = now.clone().startOf('month').toDate();
        const startOfLastMonth = now.clone().subtract(1, 'month').startOf('month').toDate();
        const endOfLastMonth = now.clone().subtract(1, 'month').endOf('month').toDate();

        // 1. Overview Stats
        const totalBookings = await Booking.countDocuments();
        const lastMonthBookings = await Booking.countDocuments({ created_at: { $gte: startOfLastMonth, $lte: endOfLastMonth } });
        
        const uniqueCustomers = await Booking.distinct("contact_details.booker.email");
        const totalNewCustomers = uniqueCustomers.length;

        const totalEarningResult = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$vehicle_details.estimated_price" } } }
        ]);
        const totalEarning = totalEarningResult.length > 0 ? totalEarningResult[0].total : 0;

        // Trends (Simple calculation vs last month)
        const bookingTrend = lastMonthBookings === 0 ? 100 : ((totalBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(2);

        // 2. Revenue Overview (Monthly)
        const revenueOverview = await Booking.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$created_at" }, year: { $year: "$created_at" } },
                    revenue: { $sum: "$vehicle_details.estimated_price" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 3. Total Trips Status
        const doneTrips = await Booking.countDocuments({ booking_status: "completed" });
        const bookedTrips = await Booking.countDocuments({ booking_status: "confirmed" });
        const cancelledTrips = await Booking.countDocuments({ booking_status: "cancelled" });
        
        const totalStatus = doneTrips + bookedTrips + cancelledTrips || 1; // avoid div by zero

        // 4. Top Destinations
        const topDestinations = await Booking.aggregate([
            { $unwind: "$trip_details" },
            {
                $group: {
                    _id: "$trip_details.dropoff_location",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        return {
            success: true,
            overview: {
                total_booking: { value: totalBookings, trend: `+${bookingTrend}%` },
                total_new_customers: { value: totalNewCustomers, trend: "-0.03%" }, // Placeholder trend
                total_earning: { value: totalEarning, trend: "+6.08%" } // Placeholder trend
            },
            revenue_overview: {
                this_year: revenueOverview.filter(r => r._id.year === now.year()).map(r => ({ month: moment().month(r._id.month - 1).format("MMM"), revenue: r.revenue })),
                last_year: revenueOverview.filter(r => r._id.year === now.year() - 1).map(r => ({ month: moment().month(r._id.month - 1).format("MMM"), revenue: r.revenue }))
            },
            trip_summary: [
                { name: "Done Trips", sales: ((doneTrips / totalStatus) * 100).toFixed(0) + "%", count: doneTrips },
                { name: "Booked", sales: ((bookedTrips / totalStatus) * 100).toFixed(0) + "%", count: bookedTrips },
                { name: "Cancelled", sales: ((cancelledTrips / totalStatus) * 100).toFixed(0) + "%", count: cancelledTrips }
            ],
            top_destinations: topDestinations.map(d => ({
                name: d._id,
                percentage: ((d.count / totalBookings) * 100).toFixed(1) + "%"
            }))
        };
    } catch (error) {
        console.log("getDashboardStats error:", error);
        return { success: false, message: error.message || error };
    }
};
