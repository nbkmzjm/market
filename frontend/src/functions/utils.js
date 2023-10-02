export const getError = (error) => {
   return error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
};

export const generateID = () => {
   const timestamp = Date.now().toString(36); // Convert current timestamp to base36
   const randomPart = Math.random().toString(36).substr(2, 5); // Generate a random part
   const orderID = timestamp + randomPart; // Combine timestamp and random part
   return orderID.toUpperCase(); // Convert to uppercase for better readability
};

export const generateOrderID = (min, max) => {
   const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;

   const today = new Date();

   const year = today.getFullYear().toString().substr(-2); // Extract last two digits of the year
   const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
   const day = today.getDate().toString().padStart(2, '0'); // Add leading zero if needed

   const formattedDate = `${month}${day}${year}`;

   // const randomPart = Math.random().toString(36).substr(2, 5); // Generate a random part
   const orderID = randomInt + formattedDate; // Combine timestamp and random part
   return orderID; // Convert to uppercase for better readability
};
