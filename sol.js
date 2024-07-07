document.addEventListener('DOMContentLoaded', function() {
    const imagenes = document.querySelectorAll('.imagen-galeria');
    const modal = document.getElementById('modal');
    const modalImagen = document.getElementById('modal-imagen');
    const cerrarModal = document.getElementById('cerrar-modal');

    imagenes.forEach(imagen => {
        imagen.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImagen.src = this.src;
        });
    });

    cerrarModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    const botonMusica = document.getElementById('boton-musica');
    const miniMenuMusica = document.getElementById('mini-menu-musica');

    botonMusica.addEventListener('click', function() {
        miniMenuMusica.style.display = miniMenuMusica.style.display === 'block' ? 'none' : 'block';
    });
});
