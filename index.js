const express = require('express');
const bodyparser = require('body-parser');
var app = express();
var mysql = require('mysql');
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, UPDATE, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});//Configuring express server
app.use(bodyparser.json());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cricket_league",
});

con.connect(function(err) {
    if (err) throw err;
    app.get('/country',(req, res)=>{
        con.query("SELECT * FROM country", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.parse(JSON.stringify(result)))
          }); 
    })

    app.get('/venue',(req, res)=>{
        con.query("SELECT venue.id, venue.date_added, venue.ground_name, country.country_name FROM venue inner join country on venue.country_id = country.id", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.parse(JSON.stringify(result)))
          }); 
    })

    app.get('/players/country/:id', (req, res)=>{
        con.query(`Select player.id, player.name, player.dob, role.description, player_style.style FROM player inner join role on player.role_id = role.id inner join player_style on player.style_id = player_style.id where country_id = ${parseInt(req.params.id)}`, function (err, result, fields){
            if (err) throw err;
            var players= JSON.parse(JSON.stringify(result));
            res.send(players)
        })
    })

    app.get('/match',(req, res)=>{
        con.query("SELECT * FROM matches  inner join venue on matches.venue_id = venue.id inner join win_by on matches.win_by_id = win_by.id inner join toss_decision on matches.toss_decide_id = toss_decision.id", function (err, result, fields) {
            if (err) throw err;
            res.send(JSON.parse(JSON.stringify(result)))
          }); 
    })


    app.get('/players/match/:id', (req, res)=>{
        con.query(`SELECT * from player_match inner join player on player_match.player_id = player.id inner join country on player_match.country_id = country.id where match_id = ${parseInt(req.params.id)}`, function (err, result, fields){
            if (err) throw err;
            var players= JSON.parse(JSON.stringify(result));
            res.send(players)
            console.log(players);
        })
    })

    app.get('/player/:id', (req, res)=>{
        con.query(`SELECT * from player where id = ${parseInt(req.params.id)}`, function (err, result, fields){
            if (err) throw err;
            var player= JSON.parse(JSON.stringify(result));
            res.send(player)
            console.log(player);
        })
    })

    app.get('/role/:id', (req, res)=>{
        con.query(`SELECT * from role where id = ${parseInt(req.params.id)}`, function (err, result, fields){
            if (err) throw err;
            var role= JSON.parse(JSON.stringify(result));
            res.send(role)
            console.log(role);
        })
    })

    app.get('/style/:id', (req, res)=>{
        con.query(`SELECT * from player_style where id = ${parseInt(req.params.id)}`, function (err, result, fields){
            if (err) throw err;
            var style= JSON.parse(JSON.stringify(result));
            res.send(style)
            console.log(style);
        })
    });

    app.get('/points-table',(req, res)=>{
        con.query("SELECT m.id,m.country_name, (SELECT COUNT(*) FROM matches WHERE country1_id = m.id OR country2_id = m.id) matches_played, (SELECT COUNT(*) FROM matches WHERE winner_team_id = m.id ) matches_won FROM country m;", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.send(JSON.parse(JSON.stringify(result)))
          }); 
    })
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}..`));