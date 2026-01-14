// Do your work here...
// console.log('Hello, world!');

let books = []; //array untuk menampung object
const RENDER_EVENT = 'render_book'; //event untuk trigger setiap ada perubahan data


// pastikan semua content HTML sudah ter load dengan baik
document.addEventListener('DOMContentLoaded', function(){

    const submitedBookForm = document.getElementById('bookForm')
    sectionAlert.style.display = 'none';
    submitedBookForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
        submitedBookForm.reset();
    })

    const searchFormBook = document.getElementById('searchBook');
    searchFormBook.addEventListener('submit', function(event){
        const searchTitle = document.getElementById('searchBookTitle').value;
        searchBook(searchTitle);

        event.preventDefault();
    });

    const popupContainer = document.getElementById('section-edit-form');
    popupContainer.style.display ="none";

    // load local storage untuk dimasukan ke object
    if(isStorageExist()){
        loadDataFromStorage();
    }
})

/**
 * Fungsi menambah buku
 * di perlukan value dari form yang sudah ada, ambil value dari form dengan id bookForm
 * tambahkan fungsi untuk membuat ID
 * setelah value sudah ada, lalu push kedalam object
 * lalu object ditampung didalam array
 */

// generator ID
function idGenerator(){
    return +new Date();
}

// penambahan buku
function addBook(){
    const bookTitle = document.getElementById('bookFormTitle').value;
    const bookAuthor = document.getElementById('bookFormAuthor').value;
    const bookYear = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    const bookId = idGenerator();

    const bookObject = generateBookObject(bookId, bookTitle, bookAuthor, bookYear, isComplete)
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
}

// fungsi untuk membuat object
function generateBookObject (id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}


/**
 * setelah buku sudah dibuat menjadi object dan sudah ditampung ke dalam array, maka perlu :
 * 1. menampilkan buku yang diinput ke section belum selesai dibaca
 * 2. menampilkan tombol action "selesai baca, hapus dan edit"
 */

// memasukan object ke dalam element HTML
function makeBook (bookObject){

    // membuat element HTML untuk container utama
    const containerBookId = document.createElement('div');
    containerBookId.setAttribute('data-bookid',`${bookObject.id}`);
    containerBookId.setAttribute('data-testid', 'bookItem')
    containerBookId.style.border = '1px solid #E2E8F0';
    containerBookId.style.borderRadius = '10px';
    containerBookId.style.paddingInline = '20px';
    containerBookId.style.paddingBottom = '20px';
    containerBookId.classList.add('shadow');

    // Membuat element HTML untuk teks  judul buku
    const bookItemTitle = document.createElement('h3');
    bookItemTitle.setAttribute('data-testid', 'bookItemTitle')
    bookItemTitle.innerText = bookObject.title;

    // membuat elemen HTML untuk teks author
    const bookItemAuthor = document.createElement('p');
    bookItemAuthor.setAttribute('data-testid', 'bookItemAuthor')
    bookItemAuthor.innerText = bookObject.author;

    // membuat elemen HTML untuk teks tahun
    const bookItemYear = document.createElement('p');
    bookItemYear.setAttribute('data-testid', 'bookItemYear')
    bookItemYear.innerText = bookObject.year;

    // membuat container untuk action button
    const buttonListContainer = document.createElement('div');
    buttonListContainer.classList.add('button-list');

    // membuat element HTML untuk button selesai baca
    const bookItemIsCompleteButton = document.createElement('button');
    bookItemIsCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    bookItemIsCompleteButton.classList.add('button-complete');

    // membuat element HTML untuk button delete
    const bookItemDeleteButton = document.createElement('button');
    bookItemDeleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    bookItemDeleteButton.classList.add('button-delete');
    
    // membuat element HTML untuk button Edit
    const bookItemEditButton = document.createElement('button');
    bookItemEditButton.setAttribute('data-testid', 'bookItemEditButton');
    bookItemEditButton.classList.add('button-edit');

    // menggabungkan tombol ke dalam container action button
    buttonListContainer.append(bookItemIsCompleteButton, bookItemDeleteButton, bookItemEditButton);

    // menggabungkan text judul author tahun dan tombol action container ke dalam container utama
    containerBookId.append(bookItemTitle, bookItemAuthor, bookItemYear, buttonListContainer);

    if (bookObject.isComplete) {

        const reReadedButton = bookItemIsCompleteButton;

        // tombol selesai
        // penambahan icon undo pada tombol
        const reReadIcon = document.createElement('i');
        reReadIcon.classList.add('fa-solid', 'fa-rotate-left');

        // memasukan icon kedalam button
        bookItemIsCompleteButton.append(reReadIcon, 'Ulang');

        // memanggil fungsi untuk tombol baca ulang
        reReadedButton.addEventListener('click', function() {
            reReadedItemBook(bookObject.id);
        })

        // Tombol Hapus
        // menambahkan icon trash
        const deleteIconButton = document.createElement('i');
        deleteIconButton.classList.add('fa-solid', 'fa-trash');

        // memasukan icon kedalam tombol delete
        bookItemDeleteButton.append(deleteIconButton, 'Hapus');

        // memanggil fungsi delete
        bookItemDeleteButton.addEventListener('click', function() {
            deleteItemBook(bookObject.id);
        })

        // button Edit
        // membuat element icon edit
        const editIconButton = document.createElement('i');
        editIconButton.classList.add('fa-solid', 'fa-pencil');

        // memasukan icon ke dalam tombol edit
        bookItemEditButton.append(editIconButton, 'Edit');

        // memanggil fungsi untuk tombol edit buku
        bookItemEditButton.addEventListener('click', function() {
            editItemBook(bookObject.id);
        })
    } else {
        // tombol selesai
        // penambahan icon undo pada tombol
        const ReadedIcon = document.createElement('i');
        ReadedIcon.classList.add('fa-solid', 'fa-check');

        // memasukan icon kedalam button
        bookItemIsCompleteButton.append(ReadedIcon, 'Selesai');

        // memanggil fungsi untuk tombol baca ulang
        bookItemIsCompleteButton.addEventListener('click', function() {
            readedItemBook(bookObject.id);
        })

        // Tombol Hapus
        // menambahkan icon trash
        const deleteIconButton = document.createElement('i');
        deleteIconButton.classList.add('fa-solid', 'fa-trash');

        // memasukan icon kedalam tombol delete
        bookItemDeleteButton.append(deleteIconButton, 'Hapus');

        // memanggil fungsi delete
        bookItemDeleteButton.addEventListener('click', function() {
            deleteItemBook(bookObject.id);
        })

        // button Edit
        // membuat element icon edit
        const editIconButton = document.createElement('i');
        editIconButton.classList.add('fa-solid', 'fa-pencil');

        // memasukan icon ke dalam tombol edit
        bookItemEditButton.append(editIconButton, 'Edit');

        // memanggil fungsi untuk tombol edit buku
        bookItemEditButton.addEventListener('click', function() {
            editItemBook(bookObject.id);
        })
    }

    // mengembalikan elment container utama untuk ditampilkan
    return containerBookId;
}


