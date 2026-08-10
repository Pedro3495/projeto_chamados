export function aplicarFiltros(lista,termo,status,prioridade,ordenacao) {
  const chamadosFiltrados = lista.filter((chamado) => {
    const correspondeStatus =
      status === "" || chamado.status === status;
    const correspondePesquisa =
      chamado.titulo.toLowerCase().includes(termo) ||
      chamado.clienteNome.toLowerCase().includes(termo);
    const correspondePrioridade =
      prioridade === "" ||
      chamado.prioridade === prioridade;
    return correspondePesquisa && correspondeStatus && correspondePrioridade;
  });

  const chamadosOrdenados = [...chamadosFiltrados];

  chamadosOrdenados.sort((a, b) => {
    const data1 = new Date(a.dataAbertura);
    const data2 = new Date(b.dataAbertura);

    if (ordenacao === "recentes") {
      return data2 - data1;
    } else if (ordenacao === "antigos") {
      return data1 - data2;
    } else if (ordenacao === "prioridade") {
      const pesoPrioridade = {
        Urgente: 4,
        Alta: 3,
        Media: 2,
        Baixa: 1,
      };
      return pesoPrioridade[b.prioridade] - pesoPrioridade[a.prioridade];
    }
  });

  return chamadosOrdenados
}
