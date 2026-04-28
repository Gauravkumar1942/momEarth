const pool  = require('../../database.js');

const fetchRecoOne = async (req, res) => {
    const { productType, gender, color} = req.body;
    try {
        const connection = await pool.getConnection();
        const sql = 'SELECT pid, brand, image_url, productname, product_type, price, gender, color, rating, count FROM productdetail WHERE  product_type = ? AND color = ?  AND gender = ? ORDER BY RAND()';
        const [rows]  = await connection.query(sql, [productType, color, gender]);
        connection.release();
        if(rows.length > 0) res.status(200).json(rows);
        if(rows.length === 0) res.status(200).json([]);
        
    } catch (error) {
        res.status(500).json({message : "Error"});
    }
}
module.exports = fetchRecoOne;