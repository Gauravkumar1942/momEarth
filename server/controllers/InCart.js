const pool = require('../database.js');

const Incart = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { pid } = req.params;
        if (!pid) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const sql = 'SELECT pid FROM cart WHERE pid = ?';
        const [rows] = await connection.query(sql, [pid]);
        connection.release(); // Release back to pool
        if(rows.length > 0) res.status(200).json({ inCart: true });
        if(rows.length === 0) res.status(200).json({ inCart: false });
        
    } catch (error) {
        console.error('Error checking cart:', error);
        res.status(500).json({ inCart: false });
    }
};
module.exports = Incart;