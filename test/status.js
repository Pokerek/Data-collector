const status = require('../scripts/database/status')

const test = async () => {
  await status.update()
}

test()