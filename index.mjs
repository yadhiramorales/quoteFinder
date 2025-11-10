import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "g3v9lgqa8h5nq05o.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xsamb4a7jonbmvtd",
    password: "nf8x0zyfm6ihvw4t",
    database: "cv737hisic540y84",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {

   let sql = `SELECT authorId, firstName, lastName
               FROM authors`;

    const [authorRows] = await pool.query(sql);
    console.log(authorRows);
   res.render('home.ejs', {authorRows});
});

app.get('/searchByKeyword', async (req, res) => {
    console.log(req);
    let keyword = req.query.keyword; //server gets input from browser
    // let sql = `SELECT firstName, lastName, quote
    //            FROM authors
    //            NATURAL JOIN quotes
    //            WHERE quote LIKE '%${keyword}%'`;    //should not have direct input as 
    //                                                //part of the query because we cannot 
    // 
    let sql = `SELECT authorId, firstName, lastName, quote
               FROM authors
               NATURAL JOIN quotes
               WHERE quote LIKE ?`;    
    let sqlParams = [`%${keyword}%`];   //adding this step means that the above is compiled, 
                                        // and then none of what you typed as input can be 
                                        // interpreted as code after.
    const [rows] = await pool.query(sql, sqlParams);
    console.log(rows);
   res.render('results.ejs', {rows}) //passing query results to ejs file
});

//local API to get all info for a specific author
app.get('/api/authors/:authorId', async (req, res) => { //colon distinguishes a route parameter
    let authorId = req.params.authorId; //route param must match here
    let sql =   `SELECT *
                FROM authors
                WHERE authorId = ?`;
    const [rows] = await pool.query(sql, [authorId]);
   res.send(rows);
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})