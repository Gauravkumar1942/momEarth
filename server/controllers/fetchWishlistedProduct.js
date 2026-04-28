const pool = require('../database.js');

const fetchWishlistedProduct = async (req, res) => {
    const { wishlist } = req.body || [];
    if (!Array.isArray(wishlist) || wishlist.length === 0) {
        return res.status(400).send({ message: 'empty' });
    }

    try {
        const connection = await pool.getConnection();
        const sql = `SELECT pid, brand, productname, image_url, price FROM productdetail WHERE pid IN (${wishlist.map(() => '?').join(',')})`;
        const [rows] = await connection.query(sql, wishlist);
        
        connection.release(); // Release back to pool
        if (rows.length === 0) {
            res.status(404).send({ message: 'No products found in wishlist' });
        }
        else {
            console.log('Wishlisted products fetched successfully:', rows);
        res.send(rows);
        }
    } catch (error) {
        console.error('Error fetching wishlisted products:', error);
        res.status(500).send({ message: 'Failed' });
    }
};

module.exports = fetchWishlistedProduct;