const statuses = require('../controllers/database/statuses')

const test = async () => {
  const status = await statuses.getNotOrdered(251543)
  console.log(status)
}

test()