/**
 * 1. ini adalah event listener untuk merender object
 * 2. Event yang digunakan adalah custom event
 * 3. Event listener ini akan membagi object ke kontainer sesuai dengan status isComplete didalam object
 * 4. 
 */
document.addEventListener(RENDER_EVENT, function(){

    // container untuk menampilkan buku yang belum dibaca
    const unReadBookList = document.getElementById('incompleteBookList');
    unReadBookList.innerHTML = ''; //untuk memastikan container menampilkan element html kosong

    // container untuk menampilkan buku yang sudah dibaca
    const readedBookList = document.getElementById('completeBookList');
    readedBookList.innerHTML = ''; //untuk memastikan container menampilkan element html kosong

    // kondisi untuk distribusi object berdasarkan value isComplete
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if(!bookItem.isComplete){
            unReadBookList.append(bookElement);
        } else {
            readedBookList.append(bookElement);
        }
    }
})

/**
 * mengaktifkan action button
 * 1. menambahkan fungsi untuk tombol selesai baca
 * 2. menambahkan fungsi untuk tombol hapus buku
 * 3. menambahkan fungsi untuk tombol edit buku
 * 4. menambahkan fungsi untuk tombol baca ulang
 */

// fungsi untuk tombol selesai baca
/**
 * fungsi untuk tombol selesai baca memiliki alur sebagai berikut :
 * 1. tombol selesai baca akan mengembalikan id dari object yang sudah di buat disini didefinisikan sebagai bookTarget
 * 2. jika tidak ditemukan dia akan menghentikan program (return null)
 * 3. jika ditemukan, ilai isReaded akan diubah menjadi true
 * 4. dan merender object sehingga object ter refresh
 */
function readedItemBook(bookId) {

    // definisikan target berdasarkan id yang ditangkap
    const bookTarget = findBook(bookId);

    // jika target tidak ditemukan maka program berhenti
    if (bookTarget == null) return;

    // jika ditemukan ganti nilai dari isComplete
    bookTarget.isComplete = true;

    // render ulang object
    document.dispatchEvent(new Event (RENDER_EVENT));
    saveData();
}

