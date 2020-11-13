const express = require('express');
const mysql = require('mysql');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const app = express();
const port = 2000;
app.set('view engine','hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var koneksi = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_pembayaransppku'
});

koneksi.connect((err) =>{
    if(err) throw err;
    console.log('Koneksi Databases Berhasil Disambung')
});

//signin
app.get('/signin', (req, res) => {
    koneksi.query('SELECT * FROM user',(err, hasil) => {
        if(err) throw err;
        res.render('signin.hbs', {
            hal: 'Log In'
        });
    });
});

app.post('/signin', (req, res) =>{    
    var username = req.body.inputusername;
    var password = req.body.inputpassword;
    koneksi.query('INSERT INTO user(username,password) values (?,?)',
    [  username, password ],
    (err, hasil) =>{
        if(err) throw err;
        res.redirect('/signin');
    }
    )
})

//pembayaran
app.get('/pembayaran', (req, res) => {
    koneksi.query('SELECT * FROM pembayaran',(err, hasil) => {
        if(err) throw err;
        res.render('pembayaran.hbs', {
            Hal2: 'Pembayaran',
            data4: hasil
        });
    });
});

app.post('/pembayaran', (req, res) =>{
    var siswa = req.body.inputsiswa;
    var bulan = req.body.inputbulan;
    var jumlah = req.body.inputjumlah;
    var tanggal_transaksi = req.body.inputtanggaltransaksi;
    koneksi.query('INSERT INTO pembayaran( siswa, bulan, jumlah, tanggaltransaksi) values (?,?,?,?)',
    [  siswa, bulan, jumlah, tanggal_transaksi, ],
    (err, hasil) =>{
        if(err) throw err;
        res.redirect('/pembayaran');
    }
    )
})

app.get('/hapus/:id_pembayaran',(req, res) =>{
    var  id_pembayaran= req.params.id_pembayaran;
    koneksi.query("DELETE from pembayaran where id_pembayaran=?",
     [id_pembayaran], (err, hasil) =>{
         if(err) throw err;
         res.redirect('/pembayaran')
     }
    )
})

app.get('/signin',(req, res) =>{
    res.render( __dirname + '/views/signin.hbs')
});

app.get('/pembayaran',(req, res) =>{
    res.render( __dirname + '/views/pembayaran.hbs')
});

app.listen(port, () =>{
    console.log(`App berjalan pada port ${port}`);
});