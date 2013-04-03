# LeapDoodle

Welcome to the ETE Leap Doodle application. This is intended for use with the Leap (https://www.leapmotion.com/), the Chrome web browser (as of this writing, Chrome version 26.0.1410.43), and a computer equipped with a web camera.

# Installation

This requires Node.js (as of this writing, version 0.10.2).  If you're using npm, you can use 'npm install' and this will locally install the necessary dependencies.

# Usage

LeapDoodle works with the Leap Motion controller and Chrome web browser (version 26.0.1410.43).  To run the server component, run 'node app.js' from the base directory.  This will run a Node.js Express server on port 3000.  Open your browser and point it to http://localhost:3000/eteDoodle and allow access to the web camera.

Photos uploaded to the server will be saved at in the user home directory under snapshotImages.
