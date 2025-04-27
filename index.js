import express from "express"
import pkg from "pg"
import ejs from "ejs"
const app = express()

app.set('view engine', 'ejs')

const {Pool} = pkg

const pool = new Pool({
    user : 'postgres',
    host :'localhost',
    database : "hostingTest",
    password : 'Zohrajan10@',
    port : 5432
})


const q = 'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, email TEXT NOT NULL);'
pool.query(q).then((result)=>{
    console.log('table created')
}).catch((err)=>{console.log(err)})

app.get('/',async(req,res)=>{
    try{
        // await pool.query('SELECT 1')
        // res.send('database connected !')
        // const inserq = 'INSERT INTO  users(username, email) VALUES($1, $2) RETURNING *'
        // const newUser = await pool.query(inserq, ["ali", "abedkhan.noori10@gmail.com"]);
        
        // if(newUser){
        //     console.log('data inserted success ' + JSON.stringify(newUser.rows))
         const result = await pool.query('SELECT * FROM users ORDER BY id')
         const users = result.rows
            res.render('index', {users: users})   

        // }

        
    }catch(err){
        res.send("database error : " + err)
    }
})



app.post('/delete/:id', async(req,res)=>{
    const id = Number(req.params.id)
      
   try{
    const user = await pool.query('SELECT * FROM users where id  = $1', [id])

    if(user){
        await pool.query('DELETE FROM users where id = $1 RETURNING *', [id])
        console.log('user deleted success')
        res.redirect('/')
    }
   }catch(err){
      res.send(err)
   }
})



app.listen(3000, ()=>{
    console.log('hosted in 3000')
})