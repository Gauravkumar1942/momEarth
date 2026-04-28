const pool = require('../../database.js');
const submitReview = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { pid, phone, rating, review, name } = req.body;
        // const sql = 'UPDATE rating SET (pid, phone, rating, review, name) VALUES (?, ?, ?, ?, ?)';
        const sql = 'SELECT * FROM rating WHERE pid = ? AND phone = ?';
        const [rows] = await connection.execute(sql, [pid, phone]);
        if(rows.length > 0) {
           const updateSql = 'UPDATE rating SET rating = ?, review = ?, name = ? WHERE pid = ? AND phone = ?';
           const [updateResult] = await connection.execute(updateSql, [rating, review, name, pid, phone]);
           if(updateResult.affectedRows === 0) {
            return res.status(400).json({message: false,  error: 'Failed to update review' });
           }else{
            return res.status(200).json({ message: true });
           }
        }

        // I thunk here we can directly insert the
        const insertSql = 'INSERT INTO rating (pid, phone, rating, review, name) VALUES (?, ?, ?, ?, ?)';
        const [insertResult] = await connection.execute(insertSql, [pid, phone, rating, review, name]);
        if(insertResult.affectedRows === 0) {
            return res.status(400).json({message: false,  error: 'Failed to submit review' });
        } else {
            return res.status(201).json({ message: true });
        }

        // const [result] = await connection.execute(sql, [pid, phone, rating, review, name]);
        // if(result.affectedRows === 0) {
        //     return res.status(400).json({message: false,  error: 'Failed to submit review' });
        // }
        
        // else res.status(201).json({ message: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({  message: false, error: 'Internal server error' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
module.exports = submitReview;