  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const compression = require('compression');
  const cron = require('node-cron');
 
  
  const routesCart = require('./routes/routesCart.js') // Assuming you have a separate routes file for cart
  const routesPid = require('./routes/routesPid.js') // Assuming you have a separate routes file for cart
  const routesWishlist = require('./routes/routesWishlist.js') // Assuming you have a separate routes file for cart
  const routesReco = require('./routes/routesReco.js')

  const routesOrders = require('./routes/routesOrders.js')
  
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(compression());

  const pool = require('./database.js');

  async function handleRatingUpdates() {
    let connection;
    try {
      connection = await pool.getConnection();
      
      let sql = `
            UPDATE productdetail pd
            LEFT JOIN (
                SELECT pid, COUNT(*) as total_sales FROM orders GROUP BY pid
            ) o ON pd.pid = o.pid
            LEFT JOIN (
                SELECT pid, AVG(rating) as avg_rating FROM rating GROUP BY pid
            ) r ON pd.pid = r.pid
            SET 
                pd.count = IFNULL(o.total_sales, 0),
                pd.rating = IFNULL(r.avg_rating, 0);
        `;

      await connection.query(sql);
      console.log(`[${new Date().toISOString()}] ✅ Product ratings and counts updated successfully`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Error:`, error.message);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // Start cron job after server starts (delay to ensure pool is ready)
  setTimeout(() => {
    console.log('✅ Starting cron job for rating updates...');
    cron.schedule('*/3 * * * *', () => {
      handleRatingUpdates();
    });
  }, 2000);

  // cron job to update the returnable status every day at midnight

  async function handleReturnableUpdates() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    let sql = `
      UPDATE orders
      SET returnable = CASE
        WHEN DATE_ADD(orderDate, INTERVAL 7 DAY) < NOW() THEN false
        ELSE true
      END
      WHERE orderDate IS NOT NULL AND deliveryStatus = 'Delivered';
    `;

    const [result] = await connection.query(sql);
    console.log(`[${new Date().toISOString()}] ✅ Returnable status updated successfully - ${result.affectedRows} orders processed`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error updating returnable status:`, error.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Start cron job after server starts (delay to ensure pool is ready)
setTimeout(() => {
  console.log('✅ Starting cron job for returnable order updates...');
  cron.schedule('*/3 * * * *', () => {  // Runs daily at midnight
    handleReturnableUpdates();
  });
}, 2000);

// Handle return expiry date updates every 30 minutes
async function handleReturnExpiryDateUpdates() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    let sql = `
      UPDATE orders
      SET returnExpiryDate = DATE_ADD(NOW(), INTERVAL 7 DAY)
      WHERE orderStatus = 'Delivered' 
      AND (returnExpiryDate IS NULL OR returnExpiryDate = '0000-00-00 00:00:00' OR returnExpiryDate = 0 OR returnExpiryDate = '0')
    `;

    const [result] = await connection.query(sql);
    console.log(`[${new Date().toISOString()}] ✅ Return expiry dates updated - ${result.affectedRows} orders processed`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error updating return expiry dates:`, error.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Start cron job after server starts (delay to ensure pool is ready)
setTimeout(() => {
  console.log('✅ Starting cron job for return expiry date updates (every 30 mins)...');
  cron.schedule('*/30 * * * *', () => {  // Runs every 30 minutes
    handleReturnExpiryDateUpdates();
  });
}, 2000);







  // Create database connection for each worker
//   const db = mysql.createConnection({
//     host: "localhost",
//     user: 'root',
//     password: "",
//     database: "customers"
//   });

  // Better to use connection pool in clustered environment
  // const pool = mysql.createPool({
  //   host: "localhost",
  //   user: 'root',
  //   password: "",
  //   database: "customers",
  //   connectionLimit: 10
  // });

//   app.post('/wishlist', (req, res) => {
//     const {wishlist} = req.body || [];
//     const sql = `SELECT pid, brand, productname, image_url, price FROM productdetail WHERE pid IN (${wishlist.map(() => '?').join(',')})`;
    
//     db.query(sql, wishlist, (err, result) => {
//       if(err) {
//         res.status(500).send({message: 'Failed'});
//         return;
//       }
//       res.send(result);
//     });
//   });

//   app.get('/cart', (req,res) => {
//     const sql = 'SELECT pid, image_url, brand, productname, price FROM productdetail WHERE pid IN (SELECT pid FROM cart)';
//     db.query(sql, (err, result) => {
//       if(err) {
//         res.status(500).send({message: 'Failed'});
//         return;
//       }
//       res.send(result);
//     });
//   });

//   app.get('/products/pid/:pid', (req, res) => {
//     const {pid} = req.params;
//     // Use parameterized query to prevent SQL injection
//     const sql = `SELECT image_url,image_1, image_2, image_3, image_4, price, pid, productname, brand, 1feature, 2feature, 3feature, 4feature, material, care FROM productdetail WHERE pid = ?`;
//     db.query(sql, [pid], (err, result) => {
//       if(err){
//         res.status(500).send({message: "failed"});
//         return;
//       }
//       res.send(result);
//     });
//   });



  app.use('/cart', routesCart);
  app.use('/wishlist', routesWishlist);
  app.use('/products', routesPid);
  app.use('/reco', routesReco);

  //order 
  app.use('/orders', routesOrders);
  
//   app.post('/cart/add', (req, res) => {
//     const { pid } = req.body;
//     // Use parameterized query
//     const sql = 'INSERT INTO cart (pid) VALUES (?)';
//     db.query(sql, [pid], (err, result) => {
//       if(err) {
//         return res.status(500).send({message: 'Failed to add to cart'});
//       }
//       res.json({success: true});
//     });
//   });

//   app.delete('/cart/remove', (req, res) => {
//     const { pid } = req.body;
//     // Use parameterized query
//     const sql = 'DELETE FROM cart WHERE pid = ?';
//     db.query(sql, [pid], (err, result) => {
//       if(err) {
//         return res.status(500).send({message: 'Failed to remove from cart'});
//       }
//       res.json({success: true});
//     });
//   });

//   app.post('/cart/check/:pid', (req, res) => {
//     const { pid } = req.params;
//     // Use parameterized query
//     const sql = 'SELECT pid FROM cart WHERE pid = ?';
//     db.query(sql, [pid], (err, result) => {
//       if(err) {
//         return res.status(500).send({message: 'Failed to check cart'});
//       }
//       if(result.length > 0) {
//         return res.json({inCart: true});
//       } else {
//         return res.json({inCart: false});
//       }
//     });
//   });

 const port = 3000;
  const server = app.listen(port, () => {
    console.log(`Worker ${process.pid} started on port ${port}`);
  });
// const pool = require('./database.js'); // Assuming you have a separate database.js file for connection pooling
  process.on('SIGINT', async () =>{
    try {
        await pool.end(); // Close all pool connections
        console.log(`Worker ${process.pid} shutting down gracefully...`);
        server.close(() =>{
            console.log(`Worker ${process.pid} has shut down`);
            process.exit(0);
        })
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
        
    }
  })




module.exports = app;








// const cluster = require('cluster');
// const os = require('os');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mysql = require('mysql2/promise'); // Promise-based API

// if (cluster.isMaster) {
//   // Master process - fork workers
//   const numCPUs = os.cpus().length;
//   console.log(`📦 Master ${process.pid} is running with ${numCPUs} workers`);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // Handle worker exit events
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork(); // Auto-restart
//   });
// } else {
//   // Worker process - create Express app
//   const app = express();
//   app.use(cors());
//   app.use(bodyParser.json());

//   // 🚀 MySQL Connection Pool (shared across requests)
//   const pool = mysql.createPool({
//     host: "localhost",
//     user: 'root',
//     password: "",
//     database: "customers",
//     connectionLimit: 10,  // Adjust based on your DB capacity
//     waitForConnections: true,
//     queueLimit: 0
//   });

//   // ✅ Health check endpoint
//   app.get('/health', (req, res) => {
//     res.status(200).json({ status: 'OK', worker: process.pid });
//   });

//   // 🛒 Wishlist endpoint
//   app.post('/wishlist', async (req, res) => {
//     try {
//       const { wishlist = [] } = req.body;
//       if (!wishlist.length) {
//         return res.status(400).json({ message: 'Empty wishlist' });
//       }

//       const connection = await pool.getConnection();
//       const sql = `SELECT pid, brand, productname, image_url, price 
//                    FROM productdetail 
//                    WHERE pid IN (${wishlist.map(() => '?').join(',')})`;
      
//       const [rows] = await connection.query(sql, wishlist);
//       connection.release(); // Release back to pool
      
//       res.json(rows);
//     } catch (error) {
//       console.error('Wishlist error:', error);
//       res.status(500).json({ message: 'Failed to fetch wishlist' });
//     }
//   });

//   // 🛍️ Cart endpoint
//   app.get('/cart', async (req, res) => {
//     try {
//       const connection = await pool.getConnection();
//       const [rows] = await connection.query(
//         `SELECT pid, image_url, brand, productname, price 
//          FROM productdetail 
//          WHERE pid IN (SELECT pid FROM cart)`
//       );
//       connection.release();
//       res.json(rows);
//     } catch (error) {
//       console.error('Cart error:', error);
//       res.status(500).json({ message: 'Failed to fetch cart' });
//     }
//   });

//   // 🖼️ Product details endpoint
//   app.get('/products/pid/:pid', async (req, res) => {
//     try {
//       const { pid } = req.params;
//       const connection = await pool.getConnection();
//       const [rows] = await connection.query(
//         `SELECT image_url, image_1, image_2, image_3, image_4, price, 
//                 pid, productname, brand, 1feature, 2feature, 
//                 3feature, 4feature, material, care 
//          FROM productdetail 
//          WHERE pid = ?`,
//         [pid]
//       );
//       connection.release();
//       res.json(rows[0] || {});
//     } catch (error) {
//       console.error('Product detail error:', error);
//       res.status(500).json({ message: 'Failed to fetch product' });
//     }
//   });

//   // ➕ Add to cart
//   app.post('/cart/add', async (req, res) => {
//     try {
//       const { pid } = req.body;
//       const connection = await pool.getConnection();
//       await connection.query('INSERT INTO cart (pid) VALUES (?)', [pid]);
//       connection.release();
//       res.json({ success: true });
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       res.status(500).json({ message: 'Failed to add to cart' });
//     }
//   });

//   // ➖ Remove from cart
//   app.delete('/cart/remove', async (req, res) => {
//     try {
//       const { pid } = req.body;
//       const connection = await pool.getConnection();
//       await connection.query('DELETE FROM cart WHERE pid = ?', [pid]);
//       connection.release();
//       res.json({ success: true });
//     } catch (error) {
//       console.error('Remove from cart error:', error);
//       res.status(500).json({ message: 'Failed to remove from cart' });
//     }
//   });

//   // ✔️ Check cart status
//   app.post('/cart/check/:pid', async (req, res) => {
//     try {
//       const { pid } = req.params;
//       const connection = await pool.getConnection();
//       const [rows] = await connection.query(
//         'SELECT pid FROM cart WHERE pid = ?',
//         [pid]
//       );
//       connection.release();
//       res.json({ inCart: rows.length > 0 });
//     } catch (error) {
//       console.error('Cart check error:', error);
//       res.status(500).json({ message: 'Failed to check cart' });
//     }
//   });

//   // 🚀 Start server
//   const PORT = 3000;
//   app.listen(PORT, () => {
//     console.log(`🛠️ Worker ${process.pid} ready on port ${PORT}`);
//   });

//   // Graceful shutdown
//   process.on('SIGTERM', () => {
//     console.log(`🛑 Worker ${process.pid} shutting down...`);
//     pool.end(); // Close all pool connections
//     process.exit(0);
//   });
// }