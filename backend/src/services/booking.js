const Booking = require("../models/bookingModel");
const Vehicle = require("../models/vehiclesModels");
const Admin = require("../models/adminModel");
const moment = require("moment");
const socketUtil = require("../../socket");

// Helper to notify admin via socket and save to DB
const notifyAdmin = async (booking) => {
	try {
		const notificationData = {
			booking_id: booking._id,
			booker_name: `${booking.contact_details.booker.first_name} ${booking.contact_details.booker.last_name}`,
			email: booking.contact_details.booker.email,
			phone: booking.contact_details.booker.primary_phone.number,
			pickup: booking.trip_details[0].pickup_location,
			dropoff: booking.trip_details[0].dropoff_location,
			estimated_price: booking.vehicle_details.estimated_price,
			date: moment(booking.trip_details[0].date).format("MMM DD, YYYY"),
			time: booking.trip_details[0].start_time,
			message: "New booking received!"
		};

		// 1. Emit real-time notification
		const io = socketUtil.getIO();
		io.emit("new_booking", notificationData);

		// 2. Save notification to all admins in the database
		await Admin.updateMany(
			{}, 
			{ $push: { notifications: { $each: [notificationData], $position: 0 } } }
		);

	} catch (err) {
		console.log("Admin notification error:", err.message);
	}
};

// Helper to extract numeric hours from duration string (e.g., "2 hours" -> 2)
const parseDurationToHours = (durationStr) => {
	if (!durationStr) return 0;
	const match = durationStr.match(/(\d+)/);
	return match ? parseInt(match[1]) : 0;
};

// Helper to extract numeric minutes from duration (e.g., "2 hours" -> 120)
const parseDurationToMinutes = (durationStr) => {
	if (!durationStr) return 0;
	const hours = parseDurationToHours(durationStr);
	return hours * 60;
};

// Mock function for distance (In a real app, use Google Maps API)
const getDistance = async (pickup, dropoff) => {
	// Returning a mock distance of 10 miles for demonstration
	return 10; 
};

exports.initiateBooking = async (tripData) => {
	try {
		// 1. Save initial trip details
		const booking = new Booking({ trip_details: tripData });
		const savedBooking = await booking.save();

		// 2. Get total passengers and luggage from all segments
		let totalPass = 0;
		let totalLuggage = 0;
		tripData.forEach(segment => {
			totalPass = Math.max(totalPass, parseInt(segment.total_passengers || 0));
			totalLuggage = Math.max(totalLuggage, parseInt(segment.total_luggage || 0));
		});

		// 3. Find suitable vehicles
		const vehicles = await Vehicle.find({});
		const suitableVehicles = vehicles.filter(v => 
			parseInt(v.passenger_capacity) >= totalPass &&
			parseInt(v.luggage_capacity) >= totalLuggage
		);

		// 4. Calculate pricing for each vehicle
		const vehiclesWithPrice = await Promise.all(suitableVehicles.map(async (vehicle) => {
			let totalPrice = 0;

			// Support for old string-based pricing (fallback)
			let pricing = {
				base_price: 0,
				price_per_minute: 0,
				price_per_mile: 0,
				price_per_hour: 0
			};

			if (vehicle.price && typeof vehicle.price === 'object' && vehicle.price.price_per_hour !== undefined) {
				pricing = vehicle.price;
			} else if (vehicle.price) {
				const priceNum = parseFloat(vehicle.price) || 0;
				pricing.base_price = priceNum;
				pricing.price_per_hour = priceNum;
			}

			for (const segment of tripData) {
				const durationHours = parseDurationToHours(segment.duration);
				const durationMinutes = parseDurationToMinutes(segment.duration);
				const distanceMiles = await getDistance(segment.pickup_location, segment.dropoff_location);

				if (segment.trip_type === "Hourly") {
					totalPrice += durationHours * (pricing.price_per_hour || 0);
				} else {
					// One Way or Round Trip
					totalPrice += (pricing.base_price || 0) + 
								 (durationMinutes * (pricing.price_per_minute || 0)) + 
								 (distanceMiles * (pricing.price_per_mile || 0));
				}
			}

			return {
				_id: vehicle._id,
				vehicle_name: vehicle.vehicle_name,
				image: vehicle.image,
				passenger_capacity: vehicle.passenger_capacity,
				luggage_capacity: vehicle.luggage_capacity,
				estimated_price: totalPrice.toFixed(2)
			};
		}));

		return { 
			success: true, 
			booking_id: savedBooking._id, 
			available_vehicles: vehiclesWithPrice 
		};
	} catch (error) {
		console.log("initiateBooking error:", error);
		return { success: false, message: error.message || error };
	}
};

exports.finalizeBooking = async (bookingId, vehicleDetails, contactDetails, specialRequests) => {
	try {
		const updateData = {
			vehicle_details: vehicleDetails,
			contact_details: contactDetails,
			special_requests: specialRequests,
			booking_status: "confirmed",
			updated_at: Date.now()
		};

		// If booker is also the passenger, sync booker info to passenger info if not provided
		if (contactDetails.booker && contactDetails.booker.is_passenger) {
			if (!contactDetails.passenger || !contactDetails.passenger.first_name) {
				updateData.contact_details.passenger = {
					first_name: contactDetails.booker.first_name,
					last_name: contactDetails.booker.last_name,
					email: contactDetails.booker.email,
					primary_phone: contactDetails.booker.primary_phone,
					secondary_phone: contactDetails.booker.secondary_phone
				};
			}
		}

		const updated = await Booking.findByIdAndUpdate(
			bookingId,
			updateData,
			{ new: true }
		);
		if (!updated) return { success: false, message: "Booking not found" };

		// Notify admin via socket
		notifyAdmin(updated);

		return { success: true, message: "Booking finalized successfully", booking: updated };
	} catch (error) {
		console.log("finalizeBooking error:", error);
		return { success: false, message: error.message || error };
	}
};

exports.createBooking = async (bookingData) => {
	try {
		const booking = new Booking(bookingData);
		const saved = await booking.save();
		return { success: true, message: "Booking created successfully", booking: saved };
	} catch (error) {
		console.log("createBooking error:", error);
		return { success: false, message: error.message || error };
	}
};

exports.getAllBookings = async () => {
	try {
		const bookings = await Booking.find().populate("vehicle_details.vehicle_id");
		return { success: true, bookings };
	} catch (error) {
		console.log("getAllBookings error:", error);
		return { success: false, message: error.message || error };
	}
};

exports.getTodayBookings = async () => {
	try {
		const todayStart = moment().startOf('day').toDate();
		const todayEnd = moment().endOf('day').toDate();
		
		const bookings = await Booking.find({
			created_at: { $gte: todayStart, $lte: todayEnd }
		}).sort({ created_at: -1 });

		return { success: true, bookings };
	} catch (error) {
		console.log("getTodayBookings error:", error);
		return { success: false, message: error.message || error };
	}
};

exports.updateBookingStatus = async (id, status) => {
	try {
		const updated = await Booking.findByIdAndUpdate(
			id,
			{ booking_status: status, updated_at: Date.now() },
			{ new: true }
		);
		if (!updated) return { success: false, message: "Booking not found" };
		return { success: true, message: `Booking ${status} successfully`, booking: updated };
	} catch (error) {
		console.log("updateBookingStatus error:", error);
		return { success: false, message: error.message || error };
	}
};
