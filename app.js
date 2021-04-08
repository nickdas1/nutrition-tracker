const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`);
})


