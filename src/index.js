const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;
const SortMiddleware = require('./app/middleware/SortMiddleware');

const route = require('./routes');
const db = require('./config/db');

// connect to db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());
app.use(methodOverride('_method'));
//custom middlewares
app.use(SortMiddleware);
// HTTP logger
app.use(morgan('combined'));

// template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      sortable: (field, sort) => {
        const icons = {
          default: 'oi oi-elevator',
          asc: 'oi oi-sort-ascending',
          desc: 'oi oi-sort-descending',
        };
        const types = {
          default: 'asc',
          asc: 'desc',
          desc: 'asc',
        };
        const sortType = field === sort.column ? sort.type : 'default';
        const icon = icons[sortType];
        const type = types[sortType];
        return `<a href="?_sort&column=${field}&type=${type}"
            ><span class="${icon}"></span
          ></a>`;
      },
    },
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

// 127.0.0.1 -> localhost
app.listen(port, () => {
  console.log(`App listening at  http://localhost:${port}`);
});
