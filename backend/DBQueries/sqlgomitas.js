const db = require('../config/database.js');

const queries = {
    mostrarTodo: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM your_table;', (error, resultado) => {
                if (error) reject(error);
                resolve(resultado);
            });
        });
    },

    mostrarPorID: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM your_table WHERE id=?', [id], (error, resultado) => {
                if (error) reject(error);
                resolve(resultado);
            });
            
        });
    },

    reemplazarPorId: (id, args) => {
        return new Promise((resolve, reject) => 
        {
            db.query('SELECT * FROM your_table WHERE id=?', [id], (error, resultado) => 
            {
                if (error) reject (error);
                
                if (!resultado || resultado.length == 0)
                {
                    resolve ({ message: `Couldn't find any registry with ID ${id}`});
                    return;
                }

                db.query('UPDATE your_table SET name=?, description=? WHERE id=?', [args.name, args.description, id], 
                    (error, resultadoQuery) => 
                    {
                        if (error) reject (error);
                        resolve ({ mensaje: "Parece que todo fue bien...", resultadoQuery });
                    });
            });
        });
    }
};

module.exports = queries;