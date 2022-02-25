class Controller {

    // [GET] --> Display a listing of the resource.
    index(req, res, next) {
        res.render('news');
    }

    // [POST] --> Store a newly created resource in storage.
    store(req, res, next) {}

    // [GET] --> Display the specified resource.
    show(req, res, next) {
        res.send('NEWS DETAILS');
    }

    // [PUT] --> Update the specified resource in storage.
    update(req, res, next) {}

    // [DELETE] 
    destroy(req, res, next) {}
}

module.exports = new Controller;