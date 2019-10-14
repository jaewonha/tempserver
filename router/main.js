module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });
     app.get('/redirect',function(req,res){
        res.render('redirect.html');
    });
}
