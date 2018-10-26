"use strict";

// enables lib debugging statements
process.env.DEBUG = "dialogflow:debug";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { List } = require("actions-on-google");

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    const arrMedicos = [
      {
        nome: "Dr. João Da Silva",
        especialidades: ["Gastro", "Clínico geral"],
        regiao: ["Canasvieiras", "Norte da ilha"],
        endereco: "rua 1",
        telefone: "48 3331 4488"
      },
      {
        nome: "Dr. Asafe do Nascimento",
        especialidades: ["Pediatria", "Clínico geral"],
        regiao: ["Centro"],
        endereco: "rua 2",
        telefone: "48 9991 4487"
      },
      {
        nome: "Dra. Berenice Damasceno",
        especialidades: ["Pediatria", "Clínico geral"],
        regiao: ["Centro"],
        endereco: "rua 2",
        telefone: "48 9991 4487"
      }
    ];

    function realizarBusca(agent) {
      const nmUsuarioConst = agent.parameters.NomeUsuario;
      let nuCarterinha = "";
      for (let i = 0; i < nmUsuarioConst.length; i++) {
        nuCarterinha += nmUsuarioConst.charCodeAt(i);
      }
      nuCarterinha += "000000000000";
      if (nuCarterinha.length > 12) {
        nuCarterinha = nuCarterinha.substr(0, 12);
      }
      agent.add(`O número de sua carteirinha é 0 025 ${nuCarterinha} 3 `);
    }

    function buscarMedicoPorEspecialidade(agent) {
      const regiaoConst = agent.parameters.Regiao;
      const especialidadeConst = agent.parameters.Especialidades;
      const resultado = arrMedicos.filter(el => {
        let retorno = true;
        regiaoConst && (retorno = retorno && el.regiao.includes(regiaoConst));
        especialidadeConst &&
          (retorno = retorno && el.especialidades.includes(especialidadeConst));
        return retorno;
      });
      mensagemMedicos(agent, resultado);
    }

    function mensagemMedicos(agent, medicos) {
      !medicos.length
        ? agent.add("Nenhum médico encontrado.")
        : medicos.foreach(medico => {
            agent.add(medico.nome.toUpperCase());
            agent.add(medico.telefone);
            agent.add(medico.endereco);
          });
    }

    let intentMap = new Map();
    intentMap.set("BuscarNumeroCarteirinha", realizarBusca);
    intentMap.set("BuscarMedicoPorEspecialidade", buscarMedicoPorEspecialidade);
    agent.handleRequest(intentMap);
  }
);
