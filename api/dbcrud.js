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

async function getStations() {
  try {
    const [rows, fields] = await pool.execute('SELECT idStazione, nome FROM stazione');
    return rows;
  } catch (error) {
    console.error('Errore durante il recupero delle stazioni:', error);
    throw error;
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

module.exports = {
  getAccount:  getAccount,
  postLogin,
  register:  register,
  getStations: getStations
}