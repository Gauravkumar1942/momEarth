const pool = require('../database.js');
const fs = require('fs');

const fetchBySearch = async (req, res) => {
    const { color, material, season, gender, product_type } = req.body.filter;

    try {
        const connection = await pool.getConnection();

        // Build base SQL query
        let sql = `SELECT * 
                   FROM productdetail WHERE 1=1`;
        const params = [];

        // Add search term filters (match in productname, brand, or product_type)
        // if (q && q.trim()) {
        //     const searchTerm = `%${q.trim()}%`;
        //     sql += ` AND (productname LIKE ? OR brand LIKE ? OR product_type LIKE ?)`;
        //     params.push(searchTerm, searchTerm, searchTerm);
        // }

        // Add attribute filters
        if (color && color.trim()) {
            sql += ` AND color LIKE ?`;
            params.push(`%${color.trim()}%`);
        }

        if (material && material.trim()) {
            sql += ` AND material LIKE ?`;
            params.push(`%${material.trim()}%`);
        }

        if (season && season.trim()) {
            sql += ` AND season LIKE ?`;
            params.push(`%${season.trim()}%`);
        }

        if (gender && gender.trim()) {
            sql += ` AND gender LIKE ?`;
            params.push(`%${gender.trim()}%`);
        }

        if (product_type && product_type.trim()) {
            sql += ` AND product_type LIKE ?`;
            params.push(`%${product_type.trim()}%`);
        }

        // // Add price range filter
        // if (priceRange && priceRange.trim()) {
        //     if (priceRange === 'under500') {
        //         sql += ` AND price < 500`;
        //     } else if (priceRange === '500-1000') {
        //         sql += ` AND price >= 500 AND price <= 1000`;
        //     } else if (priceRange === '1000-2000') {
        //         sql += ` AND price > 1000 AND price <= 2000`;
        //     } else if (priceRange === 'above2000') {
        //         sql += ` AND price > 2000`;
        //     }
        // }

        console.log('SQL Query:', sql);
        console.log('Params:', params);

        const [rows] = await connection.query(sql, params);
        connection.release();

        console.log('Results found:', rows.length);



        
    // Inserting the searched term into the logging folder for analytics

      try {
              console.log('Database update successful, attempting to log...');
              // Log the exchange request to a daily file
              const now = new Date();
              const dateString = now.toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' }).replace(/\//g, '-');
              const timeString = now.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
              
              const dataTobeLogged = {
                  timestamp: `${dateString} ${timeString}`,
                  color, material, season, gender, product_type,
                  
                  action: 'Product Searched'
              };
              
              const logDir = __dirname + '/../../logs/userSearch';
              const filename = `${dateString}.log`; // Daily file: DD-MM-YYYY.log
              const filePath = logDir + '/' + filename;
              
              console.log('Attempting to write to log file:', filePath);
              console.log('Log directory:', logDir);
              console.log(dataTobeLogged);
              
              
              // Create directory if it doesn't exist
              if (!fs.existsSync(logDir)) {
                  console.log('Directory does not exist, creating...');
                  fs.mkdirSync(logDir, { recursive: true });
                  console.log('Directory created successfully');
              }
              
              // Append to daily log file (creates if doesn't exist)
              console.log('Writing to file:', filePath);
              fs.appendFileSync(filePath, JSON.stringify(dataTobeLogged) + '\n');
              console.log('File written successfully');
                // res.json({ success: true });
            } catch (fileError) {
                console.error('Error writing to cancellation log file:', fileError);
                // res.json({ success: true, error: 'Order cancelled but failed to log cancellation', details: fileError.message });
            }

        return res.status(200).json(rows.length > 0 ? rows : { length: 0 });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            message: 'Search failed: ' + error.message
        });
    }
};

module.exports = fetchBySearch;
