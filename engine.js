// --- MOTOR DE PDF (4 Fotos por página, Clean) ---
function gerarRelatorioPDF(dadosRelatorio, listaFotos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const larguraPagina = 210;
    const margem = 15;
    
    listaFotos.forEach((foto, index) => {
        if (index > 0 && index % 4 === 0) doc.addPage();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(dadosRelatorio.titulo.replace(/_/g, ' '), margem, 15);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(dadosRelatorio.descricao1, margem, 21);
        doc.text(dadosRelatorio.descricao2, margem, 26);

        doc.setLineWidth(0.5);
        doc.setDrawingColor(200, 200, 200);
        doc.line(margem, 32, larguraPagina - margem, 32);

        let posicaoNaPagina = index % 4;
        let coluna = posicaoNaPagina % 2;
        let linha = Math.floor(posicaoNaPagina / 2);
        let larguraBloco = (larguraPagina - (margem * 2) - 10) / 2;
        let posX = margem + (coluna * (larguraBloco + 10));
        let posY = 40 + (linha * 60);

        doc.setDrawColor(150, 150, 150);
        doc.rect(posX, posY, larguraBloco, 35);
        doc.setFontSize(8);
        doc.text("[Espaço da Foto]", posX + (larguraBloco/2) - 20, posY + 18);

        let textoMetadados = `Obs: ${foto.observacao}\nGPS: ${foto.coordenadas}\nData: ${foto.dataHora}`;
        let linhasTexto = doc.splitTextToSize(textoMetadados, larguraBloco);
        doc.text(linhasTexto, posX, posY + 42);
    });

    doc.save(`${dadosRelatorio.titulo}_Relatorio.pdf`);
}

// --- MOTOR DE EXCEL ---
function gerarPlanilhaExcel(dadosRelatorio, listaFotos) {
    let dadosPlanilha = [
        ["RELATÓRIO DE CAMPO - DADOS GERAIS"],
        ["Obra / Trecho:", dadosRelatorio.titulo.replace(/_/g, ' ')],
        ["Descrição Principal:", dadosRelatorio.descricao1],
        ["Descrição Secundária:", dadosRelatorio.descricao2],
        [],
        ["#", "Data/Hora", "Coordenadas GPS", "Anotações de Campo"]
    ];

    listaFotos.forEach((foto, index) => {
        dadosPlanilha.push([index + 1, foto.dataHora, foto.coordenadas, foto.observacao]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(dadosPlanilha);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");
    XLSX.writeFile(workbook, `${dadosRelatorio.titulo}_Planilha.xlsx`);
}

// --- MOTOR DE KML RESTRITO ---
function gerarKmlRestritoDoRelatorio(dadosRelatorio, listaFotos) {
    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n  <Document>\n    <name>${dadosRelatorio.titulo} - Waypoints</name>`;

    listaFotos.forEach((foto, index) => {
        let coords = foto.coordenadas.split(',').map(item => item.trim());
        if (coords.length === 2) {
            let lon = parseFloat(coords[1]);
            let lat = parseFloat(coords[0]);
            if (!isNaN(lat) && !isNaN(lon)) {
                kmlContent += `\n    <Placemark>\n      <name>Foto #${index + 1}</name>\n      <description><![CDATA[<b>Anotação:</b> ${foto.observacao}]]></description>\n      <Point>\n        <coordinates>${lon},${lat},0</coordinates>\n      </Point>\n    </Placemark>`;
            }
        }
    });

    kmlContent += `\n  </Document>\n</kml>`;

    let encodedUri = "data:application/vnd.google-earth.kml+xml;charset=utf-8," + encodeURIComponent(kmlContent);
    let a = document.createElement('a');
    a.href = encodedUri;
    a.download = `${dadosRelatorio.titulo}_Waypoints.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}