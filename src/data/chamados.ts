type Chamado = {
  clienteNome: string;
  dataAbertura: string;
  id: number;
  prioridade: Prioridade;
  status: Status;
  titulo: string;
};

type Prioridade = "Baixa" | "Media" | "Alta" | "Urgente";
type Status = "Aberto" | "Em andamento" | "Aguardando cliente" | "Concluído";

const chamados: Chamado[] = [];

export { chamados, Chamado };
