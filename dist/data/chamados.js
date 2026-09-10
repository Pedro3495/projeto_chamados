const chamados = [];
function ehPrioridade(valor) {
    return (valor === "Baixa" ||
        valor === "Media" ||
        valor === "Alta" ||
        valor === "Urgente");
}
function ehStatus(valor) {
    return (valor === "Aberto" ||
        valor === "Em andamento" ||
        valor === "Aguardando cliente" ||
        valor === "Concluído");
}
export { chamados, ehPrioridade, ehStatus };
