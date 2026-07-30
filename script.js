const form = document.getElementById("form-aparelho");

const nomeInput = document.getElementById("nome");
const potenciaInput = document.getElementById("potencia");
const horasInput = document.getElementById("horas");
const diasInput = document.getElementById("dias");
const tarifaInput = document.getElementById("tarifa");

const listaAparelhos = document.getElementById("lista-aparelhos");
const mensagemVazia = document.getElementById("mensagem-vazia");

const consumoTotalElemento = document.getElementById("consumo-total");
const custoTotalElemento = document.getElementById("custo-total");
const custoAnualElemento = document.getElementById("custo-anual");
const quantidadeElemento = document.getElementById("quantidade-aparelhos");

const destaqueConsumo = document.getElementById("destaque-consumo");
const graficoConsumo = document.getElementById("grafico-consumo");

const indiceEdicao = document.getElementById("indice-edicao");

const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");
const botaoLimpar = document.getElementById("botao-limpar");

let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || [];

const tarifaSalva = localStorage.getItem("tarifa");

if (tarifaSalva) {
    tarifaInput.value = tarifaSalva;
}


/* ------------------------------
   Armazenamento
------------------------------ */

function salvarDados() {
    localStorage.setItem("aparelhos", JSON.stringify(aparelhos));
}

function salvarTarifa() {
    localStorage.setItem("tarifa", tarifaInput.value);
}


/* ------------------------------
   Cálculos
------------------------------ */

function calcularConsumo(potencia, horas, dias) {
    return (potencia * horas * dias) / 1000;
}

function calcularCusto(consumo) {
    const tarifa = Number(tarifaInput.value);

    return consumo * tarifa;
}

function atualizarValoresAparelhos() {
    aparelhos.forEach(function (aparelho) {
        aparelho.consumo = calcularConsumo(
            aparelho.potencia,
            aparelho.horas,
            aparelho.dias
        );

        aparelho.custo = calcularCusto(aparelho.consumo);
    });
}


/* ------------------------------
   Formatação
------------------------------ */

function formatarNumero(valor) {
    return valor.toFixed(2).replace(".", ",");
}

function formatarDinheiro(valor) {
    const formatador = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    return formatador.format(valor);
}


/* ------------------------------
   Classificação de consumo
------------------------------ */

function classificarConsumo(consumo) {
    if (consumo < 50) {
        return {
            texto: "Baixo",
            classe: "nivel-baixo"
        };
    }

    if (consumo < 150) {
        return {
            texto: "Moderado",
            classe: "nivel-moderado"
        };
    }

    return {
        texto: "Alto",
        classe: "nivel-alto"
    };
}


/* ------------------------------
   Resumo
------------------------------ */

function atualizarResumo() {
    let consumoTotal = 0;
    let custoTotal = 0;

    aparelhos.forEach(function (aparelho) {
        consumoTotal += aparelho.consumo;
        custoTotal += aparelho.custo;
    });

    consumoTotalElemento.textContent =
        formatarNumero(consumoTotal) + " kWh";

    custoTotalElemento.textContent =
        formatarDinheiro(custoTotal);

    custoAnualElemento.textContent =
        formatarDinheiro(custoTotal * 12);

    quantidadeElemento.textContent =
        String(aparelhos.length);

    atualizarDestaque(consumoTotal);
}


/* ------------------------------
   Maior consumidor
------------------------------ */

function atualizarDestaque(consumoTotal) {
    if (aparelhos.length === 0) {
        destaqueConsumo.className = "destaque-vazio";
        destaqueConsumo.textContent =
            "Cadastre aparelhos para visualizar a análise.";

        return;
    }

    let maiorConsumidor = aparelhos[0];

    aparelhos.forEach(function (aparelho) {
        if (aparelho.consumo > maiorConsumidor.consumo) {
            maiorConsumidor = aparelho;
        }
    });

    let percentual = 0;

    if (consumoTotal > 0) {
        percentual =
            (maiorConsumidor.consumo / consumoTotal) * 100;
    }

    destaqueConsumo.className = "destaque";

    destaqueConsumo.innerHTML = `
        <strong>
            Maior consumidor: ${maiorConsumidor.nome}
        </strong>

        <span>
            ${formatarNumero(maiorConsumidor.consumo)} kWh/mês,
            equivalente a ${formatarNumero(percentual)}%
            do consumo cadastrado.
        </span>
    `;
}


/* ------------------------------
   Gráfico
------------------------------ */

function atualizarGrafico() {
    graficoConsumo.innerHTML = "";

    if (aparelhos.length === 0) {
        graficoConsumo.innerHTML = `
            <p class="grafico-vazio">
                Nenhum dado disponível.
            </p>
        `;

        return;
    }

    const aparelhosOrdenados = [...aparelhos];

    aparelhosOrdenados.sort(function (a, b) {
        return b.consumo - a.consumo;
    });

    const maiorConsumo = aparelhosOrdenados[0].consumo;

    aparelhosOrdenados.forEach(function (aparelho) {
        let largura = 0;

        if (maiorConsumo > 0) {
            largura =
                (aparelho.consumo / maiorConsumo) * 100;
        }

        const item = document.createElement("div");

        item.className = "item-grafico";

        item.innerHTML = `
            <span class="nome-grafico">
                ${aparelho.nome}
            </span>

            <div class="barra-fundo">
                <div
                    class="barra-consumo"
                    style="width: ${largura}%"
                ></div>
            </div>

            <span class="valor-grafico">
                ${formatarNumero(aparelho.consumo)} kWh
            </span>
        `;

        graficoConsumo.appendChild(item);
    });
}


