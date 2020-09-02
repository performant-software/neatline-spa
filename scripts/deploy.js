const ncp = require('ncp');
const dotenv = require('dotenv');

// Configure dotenv in order to use environment variables.
dotenv.config();

// Copy the build directory to the destination.
ncp.ncp(process.env.NODE_BUILD_DIR, process.env.NODE_BUILD_DESTINATION, (error) => {
  error ? console.error(error) : console.log(`Successfully moved build to ${process.env.NODE_BUILD_DESTINATION}.`);
});
