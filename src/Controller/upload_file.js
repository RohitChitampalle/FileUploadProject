const connection = require('../models/index');
const executeQueries = require('../models/mysqlPool');

//changes in book list api
let handleGetAllBookList = (req, res) => {
    try {
        let query = 'select * from Book_Store;'
        connection.query(query, (err, results) => {
            if (err) {

                return res.status(501).json([{
                    "Error": err.sqlMessage
                }]);
            }
            return res.status(201).json(results)
        });

    } catch (error) {
        // console.log()
        return res.status(501).json([{
            "Error Name": error.name,
            "Error Message": error.message
        }])
    }

}



let handleSetBooks = async (req, res) => {
    try {

        let data = await executeQueries(req, res)

        return res.status(201).json([{
            "status": data
        }])

    } catch (error) {
        return [{
            "Error": error
        }]
    }

}

let handleGetBooksById = (req, res) => {
    try {
        let id = Number(req.params.id);
        //change in query to get ibook_d
        let query1 = `Select book_name,book_id from add_books where user_id= ${id}`
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

let handleDeleteBookById = (req, res) => {
    try {

        let data = req.body;
        let query1 = `Delete from add_books where user_id = ${data.user_id} and book_id = ${data.book_id}`
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

module.exports = {
    handleGetAllBookList,
    handleGetBooksById,
    handleSetBooks,
    handleDeleteBookById
}