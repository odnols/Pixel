const width = 768;
const height = 1152;
let canvas, canvas2

function get(alvo) {

    let alvos = document.getElementsByClassName(alvo)
    if (alvos.length < 1) return document.getElementById(alvo)

    return alvos
}

function preview_canvas() {

    canvas = get('preview')

    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)

    let file = get("input").files
    let fileReader = new FileReader()
    const img = new Image();

    fileReader.onload = function (event) {
        img.src = event.target.result
    }

    img.onload = function () {

        const resolucao = parseInt(get("resolucao").value)

        let canvas_width = parseInt(this.width / resolucao) * resolucao
        let canvas_height = parseInt(this.height / resolucao) * resolucao

        canvas.height = canvas_height
        canvas.width = canvas_width

        context.drawImage(img, 0, 0, canvas_width, canvas_height);

        pixaliza()
    }

    fileReader.readAsDataURL(file[0])

    get("loading").style.display = "block";
}

function pixaliza() {

    // Quantidade de pixels por chunk
    const escala = parseInt(get("escala").value)
    let resolucao = parseInt(get("resolucao").value)

    canvas = get('preview')
    const context = canvas.getContext("2d")

    canvas2 = get('canvas')
    const context2 = canvas2.getContext("2d")

    canvas2.height = canvas.height * escala
    canvas2.width = canvas.width * escala

    for (let i = 0; i < parseInt(width / resolucao); i++) {
        for (let z = 0; z < parseInt(height / resolucao); z++) {

            // Coletando as cores destaques da região do canvas
            const idata = context.getImageData(i * resolucao, z * resolucao, i > 0 ? i * resolucao : resolucao, z > 0 ? z * resolucao : resolucao).data;

            // Desenhando a cor destaque no novo canvas
            context2.fillStyle = `rgba(${idata[0]},${idata[1]},${idata[2]},${idata[3]})`
            context2.fillRect(i * (resolucao * escala), z * (resolucao * escala), i > 0 ? i * (resolucao * escala) : (resolucao * escala), z > 0 ? z * (resolucao * escala) : (resolucao * escala))
            context2.stroke()
        }
    }

    get("loading").style.display = "none";
}