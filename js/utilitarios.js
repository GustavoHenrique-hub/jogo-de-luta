//Hit de cada personagem
function hitRetangular({ retangulo1, retangulo2 }) {
    return (retangulo1.hitBox.position.x + retangulo1.hitBox.width >= retangulo2.position.x &&
        retangulo1.hitBox.position.x <= retangulo2.position.x + retangulo2.width &&
        retangulo1.hitBox.position.y + retangulo1.hitBox.height >= retangulo2.position.y &&
        retangulo1.hitBox.position.y <= retangulo2.position.y + retangulo2.height)
}


//Determina quem ganha
function determinaGanhador({ jogador1, jogador2, tempoId }) {
    clearTimeout(tempoId)

    document.querySelector('#exibirTexto').style.display = 'flex'

    if (jogador1.vida === jogador2.vida) {
        document.querySelector('#exibirTexto').innerHTML = 'Empate'

    } else if (jogador1.vida > jogador2.vida) {
        document.querySelector('#exibirTexto').innerHTML = 'Jogador 1 Wins'

    } else if (jogador2.vida > jogador1.vida) {
        document.querySelector('#exibirTexto').innerHTML = 'Jogador 2 Wins'

    }
}

//Diminui o contador de tempo
let tempo = 60
let tempoId
function diminuirTempo() {
    if (tempo > 0) {
        tempoId = setTimeout(diminuirTempo, 1000)
        tempo--
        document.querySelector('#tempo').innerHTML = tempo
    }

    //Diz qual o resultado da partida
    if (tempo === 0) {
        determinaGanhador({ jogador1, jogador2, tempoId })
    }
}