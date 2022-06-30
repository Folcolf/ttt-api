import express from 'express'

export class SSEClient {
  /**
   * @param {express.Response} res - La réponse HTTP
   */
  constructor(res) {
    this.res = res
    this.initialize()
  }

  /**
   * Initialise la connexion avec le client
   * @function initialize
   */
  initialize() {
    const headers = {
      /* Permet d'indiquer au client qu'il s'agit d'une connexion SSE */
      'Content-Type': 'text/event-stream',
      /* Permet d'indiquer au client que la connexion est persistente */
      Connection: 'keep-alive',
      /* Permet d'empêcher la mise en cache des messages */
      'Cache-Control': 'no-cache',
    }

    /* On envoie les headers au client */
    this.res.writeHead(200, headers)
  }

  /**
   * Envoie un message au client
   * @function send
   * @params {Object} message - Le message à envoyer au client
   * @params {number|string} [message.id] - L'identifiant unique du message
   * @params {string} [message.type='message'] - Le type de message
   * @params {number} [message.retry] - Le délai en millisecondes avant une tentative de reconnexion au serveur
   * @params {string} message.data - Le contenu du message
   */
  send(message) {
    const { id, type = 'message', retry, data } = message

    if (id) {
      this.res.write(`id: ${id}\n`)
    }
    if (type) {
      this.res.write(`event: ${type}\n`)
    }
    if (retry) {
      this.res.write(`retry: ${retry}\n`)
    }

    this.res.write(
      `data: ${typeof data === 'object' ? JSON.stringify(data) : data}\n\n`
    )
  }
}
