const pool = require('../database.js'); // Adjust the path as necessary

const RemoveFromCart = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { pid } = req.body;
        if (!pid) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        
        const sql = 'DELETE FROM cart WHERE pid = ?';
        await connection.query(sql, [pid]);
        connection.release();
        res.status(200).json({success: true});
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false });
    }
};

module.exports = RemoveFromCart;