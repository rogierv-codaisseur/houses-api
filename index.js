const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:secret@localhost:5432/postgres';
const sequelize = new Sequelize(connectionString, {
  define: { timestamps: false }
});
const port = 4000;
app.listen(process.env.PORT || port, () => `Listening on port ${port}`);

const House = sequelize.define(
  'house',
  {
    title: Sequelize.STRING,
    address: Sequelize.TEXT,
    size: Sequelize.INTEGER,
    price: Sequelize.INTEGER
  },
  {
    tableName: 'houses'
  }
);

House.sync();

app.get('/houses', (req, res, next) => {
  House.findAll()
    .then(houses => {
      res.json({ houses });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      });
    });
});

app.get('/houses/:id', (req, res, next) => {
  const id = req.params.id;
  House.findByPk(id)
    .then(house => res.json({ house }))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      });
    });
});

app.post('/houses/', (req, res) => {
  House.create({
    title: 'Multi Million Estate',
    address: 'This was build by a super duper rich programmer',
    size: 1235,
    price: 98400000
  })
    .then(house => res.status(201).json(house))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      });
    });
});

app.put('/houses/:id', (req, res) => {
  const id = req.params.id;
  House.findByPk(id)
    .then(house =>
      house.update({
        address: 'Super Duper Million Dollas Mainson'
      })
    )
    .then(house => res.status(200).send({ house }))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      });
    });
});

app.delete('/houses/:id', (req, res) => {
  const id = req.params.id;
  House.findByPk(id)
    .then(house => house.destroy())
    .then(res.status(200).send('Deletion is done'))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      });
    });
});
