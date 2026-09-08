import type { Chamado, Status, Prioridade } from "./data/chamados";

type Ordenacao = "recentes" | "antigos" | "prioridade";

export function aplicarFiltros(
  lista: Chamado[],
  termo: string,
  status: Status,
  prioridade: Prioridade,
  ordenacao: Ordenacao,
) {
  const chamadosFiltrados = lista.filter((chamado) => {
    const correspondeStatus = status === "" || chamado.status === status;
    const correspondePesquisa =
      chamado.titulo.toLowerCase().includes(termo) ||
      chamado.clienteNome.toLowerCase().includes(termo);
    const correspondePrioridade =
      prioridade === "" || chamado.prioridade === prioridade;
    return correspondePesquisa && correspondeStatus && correspondePrioridade;
  });

  const chamadosOrdenados = [...chamadosFiltrados];

  chamadosOrdenados.sort((a: Chamado, b: Chamado) => {
    const data1 = new Date(a.dataAbertura).getTime();
    const data2 = new Date(b.dataAbertura).getTime();

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
        "": 0,
      };
      return pesoPrioridade[b.prioridade] - pesoPrioridade[a.prioridade];
    }
    return 0;
  });
}


