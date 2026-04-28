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
//         console.log('PIDs to fetch:', pids, 'Types:', pids.map(p => typeof p));
        
//         // Fetch returnable and exchangeable values based on PIDs
//         const [productDetails] = await connection.query(
//             `SELECT pid, returnable, exchangeable FROM productdetail WHERE pid IN (?)`,
//             [pids]
//         );

//         console.log('\n=== RAW PRODUCT DETAILS FROM DB ===');
//         console.log(JSON.stringify(productDetails, null, 2));

//         // Create a map for quick lookup by PID
//         // Convert PID to string to ensure consistent matching
//         const productDetailsMap = {};
//         productDetails.forEach(product => {
//             const pidKey = String(product.pid);
//             productDetailsMap[pidKey] = {
//                 returnable: Number(product.returnable),    // Explicit conversion to number
//                 exchangeable: Number(product.exchangeable) // Explicit conversion to number
//             };
//             console.log(`✓ Mapped PID: ${pidKey} => Returnable: ${productDetailsMap[pidKey].returnable} (type: ${typeof productDetailsMap[pidKey].returnable}), Exchangeable: ${productDetailsMap[pidKey].exchangeable} (type: ${typeof productDetailsMap[pidKey].exchangeable})`);
//         });

//         console.log('\n=== PRODUCT DETAILS MAP ===');
//         console.log(JSON.stringify(productDetailsMap, null, 2));

//         // Insert each order into the database
//         let successCount = 0;
//         let failedOrders = [];

//         for (let order of ordersArray) {
//             try {
//                 // Get returnable and exchangeable from the map
//                 // Convert PID to string for lookup
//                 const pidKey = String(order.pid);
//                 const productInfo = productDetailsMap[pidKey] || { returnable: 0, exchangeable: 0 };
                
//                 console.log(`\n=== Processing Order ${order.orderID} ===`);
//                 console.log(`Order PID: ${order.pid} (type: ${typeof order.pid})`);
//                 console.log(`Looking up with key: "${pidKey}"`);
//                 console.log(`Found Product Info:`, productInfo);
//                 console.log(`isReturnable value: ${productInfo.returnable} (type: ${typeof productInfo.returnable})`);
//                 console.log(`isExchangeable value: ${productInfo.exchangeable} (type: ${typeof productInfo.exchangeable})`);

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
//                     productInfo.returnable,      // From database based on PID - SHOULD BE 1
//                     productInfo.exchangeable,    // From database based on PID - SHOULD BE 1
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

//                 console.log(`\n📋 VALUES ARRAY (index 10 & 11 should be 1):`);
//                 values.forEach((val, idx) => {
//                     if (idx === 10 || idx === 11) {
//                         console.log(`  [${idx}] = ${val} (type: ${typeof val}) ⭐ THIS IS isReturnable/isExchangeable`);
//                     } else {
//                         console.log(`  [${idx}] = ${val} (type: ${typeof val})`);
//                     }
//                 });

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
