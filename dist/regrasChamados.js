export function obterProximoId(lista) {
    if (lista.length === 0) {
        return 1;
    }
    return Math.max(...lista.map((chamado) => chamado.id)) + 1;
}
export function criarChamado(lista, dados, dataAbertura) {
    const novoChamado = {
        ...dados,
        id: obterProximoId(lista),
        dataAbertura,
    };
    return [...lista, novoChamado];
}
export function atualizarChamado(lista, id, dados) {
    return lista.map((chamado) => {
        if (chamado.id === id) {
            return {
                ...chamado,
                ...dados,
            };
        }
        return chamado;
    });
}
export function excluirChamado(lista, id) {
    return lista.filter((chamado) => chamado.id !== id);
}
