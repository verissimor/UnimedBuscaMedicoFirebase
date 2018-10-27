var medicos = [];
$("#resultados > li > div").toArray().map( el => {
	let medico = {};
	medico.nome  = $(el).children("span.fn").text().split("(CRM")[0].trim();
	medico.telefone = $(el).children(".tel").text().split(":")[1].replace(/\s\s+/g, ' ').trim();
	medico.especialidades = [];
	medico.regiao = [];
	$(el).children(".adr").toArray().forEach( adr => {
		const especialidades = $(adr).children("span.fn")[1].innerText.split("Especialidade(s):")
		if(especialidades.length <= 1) return;
		especialidades[1].split("|").forEach(espec => {
			medico.especialidades.push(espec.split("(RQE")[0].trim());
		})
		medico.regiao.push({
			bairro: $(adr).children(".locality").text().split("-")[0].trim(),
			endereco: $(adr).children(".street-address").text().replace(/\s\s+/g, ' ').trim()
		});
	});
	medicos.push(medico);
});
console.log(JSON.stringify(medicos));