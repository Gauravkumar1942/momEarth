const pool = require('../../database.js');
const fs = require('fs');

const returnOrder = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { pid, phone, orderID, size, name, address, pincode, productName, brandName, price, quantity } = req.body;
        
        // if (type === 'exchange') {
        //     // First fetch the current size
        //     const [orderData] = await connection.execute(
        //         "SELECT size FROM orders WHERE pid = ? AND phone = ? AND orderID = ? AND deliveryStatus = 'Delivered'",
        //         [pid, phone, orderID]
        //     );
            
        //     if (orderData.length === 0) {
        //         return res.status(404).json({ success: false, error: 'Order not found or not delivered yet' });
        //     }
            
        //     const currentSize = orderData[0].size;
        //     const newSizeValue = `${currentSize}-${sizeChange}`;
            
        //     // Update with oldSize-newSize format
        //     const sql = "UPDATE orders SET returnAlert = 'exchange', size = ? WHERE pid = ? AND phone = ? AND orderID = ? AND deliveryStatus = 'Delivered'";
        //     const params = [newSizeValue, pid, phone, orderID];
            
        //     const [result] = await connection.execute(sql, params);
            
        //     if (result.affectedRows > 0) {
        //         return res.json({ success: true });
        //     }
        // } else {
            // For return, keep the original logic
            const sql = "UPDATE orders SET returnAlert = 'return' WHERE pid = ? AND phone = ? AND orderID = ? AND deliveryStatus = 'Delivered'";
            const params = [pid, phone, orderID];
            
            const [result] = await connection.execute(sql, params);
            
            if (result.affectedRows > 0) {

                  try {
                                           console.log('Database update successful, attempting to log...');
                                           // Log the exchange request to a daily file
                                           const now = new Date();
                                           const dateString = now.toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' }).replace(/\//g, '-');
                                           const timeString = now.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
                                           
                                           const dataTobeLogged = {
                                               timestamp: `${dateString} ${timeString}`,
                                              pid, phone, orderID, size, name, address, pincode, productName, brandName, price, quantity,
                                               
                                               action: 'Product Returned'
                                           };
                                           
                                           const logDir = __dirname + '/../../logs/orders/orderReturn';
                                           const filename = `${dateString}.log`; // Daily file: DD-MM-YYYY.log
                                           const filePath = logDir + '/' + filename;
                                           
                                           console.log('Attempting to write to log file:', filePath);
                                           console.log('Log directory:', logDir);
                                           console.log(dataTobeLogged);
                                           
                                           
                                           // Create directory if it doesn't exist
                                           if (!fs.existsSync(logDir)) {
                                               console.log('Directory does not exist, creating...');
                                               fs.mkdirSync(logDir, { recursive: true });
                                               console.log('Directory created successfully');
                                           }
                                           
                                           // Append to daily log file (creates if doesn't exist)
                                           console.log('Writing to file:', filePath);
                                           fs.appendFileSync(filePath, JSON.stringify(dataTobeLogged) + '\n');
                                           console.log('File written successfully');
                                           res.json({ success: true });
                                       } catch (fileError) {
                                           console.error('Error writing to cancellation log file:', fileError);
                                           res.json({ success: true, error: 'Order cancelled but failed to log cancellation', details: fileError.message });
                                       }
                // return res.json({ success: true });
            } else {
                return res.status(404).json({ success: false, error: 'Order not found or not delivered yet' });
            }
        // }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = returnOrder;