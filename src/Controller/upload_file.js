const connection = require('../Models/index')
const smsGenerator = require('./mail')
const port = 8012;
const pool = require("../Models/connectionPool")


function generateRandomDigit() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



let handleUploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const file = req.file;
        const u_id = 1;
        const rand_num_password = generateRandomDigit();

        // Insert file information into the MySQL database
        const insertSql = `INSERT INTO Upload_Files (upload_id, user_id, file_data) VALUES ("${rand_num_password}", "${u_id}", "${file}")`;
        connection.query(
            insertSql,
            async (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error inserting file information into the database.');
                }

                const fileId = rand_num_password;
                const downloadUrl = `http://localhost:${port}/download/1`;

                // Retrieve file data from the MySQL database
                const updateSql = `UPDATE Upload_Files SET downloadUrl = "${downloadUrl}" WHERE user_id = ${u_id} AND upload_id = "${rand_num_password}"`;
                connection.query(updateSql, (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error(updateErr);
                        return res.status(500).send('Error updating downloadUrl in the database.');
                    }

                    console.log("Update result =>", updateResult);
                    let re = smsGenerator('+919611123923', rand_num_password)
                    return res.status(200).json({
                        downloadUrl
                    });
                });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }

}
let FileDownload = async (req, res) => {

    try {
        const fileId = req.params.id;
        const data = req.body

        if (!data) {
            return res.status(501).json([{
                "message": "Please send the 6 Digit code"
            }]);;
        }
        const conn = await pool.getConnection()
        // Retrieve file data from the MySQL database
        let sql = `SELECT  file_data FROM Upload_Files WHERE user_id = ${fileId} and upload_id=${data.upload_id}`
        const result = await conn.query(sql);

        if (result[0].length === 0) {
            return res.status(404).send('File not found.');
        }

        const file = result[0][0];
        res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
        res.status(200).send(file.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading file from MySQL.');
    }

}
let handleGetAllFileList = (req, res) => {
    try {
        let id =1;
        console.log(JSON.stringify(id));

        //change in query to get ibook_

        let query1 = `Select downloadUrl from Upload_Files where user_id= ${id} AND downloadUrl IS NOT NULL`
        connection.query(query1, (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(501).json([{
                    "Error": err.sqlMessage
                }]);;
            }
            return res.status(201).json(results)
        });

    } catch (error) {
        return [{
            "Error": error
        }]
    }


}

let handleDeleteFile = (req, res) => {
    try {

        let data = req.body;
        console.log(data.downloadUrl)
        let query1 = `Delete from Upload_Files where user_id = 1 and downloadUrl = '${data.downloadUrl}';`
    connection.query(query1, (err, results) => {
                if (err) {
                    console.error('Error querying database:', err);
                    return res.status(501).json({
                        error: err.sqlMessage
                    });
                }

                if (results.affectedRows === 0) {
                    // No matching records found
                    return res.status(404).json({
                        message: 'No matching records found for deletion.'
                    });
                }

                // Successful deletion
                return res.status(201).json({
                    message: 'Record deleted successfully.',
                    affectedRows: results.affectedRows
                });
            })

    } catch (error) {
        return [{
            "Error": error
        }]
    }


}

module.exports = {
    handleGetAllFileList,
    handleUploadFile,
    handleDeleteFile,
    FileDownload
}