// fungsi untuk tombol baca ulang
// memiliki alur yang sama seperti fungsi sudah dibaca
function reReadedItemBook(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;

    document.dispatchEvent(new Event (RENDER_EVENT));
    saveData();
}

// diperlukan fungsi findBook untuk menemukan target dari object
function findBook (bookId) {
    for(const bookItem of books ) {
        if (bookItem.id == bookId){
            return bookItem;
        }
    }

    return null;
}


// Fungsi untuk menghapus buku
function deleteItemBook(bookId) {
    const bookTarget = bookIndex(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget,1);
    document.dispatchEvent(new Event (RENDER_EVENT));
    saveData();
}

// fungsi untuk mencari index
function bookIndex(bookId) {
    for (const index in books) {
        if(books[index].id == bookId){
            return index;
        }
    }

    return -1;
}


// Fungsi untuk edit buku
function editItemBook (bookId) {

    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    const sectionAlert = document.getElementById('alert-section');
    const containerForm = document.getElementById('form-edit-container');
    const popupContainer = document.getElementById('section-edit-form');
    const closeButton = document.getElementById('close-pupup');
    const formEdit = document.getElementById('editBookForm');

    popupContainer.style.display = "flex";

    closeButton.addEventListener('click', function(){
        closePopUp();
    });

    const editTitleRecent = document.getElementById('editBookFormTitle');
    editTitleRecent.value = bookTarget.title;
    editTitleRecent.placeholder = bookTarget.title;

    const editAuthorRecent = document.getElementById('editBookFormAuthor');
    editAuthorRecent.value = bookTarget.author;
    editAuthorRecent.placeholder = bookTarget.author;

    const editYearRecent = document.getElementById('editBookFormYear');
    editYearRecent.value = bookTarget.year;
    editYearRecent.placeholder = bookTarget.year;

    const isReadRecent = document.getElementById('editBookFormIsComplete');
    isReadRecent.checked = bookTarget.isComplete;

    formEdit.onsubmit = function(event){
        event.preventDefault();
        
        const editTitleValue = document.getElementById('editBookFormTitle').value;
        const editAuthorValue = document.getElementById('editBookFormAuthor').value;
        const editYearValue = document.getElementById('editBookFormYear').value;
        const isReadValue = document.getElementById('editBookFormIsComplete').checked;

        books = books.map(book => {
            if (book.id === bookTarget.id) {
                return {...book, title:editTitleValue, author: editAuthorValue, year:editYearValue, isComplete: isReadValue
                }
            };

            return book;
        });

        popupContainer.style.display = "none";
        sectionAlert.style.display = "block";

        document.dispatchEvent(new Event (RENDER_EVENT));
        saveData();
    };

}

// closebutton function
function closePopUp() {
    const popupContainer = document.getElementById('section-edit-form');
    popupContainer.style.display ="none";
}

// alert close
const sectionAlert = document.getElementById('alert-section');
const buttonAlert = document.getElementById('buttonAlert');

buttonAlert.addEventListener('click', function() {
    sectionAlert.style.display = 'none';
})


