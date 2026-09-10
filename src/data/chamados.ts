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

function ehPrioridade(valor: string): valor is Prioridade {
  return (
    valor === "Baixa" ||
    valor === "Media" ||
    valor === "Alta" ||
    valor === "Urgente"
  );
}

function ehStatus(valor: string): valor is Status {
  return (
    valor === "Aberto" ||
    valor === "Em andamento" ||
    valor === "Aguardando cliente" ||
    valor === "Concluído"
  );
}

export { chamados, ehPrioridade, ehStatus };
export type { Chamado, Prioridade, Status };
