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



//         // We want to extract all the PIDs from the ordersArray to fetch the returnable and exchangeable values in one query, and then use that data to push in the order table of the DB along side the other things as mentioned below
//         const pids = ordersArray.map(order => order.pid);
//         const [productDetails] = await connection.query(
//             `SELECT pid, returnable, exchangeable FROM productdetail WHERE pid IN (?)`,
//             [pids]
//         );

//         // Insert each order into the database
//         let successCount = 0;
//         let failedOrders = [];

//         for (let order of ordersArray) {
//             try {
//                 // Insert with all columns matching BuyNow.jsx data
//                 const query = `
//                     INSERT INTO orders 
//                     (phone, pid, brandName, image_url, price, quantity, size, orderID, orderDate,returnExpiryDate, isReturnable, isExchangeable, 
//                      pincode, address, orderStatus, returnable, returnAlert,  deliveryStatus, trackingID, productName,  name) 
//                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, ?)
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
//                     // order.isReturnable || 0,   // here push the stuff that we get from the productdetail table based on the pid of the order
//                     // order.isExchangeable || 0, // here push the stuff that we get from the productdetail table based on the pid of the order
//                     productDetails.find(p => p.pid === order.pid)?.returnable || 0,
//                     productDetails.find(p => p.pid === order.pid)?.exchangeable || 0,
//                     // order.isExchangeable || 0,
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

//                 console.log(`Attempting to insert order ${order.orderID} with values:`, values);
//                 console.log('SQL Query:', query);

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

// module.exports = insertOrder;





const pool = require('../../database.js');
const fs = require('fs');

