document.addEventListener('DOMContentLoaded', function () {
    const contenido = document.getElementById('contenido');
    const versiculoContainer = document.getElementById('versiculo');
    const botonesMusica = document.getElementById('botones-musica');
    const botonGaleria = document.getElementById('boton-galeria');

    contenido.classList.add('fadeIn');
    cargarVersiculos();
    generarNuevoVersiculo();

    document.getElementById('generar-versiculo').addEventListener('click', generarNuevoVersiculo);

    botonesMusica.addEventListener('click', function (event) {
        // Lógica para manejar eventos de botones de música
    });

    botonGaleria.addEventListener('click', function (event) {
        // Lógica para manejar eventos del botón de galería
    });
});


        let versiculos = [];
        let versiculoActual = '';

        function cargarVersiculos() {
            versiculos = [
                "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, mas tenga vida eterna. - Juan 3:16",
                "Jehová es mi pastor; nada me faltará. - Salmo 23:1",
                "La bondad y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días. - Salmo 23:6",
                "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia. - Isaías 41:10",
                "Bienaventurado el hombre que no anda en el consejo de los impíos, ni se detiene en el camino de los pecadores, ni se sienta en la silla de los burladores. - Salmo 1:1",
                "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones. - Salmo 46:1",
                "Cree en el Señor Jesucristo, y serás salvo, tú y tu casa. - Hechos 16:31",
                "El amor sea sin fingimiento. Aborreced lo malo, seguid lo bueno. - Romanos 12:9",
                "El que guarda su boca guarda su alma, pero el que mucho abre sus labios tendrá calamidad. - Proverbios 13:3",
                "El principio de la sabiduría es el temor de Jehová; buen entendimiento tienen todos los que practican sus mandamientos. - Salmo 111:10",
                "Por tanto, no os afanéis por el día de mañana, porque el día de mañana traerá su afán. - Mateo 6:34",
                "Si Jehová no edificare la casa, en vano trabajan los que la edifican. - Salmo 127:1",
                "El que perdona la ofensa cultiva el amor; el que insiste en la ofensa divide a los amigos. - Proverbios 17:9",
                "Los que confían en Jehová son como el monte Sion, que no se mueve, sino que permanece para siempre. - Salmo 125:1",
                "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá. - Mateo 7:7",
                "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. - Salmo 91:1",
                "Jehová es mi pastor; nada me faltará. - Salmo 23:1",
                "La bondad y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días. - Salmo 23:6",
                "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia. - Isaías 41:10",
                "Bienaventurado el hombre que no anda en el consejo de los impíos, ni se detiene en el camino de los pecadores, ni se sienta en la silla de los burladores. - Salmo 1:1",
                "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones. - Salmo 46:1",
                "Cree en el Señor Jesucristo, y serás salvo, tú y tu casa. - Hechos 16:31",
                "El amor sea sin fingimiento. Aborreced lo malo, seguid lo bueno. - Romanos 12:9",
                "El que guarda su boca guarda su alma, pero el que mucho abre sus labios tendrá calamidad. - Proverbios 13:3",
                "El principio de la sabiduría es el temor de Jehová; buen entendimiento tienen todos los que practican sus mandamientos. - Salmo 111:10",
                "Por tanto, no os afanéis por el día de mañana, porque el día de mañana traerá su afán. - Mateo 6:34",
                "Si Jehová no edificare la casa, en vano trabajan los que la edifican. - Salmo 127:1",
                "El que perdona la ofensa cultiva el amor; el que insiste en la ofensa divide a los amigos. - Proverbios 17:9",
                "Los que confían en Jehová son como el monte Sion, que no se mueve, sino que permanece para siempre. - Salmo 125:1",
                "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá. - Mateo 7:7",
                "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. - Salmo 91:1",
                "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis. - Jeremías 29:11",
                "Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida; ¿de quién he de atemorizarme? - Salmo 27:1",
                "Encomienda a Jehová tu camino, y confía en él; y él hará. - Salmo 37:5",
                "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán. - Isaías 40:31",
                "No os conforméis a este mundo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta. - Romanos 12:2",
                "Así que, todas las cosas que queráis que los hombres hagan con vosotros, así también haced vosotros con ellos; porque esto es la ley y los profetas. - Mateo 7:12",
                "Porque tú eres mi esperanza, Señor Jehová; en ti he confiado desde mi juventud. - Salmo 71:5",
                "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. - Mateo 11:28",
                "Porque para mí el vivir es Cristo, y el morir es ganancia. - Filipenses 1:21",
                "Dios es espíritu; y los que le adoran, en espíritu y en verdad es necesario que adoren. - Juan 4:24",
                "El Señor es mi fortaleza y mi escudo; en él confió mi corazón, y fui ayudado, por lo que se gozó mi corazón, y con mi cántico le alabaré. - Salmo 28:7",
                "Porque la palabra de Dios es viva y eficaz, y más cortante que toda espada de dos filos; y penetra hasta partir el alma y el espíritu, las coyunturas y los tuétanos, y discierne los pensamientos y las intenciones del corazón. - Hebreos 4:12",
                "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, mas tenga vida eterna. - Juan 3:16",
                "Jehová es mi pastor; nada me faltará. - Salmo 23:1",
                "La bondad y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días. - Salmo 23:6",
                "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia. - Isaías 41:10",
                "Bienaventurado el hombre que no anda en el consejo de los impíos, ni se detiene en el camino de los pecadores, ni se sienta en la silla de los burladores. - Salmo 1:1",
                "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones. - Salmo 46:1",
                "Cree en el Señor Jesucristo, y serás salvo, tú y tu casa. - Hechos 16:31",
                "El amor sea sin fingimiento. Aborreced lo malo, seguid lo bueno. - Romanos 12:9",
                "El que guarda su boca guarda su alma, pero el que mucho abre sus labios tendrá calamidad. - Proverbios 13:3"
            ];
        }

        function obtenerVersiculoAleatorio() {
            const índice = Math.floor(Math.random() * versiculos.length);
            return versiculos[índice];
        }

        function generarNuevoVersiculo() {
            const nuevoVersiculo = obtenerVersiculoAleatorio();
            document.getElementById('versiculo').textContent = nuevoVersiculo;
        }
