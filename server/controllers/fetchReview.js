const pool = require('../database.js');
const fs = require('fs');

const fetchReview = async (req, res) => {
    const { pid } = req.params;
    
    try {
        const connection = await pool.getConnection();
        const sql = `SELECT rating, review, name FROM rating WHERE pid = ?`;
        const [rows] = await connection.query(sql, [pid]);
        connection.release();

        // Logging
        // const date = new Date().toLocaleString('en-IN', { day: 'numeric' });
        // const month = new Date().toLocaleString('en-IN', { month: 'long' });
        // const year = new Date().toLocaleString('en-IN', { year: 'numeric' });
        // const fileName = `${date}${month}${year}.log`;
        // const fsData = {
        //     'Time': new Date().toLocaleString('en-IN', {
        //         hour: '2-digit',
        //         minute: '2-digit',
        //         second: '2-digit',
        //         weekday: 'long',
        //         month: 'long',
        //         year: 'numeric',
        //         timeZone: 'Asia/Kolkata',
        //         hour12: true,
        //     }),
        //     'Endpoint': req.originalUrl,
        //     'Method': req.method,
        //     'Data': rows,
        //     'Status': res.statusCode
        // };
        // fs.appendFile(__dirname + '/../logs/' + fileName, JSON.stringify(fsData, null, 2), 'utf-8', (err) => {
        //     if (err) console.log(err, 'The Error');
        // });

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(200).json({ length: 0, data: [] });
        }
    } catch (err) {
        console.error('Error fetching reviews by PID:', err);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};

module.exports = fetchReview;
