const express=require("express");
const sqlite3=require("sqlite3");
const { open }=require("sqlite");
const path=require("path");

const app=express();
app.use(express.json());
const databasePath=path.join(__dirname,"moviesData.db");
let db=null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/movies/",async (req,res)=>{
    const q1=`select movie_name from movie;`;
    const arr1=await db.all(q1);
    res.send(arr1.map((i)=>{
        return ({
            movieName:i;
        });
    });
    );
});


app.post("/movies/",async (req,res)=>{
    const {directorId,movieName,leadActor}=req.body;
    const q2=`insert into movie(director_id,movie_name,lead_actor) values
    (${directorId},'${movieName}','${leadActor}');`;
    const res2=await db.run(q2);
    res.send('Movie Successfully Added');
});

app.get("/movies/:id",async (req,res)=>{
    const {id}=req.params;
    const q1=`select movie_name from movie where movie_id=${id};`;
    const obj2=await db.get(q1);
    res.send({
        movieId:obj2.movie_id,
        directorId:obj2.director_id,
        movieName:obj2.movie_name,
        leadActor:obj2.lead_actor
    });
});

app.put("/movies/:id",async (req,res)=>{
    const {id}=req.params;
    const {directorId,movieName,leadActor}=req.body;
    const q4=`update movie set director_id=${directorId},
    movie_name='${movieName}',
    lead_actor='${leadActor}'
    where movie_id=${id};`;
    const obj3=await db.run(q4);
    res.send('Movie Details Updated');
});

app.delete("/movies/:id",async (req,res)=>{
    const {id}=req.params;
    const q5=`delete from movie where movie_id=${id};`;
    await db.run(q5);
    res.send('Movie Removed');
});

app.get("/directors/",async (req,res)=>{
    const q6=`select * from director;`;
    const arr6=await db.all(q6);
    const arr7=arr1.map((i)=>{
        return ({
            directorId:i.director_id,
            directorName:i.director_name
        });
    });
    res.send(arr7);
});

app.get("/director/:directorId/movies/",async (req,res)=>{
    const {directorId}=req.params;
    const q8=`select movie_name from movie where director_id=${directorId}`;
    const a1=await db.all(q8);
    res.send(a1.map((i)=>{
        return({
            movieName:i.movie_name
        });
    }));
});

module.exports = app;