const insertOrder = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const ordersArray = req.body;
        
        console.log('Received orders array:', JSON.stringify(ordersArray, null, 2));
        
        // Check if ordersArray is an array
        if (!Array.isArray(ordersArray) || ordersArray.length === 0) {
            console.log('Invalid orders data - not an array or empty');
            return res.json({ success: false, message: 'Invalid orders data' });
        }

        // Extract all PIDs from the ordersArray
        const pids = ordersArray.map(order => order.pid);
        console.log('PIDs to fetch:', pids, 'Types:', pids.map(p => typeof p));
        
        // Fetch returnable and exchangeable values based on PIDs
        const [productDetails] = await connection.query(
            `SELECT pid, returnable, exchangeable FROM productdetail WHERE pid IN (?)`,
            [pids]
        );

        console.log('\n=== RAW PRODUCT DETAILS FROM DB ===');
        console.log(JSON.stringify(productDetails, null, 2));
        
        // Check what we actually got
        if (productDetails && productDetails.length > 0) {
            const firstProduct = productDetails[0];
            console.log('\n🔍 FIRST PRODUCT DETAILS:');
            console.log('Keys:', Object.keys(firstProduct));
            for (let key in firstProduct) {
                console.log(`  ${key}: ${firstProduct[key]} (type: ${typeof firstProduct[key]})`);
            }
        }

        // Create a map for quick lookup by PID
        // DON'T convert - keep as original type from database
        const productDetailsMap = {};
        productDetails.forEach(product => {
            const pidValue = product.pid;
            const returnableValue = product.returnable;
            const exchangeableValue = product.exchangeable;
            
            console.log(`\n📦 Processing product - PID: ${pidValue}, returnable: ${returnableValue} (${typeof returnableValue}), exchangeable: ${exchangeableValue} (${typeof exchangeableValue})`);
            
            productDetailsMap[pidValue] = {
                returnable: Number(returnableValue),    
                exchangeable: Number(exchangeableValue)
            };
            
            console.log(`  ✓ After Number() conversion: returnable: ${productDetailsMap[pidValue].returnable} (${typeof productDetailsMap[pidValue].returnable}), exchangeable: ${productDetailsMap[pidValue].exchangeable} (${typeof productDetailsMap[pidValue].exchangeable})`);
        });

        console.log('\n=== PRODUCT DETAILS MAP KEYS ===');
        console.log('All keys in map:', Object.keys(productDetailsMap));
        console.log('Map contents:', JSON.stringify(productDetailsMap, null, 2));

        // Insert each order into the database
        let successCount = 0;
        let failedOrders = [];
        let ordersToLog = []; // Collect all orders for logging

        for (let order of ordersArray) {
            try {
                // Get returnable and exchangeable from the map
                // Use PID as-is (don't convert) for lookup
                let productInfo = productDetailsMap[order.pid];
                
                console.log(`\n=== Processing Order ${order.orderID} ===`);
                console.log(`Order PID: ${order.pid}`);
                
                // FALLBACK: If not in map, query database directly
                if (!productInfo) {
                    console.log(`⚠️ PID not in map, querying database directly...`);
                    const [directQuery] = await connection.query(
                        `SELECT returnable, exchangeable FROM productdetail WHERE pid = ?`,
                        [order.pid]
                    );
                    
                    if (directQuery && directQuery.length > 0) {
                        productInfo = {
                            returnable: Number(directQuery[0].returnable),
                            exchangeable: Number(directQuery[0].exchangeable)
                        };
                        console.log(`✓ Found via direct query: returnable=${productInfo.returnable}, exchangeable=${productInfo.exchangeable}`);
                    } else {
                        productInfo = { returnable: 0, exchangeable: 0 };
                        console.log(`✗ NOT FOUND - using defaults (0, 0)`);
                    }
                } else {
                    console.log(`✓ Found in map: returnable=${productInfo.returnable}, exchangeable=${productInfo.exchangeable}`);
                }
                
                console.log(`Final values to insert: isReturnable=${productInfo.returnable}, isExchangeable=${productInfo.exchangeable}`);

                // Insert with all columns and proper returnable/exchangeable values from database
                const query = `
                    INSERT INTO orders 
                    (phone, pid, brandName, image_url, price, quantity, size, orderID, orderDate, returnExpiryDate, isReturnable, isExchangeable, 
                     pincode, address, orderStatus, returnable, returnAlert, deliveryStatus, trackingID, productName, name) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const values = [
                    order.phone || '',
                    order.pid || '',
                    order.brandName || '',
                    order.image_url || '',
                    order.price || 0,
                    order.quantity || 1,
                    order.size || '',
                    order.orderID || '',
                    order.orderDate || new Date().toISOString(),
                    order.returnExpiryDate || new Date().toISOString(),
                    productInfo.returnable,      // From database based on PID - SHOULD BE 1
                    productInfo.exchangeable,    // From database based on PID - SHOULD BE 1
                    order.pincode || '',
                    order.address || '',
                    order.orderStatus || 'on',
                    order.returnable || false,
                    order.returnAlert || false,
                    order.deliveryStatus || 'Ordered',
                    order.trackingID || 0,
                    order.productName || '',
                    order.name || ''
                ];

                console.log(`\n📋 FINAL VALUES ARRAY:`);
                console.log(`  [10] isReturnable = ${values[10]} (type: ${typeof values[10]}) ⭐`);
                console.log(`  [11] isExchangeable = ${values[11]} (type: ${typeof values[11]}) ⭐`);

                const [result] = await connection.execute(query, values);
                
                if (result.affectedRows > 0) {
                    successCount++;
                    console.log(`✓ Order ${order.orderID} inserted successfully`);
                    
                    // Collect order data for logging
                    ordersToLog.push({
                        orderID: order.orderID,
                        timestamp: new Date().toLocaleString('en-IN', { 
                            day: '2-digit', month: '2-digit', year: 'numeric', 
                            hour: '2-digit', minute: '2-digit', second: '2-digit', 
                            hour12: true, timeZone: 'Asia/Kolkata' 
                        }),
                        phone: order.phone,
                        pid: order.pid,
                        productName: order.productName,
                        brandName: order.brandName,
                        price: order.price,
                        quantity: order.quantity,
                        size: order.size,
                        address: order.address,
                        pincode: order.pincode,
                        name: order.name,
                        image_url: order.image_url,
                        orderDate: order.orderDate,
                        returnExpiryDate: order.returnExpiryDate,
                        orderStatus: order.orderStatus
                    });
                } else {
                    failedOrders.push(order.orderID);
                    console.log(`✗ Order ${order.orderID} failed - no rows affected`);
                }
            } catch (err) {
                console.error(`✗ Error inserting order ${order.orderID}:`, err);
                failedOrders.push({ orderID: order.orderID, error: err.message });
            }
        }

        console.log(`\n=== SUMMARY ===`);
        console.log(`Total success: ${successCount}/${ordersArray.length}`);

        if (successCount === ordersArray.length) {
            // Log all successfully inserted orders to file
            try {
                const now = new Date();
                const dateString = now.toLocaleString('en-IN', { 
                    day: '2-digit', month: '2-digit', year: 'numeric', 
                    timeZone: 'Asia/Kolkata' 
                }).replace(/\//g, '-');
                
                const logDir = __dirname + '/../../logs/orders/orderInsert';
                const filename = `${dateString}.log`; // Daily file: DD-MM-YYYY.log
                const filePath = logDir + '/' + filename;
                
                console.log('Attempting to write to log file:', filePath);
                console.log('Log directory:', logDir);
                
                // Create directory if it doesn't exist
                if (!fs.existsSync(logDir)) {
                    console.log('Directory does not exist, creating...');
                    fs.mkdirSync(logDir, { recursive: true });
                    console.log('Directory created successfully');
                }
                
                // Write all orders at once (better for performance)
                // Each order on a new line for easy parsing
                ordersToLog.forEach(order => {
                    fs.appendFileSync(filePath, JSON.stringify(order) + '\n');
                });
                
                console.log(`✓ Successfully logged ${ordersToLog.length} orders to file`);
                res.json({ success: true, message: 'All orders placed successfully', insertedCount: successCount });
            } catch (fileError) {
                console.error('Error writing to log file:', fileError);
                res.json({ success: true, message: 'All orders placed successfully', insertedCount: successCount, logError: fileError.message });
            }
        } else if (successCount > 0) {
            res.json({ success: true, message: `${successCount} out of ${ordersArray.length} orders placed`, insertedCount: successCount, failedOrders });
        } else {
            res.json({ success: false, message: 'Failed to insert orders', failedOrders });
        }

    } catch (error) {
        console.error('Connection or general error:', error);
        res.json({ success: false, message: 'Error inserting orders', error: error.message });
    }
    finally {
        if (connection) {
            try {
                connection.release();
            } catch (err) {
                console.error('Error releasing connection:', err);
            }
        }
    }
}

module.exports = insertOrder;
