const pool = require('../database.js');
 const fetchCart = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const sql = `SELECT pid, brand, productname, image_url, price FROM productdetail WHERE pid IN (SELECT pid FROM cart)`;
        const [rows] =  await connection.query(sql);
        connection.release(); // Release back to pool
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
 }
 module.exports = fetchCart;