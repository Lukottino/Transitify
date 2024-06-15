var  Db = require('./dbcrud');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
const res = require('express/lib/response');
var  app = express();
var  router = express.Router();

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(express.json());
app.use(cors());
app.use('/api', router);

router.use((request, response, next) => {
  console.log('Server in funzione...');
  next();
});

router.route('/account/:id').get((request, response) => {
  Db.getAccount(request.params.id).then((data) => {
    console.log(response.json(data[0]))
    response.json(data[0]);
  })
})

router.route('/stations').get((req, res) => {
  try {
    Db.getStations().then((data) => {
      res.json(data);
    }).catch(error => {
      console.error('Errore durante il recupero delle stazioni e delle linee:', error);
      res.status(500).json({ error: 'Errore durante il recupero delle stazioni e delle linee.' });
    });
  } catch (error) {
    console.error('Errore durante il recupero delle stazioni e delle linee:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle stazioni e delle linee.' });
  }
});


app.post('/api/simulate-trip', async (req, res) => {
  const { departureId, arrivalId } = req.body;
  try {
    const tripData = await Db.simulateTrip(departureId, arrivalId);
    res.json(tripData);
  } catch (error) {
    console.error('Errore durante la simulazione del viaggio:', error);
    res.status(500).json({ error: 'Errore durante la simulazione del viaggio.' });
  }
});



router.route('/login').post((req, res) => {
  let { email, password } = req.body;
  Db.postLogin(email, password, (error, result) => {
      if (error) {
          console.error('Errore durante il login:', error); // Log per il debug
          res.status(500).send({ status: 500, error: error });
      } else {
          console.log('Login riuscito, token generato:', result); // Log per il debug
          res.status(200).send({ status: 200, success: true, token: result.token, type: result.type});
      }
  });
});

router.route('/register').post((req, res) => {
  let { email, password, nome, cognome, tipo } = req.body;
  console.log('Request body:', req.body); // Log for debugging
  Db.register(email, password, nome, cognome, tipo, (error, result) => {
    if (error) {
      res.status(500).send({ status: 500, error: error });
    } else {
      res.status(200).send({ status: 200, success: true, token: result.token });
    }
  });
});

  
var  port = process.env.PORT || 3000;
app.listen(port);
console.log('Le API sono in ascolto sulla porta ' + port);