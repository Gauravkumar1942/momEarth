// const pool = require('../../database.js');

// const insertOrder = async (req, res) => {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         const ordersArray = req.body;
        
//         console.log('Received orders array:', JSON.stringify(ordersArray, null, 2));
        
//         // Check if ordersArray is an array
//         if (!Array.isArray(ordersArray) || ordersArray.length === 0) {
//             console.log('Invalid orders data - not an array or empty');
//             return res.json({ success: false, message: 'Invalid orders data' });
//         }

//         // Extract all PIDs from the ordersArray
//         const pids = ordersArray.map(order => order.pid);
        
//         // Fetch returnable and exchangeable values based on PIDs
//         const [productDetails] = await connection.query(
//             `SELECT pid, returnable, exchangeable FROM productdetail WHERE pid IN (?)`,
//             [pids]
//         );

//         // Create a map for quick lookup by PID
//         const productDetailsMap = {};
//         productDetails.forEach(product => {
//             productDetailsMap[product.pid] = {
//                 returnable: product.returnable,
//                 exchangeable: product.exchangeable
//             };
//         });

//         console.log('Product Details Map:', JSON.stringify(productDetailsMap, null, 2));

//         // Insert each order into the database
//         let successCount = 0;
//         let failedOrders = [];

//         for (let order of ordersArray) {
//             try {
//                 // Get returnable and exchangeable from the map
//                 const productInfo = productDetailsMap[order.pid] || { returnable: 0, exchangeable: 0 };
                
//                 console.log(`\n=== Processing Order ${order.orderID} ===`);
//                 console.log(`PID: ${order.pid}`);
//                 console.log(`Returnable from DB: ${productInfo.returnable}`);
//                 console.log(`Exchangeable from DB: ${productInfo.exchangeable}`);

//                 // Insert with all columns and proper returnable/exchangeable values from database
//                 const query = `
//                     INSERT INTO orders 
//                     (phone, pid, brandName, image_url, price, quantity, size, orderID, orderDate, returnExpiryDate, isReturnable, isExchangeable, 
//                      pincode, address, orderStatus, returnable, returnAlert, deliveryStatus, trackingID, productName, name) 
//                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//                 `;

//                 const values = [
//                     order.phone || '',
//                     order.pid || '',
//                     order.brandName || '',
//                     order.image_url || '',
//                     order.price || 0,
//                     order.quantity || 1,
//                     order.size || '',
//                     order.orderID || '',
//                     order.orderDate || new Date().toISOString(),
//                     order.returnExpiryDate || new Date().toISOString(),
//                     productInfo.returnable,      // From database based on PID
//                     productInfo.exchangeable,    // From database based on PID
//                     order.pincode || '',
//                     order.address || '',
//                     order.orderStatus || 'on',
//                     order.returnable || false,
//                     order.returnAlert || false,
//                     order.deliveryStatus || 'Ordered',
//                     order.trackingID || 0,
//                     order.productName || '',
//                     order.name || ''
//                 ];

//                 console.log(`Inserting with values:`, values);

//                 const [result] = await connection.execute(query, values);
                
//                 if (result.affectedRows > 0) {
//                     successCount++;
//                     console.log(`✓ Order ${order.orderID} inserted successfully`);
//                 } else {
//                     failedOrders.push(order.orderID);
//                     console.log(`✗ Order ${order.orderID} failed - no rows affected`);
//                 }
//             } catch (err) {
//                 console.error(`✗ Error inserting order ${order.orderID}:`, err);
//                 failedOrders.push({ orderID: order.orderID, error: err.message });
//             }
//         }

//         console.log(`\n=== SUMMARY ===`);
//         console.log(`Total success: ${successCount}/${ordersArray.length}`);

//         if (successCount === ordersArray.length) {
//             res.json({ success: true, message: 'All orders placed successfully', insertedCount: successCount });
//         } else if (successCount > 0) {
//             res.json({ success: true, message: `${successCount} out of ${ordersArray.length} orders placed`, insertedCount: successCount, failedOrders });
//         } else {
//             res.json({ success: false, message: 'Failed to insert orders', failedOrders });
//         }

//     } catch (error) {
//         console.error('Connection or general error:', error);
//         res.json({ success: false, message: 'Error inserting orders', error: error.message });
//     }
//     finally {
//         if (connection) {
//             try {
//                 connection.release();
//             } catch (err) {
//                 console.error('Error releasing connection:', err);
//             }
//         }
//     }
// }

// module.exports = insertOrder;
