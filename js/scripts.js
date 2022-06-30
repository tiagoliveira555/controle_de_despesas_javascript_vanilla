const transacoesUl = document.querySelector(".transacoes");
const saldoAtual = document.querySelector(".saldo_atual");
const receitas = document.querySelector(".receitas");
const despesas = document.querySelector(".despesas");

const nomeForm = document.querySelector("#nome");
const valorForm = document.querySelector("#valor");
const btnSubmit = document.querySelector("#btn_submit");

const getBanco = () => JSON.parse(localStorage.getItem("despesas")) ?? [];
const setBanco = (bd) => localStorage.setItem("despesas", JSON.stringify(bd));

const transacoes = getBanco();

const valorAtualTransacao = () =>
  transacoes.map((t) => t.valor).reduce((acc, v) => acc + v, 0);

const valorReceitasTransacao = () =>
  transacoes
    .map((t) => t.valor)
    .filter((v) => v > 0)
    .reduce((acc, v) => acc + v, 0);

const valorDespesasTransacoes = () =>
  transacoes
    .map((t) => t.valor)
    .filter((v) => v < 0)
    .reduce((acc, v) => acc + v, 0);

const removerTransacao = (id) => {
  const index = transacoes.map((t) => t.id).findIndex((i) => i === id);

  transacoes.splice(index, 1);

  setBanco(transacoes);
  clear();
  transacoes.map((t) => transacaoPrint(t));
  atualizaSaldo();
};

const atualizaSaldo = () => {
  saldoAtual.innerHTML = valorAtualTransacao().toFixed(2);
  receitas.innerHTML = valorReceitasTransacao().toFixed(2);
  despesas.innerHTML = Math.abs(valorDespesasTransacoes()).toFixed(2);
};

const transacaoPrint = ({ id, nome, valor }) => {
  const classTransacao = valor < 0 ? "negativo" : "positivo";
  const sinal = valor < 0 ? "-" : "+";
  const valorFormatado = Math.abs(valor).toFixed(2);

  const li = document.createElement("li");
  li.classList.add(classTransacao);

  li.innerHTML = `
    <span class="apagar" onClick=removerTransacao(${id})>x</span>
    <p>${nome}</p><span>${sinal} R$ ${valorFormatado}</span>
    `;

  transacoesUl.prepend(li);
};

const gerarId = () => {
  return Math.round(Math.random() * 1000);
};

const clear = () => {
  transacoesUl.innerHTML = "";
  nomeForm.value = "";
  valorForm.value = "";
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (nomeForm.value === "" || valorForm.value === "") {
    alert("Preencha todos os campos");
    return;
  }

  const transacao = {
    id: gerarId(),
    nome: nomeForm.value,
    valor: Number(valorForm.value),
  };

  transacoes.push(transacao);
  setBanco(transacoes);
  clear();
  transacoes.map((t) => transacaoPrint(t));
  atualizaSaldo();
};

transacoes.map((t) => transacaoPrint(t));
atualizaSaldo();

btnSubmit.addEventListener("click", handleSubmit);
