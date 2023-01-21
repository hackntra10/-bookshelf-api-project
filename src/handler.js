const {nanoid} = require('nanoid');
const books = require('./books');

const addBookFunction = (request, h)=> {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload 

    const id = nanoid(16)
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = false;

    if (pageCount=== readPage) {
        finished = true
    }

    const newBook = {
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher,
        pageCount,
        readPage, 
        finished, 
        reading, 
        insertedAt, 
        updatedAt
    }



    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0

 
    if (!newBook.name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response
    }

    if(newBook.readPage > newBook.pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response
    }

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId : id,
            },
        });
        response.code(201);
        return response
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
    });

    response.code(500);
    return response
};

const allDataBookFunction = (response, h) => {
    const { name, reading, finished} = response.query;

    let temporaryBookData = books

    if(name) {
        temporaryBookData = temporaryBookData.filter((book)=> book.name.toLowerCase() === name.toLowerCase())
    }

    if(reading) {
        if(reading===1) {
            temporaryBookData = temporaryBookData.filter((book)=> book.reading === true)
        } else if (reading === 0) {
            temporaryBookData = temporaryBookData.filter((book)=>book.reading=== false)
        }
    }

    if(finished) {
        if(finished===1) {
            temporaryBookData = temporaryBookData.filter((book)=> book.finished === true)
        } else if (finished === 0) {
            temporaryBookData = temporaryBookData.filter((book)=>book.finished=== false)
        }
    }
    
    const newFilterBook = temporaryBookData.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))

    return h.response({
       status : "success",
       data : {
           books: newFilterBook,
       }  
    })
};


const detailDataBookFunction = (request, h) => {
     const { bookId } = request.params

     const book = books.filter((data) => data.id === bookId)[0]

     if (book !== undefined) {
        return {
            status : 'success',
            data: {
                book,
            }
        }
     }

     const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
     });
     response.code(404);
     return response;
};

const editDataBookFunction = (request, h) => {
    const { bookId } = request.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload 
    // const updatedAt = new Date().toISOString();

    const index = books.findIndex((book)=> book.id === bookId);

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbaharui buku, Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbaharui buku, ReadPage tidak boleh lebih besar dair pageCount'
        })
        response.code(400)
        return response
    }

    if (index !== -1){
        books[index] = {
            ...books[index],
            name,
            year, 
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbaharui'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbaharui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
} 

const deleteBookByIdFunction = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book)=> book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus, Id tidak ditemukan'
    });
    response.code(404);
    return response
}

module.exports = {
     addBookFunction, 
     allDataBookFunction, 
     detailDataBookFunction,
     editDataBookFunction,
     deleteBookByIdFunction
}