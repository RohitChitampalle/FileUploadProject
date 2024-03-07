const connection = require('../Models/index')
const jwt = require('jsonwebtoken');

let handleGetAllUsers = (req, res) => {
    try {
        let query = 'SELECT * FROM User'
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(501).json([{
                    "Error": err.sqlMessage
                }]);;
            }
            //    console.log('Query results:', results);
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


let handleGetUserById = (req, res) => {
    try {
        let id = req.query.id;
        let query = `SELECT * FROM User WHERE PersonID = ${id}`
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(501).json([{
                    "Error": err.sqlMessage
                }]);;
            }
            //    console.log('Query results:', results);
            return res.status(201).json(results)
        });

    } catch (error) {
        return [{
            "Error": error
        }]
    }


}
let UserRegister = (req, res) => {
    try {
        let data = req.body;

     
   if (data.first_name === "", data.last_name === "", data.email === "", data.password === "") {
     const error = new Error('One or more required fields are missing');
     error.status = 400;
     return res.status(400).json({
         "Error": "One or more required fields are missing"
   });

   }else{

       //change is column name closed/08-02-2024.
    
       let query = ` INSERT INTO User (first_name, last_name,email,password) 
       VALUES("${data.first_name}", "${data.last_name}", "${data.email}", "${data.password}")
       `
       connection.query(query, (err, results) => {
           if (err) {
               console.error('Error querying database:', err);
               return res.status(501).json([{
                   "Error": err.sqlMessage
               }]);
           }
           //    console.log('Query results:', results);
           return res.status(201).json({
               "status": "data inserted successFul",
               "id": results.lastIndexOf
           })
       });
   }



    } catch (error) {
        return [{
            "Error": error
        }]
    }
}

let userLogin = (req, res) => {
    try {

        let username = req.query.username
        let password = req.query.password
        let query = ` SELECT user_id,first_name,last_name FROM User where email ="${username}" and password ="${password}";`
        connection.query(query, (err, results) => {
            if (err) {
                return res.status(501).json([{
                    "Error": err.sqlMessage,
                    message: 'Login failed'
                }]);;
            }



            if (results.length === 0) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            const user = results[0];
            const token = jwt.sign({
                id: user.id,
                username: user.username
            }, process.env.JWT_SECRET_KEY);

            res.json({
                "token": token,
                "id": user.user_id
            })
        });


    } catch (error) {
        return [{
            "Error": error
        }]
    }
}

// let handleUserDeleteById = (req, res) => {
//     try {

//         let id = Number(req.params.id)
//         let query = ` DELETE FROM Persons WHERE PersonID = ${id}`
//         connection.query(query, (err, results) => {
//             if (err) {
//                 console.error('Error querying database:', err);
//                 return res.status(501).json([{
//                     "Error": err.sqlMessage
//                 }]);;
//             }
//             //    console.log('Query results:', results);
//             return res.status(201).json({
//                 "status": "data deleted successFul",
//                 "Affected_Row": results.affectedRows
//             })
//         });


//     } catch (error) {
//         return [{
//             "Error": error
//         }]
//     }


// }



module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    // handleUserDeleteById,
    UserRegister,
    userLogin
}