const { 
    addBookFunction, 
    allDataBookFunction, 
    detailDataBookFunction, 
    editDataBookFunction, 
    deleteBookByIdFunction
} = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookFunction,
    },
    {
        method: 'GET',
        path: '/books',
        handler: allDataBookFunction,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: detailDataBookFunction
    },
    {
        method: 'PUT',
        path:'/books/{bookId}',
        handler: editDataBookFunction,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdFunction
    }
];

module.exports = routes;