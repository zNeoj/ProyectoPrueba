const express = require('express');
const router = express.Router();
const sqlQuery = require('../DBQueries/sqlgomitas.js')

router.route("/")
.get(async (req, res) => {
    res.json(await sqlQuery.mostrarTodo());
});

router.route("/:id")
.get(async (req, res) => {
    res.json(await sqlQuery.mostrarPorID(req.params.id));
})
.patch(async (req, res) => {
    res.json(await sqlQuery.reemplazarPorId(req.params.id, req.body));
});


module.exports = router;