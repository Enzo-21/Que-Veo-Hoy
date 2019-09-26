CREATE DATABASE `queveohoy`;

USE queveohoy;

CREATE TABLE `pelicula` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100),
  `duracion` int(5),
  `director` varchar(400),
  `anio` int(5),
  `fecha_lanzamiento` date,
  `puntuacion` int(2),
  `poster` varchar(300),
  `trama` varchar(700),

  PRIMARY KEY (`id`)
); 

CREATE TABLE `genero` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30),

  PRIMARY KEY (`id`)
)

ALTER TABLE `pelicula` ADD genero_id INT;
ALTER TABLE `pelicula` ADD FOREIGN KEY(genero_id) references genero(id);

CREATE TABLE `actor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70),

  PRIMARY KEY (`id`)
)

CREATE TABLE `actor_pelicula`(
  `id` int NOT NULL auto_increment,
  actor_id int NOT NULL,
  pelicula_id int NOT NULL,
  PRIMARY KEY (id),  
  FOREIGN KEY (actor_id) REFERENCES actor(id),
  FOREIGN KEY (pelicula_id) REFERENCES pelicula(id)
);