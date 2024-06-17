const pool = require('./dbconfig');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getAverageCost(accountId) {
  try {
    const [rows]= await pool.execute(
      `SELECT AVG(prezzo) AS prezzoMedio
      FROM viaggio 
      INNER JOIN (SELECT idViaggio, idAccount FROM unique_card c
            LEFT JOIN viaggio v ON c.cardId = v.cardId) Acc ON Acc.idViaggio = viaggio.idViaggio
      WHERE Acc.idAccount = ?`, [accountId]);
    return rows;
  } catch (error) {
    console.error('Errore durante il recupero del costo medio:', error);
    throw error;
  }
}

async function getTopRoutes(accountId) {
  try {
    const [rows, fields] = await pool.execute(`
      SELECT COUNT(*) As Frequenza, CONCAT(s1.nome,' - ', s2.nome) AS percorso  FROM (
        SELECT MAX(CASE WHEN x = 'IN' THEN IdStazione ELSE 0 END) As Ingresso,
              MAX(CASE WHEN x = 'OUT' THEN IdStazione ELSE 0 END) As Uscita, IngUsc.idViaggio
        FROM (
        SELECT 'IN' As x, movimento.idViaggio, INGRESSO.idMovimento, Movimento.IdStazione
        FROM Movimento 
        INNER JOIN ( SELECT MIN(idMovimento) As idMovimento, idViaggio
            FROM movimento m1
            WHERE tipoMovimento = 'CHECKIN'
                        GROUP BY idViaggio
                        ) INGRESSO ON movimento.idMovimento = INGRESSO.idMovimento
        UNION 
        SELECT 'OUT' As x, movimento.idViaggio, INGRESSO.idMovimento, Movimento.IdStazione
        FROM Movimento 
        INNER JOIN ( SELECT MIN(idMovimento) As idMovimento, idViaggio
            FROM movimento m1
            WHERE tipoMovimento = 'CHECKOUT'
                        GROUP BY idViaggio
                        ) INGRESSO ON movimento.idMovimento = INGRESSO.idMovimento ) IngUsc
        GROUP BY IngUsc.idViaggio ) Tratte
        LEFT JOIN stazione s1 ON s1.idStazione = Tratte.Ingresso
        LEFT JOIN stazione s2 ON s2.idStazione = Tratte.Uscita
        INNER JOIN (SELECT idViaggio, idAccount FROM unique_card c
              LEFT JOIN viaggio v ON c.cardId = v.cardId) Acc ON Acc.idViaggio = Tratte.IdViaggio
        WHERE Acc.idAccount = ?
        GROUP BY s1.Nome, s2.Nome`, [accountId]);
    
    return rows;
  } catch (error) {
    console.error('Errore durante il recupero delle carte:', error);
    throw error;
  }
}

async function getClients() {
  try {
    const [rows] = await pool.execute('SELECT * FROM CLIENTE');
    return rows;
  } catch (error) {
    console.error('Errore durante il recupero dei clienti:', error);
    throw error;
  }
}

async function getAccounts() {
  try {
    const [rows] = await pool.execute('SELECT * FROM ACCOUNT');
    return rows;
  } catch (error) {
    console.error('Errore durante il recupero degli account:', error);
    throw error;
  }
}

async function deleteAccount(accountId) {
  try {
    await pool.execute('DELETE FROM ACCOUNT WHERE idAccount = ?', [accountId]);
    return { accountId };
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'account:', error);
    throw error;
  }
}

async function createClient(client) {
  try {
    const { nome, cognome, email } = client;
    const [result] = await pool.execute('INSERT INTO CLIENTE (nome, cognome, email) VALUES (?, ?, ?)', [nome, cognome, email]);
    return { clienteId: result.insertId, nome, cognome, email };
  } catch (error) {
    console.error('Errore durante la creazione del cliente:', error);
    throw error;
  }
}

async function updateClient(clienteId, client) {
  try {
    const { nome, cognome, email } = client;
    await pool.execute('UPDATE CLIENTE SET nome = ?, cognome = ?, email = ? WHERE clienteId = ?', [nome, cognome, email, clienteId]);
    return { clienteId, nome, cognome, email };
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del cliente:', error);
    throw error;
  }
}

