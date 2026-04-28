const pool = require('../database.js');

const AddToCart = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const { pid } = req.body;
        if (!pid) {
            connection.release();
            return res.status(400).json({ success: false });
        }
        const sql = 'INSERT INTO cart (pid) VALUES (?)';
        await connection.query(sql, [pid]);
        connection.release();
        res.status(200).json({success: true});

        
    } catch (error) {
        connection.release();
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false });
        
    }
}
module.exports = AddToCart;