// Pencarian Buku
function searchBook(searchTitle){
    const bookTarget = searchingBook(searchTitle);

    if(!bookTarget){
        alert('Buku tidak ditemukan');
    } else {
        alert('Buku ditemukan');

        const resultContainer = document.getElementById('container-search') //container utama
        
        const containerBookId = document.createElement('div'); //inner container
        containerBookId.setAttribute('data-bookid',`${bookTarget.id}`);
        containerBookId.setAttribute('data-testid', 'bookItem')
        containerBookId.style.border = '1px solid #E2E8F0';
        containerBookId.style.borderRadius = '10px';
        containerBookId.style.paddingInline = '20px';
        containerBookId.style.paddingBottom = '20px';
        containerBookId.classList.add('shadow');

        // Membuat element HTML untuk teks  judul buku
        const bookItemTitle = document.createElement('h3');
        bookItemTitle.setAttribute('data-testid', 'bookItemTitle')
        bookItemTitle.innerText = bookTarget.title;

        // membuat elemen HTML untuk teks author
        const bookItemAuthor = document.createElement('p');
        bookItemAuthor.setAttribute('data-testid', 'bookItemAuthor')
        bookItemAuthor.innerText = bookTarget.author;

        // membuat elemen HTML untuk teks tahun
        const bookItemYear = document.createElement('p');
        bookItemYear.setAttribute('data-testid', 'bookItemYear')
        bookItemYear.innerText = bookTarget.year;

        // membuat container untuk action button
        const buttonListContainer = document.createElement('div');
        buttonListContainer.classList.add('button-list');

        // membuat element HTML untuk button selesai baca
        const bookItemIsCompleteButton = document.createElement('button');
        bookItemIsCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
        bookItemIsCompleteButton.classList.add('button-complete');

        // membuat element HTML untuk button delete
        const bookItemDeleteButton = document.createElement('button');
        bookItemDeleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
        bookItemDeleteButton.classList.add('button-delete');
        
        // membuat element HTML untuk button Edit
        const bookItemEditButton = document.createElement('button');
        bookItemEditButton.setAttribute('data-testid', 'bookItemEditButton');
        bookItemEditButton.classList.add('button-edit');

        // menggabungkan tombol ke dalam container action button
        buttonListContainer.append(bookItemIsCompleteButton, bookItemDeleteButton, bookItemEditButton);

        // menggabungkan text judul author tahun dan tombol action container ke dalam container utama
        containerBookId.append(bookItemTitle, bookItemAuthor, bookItemYear, buttonListContainer);

        resultContainer.append(containerBookId);

        if (bookTarget.isComplete) {

            const reReadedButton = bookItemIsCompleteButton;

            // tombol selesai
            // penambahan icon undo pada tombol
            const reReadIcon = document.createElement('i');
            reReadIcon.classList.add('fa-solid', 'fa-rotate-left');

            // memasukan icon kedalam button
            bookItemIsCompleteButton.append(reReadIcon, 'Ulangi');

            // memanggil fungsi untuk tombol baca ulang
            reReadedButton.addEventListener('click', function() {
                reReadedItemBook(bookTarget.id);

                containerBookId.style.display = "none";
            })

            // Tombol Hapus
            // menambahkan icon trash
            const deleteIconButton = document.createElement('i');
            deleteIconButton.classList.add('fa-solid', 'fa-trash');

            // memasukan icon kedalam tombol delete
            bookItemDeleteButton.append(deleteIconButton, 'Hapus');

            // memanggil fungsi delete
            bookItemDeleteButton.addEventListener('click', function() {
                deleteItemBook(bookTarget.id);

                containerBookId.style.display = "none";
            })

            // button Edit
            // membuat element icon edit
            const editIconButton = document.createElement('i');
            editIconButton.classList.add('fa-solid', 'fa-pencil');

            // memasukan icon ke dalam tombol edit
            bookItemEditButton.append(editIconButton, 'Edit');

            // memanggil fungsi untuk tombol edit buku
            bookItemEditButton.addEventListener('click', function() {
                editItemBook(bookTarget.id);

                containerBookId.style.display = "none";
            })
        } else {
            // tombol selesai
            // penambahan icon undo pada tombol
            const ReadedIcon = document.createElement('i');
            ReadedIcon.classList.add('fa-solid', 'fa-check');

            // memasukan icon kedalam button
            bookItemIsCompleteButton.append(ReadedIcon, 'Selesai');

            // memanggil fungsi untuk tombol baca ulang
            bookItemIsCompleteButton.addEventListener('click', function() {
                readedItemBook(bookTarget.id);

                containerBookId.style.display = "none";
            })

            // Tombol Hapus
            // menambahkan icon trash
            const deleteIconButton = document.createElement('i');
            deleteIconButton.classList.add('fa-solid', 'fa-trash');

            // memasukan icon kedalam tombol delete
            bookItemDeleteButton.append(deleteIconButton, 'Hapus');

            // memanggil fungsi delete
            bookItemDeleteButton.addEventListener('click', function() {
                deleteItemBook(bookTarget.id);

                containerBookId.style.display = "none";
            })

            // button Edit
            // membuat element icon edit
            const editIconButton = document.createElement('i');
            editIconButton.classList.add('fa-solid', 'fa-pencil');

            // memasukan icon ke dalam tombol edit
            bookItemEditButton.append(editIconButton, 'Edit');

            // memanggil fungsi untuk tombol edit buku
            bookItemEditButton.addEventListener('click', function() {
                editItemBook(bookTarget.id);

                containerBookId.style.display = "none";
            })
        }

        return resultContainer;
        
    }
}

function searchingBook(searchTitle) {
    for(const bookItem of books){
        if (bookItem.title.toLowerCase() == searchTitle.toLowerCase()) {
            return bookItem;
        }
    }
    return null;
}


// safe di local storage
function saveData() {
    if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'book-storage';

function isStorageExist(){
    if (typeof(Storage) === undefined) {
        alert('Browser tidak mendukung localstorage');
        return false;
    }

    return true;
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for (const book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}