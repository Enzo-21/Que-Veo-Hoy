var database = require('../lib/conexionbd');

movies = (req, res) => {

    let query = 'SELECT * FROM pelicula'

    const year = req.query.anio;
    const title = req.query.titulo;
    const genre = req.query.genero;
    const sortBy = req.query.columna_orden;
    const page = req.query.pagina;
    const quantity = req.query.cantidad;



    //Filtro por titulo, género y/o año
    (title && genre && year) ? query += ` WHERE genero_id = ${genre} AND titulo LIKE "\%${title}\%" AND anio = ${year}` : false;

    (title && !genre && year) ? query += ` WHERE titulo LIKE "\%${title}\%" AND anio = ${year}` : false;
    (title && genre && !year) ? query += ` WHERE genero_id = ${genre} AND titulo LIKE "\%${title}\%"` : false;
    (!title && genre && year) ? query += ` WHERE genero_id = ${genre} AND anio = ${year}` : false;

    (genre && !title && !year) ? query += ` WHERE genero_id = ${genre}` : false;
    (title && !genre && !year) ? query += ` WHERE titulo LIKE "\%${title}\%"` : false;
    (year && !title && !genre) ? query += ` WHERE anio = ${year}` : false;

    //Orden
    switch (sortBy) {
        case 'titulo':
            query += ` ORDER BY titulo `
            break;
        case 'anio':
            query += ` ORDER BY anio`
            break;
        case 'puntuacion':
            query += ` ORDER BY puntuacion`
            break;
        default:
            break;
    };

    //Limit
    


    //============//

    database.connection.query(query, (err, results) => {

        let limitedQuery = query += ` LIMIT ${(page - 1) * quantity},${quantity}`;
        database.connection.query(limitedQuery, (err_, results_) => {

            let peliculas = {
                peliculas: results_,
                total: results.length,
                
            }
    
            if (err) {
                console.log('No funciona');
                console.log(err_);
    
            } else {
                res.send(peliculas)      
            }
        })
        
       
    }
    )


}

genres = (req, res) => {
    let query = 'SELECT * FROM genero;'

    database.connection.query(query, (err, results) => {

        let generos = {
            generos: results,
        }

        if (err) {
            console.log('No funciona');
            console.log(err);

        } else {
            res.send(generos)
        }
    })
}

movieInfo = (req, res) => {
    const id = req.params.id;
    let query = `SELECT * FROM pelicula JOIN genero ON genero_id = genero.id WHERE pelicula.id = ${id}`
    
    database.connection.query(query, (err, results) => {

        if (err) {
            console.log('No funciona');
            console.log(err);

        } else {
            query = `SELECT * FROM actor_pelicula JOIN actor ON actor_id = actor.id WHERE pelicula_id = ${id}`

            database.connection.query(query, (_err, _results) => {

                if (_err) {
                    console.log('No funciona');
                    console.log(_err);
        
                } else {
                    var data = {
                        pelicula: results[0],
                        actores: _results
                      };

                    res.send(data);
                    
                    
                }
            }) 
        }
    }) 
}


function movieSuggest(req, res) {
    const genero = req.query.genero;
    const anio_inicio = req.query.anio_inicio;
    const anio_fin = req.query.anio_fin;
    const puntuacion = req.query.puntuacion


    //Query por defecto
    let query = "SELECT pelicula.*, genero.nombre FROM pelicula JOIN genero ON pelicula.genero_id = genero.id";
    //Si tengo seleccionado un genero 
    (genero) ? query += ` where genero.nombre = '${genero}'` : false;
    //Si tengo seleccionado un genero y 'Estreno' o 'Clásica'
    (anio_inicio && anio_fin && genero) ? query += ` and anio BETWEEN '${anio_inicio}' and '${anio_fin}'` : false;
    //Si tengo seleccionado 'Estreno' o 'Clásica' pero sin genero en particular
    (anio_inicio && anio_fin && !genero) ? query += ` WHERE anio BETWEEN '${anio_inicio}' and '${anio_fin}'` : false;
    //Si tengo seleccionado un genero y puntuación
    (puntuacion && genero) ? query += ` and puntuacion >= ${puntuacion}` : false;
    //Si tengo seleccionado puntuación pero sin género
    (puntuacion && !genero) ? query += ` WHERE puntuacion >= ${puntuacion}` : false;

    
    console.log(query);
    

    database.connection.query(query, (err, results) => {
        if (err) {
            console.log('No funciona');
            console.log(err);
        } else {
            const data = {
                'peliculas': results
                };
            res.send(JSON.stringify(data));  
        }

         
    });
};


module.exports = {
    movies: movies,
    genres: genres,
    movieInfo: movieInfo,
    movieSuggest: movieSuggest
};
