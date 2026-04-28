const pool = require('../database.js'); // Adjust the path as necessary
const fs = require('fs')
const fetchByPid = async (req, res) => {
    const { pid } = req.params;
    
    try {
        const connection = await pool.getConnection();
        const sql = `SELECT * FROM productdetail WHERE pid = ?`;
        const [rows] = await connection.query(sql, [pid]);
        connection.release();
        const date = new Date().toLocaleString('en-IN', { day: 'numeric' });
        const month = new Date().toLocaleString('en-IN', { month: 'long' });
        const year = new Date().toLocaleString('en-IN', { year: 'numeric' });
        const fileName = `${date}${month}${year}.log`;
        const fsData =  {
            'Time' : new Date().toLocaleString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                weekday: 'long',
                
                month: 'long',
                year: 'numeric',
                timeZone: 'Asia/Kolkata',
                hour12: true,    
            }),
            'Endpoint' : req.originalUrl,
            'Method' : req.method,
            'Data' : rows,
            'Status' : res.statusCode
        }
        fs.appendFile(__dirname + '/../logs/' + fileName, JSON.stringify(fsData, null, 2), 'utf-8', (err) =>{
            console.log(err, 'The Error');
            
        });
        if(rows.length > 0)res.status(200).json(rows);
        if(rows.length === 0) res.status(200).json({length: 0})
    } catch (err) {
        console.error('Error fetching product by PID:', err);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

module.exports = fetchByPid;
