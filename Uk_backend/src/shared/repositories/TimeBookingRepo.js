const { User_Booking } = require("../entities");

const bookingDate = async (clientId, requestBody) => {
  const { firstDate, secondDate, country, city, status, clientType } = requestBody;
  const book = await User_Booking.create({
    userId: clientId,
    firstDate: firstDate,
    secondDate: secondDate,
    country: country,
    city: city,
    state: status,
    clientType: clientType
  });
  await book.save();
  return book;
};

const getbookingDate = async () => {
  const bookDate = await User_Booking.findAll({
    attributes:['firstDate','secondDate']
  });
  return bookDate;
}

const checkBooking = async (id) => {
  const isExist = await User_Booking.count({ where: { userId: id } });
  if (isExist > 0) return true;
  else return false;
};

module.exports = { bookingDate, checkBooking, getbookingDate };
