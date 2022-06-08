`use strict`;
/**
 * root node call defined here
 */
import 'dotenv/config';
import os from 'os';
import cluster from 'cluster';
import Server from './src/bin/server';
// master and worker -> cluste.fork()
// if (cluster.isPrimary) {
//   console.log('Master process is running ', process.pid);
//   const noOfCpus = os.cpus().length;
//   for (let i = 0; i < noOfCpus; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', () => {
//     console.log('One worker destroyed');
//     cluster.fork();
//   });
// } else {
  new Server().init();
// }