/* ------------------------------
   Tabela
------------------------------ */

function renderizarAparelhos() {
    atualizarValoresAparelhos();

    listaAparelhos.innerHTML = "";

    let consumoTotal = 0;

    aparelhos.forEach(function (aparelho) {
        consumoTotal += aparelho.consumo;
    });

    if (aparelhos.length === 0) {
        mensagemVazia.style.display = "block";
        botaoLimpar.style.display = "none";
    } else {
        mensagemVazia.style.display = "none";
        botaoLimpar.style.display = "block";
    }

    aparelhos.forEach(function (aparelho, indice) {
        let participacao = 0;

        if (consumoTotal > 0) {
            participacao =
                (aparelho.consumo / consumoTotal) * 100;
        }

        const nivel = classificarConsumo(aparelho.consumo);

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${aparelho.nome}</td>

            <td>
                ${aparelho.potencia} W
            </td>

            <td>
                ${aparelho.horas} h/dia
                <br>
                ${aparelho.dias} dias/mês
            </td>

            <td>
                ${formatarNumero(aparelho.consumo)} kWh
            </td>

            <td>
                <span class="nivel ${nivel.classe}">
                    ${nivel.texto}
                </span>
            </td>

            <td>
                ${formatarDinheiro(aparelho.custo)}
            </td>

            <td>
                ${formatarNumero(participacao)}%
            </td>

            <td>
                <div class="acoes">

                    <button
                        class="botao-editar"
                        onclick="editarAparelho(${indice})"
                    >
                        Editar
                    </button>

                    <button
                        class="botao-excluir"
                        onclick="excluirAparelho(${indice})"
                    >
                        Excluir
                    </button>

                </div>
            </td>
        `;

        listaAparelhos.appendChild(linha);
    });

    atualizarResumo();
    atualizarGrafico();
    salvarDados();
}


/* ------------------------------
   Cadastro e edição
------------------------------ */

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = nomeInput.value.trim();
    const potencia = Number(potenciaInput.value);
    const horas = Number(horasInput.value);
    const dias = Number(diasInput.value);

    if (
        nome === "" ||
        potencia <= 0 ||
        horas <= 0 ||
        horas > 24 ||
        dias <= 0 ||
        dias > 31
    ) {
        alert("Preencha os campos corretamente.");

        return;
    }

    const aparelho = {
        nome: nome,
        potencia: potencia,
        horas: horas,
        dias: dias,
        consumo: 0,
        custo: 0
    };

    if (indiceEdicao.value !== "") {
        const indice = Number(indiceEdicao.value);

        aparelhos[indice] = aparelho;
    } else {
        aparelhos.push(aparelho);
    }

    renderizarAparelhos();
    cancelarEdicao();
});


/* ------------------------------
   Editar
------------------------------ */

function editarAparelho(indice) {
    const aparelho = aparelhos[indice];

    nomeInput.value = aparelho.nome;
    potenciaInput.value = aparelho.potencia;
    horasInput.value = aparelho.horas;
    diasInput.value = aparelho.dias;

    indiceEdicao.value = String(indice);

    botaoSalvar.textContent = "Salvar alterações";

    botaoCancelar.classList.remove("oculto");

    nomeInput.focus();
}


/* ------------------------------
   Cancelar edição
------------------------------ */

function cancelarEdicao() {
    form.reset();

    indiceEdicao.value = "";

    botaoSalvar.textContent = "Adicionar aparelho";

    botaoCancelar.classList.add("oculto");
}


/* ------------------------------
   Excluir
------------------------------ */

function excluirAparelho(indice) {
    const confirmou = confirm(
        "Deseja excluir este aparelho?"
    );

    if (!confirmou) {
        return;
    }

    aparelhos.splice(indice, 1);

    renderizarAparelhos();
}


/* ------------------------------
   Limpar lista
------------------------------ */

botaoLimpar.addEventListener("click", function () {
    if (aparelhos.length === 0) {
        return;
    }

    const confirmou = confirm(
        "Deseja excluir todos os aparelhos cadastrados?"
    );

    if (!confirmou) {
        return;
    }

    aparelhos = [];

    renderizarAparelhos();
});


/* ------------------------------
   Cancelar
------------------------------ */

botaoCancelar.addEventListener("click", function () {
    cancelarEdicao();
});


/* ------------------------------
   Atualização da tarifa
------------------------------ */

tarifaInput.addEventListener("change", function () {
    if (Number(tarifaInput.value) <= 0) {
        tarifaInput.value = "1.00";
    }

    salvarTarifa();
    renderizarAparelhos();
});


/* ------------------------------
   Inicialização
------------------------------ */

renderizarAparelhos();