async function deleteClient(clienteId) {
  try {
    await pool.execute('DELETE FROM CLIENTE WHERE idCliente = ?', [clienteId]);
    return { clienteId };
  } catch (error) {
    console.error('Errore durante l\'eliminazione del cliente:', error);
    throw error;
  }
}

async function getClient(idClient) {
  try {
    const [rows, fields] = await pool.execute('SELECT * FROM cliente WHERE idCliente = ?', [idClient]);
    return rows;
  } catch (error) {
    console.error('Errore durante il recupero dell\'account:', error);
    throw error;
  }
}

async function getAccount(idAccount) {
  try {
    const [rows, fields] = await pool.execute('SELECT * FROM account WHERE idAccount = ?', [idAccount]);
    return rows;
  } catch (error) {
    console.error('Errore durante il recupero dell\'account:', error);
    throw error;
  }
}

async function getStations() {
  try {
    const [stations] = await pool.execute('SELECT idStazione, nome, tipo, idZona FROM stazione');
    const [lineStationsResult] = await pool.execute('SELECT idLinea, idStazione, ordine FROM linea_stazione ORDER BY idLinea, ordine;');
    const [lines] = await pool.execute('SELECT idLinea, nome FROM linea');

    const lineMap = {};
    lineStationsResult.forEach(ls => {
      if (!lineMap[ls.idLinea]) {
        lineMap[ls.idLinea] = {
          idLinea: ls.idLinea,
          stations: [],
          ordine: []
        };
      }
      lineMap[ls.idLinea].stations.push(ls.idStazione);
      lineMap[ls.idLinea].ordine.push(ls.ordine);
    });

    const lineStations = Object.values(lineMap);

    return { stations, lines, lineStations };
  } catch (error) {
    console.error('Errore durante il recupero delle stazioni e delle linee:', error);
    throw error;
  }
}

