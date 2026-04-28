const pool = require('../../database.js');

const fetchOrders = async (req, res) => {
  let conn; // declare outside
  try {
    const { phone } = req.body;
    // const phone =  7091861823;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    conn = await pool.getConnection(); // only defined if this succeeds
    const sql = 'SELECT * FROM orders WHERE phone = ? AND orderStatus = "on"';
    const [rows] = await conn.query(sql, [phone]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } finally {
    if (conn) {
      try {
        conn.release(); // only release if connection exists
      } catch (err) {
        console.error('Error releasing connection:', err);
      }
    }
  }
};

module.exports = fetchOrders;
