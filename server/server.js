'use strict';

const app = require('./api');

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at port ${PORT}.`);
});
