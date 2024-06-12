var  config = require('./dbconfig');
const  sql = require('mysql2');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require('./dbconfig'); // Assicurati di avere il percorso corretto al file di configurazione

async function getAccount(idAccount) {
  try {
    const [rows, fields] = await pool.execute('SELECT * FROM account WHERE idAccount = ?', [idAccount]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;  // Propaga l'errore per la gestione nel livello superiore
  }
}

async  function  getElencoClienti() {
  try {
    let  pool = await  sql.connect(config);
    let  elencoFilm = await  pool.request().query("SELECT * from CLIENTE");
    return  elencoFilm.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async  function  getProdotti() {
  try {
    let  pool = await  sql.connect(config);
    let  elencoProdotti = await  pool.request().query("SELECT * from CONSUMAZIONE");
    return  elencoProdotti.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function postListino(...abilitazioni){
  try{
    let pool=await sql.connect(config);
    let res = await pool.request()
    .input('val1', sql.Int, abilitazioni[0])
    .input('val2', sql.Int,abilitazioni[1])
    .input('val3', sql.Int,abilitazioni[2])
    .query("SELECT * FROM (LISTINO JOIN CONSUMAZIONE ON nomeConsumazione = nome) JOIN MENU on codiceMenu = codice WHERE codiceSede=@val1 OR codiceSede=@val2 OR codiceSede=val3")
  }
  catch(error){
    console.log(error);
  }
}


/*
async  function  getAccount(idAccount) {
  try {
    let  pool = await  sql.connect(config);
    let  account = await  pool.request()
    .input('input_parameter', sql.Int, idAccount)
    .query("SELECT * FROM account WHERE idAccount = @input_parameter");
    return  account.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}
*/

async  function  getClasse(ClasseCliente) {
  try {
    let  pool = await  sql.connect(config);
    let  cliente = await  pool.request()
    .input('input_parameter', sql.Int, ClasseCliente)
    .query("SELECT * from CLIENTE where CLASSE = @input_parameter");
    return  cliente.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

async function register(email, password, nome, cognome, tipo, callback = () => {}) {
  try {
    // Log dei parametri ricevuti
    console.log('Received parameters:', { email, password, nome, cognome, tipo });

    // Verifica che tutti i campi obbligatori siano presenti
    if (!email || !password || !nome || !cognome || !tipo) {
      return callback('All fields are required');
    }

    let newPassword = await bcrypt.hash(password, 10);

    // Verifica se l'utente esiste già
    const [existingUserRows] = await pool.execute("SELECT * FROM account WHERE email = ?", [email]);

    if (existingUserRows.length > 0) {
      return callback('USER ALREADY REGISTERED');
    }

    // Query per inserire il nuovo utente
    let query = `INSERT INTO account (email, password, nome, cognome, tipo)
                 VALUES (?, ?, ?, ?, ?)`;

    await pool.execute(query, [email, newPassword, nome, cognome, tipo]);

    return callback(null, newPassword);
  } catch (err) {
    console.error(err);
    return callback(err);
  }
}

async function postLogin(email, password, callback) {
  try {
      console.log('Email e password ricevuti:', email, password); // Log per il debug
      
      const [rows, fields] = await pool.execute("SELECT * FROM account WHERE email = ?", [email]);
      console.log('Risultato della query:', rows); // Log per il debug

      if (rows.length === 0) {
          console.log('Utente non trovato'); // Log per il debug
          return callback('UTENTE NON TROVATO');
      } else {
          const user = rows[0];
          console.log('Password hash nel database:', user.password); // Log per il debug
          
          if (await bcrypt.compare(password, user.password)) {
              console.log('Login valido'); // Log per il debug

              const token = jwt.sign(
                  {
                      user_id: user.id,
                      email: email
                  },
                  "tuttecose",
                  {
                      expiresIn: "60 days"
                  }
              );
              return callback(null, token);
          } else {
              console.log('Password non corrispondente'); // Log per il debug
              return callback('BAD LOGIN');
          }
      }
  } catch (err) {
      console.error('Errore durante il login:', err); // Log per il debug
      return callback(err);
  }
}
  

async function aggiungiFilm(film){
  try{
    let pool = await sql.connect(config);
    let nuovoFilm = await pool.request()
    .input('Titolo', sql.NVarChar, nuovoFilm.Titolo)
    .input('Anno', sql.NVarChar, nuovoFilm.Anno)
    .input('Regista', sql.NVarChar, nuovoFilm.Regista)
    .query('INSERT INTO Film (Titolo, Anno, Regista) VALUES (@Titolo, @Anno, @Regista)');
    return nuovoFilm.recordsets
  }
  catch (err)
  {
    console.log(err);
  }
}

module.exports = {
  getAccount:  getAccount,
  postLogin,
  register:  register
}