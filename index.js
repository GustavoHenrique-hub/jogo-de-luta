//Utilizando o DOM para selecionar o elmento <canvas> no HTML
const canvas = document.querySelector('canvas')

//Contexto de renderização do <canvas> 
const ctx = canvas.getContext('2d')

//Define o tamanho do <canvas>
canvas.width = 1024
canvas.height = 576

//Define um retângulo do tamanho do <canvas>
ctx.fillRect(0, 0, canvas.width, canvas.height)


const gravidade = 0.7

//Imagem de fundo
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imagemSrc: './imagens/background.png'
})

//Imagem do Mercado
const shop = new Sprite({
    position: {
        x: 625,
        y: 127.5
    },
    imagemSrc: './imagens/shop.png',
    scale: 2.75,
    framesMax: 6
})


//Objeto jogador1
const jogador1 = new Lutador({
    position: {
        x: 0,
        y: 0
    },
    velocidade: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imagemSrc: './imagens/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 156
    },
    sprites: {
        idle: {
            imagemSrc: './imagens/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imagemSrc: './imagens/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imagemSrc: './imagens/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imagemSrc: './imagens/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imagemSrc: './imagens/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imagemSrc: './imagens/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imagemSrc: './imagens/samuraiMack/Death.png',
            framesMax: 6,
        },

    },
    hitBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 155,
        height: 50
    }
})



//Objeto inimigo
const jogador2 = new Lutador({
    position: {
        x: 450,
        y: 100
    },
    velocidade: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imagemSrc: './imagens/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 166
    },
    sprites: {
        idle: {
            imagemSrc: './imagens/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imagemSrc: './imagens/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imagemSrc: './imagens/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imagemSrc: './imagens/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imagemSrc: './imagens/kenji/Attack1.png',
            framesMax: 4,
        },
        attack1: {
            imagemSrc: './imagens/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imagemSrc: './imagens/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imagemSrc: './imagens/kenji/Death.png',
            framesMax: 7,
        },


    },
    hitBox: {
        offset: {
            x: -172,
            y: 50
        },
        width: 155,
        height: 50
    }
})



//Define os atalhos de movimento
const teclas = {
    //Jogador 1
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },

    //Jogador 2
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

diminuirTempo()

//Define a animação de cada movimento 
function animacao() {
    window.requestAnimationFrame(animacao)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.135)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    jogador1.update()
    jogador2.update()

    jogador1.velocidade.x = 0
    jogador2.velocidade.x = 0


    //Movimento jogador 1
    if (teclas.a.pressed && jogador1.ultimaTecla === 'a') {
        jogador1.velocidade.x = -6.5
        jogador1.switchSprite('run')
    }
    else if (teclas.d.pressed && jogador1.ultimaTecla === 'd') {
        jogador1.velocidade.x = 6.5
        jogador1.switchSprite('run')
    } else {
        jogador1.switchSprite('idle')
    }

    //Pulando
    if (jogador1.velocidade.y < 0) {
        jogador1.switchSprite('jump')
    } else if (jogador1.velocidade.y > 0) {
        jogador1.switchSprite('fall')
    }
    //Movimento jogador 2
    if (teclas.ArrowLeft.pressed && jogador2.ultimaTecla === 'ArrowLeft') {
        jogador2.velocidade.x = -6.5
        jogador2.switchSprite('run')
    }
    else if (teclas.ArrowRight.pressed && jogador2.ultimaTecla === 'ArrowRight') {
        jogador2.velocidade.x = 6.5
        jogador2.switchSprite('run')
    } else {
        jogador2.switchSprite('idle')
    }

    //Pulando
    if (jogador2.velocidade.y < 0) {
        jogador2.switchSprite('jump')
    } else if (jogador2.velocidade.y > 0) {
        jogador2.switchSprite('fall')
    }

    //Hit Box jogador 1 e jogador 2 recebe o hit
    if (hitRetangular({
        retangulo1: jogador1,
        retangulo2: jogador2
    }) && jogador1.atacando && jogador1.framesCurrent === 4) {

        jogador2.takeHit()
        jogador1.atacando = false
        gsap.to('#vidaJogador2', {
            width: jogador2.vida + '%'
        })
    }

    //Se o jogador errar
    if (jogador1.atacando && jogador1.framesCurrent === 4) {
        jogador1.atacando = false
    }

    //Hit Box jogador 2 
    if (hitRetangular({
        retangulo1: jogador2,
        retangulo2: jogador1
    }) && jogador2.atacando && jogador2.framesCurrent === 2) {

        jogador1.takeHit()
        jogador2.atacando = false

        gsap.to('#vidaJogador1', {
            width: jogador1.vida + '%'
        })
    }

    //Se o jogador errar
    if (jogador2.atacando && jogador2.framesCurrent === 2) {
        jogador2.atacando = false
    }

    //Fim de jogo baseado na vida
    if (jogador1.vida <= 0 || jogador2.vida <= 0) {
        determinaGanhador({ jogador1, jogador2, tempoId })
    }
}

animacao()

//Andar personagem
window.addEventListener('keydown', (event) => {

    //teclas jogador 1
    if (!jogador1.dead) {
        switch (event.key) {

            case 'd':
                teclas.d.pressed = true
                jogador1.ultimaTecla = 'd'
                break

            case 'a':
                teclas.a.pressed = true
                jogador1.ultimaTecla = 'a'
                break

            case 'w':
                jogador1.velocidade.y = -17
                break

            case ' ':
                jogador1.ataque()
                break

        }
    }

    //teclas jogador 2
    if (!jogador2.dead) {
        switch (event.key) {

            case 'ArrowRight':
                teclas.ArrowRight.pressed = true
                jogador2.ultimaTecla = 'ArrowRight'
                break

            case 'ArrowLeft':
                teclas.ArrowLeft.pressed = true
                jogador2.ultimaTecla = 'ArrowLeft'
                break

            case 'ArrowUp':
                jogador2.velocidade.y = -17
                break

            case 'Enter':
                jogador2.ataque()
                break
        }
    }
})

//Parar personagem
window.addEventListener('keyup', (event) => {
    switch (event.key) {

        //teclas jogador 1
        case 'd':
            teclas.d.pressed = false
            break

        case 'a':
            teclas.a.pressed = false
            break

        //teclas jogador 2
        case 'ArrowRight':
            teclas.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            teclas.ArrowLeft.pressed = false
            break

    }

})