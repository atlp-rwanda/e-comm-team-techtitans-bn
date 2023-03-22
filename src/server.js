import app from './app.js';

const PORT = process.env.PORT;

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`🍏 Server is running on: http://localhost:${PORT} ... 🌊`);
    });
    // Catch all routes that were not found and send this response
    app.use((req, res) => {
      res.status(404).json({
        status: 404,
        success: false,
        message: "🍎 Route doesn't exist.😬",
      });
    });
  } catch (error) {
    if (error) {
      console.log(`🍎 Error occurred when starting server: ${error.message}`);
    } else {
      console.log('Unexpected error', error);
    }
  }
};

start();

//! The start() function above will be restructured to the one below once connected to the db's 'development' environment
// const start = () => {
//   try {
//     app.listen(PORT, () => {
//       // If we are in development mode, the server will run on localhost
//       if (process.env.NODE_ENV === 'development') {
//         console.log(`🍏 Server running on: http://localhost:${PORT} ... 🌊`);
//       } else {
//         console.log(
//           `🍏 Server is running on http://localhost:${process.env.CLIENT_URL}`,
//         );
//       }

//       // Catch all "not found" routes and send this message response
//       app.use((req, res) => {
//         res.status(404).json({
//           status: 404,
//           success: false,
//           message: "🍎 Route doesn't exist.",
//         });
//       });
//     });
//   } catch (error) {
//     if (error) {
//       console.log(`🍎 Error occurred when starting server: ${error.message}`);
//     } else {
//       console.log('Unexpected error', error);
//     }
//   }
// };

// start()
