const { User_Booking } = require("../entities");

const bookingDate = async (clientId, requestBody) => {
  const {
    firstDate,
    secondDate,
    country,
    city,
    status,
    clientType,
  } = requestBody;
  const book = await User_Booking.create({
    userId: clientId,
    firstDate: firstDate,
    secondDate: secondDate,
    country: country,
    city: city,
    state: status,
    clientType: clientType,
    expiry: "Active",
  });
  await book.save();
  return book;
};

const getbookingDate = async () => {
  const bookDate = await User_Booking.findAll({
    attributes: ["firstDate", "secondDate"],
  });
  return bookDate;
};

const checkBooking = async (id) => {
  const isExist = await User_Booking.count({ where: { userId: id } });
  if (isExist > 0) return true;
  else return false;
};

const getBookDate = async (id) => {
  return await User_Booking.findOne({
    where: { userId: id },
  });
};

const updateExpiry = async (id, state) => {
  return await User_Booking.update({ expiry: state }, { where: {userId: id} });
};

module.exports = {
  bookingDate,
  checkBooking,
  getbookingDate,
  getBookDate,
  updateExpiry,
};
