let fii_user = [];
let fii_table = [];

async function carregarDadosUser(url) {
    await fetch(url)
        .then(resp => resp.json())
        .then(json => fii_user = json);
    carregarDadosFundos();
}

async function carregarDadosFundos() {

    for (let FII of fii_user) {
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${FII.nome}`)
            .then(resp => resp.json());

        fii_table.push(json);
    }

    if (fii_table.length > 0) {
        document.querySelector("#loading").style.display = "none";
    }

    exibirTabela(fii_table, fii_user);
}

carregarDadosUser("json/fii.json");

function exibirTabela(fii_table, fii_user) {

    let saidaDados = "";
    let dadosfiiUser = [];
    let proventoTotal = 0;
    let cotasTotal = 0;
    let investTotal = 0;

    for (let i = 0; i < fii_user.length; i++) {
        dadosfiiUser.push(fii_table.find((item) => item.fundo.indexOf(fii_user[i].nome.toUpperCase()) >= 0));
    }

    for (let i = 0; i < dadosfiiUser.length; i++) {
        proventoTotal += dadosfiiUser[i].pvp;
        cotasTotal += fii_user[i].qtde;
        investTotal += fii_user[i].totalgasto;

        let rendimento = ((dadosfiiUser[i].pvp * 100) / dadosfiiUser[i].minMes).toFixed(2);

        let classeDados = (rendimento < 0.6) ? "negativo" : "positivo";

        saidaDados += `
            <tr class=${classeDados}>
                <td>${dadosfiiUser[i].fundo}</td>
                <td>${dadosfiiUser[i].setor}</td>
                <td>${dadosfiiUser[i].proximoRendimento.dataBase == "-" ? dadosfiiUser[i].ultimoRendimento.dataBase : dadosfiiUser[i].proximoRendimento.dataBase}</td>
                <td>${dadosfiiUser[i].proximoRendimento.dataPag == "-" ? dadosfiiUser[i].ultimoRendimento.dataPag : dadosfiiUser[i].proximoRendimento.dataPag}</td>
                <td>R$ ${dadosfiiUser[i].pvp}</td>
                <td>R$ ${dadosfiiUser[i].minMes}</td>
                <td>${fii_user[i].qtde}</td>
                <td>R$ ${fii_user[i].totalgasto}</td>
                <td>R$${(fii_user[i].totalgasto / fii_user[i].qtde).toFixed(2)}</td>
                <td>${rendimento} % </td>
                <td>${dadosfiiUser[i].dividendYield} % </td>
                <td>R$ ${dadosfiiUser[i].rendimentoMedio24M.toFixed(2)} </td>
            </tr>
        `;

    }

    saidaDados += `
    <tr class="trTotalGeral">
        <td colspan="4">Total Geral</td>
        <td>R$ ${proventoTotal.toFixed(2)}</td>
        <td> - </td>
        <td>${cotasTotal}</td>
        <td>R$ ${investTotal.toFixed(2)}</td>
        <td> - </td>
        <td> - </td>
        <td> - </td>
        <td> - </td>
    </tr>`;

    document.querySelector("#saidaTabela").innerHTML += saidaDados;
}