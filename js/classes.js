//classe para fazer o movimento de cada retângulo
class Sprite {

    //função dentro da classe
    constructor({ position, imagemSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.imagem = new Image()
        this.imagem.src = imagemSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 7
        this.offset = offset
    }

    desenho() {
        ctx.drawImage(
            this.imagem,
            this.framesCurrent * (this.imagem.width / this.framesMax),
            0,
            this.imagem.width / this.framesMax,
            this.imagem.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.imagem.width / this.framesMax) * this.scale,
            this.imagem.height * this.scale
        )
    }


    //Frame de animação
    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {

            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    //Atualização do movimento
    update() {
        this.desenho()
        this.animateFrames()
    }
}

class Lutador extends Sprite {

    //função dentro da classe
    constructor({
        position,
        velocidade,
        color = 'red',
        imagemSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        hitBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imagemSrc,
            scale,
            framesMax,
            offset
        })
        this.position = position
        this.velocidade = velocidade
        this.width = 50
        this.height = 150
        this.ultimaTecla
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: hitBox.offset,
            width: hitBox.width,
            height: hitBox.height
        }
        this.atacando
        this.color = color
        this.vida = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].imagem = new Image()
            sprites[sprite].imagem.src = sprites[sprite].imagemSrc
        }
        console.log(this.sprites)
    }

    //Atualização do movimento
    update() {
        this.desenho()
        if (!this.dead) this.animateFrames()

        //Hit box
        this.hitBox.position.x = this.position.x + this.hitBox.offset.x
        this.hitBox.position.y = this.position.y + this.hitBox.offset.y

        //desenha o hit box
        //ctx.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height)

        this.position.x += this.velocidade.x
        this.position.y += this.velocidade.y

        //Gravidade
        if (this.position.y + this.height + this.velocidade.y >= canvas.height - 96.5) {
            this.velocidade.y = 0
            this.position.y = 330
        } else {
            this.velocidade.y += gravidade
        }

    }

    ataque() {
        this.switchSprite('attack1')
        this.atacando = true
    }

    takeHit() {
        this.vida -= 20

        if (this.vida <= 0) {
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite) {
        //animação de morte
        if (this.imagem === this.sprites.death.imagem) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }
        // sobrepõe todas a outras animações com a animação de ataque
        if (this.imagem === this.sprites.attack1.imagem &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1)
            return


        // sobrepõe quando o lutador recebe o hit
        if (this.imagem === this.sprites.takeHit.imagem &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1)
            return

        switch (sprite) {
            case 'idle':
                if (this.imagem !== this.sprites.idle.imagem) {
                    this.imagem = this.sprites.idle.imagem
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'run':
                if (this.imagem !== this.sprites.run.imagem) {
                    this.imagem = this.sprites.run.imagem
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'jump':
                if (this.imagem !== this.sprites.jump.imagem) {
                    this.imagem = this.sprites.jump.imagem
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'fall':
                if (this.imagem !== this.sprites.fall.imagem) {
                    this.imagem = this.sprites.fall.imagem
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break


            case 'attack1':
                if (this.imagem !== this.sprites.attack1.imagem) {
                    this.imagem = this.sprites.attack1.imagem
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'takeHit':
                if (this.imagem !== this.sprites.takeHit.imagem) {
                    this.imagem = this.sprites.takeHit.imagem
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'death':
                if (this.imagem !== this.sprites.death.imagem) {
                    this.imagem = this.sprites.death.imagem
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break

        }
    }
}