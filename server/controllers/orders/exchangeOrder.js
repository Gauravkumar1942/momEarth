const pool = require('../../database.js');
const fs = require('fs');
const exchangeOrder = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { pid, phone, orderID,size, selectedSize } = req.body;
        console.log('=== Exchange Order Request ===');
        console.log('Request body:', { pid, phone, orderID, size, selectedSize });
        
        const sql = "UPDATE orders SET returnAlert = ? WHERE pid = ? AND phone = ? AND orderID = ? AND deliveryStatus = 'Delivered'";
        const params = [`exchange(${size}-${selectedSize})`, pid, phone, orderID];
        console.log('SQL Query:', sql);
        console.log('Parameters:', params);
        
        const [result] = await connection.execute(sql, params);
        console.log('Database update result - Affected rows:', result.affectedRows);
        if (result.affectedRows > 0) {
            try {
                // Log the exchange request to a daily file
                const now = new Date();
                const dateString = now.toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' }).replace(/\//g, '-');
                const timeString = now.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
                
                const dataTobeLogged = {
                    timestamp: `${dateString} ${timeString}`,
                    pid,
                    phone,
                    orderID,
                    size,
                    selectedSize,
                    action: 'Exchange Requested'
                };
                
                const logDir = __dirname + '/../../logs/orders/orderExchange';
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
                console.error('Error writing to exchange log file:', fileError);
                res.status(500).json({ error: 'Order updated but failed to log exchange request', details: fileError.message });
            }
        } else {
            console.log('No matching orders found for exchange');
            res.status(404).json({ success: false, error: 'Order not found or not delivered yet' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = exchangeOrder;