async function simulateTrip(departureId, arrivalId, cardId) {
  let connection;
  try {
    const { stations, lines, lineStations } = await getStations();
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const departureStation = stations.find(station => station.idStazione === departureId);
    const arrivalStation = stations.find(station => station.idStazione === arrivalId);

    if (!departureStation || !arrivalStation) {
      throw new Error('Stazione di partenza o di arrivo non trovata');
    }

    const directRoute = findDirectRoute(departureId, arrivalId, lineStations);
    
    if (directRoute) {
      const zones = calculateZones([departureStation, arrivalStation], "direct");
      const cost = calculateCost(zones);

      // Insert CHECKIN movement
      await insertMovement(connection, cardId, departureId, 'CHECKIN');

      const cardUpdated = await updateCardBalance(cardId, cost);

      // Insert CHECKOUT movement
      await insertMovement(connection, cardId, arrivalId, 'CHECKOUT');

      // Insert trip record
      const tripData = {
        cardId,
        dataInizio: new Date(),
        dataFine: new Date(),
        prezzo: cost,
        stato: 'completato'
      };
      const [insertTripResult] = await connection.execute('INSERT INTO VIAGGIO (cardId, dataInizio, dataFine, prezzo, stato) VALUES (?, ?, ?, ?, ?)', [tripData.cardId, tripData.dataInizio, tripData.dataFine, tripData.prezzo, tripData.stato]);
      const viaggioId = insertTripResult.insertId;

      // Update movimento with viaggioId
      await updateMovementWithViaggioId(connection, viaggioId, departureId, 'CHECKIN');
      await updateMovementWithViaggioId(connection, viaggioId, arrivalId, 'CHECKOUT');

      await connection.commit();

      return { route: 'direct', line: directRoute.line, stations: [departureStation, arrivalStation], zones, cost, cardUpdated, viaggioId };
    }

    // Handle transfer routes
    const transferRoutes = findTransferRoutes(departureId, arrivalId, stations, lines, lineStations);

    if (transferRoutes.length > 0) {
      const allStations = transferRoutes.flatMap(route => route.segments.flatMap(segment => [segment.fromStation, segment.toStation])).filter(station => station);
      const zones = calculateZones(allStations, "transfer");
      const cost = calculateCost(zones);

      // Insert CHECKIN movement
      await insertMovement(connection, cardId, departureId, 'CHECKIN');

      const cardUpdated = await updateCardBalance(cardId, cost);

      // Insert transfer movement for each transfer station
      for (const route of transferRoutes) {
        console.log("idStazione: ", route.transferStation.idStazione)
        await insertMovement(connection, cardId, route.transferStation.idStazione, 'CHECKIN');
      }

      // Insert CHECKOUT movement
      await insertMovement(connection, cardId, arrivalId, 'CHECKOUT');

      // Insert trip record
      const tripData = {
        cardId,
        dataInizio: new Date(),
        dataFine: new Date(),
        prezzo: cost,
        stato: 'completato'
      };
      const [insertTripResult] = await connection.execute('INSERT INTO VIAGGIO (cardId, dataInizio, dataFine, prezzo, stato) VALUES (?, ?, ?, ?, ?)', [tripData.cardId, tripData.dataInizio, tripData.dataFine, tripData.prezzo, tripData.stato]);
      const viaggioId = insertTripResult.insertId;
      console.log(insertTripResult.insertId)

      // Update movimento with viaggioId for CHECKIN, CHECKOUT
      await updateMovementWithViaggioId(connection, viaggioId, departureId, 'CHECKIN');
      await updateMovementWithViaggioId(connection, viaggioId, arrivalId, 'CHECKOUT');
      for (const route of transferRoutes) {
        await updateMovementWithViaggioId(connection, viaggioId, route.transferStation.idStazione, 'CHECKIN');
      }

      await connection.commit();

      return { route: 'transfer', transferRoutes, zones, cost, cardUpdated, viaggioId };
    }

    throw new Error('Nessun percorso trovato');
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Errore durante la simulazione del viaggio:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function insertMovement(connection, cardId, stationId, tipoMovimento) {
  const movimentoData = {
    idViaggio: null, // Initially set to null, will be updated after creating the trip
    dataOra: new Date(),
    tipoMovimento,
    idStazione: stationId
  };
  const sql = 'INSERT INTO MOVIMENTO (idViaggio, dataOra, tipoMovimento, idStazione) VALUES (?, ?, ?, ?)';
  const values = [movimentoData.idViaggio, movimentoData.dataOra, movimentoData.tipoMovimento, movimentoData.idStazione];

  await connection.execute(sql, values);
}

async function updateMovementWithViaggioId(connection, viaggioId, stationId, tipoMovimento) {
  const [updateResult] = await connection.execute('UPDATE MOVIMENTO SET idViaggio = ? WHERE idStazione = ? AND tipoMovimento = ? AND idViaggio IS NULL', [viaggioId, stationId, tipoMovimento]);
  return updateResult.affectedRows > 0;
}

function calculateZones(stations, type) {
  const zones = new Set();
  stations.filter(station => station !== undefined).forEach(station => zones.add(station.idZona));
  if(type == "direct"){
    return zones.size;
  }else if (type == "transfer") {
    return zones.size + 1;
  }
}

function calculateCost(zones) {
  const costPerZone = 1.50; // Ad esempio, 1.50 euro per zona
  return zones * costPerZone;
}

async function updateCardBalance(cardId, cost) {
  try {
    console.log("carta passata: ", cardId)
    const [rows] = await pool.execute('SELECT saldo FROM card WHERE cardId = ?', [cardId]);
    if (rows.length === 0) {
      throw new Error('Carta non trovata');
    }

    const currentBalance = rows[0].saldo;
    if (currentBalance < cost) {
      throw new Error('Saldo insufficiente');
    }

    const newBalance = currentBalance - cost;
    await pool.execute('UPDATE card SET saldo = ? WHERE cardId = ?', [newBalance, cardId]);

    return { cardId, oldBalance: currentBalance, newBalance };
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del saldo della carta:', error);
    throw error;
  }
}

function findDirectRoute(departureId, arrivalId, lineStations) {
  return lineStations.find(ls => {
    const departureIndex = ls.stations.indexOf(departureId);
    const arrivalIndex = ls.stations.indexOf(arrivalId);
    return departureIndex !== -1 && arrivalIndex !== -1 && departureIndex < arrivalIndex;
  });
}

function findTransferRoutes(departureId, arrivalId, stations, lines, lineStations) {
  const transferRoutes = [];

  // Trova le linee che partono dalla stazione di partenza
  for (const ls1 of lineStations) {
    const departureIndex = ls1.stations.indexOf(departureId);

    if (departureIndex !== -1) {
      // Verifica l'ordine della stazione di partenza nella linea ls1
      const departureOrder = ls1.ordine[departureIndex];

      // Itera sulle stazioni associate alla linea ls1
      for (let i = 0; i < ls1.stations.length; i++) {
        const stationId = ls1.stations[i];
        const stationOrder = ls1.ordine[i];

        // Verifica che la stazione non sia la stessa della partenza e che sia dopo nella linea
        if (stationId !== departureId && stationOrder > departureOrder) {
          // Cerca la stazione di trasferimento
          const transferStation = stations.find(station => station.idStazione === stationId);

          if (transferStation) {
            // Trova un percorso diretto dalla stazione di trasferimento all'arrivo
            const ls2 = findDirectRoute(stationId, arrivalId, lineStations);

            if (ls2) {
              const departureLine = lines.find(line => line.idLinea === ls1.idLinea);
              const transferLine = lines.find(line => line.idLinea === ls2.idLinea);
              const arrivalStation = stations.find(station => station.idStazione === arrivalId);
              console.log(transferLine)

              if (arrivalStation) {
                transferRoutes.push({
                  transferStation,
                  segments: [
                    { fromLine: departureLine, toLine: transferLine },
                    { fromStation: transferStation, toStation: arrivalStation }
                  ]
                });
              }
            }
          }
        }
      }
    }
  }

  return transferRoutes;
}

async function register(email, password, nome, cognome, tipo, callback = () => {}) {
  try {
    console.log('Received parameters:', { email, password, nome, cognome, tipo });

    if (!email || !password || !nome || !cognome || !tipo) {
      return callback('All fields are required');
    }

    let newPassword = await bcrypt.hash(password, 10);

    const [existingUserRows] = await pool.execute("SELECT * FROM account WHERE email = ?", [email]);

    if (existingUserRows.length > 0) {
      return callback('USER ALREADY REGISTERED');
    }

    let query = `INSERT INTO account (email, password, nome, cognome, tipo)
                 VALUES (?, ?, ?, ?, ?)`;

    await pool.execute(query, [email, newPassword, nome, cognome, tipo]);

    const [newUserRows] = await pool.execute("SELECT * FROM account WHERE email = ?", [email]);
    const newUser = newUserRows[0];

    const token = jwt.sign(
      {
        user_id: newUser.id,
        email: email
      },
      "tuttecose", // Replace with your secret
      {
        expiresIn: "60 days"
      }
    );

    return callback(null, { token, type: tipo });
  } catch (err) {
    console.error(err);
    return callback(err);
  }
}

async function getUniqueCards(accountId) {
  try {
    console.log(accountId)
    const [rows, fields] = await pool.execute('SELECT * FROM card JOIN unique_card ON card.cardId = unique_card.cardId WHERE idAccount = ?', [accountId]);
    return rows;
  } catch (error) {
    console.error('Errore durante il recupero delle carte:', error);
    throw error;
  }
}

async function postLogin(email, password, callback) {
  try {
    console.log('Email e password ricevuti:', email, password);
    
    const [rows, fields] = await pool.execute("SELECT * FROM account WHERE email = ?", [email]);
    console.log('Risultato della query:', rows);

    if (rows.length === 0) {
      console.log('Utente non trovato');
      return callback('UTENTE NON TROVATO');
    } else {
      const user = rows[0];
      console.log('Password hash nel database:', user.password);
      
      if (await bcrypt.compare(password, user.password)) {
        console.log('Login valido');

        const token = jwt.sign(
          {
            user_id: user.idAccount,
            email: email,
            type: user.tipo
          },
          "tuttecose", // Sostituisci con il tuo secret
          {
            expiresIn: "60 days"
          }
        );
        const type = user.tipo;
        const idAccount = user.idAccount;
        console.log(idAccount)

        const result = {
          token: token,
          type: type,
          accountId: idAccount
        };
        return callback(null, result);
      } else {
        console.log('Password non corrispondente');
        return callback('BAD LOGIN');
      }
    }
  } catch (err) {
    console.error('Errore durante il login:', err);
    return callback(err);
  }
}

module.exports = {
  getAccount,
  postLogin,
  register,
  getStations,
  simulateTrip,
  getClients,
  createClient,
  deleteClient,
  updateClient,
  getClient,
  getAccounts,
  getUniqueCards,
  deleteAccount,
  getTopRoutes,
  getAverageCost
};
