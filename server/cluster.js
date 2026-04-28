const express = require('express');
const app = express();
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  // Master process - fork workers
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  const noOfCPUs = os.cpus().length;
  // Fork workers equal to number of CPUs
  for (let i = 0; i < noOfCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit events
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart the worker if it crashes
    cluster.fork();
  });
} else {
  require('./express.js');
  // Worker process - create Express app
}