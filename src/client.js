import axios from 'axios'
import { Transform, Writable } from 'stream'

const url = 'http://localhost:3300'

async function consume() {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })

  return response.data
}

const stream = await consume()

stream
  .pipe(
    new Transform({
      // Não é legal usar esta função como async, pois pode fechar
      // a stream sem ter terminado o processamento
      // - chunk é o pedaço recebido pela stream
      transform(chunk, enc, cb) {
        // Como o server manda o json como resposta é preciso fazer o parser dele
        const item = JSON.parse(chunk)
        const { name } = item

        const itemNumber = /\d+/.exec(name)[0]

        item.name = (itemNumber % 2 === 0) ? `${name} é par` : `${name} é ímpar`

        // o callback informa o fim do processo
        cb(null, JSON.stringify(item))
      }
    })
  )
  .pipe(
    new Writable({
      write(chunk, enc, cb) {
        console.info('The End', chunk.toString())

        cb()
      }
    })
  )
