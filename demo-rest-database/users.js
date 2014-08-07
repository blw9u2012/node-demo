var db;

function initialize(app, injectedDb)
{
    //Order matters!
    app.get('/users/faculty', getFacultyUsers); // users/faculty routes to getFacultyUsers
    app.get('/users/:id', checkNumeric, getUserById); // users/___ routes to getUserById, checked first by checkNumeric
    app.get('/users/search/:username', getUserByUsername);

    db = injectedDb;

    console.log(app.get('actions'));
}

function getActions()
{
    //set up actions that will automatically turn into buttons
    var userActions = [];
    userActions.push({url:'/users/{0}', dataType:'number', name:'Get User By ID', id:'searchUserId'});
    userActions.push({url:'/users/search/{0}', dataType:'string', name:'Search for User by Username', id:'searchUsername'});
    userActions.push({url:'/users/faculty', dataType:null, name:'Get Faculty Users', id:'getFacultyUsers'});

    return userActions;
}

//Middleware to validate that ID that you pass in is actually numeric
function checkNumeric(req, res, next)
{
    //RegEx explanation:
    // ^: From the start of the line
    // [0-9]: there must be a character that is a digit 0-9
    // +: repeated one or more times
    // $: until the end of the line
    if(req.params.id.match(/^[0-9]+$/))
    {
        next();
        return;
    }

    res.json({err: 'You must specify a numeric ID'});
}

function getUserById(req, res)
{
    var id = req.params.id;

    db.get("SELECT * FROM Users WHERE UserID = ?", id, function(err, row)
    {
       if(err)
       {
           console.log(err);
           res.send(err);
           return;
       }

       if(row)
       {
           res.json({result:row});
           return;
       }

        res.json({result:null});
    });
}

function getUserByUsername(req, res)
{
    var usernameSearch = '%' + req.params.username + '%';
    db.all("SELECT * FROM Users WHERE Username LIKE ?", usernameSearch, function(err, rows)
    {
        if(err)
        {
            console.log(err);
            res.send(err);
            return;
        }

        if(rows)
        {
            res.json({result:rows});
            return;
        }

        res.json({result:null});
    });
}

function getFacultyUsers(req, res)
{
    var id = req.params.id;
    db.all("SELECT * FROM Users WHERE IsFaculty = 1", id, function(err, rows)
    {
        if(err)
        {
            console.log(err);
            res.send(err);
            return;
        }

        if(rows)
        {
            res.json({result:rows});
            return;
        }

        res.json({result:null});
    });
}

//don't forget your module.exports
module.exports.init = initialize;
module.exports.getActions = getActions;