const pool = require('../../database.js');
const fs = require('fs');
const cancelOrders = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { pid, phone, orderID,  size, name, address, pincode, productName, brandName, price, quantity } = req.body;
        console.log('=== Cancel Order Request ===');
        console.log('Request body:', { pid, phone, orderID,  size, name, address, pincode, productName, brandName, price, quantity });
        
        if (!pid || !phone || !orderID) {
            return res.status(400).json({ success: false, error: 'Product ID, phone number, and order ID are required' });
        }
        const sql = "UPDATE orders SET orderStatus = 'off' WHERE pid = ? AND phone = ? AND orderID = ?";
        console.log('SQL Query:', sql);
        console.log('Parameters:', [pid, phone, orderID]);
        
        const [result] = await connection.execute(sql, [pid, phone, orderID]);
        console.log('Database update result - Affected rows:', result.affectedRows);
        if (result.affectedRows > 0) {

            try {
                           console.log('Database update successful, attempting to log...');
                           // Log the exchange request to a daily file
                           const now = new Date();
                           const dateString = now.toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' }).replace(/\//g, '-');
                           const timeString = now.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
                           
                           const dataTobeLogged = {
                               timestamp: `${dateString} ${timeString}`,
                               pid,
                               phone,
                               orderID, size, name, address, pincode, productName, brandName, price, quantity,
                               
                               action: 'Product Cancelled'
                           };
                           
                           const logDir = __dirname + '/../../logs/orders/orderCancel';
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
                           
                           // Append to daily log file (creates if doesn't exist)
                           console.log('Writing to file:', filePath);
                           fs.appendFileSync(filePath, JSON.stringify(dataTobeLogged) + '\n');
                           console.log('File written successfully');
                           res.json({ success: true });
                       } catch (fileError) {
                           console.error('Error writing to cancellation log file:', fileError);
                           res.json({ success: true, error: 'Order cancelled but failed to log cancellation', details: fileError.message });
                       }
        } else {
            console.log('No matching orders found for cancellation');
            return res.status(404).json({ success: false, error: 'Order not found or already cancelled' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        if (connection) connection.release();
    }
}
module.exports = cancelOrders;
