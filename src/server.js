import http from 'http'
import { Readable } from 'stream'
import { randomUUID } from 'crypto'

const PORT = process.env.PORT || 3300

// Generator
function* run() {
  for(let i = 0; i < 100; i++) {
    const data = {
      id: randomUUID(),
      name: `David-${i}`,
    }

    // Retorna o dado que já foi processado mesmo antes do loop terminar
    yield data
  }
}

async function handler(request, response) {
  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log('🚀 ~ sending', data);
        // Transforma em string pois as streams só trabalham com este tipo de dado
        // por causa do buffer
        this.push(JSON.stringify(data) + "\n");
      }

      // Informa que os dados acabaram
      this.push(null)
    }
  })

  readable
    // O pipe vai gerenciar o dado recebido
    .pipe(response)
}

http.createServer(handler)
  .listen(PORT)
  .on('listening', () => console.info(`listening on localhost:${PORT}`))
