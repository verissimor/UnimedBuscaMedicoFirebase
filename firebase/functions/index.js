// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

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
    especialidades: ["Pediatra", "Clínico geral"],
    regiao: ["Centro"],
    endereco: "rua 2",
    telefone: "48 9991 4487"
  },
  {
    nome: "Dra. Berenice Damasceno",
    especialidades: ["Pediatra", "Clínico geral"],
    regiao: ["Centro"],
    endereco: "rua 2",
    telefone: "48 9991 4487"
  }
];

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { List } = require("actions-on-google");

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });

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
      agent.add("oi erro");
    }

    function retornaNomeBonito(agent, medicos) {
      medicos.forEach(medico => {
        // agent.add(medico.nome + medico.endereco + medico.telefone);
      });
    }

    let intentMap = new Map();
    intentMap.set("BuscarNumeroCarteirinha", realizarBusca);
    intentMap.set("BuscarMedicoPorEspecialidade", buscarMedicoPorEspecialidade);
    agent.handleRequest(intentMap);
  }
);
