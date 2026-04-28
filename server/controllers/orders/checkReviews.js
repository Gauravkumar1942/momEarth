const pool = require('../../database.js');
const checkReview = async (req, res) => {
    let connection;
 try {
   connection = await pool.getConnection();
   const { pid, phone } = req.body;
   const [rows] = await connection.query('SELECT rating, review FROM rating WHERE pid = ? AND phone = ?', [pid, phone]);
   if (rows.length > 0) {
     return res.json({ success: true, rating: rows[0].rating, review: rows[0].review });
   }
   return res.json({ success: false, message: 'Order not found' });
 } catch (error) {
   console.error(error);
   return res.status(500).json({ success: false, message: 'Internal server error' });
 } finally {
   if (connection) connection.release();
 }
}
module.exports = checkReview;