let chaveIA = "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"

const input = document.querySelector(".input-cidade")
const caixa = document.querySelector(".caixa-media")

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        cliqueiNoBotao()
    }
})

async function cliqueiNoBotao(){

    let cidade = input.value

    let chave = "23ebaff3fc5e90e056c7a2fa4f7a286e"
    let endereco =
    `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`

    let respostaServidor = await fetch(endereco)
    let dadosJson = await respostaServidor.json()

    if(dadosJson.cod == "404"){
        caixa.innerHTML = `<p style="color:red;">Local não encontrado</p>`
        return
    }

    mudarFundo(
    dadosJson.weather[0].main,
    dadosJson.dt,
    dadosJson.sys.sunrise,
    dadosJson.sys.sunset
)

    caixa.innerHTML = `
        <h2 class="cidade">${dadosJson.name}</h2>
        <p class="temp">${Math.floor(dadosJson.main.temp)} °C</p>
        <img class="icone" src="https://openweathermap.org/img/wn/${dadosJson.weather[0].icon}@2x.png">
        <p class="umidade">Umidade: ${dadosJson.main.humidity}%</p>
        <button class="botao-ia" onclick="pedirRoupa()">Sugestão de Roupa</button>
        <p class="resposta-ia"></p>
    `

    setTimeout(() => {
        caixa.classList.add("mostrar")
    }, 100)
}


function mudarFundo(clima, horaAtual, nascerSol, porSol){

    const ehDia = horaAtual >= nascerSol && horaAtual < porSol

    let imagem = ""


    if(ehDia){

        if(clima === "Clear"){
            imagem = "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')"
        }
        else if(clima === "Clouds"){
            imagem = "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63')"
        }
        else if(clima === "Rain"){
            imagem = "url('https://images.unsplash.com/photo-1501696461415-6bd6660c6742')"
        }
        else if(clima === "Drizzle"){
            imagem = "url('https://images.unsplash.com/photo-1527766833261-b09c3163a791')"
        }
        else if(clima === "Snow"){
            imagem = "url('https://images.unsplash.com/photo-1608889175778-7e8a89c2cfa6')"
        }
        else{
            imagem = "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')"
        }

    }


    else{

        if(clima === "Clear"){
            imagem = "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')"
        }
        else if(clima === "Clouds"){
            imagem = "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d')"
        }
        else if(clima === "Rain" || clima === "Drizzle"){
            imagem = "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21')"
        }
        else if(clima === "Snow"){
            imagem = "url('https://images.unsplash.com/photo-1483664852095-d6cc6870702d')"
        }
        else{
            imagem = "url('https://images.unsplash.com/photo-1519681393784-d120267933ba')"
        }
    }

    document.body.classList.add("fade-bg")

    setTimeout(() => {
        document.body.style.setProperty("--bg-image", imagem)
        document.body.classList.remove("fade-bg")
    }, 400)
}


function detectaVoz(){
    let reconhecimento = new window.webkitSpeechRecognition()
    reconhecimento.lang = "pt-BR"
    reconhecimento.start()

    reconhecimento.onresult = function(evento){
        input.value = evento.results[0][0].transcript
        cliqueiNoBotao()
    }
}


async function pedirRoupa(){

    let respostaElemento = document.querySelector(".resposta-ia")
    let temperatura = document.querySelector(".temp").textContent
    let umidade = document.querySelector(".umidade").textContent
    let cidade = document.querySelector(".cidade").textContent

    respostaElemento.innerHTML = "Pensando..."

    let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + chaveIA
        },
        body: JSON.stringify({
            model: "meta-llama/llama-4-maverick-17b-128e-instruct",
            messages: [{
                role: "user",
                content: `Me dê uma sugestão de roupa.
Cidade: ${cidade}
Temperatura: ${temperatura}
Umidade: ${umidade}
Responda em 2 frases curtas.`
            }]
        })
    })

    let dados = await resposta.json()
    respostaElemento.innerHTML = dados.choices[0].message.content
}