let currentPage = 1;
const totalPages = document.querySelectorAll('.page').length;

window.onload = () => {
    const bookCover = document.querySelector('.book-cover');
    const bookContent = document.querySelector('.book-content');

    // Abrir el libro al cargar la página
    setTimeout(() => {
        bookCover.style.transform = 'rotateY(-180deg)';
        bookContent.style.opacity = '1';
        showPage(1);
    }, 500);
}

function showPage(page) {
    document.querySelectorAll('.page').forEach((p, index) => {
        if (index + 1 === page) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
    }
}
