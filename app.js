let estadoApp = {
    relatorioAtual: {
        titulo: "Trecho_Rodovia_BR101_km42",
        descricao1: "Pavimentação de Camada Asfáltica - Lote 02",
        descricao2: "Contratada: Construtora Exemplo S/A"
    },
    fotosRelatorio: [
        {
            id: 1,
            observacao: "Execução de imprimação betuminosa na Estaca 120+10m",
            coordenadas: "-23.550520, -46.633308",
            dataHora: "27/07/2026 10:15:20"
        },
        {
            id: 2,
            observacao: "Controle de temperatura da massa asfáltica (145°C)",
            coordenadas: "-23.551200, -46.634000",
            dataHora: "27/07/2026 11:45:10"
        }
    ]
};

function acionarPainelSalvamento() {
    try {
        gerarRelatorioPDF(estadoApp.relatorioAtual, estadoApp.fotosRelatorio);
        gerarPlanilhaExcel(estadoApp.relatorioAtual, estadoApp.fotosRelatorio);
        gerarKmlRestritoDoRelatorio(estadoApp.relatorioAtual, estadoApp.fotosRelatorio);
    } catch (erro) {
        console.error("Erro na exportação:", erro);
        alert("Erro ao gerar os arquivos.");
    }
}