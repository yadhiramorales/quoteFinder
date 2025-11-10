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
              FROM authors
              ORDER BY lastName`;

    const sqlCategories = `SELECT DISTINCT category AS categoryName
                            FROM quotes
                            WHERE category IS NOT NULL AND category <> ''
                            ORDER BY categoryName`;

    const [categories] = await pool.query(sqlCategories);

   const [rows] = await pool.query(sql);  
   console.log(rows);        
   res.render('home.ejs', {rows, categories})
});

app.get('/searchByAuthor', async (req, res) => {
   let authorId = req.query.authorId;
    const sql = `SELECT a.authorId, a.firstName, a.lastName, q.quote, q.category
                    FROM quotes q
                    JOIN authors a ON a.authorId = q.authorId
                    WHERE a.authorId = ?
                    ORDER BY q.quoteId`;
    const [rows] = await pool.query(sql, [authorId]);

    res.render('results.ejs', {rows});
});

app.get('/searchByKeyword', async(req, res) => {
   let keyword = req.query.keyword;
   let sql = `SELECT authorId, firstName, lastName, quote
              FROM authors
              NATURAL JOIN quotes
              WHERE quote LIKE ?`;

    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    console.log(rows);
   res.render('results.ejs', {rows})
});

app.get('/searchByCategory', async(req, res) => {
    let category = req.query.category;
    const sql = `SELECT a.authorId, a.firstName, a.lastName, q.quote
                    FROM quotes q
                    JOIN authors a ON a.authorId = q.authorId
                    WHERE TRIM(q.category) = ?
                    ORDER BY a.lastName, a.firstName`;

    const [rows] = await pool.query(sql, [category]);
    console.log(rows);
    res.render('results.ejs', {rows})
});

app.get('/searchByLikes', async (req, res) => {
  let min = parseInt(req.query.min) || 0;
  let max = parseInt(req.query.max) || 999999;

  if (min > max){
    [min, max] = [max, min];
  }

  const sql = `
    SELECT a.authorId, a.firstName, a.lastName, q.quote, q.category, q.likes
    FROM quotes q
    JOIN authors a ON a.authorId = q.authorId
    WHERE q.likes BETWEEN ? AND ?
    ORDER BY q.likes DESC
  `;

  const [rows] = await pool.query(sql, [min, max]);
  res.render('results.ejs', { rows });
});



//local API to get all info for a specific author
app.get('/api/authors/:authorId', async(req, res) => {
   let authorId = req.params.authorId;
   let sql = `SELECT *
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