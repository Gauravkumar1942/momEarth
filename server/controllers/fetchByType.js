const pool = require('../database.js');
const client = require('../redisClient.js');

const fetchByType = async (req, res) => {
    const { productType } = req.params;
    const cachedKey = `type:${productType}`;

    // Check Redis cache first

    const cachedData = await client.get(cachedKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }




    try {
        const connection = await pool.getConnection();
        const sql = `SELECT pid, image_url, brand, productname, price, rating, count FROM productdetail WHERE product_type = ?`;
        const [rows] = await connection.query(sql, [productType]);
        connection.release();

        if (rows.length === 0) {
            return res.status(200).json({ length: 0 });
        }
      
        // Store the result in Redis cache for future requests
        await client.setEx(cachedKey, 600, JSON.stringify(rows)); // Cache for 10 minutes (600 seconds)
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = fetchByType;
