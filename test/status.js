const statuses = require('../scripts/database/statuses')

const test = async () => {
  const id = await statuses.get(198313)
  console.log(id)
}

//test()