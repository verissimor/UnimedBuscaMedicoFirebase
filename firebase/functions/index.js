// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { List } = require("actions-on-google");

console.log("local runs here");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

const teste = function googleAssistantOther(agent) {
  let conv = agent.conv(); // Get Actions on Google library conversation object
  conv.ask("Please choose an item:"); // Use Actions on Google library to add responses
  conv.ask(
    new Carousel({
      title: "Google Assistant",
      items: {
        WorksWithGoogleAssistantItemKey: {
          title: "Works With the Google Assistant",
          description:
            "If you see this logo, you know it will work with the Google Assistant.",
          image: {
            url: imageUrl,
            accessibilityText: "Works With the Google Assistant logo"
          }
        },
        GoogleHomeItemKey: {
          title: "Google Home",
          description: "Google Home is a powerful speaker and voice Assistant.",
          image: {
            url: imageUrl2,
            accessibilityText: "Google Home"
          }
        }
      }
    })
  );
  // Add Actions on Google library responses to your agent's response
  agent.add(conv);
};

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcome(agent) {
      agent.add(`Welcome to my agent!`);
    }

    function realizarBusca(agent) {
      console.log(agent);
      agent.add(
        `O número de sua carteirinha é 00 559 59059 5405 4 firebase local ==== ${JSON.stringify(
          agent.parameters
        )}`
      );
    }

    function buscarMedicoPorEspecialidade(agent) {
      const regiaoConst = agent.parameters.Regiao;
      const especialidadeConst = agent.parameters.Especialidades;
      const areasDeAtuacaoConst = agent.parameters.AreasDeAtuacao;
      const arrMedicos = [
        {
          nome: "M1",
          especialidades: ["Gastro", "Clínico geral"],
          regiao: ["Canasvieiras", "Norte da ilha"],
          endereco: "rua 1",
          telefone: "48 3331 4488"
        },
        {
          nome: "M2",
          especialidades: ["Pediatra", "Clínico geral"],
          regiao: ["Centro"],
          endereco: "rua 2",
          telefone: "48 9991 4487"
        }
      ];

      const resultado = arrMedicos.filter(el => {
        let retorno = true;
        regiaoConst && (retorno = retorno && el.regiao.includes(regiaoConst));
        especialidadeConst &&
          (retorno = retorno && el.especialidades.includes(especialidadeConst));
        return retorno;
      });

      agent.add(JSON.stringify(resultado));

      // https://dialogflow.com/docs/getting-started/integrate-services
      /* agent.add(
        new Card(
          {
            title: `Dr João Verissimo Ribeiro`,
            imageUrl:
              "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
            text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
            buttonText: "Ligar",
            buttonUrl: "https://www.google.com.br"
          },
          {
            title: `Dr Heitor Teixeira`,
            imageUrl:
              "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
            text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
            buttonText: "Ligar",
            buttonUrl: "https://www.google.com.br"
          },
          {
            title: `Dr Asafe`,
            imageUrl:
              "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
            text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
            buttonText: "Ligar",
            buttonUrl: "https://www.google.com.br"
          }
        )
      );
*/
      /*agent.add(`Heitor Teixeira 048996548002`);
      //agent.add(`João Verissimo 048996548002`);
      // agent.add(`Asafe dos Santos 048996548002`);
      // agent.add(new Suggestion(`Quick Reply`));
      // agent.add(new Suggestion(`Suggestion`));
      // agent.add(`top né??`);
      */
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function yourFunctionHandler(agent) {
    //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    //   agent.add(new Card({
    //       title: `Title: this is a card title`,
    //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //       buttonText: 'This is a button',
    //       buttonUrl: 'https://assistant.google.com/'
    //     })
    //   );
    //   agent.add(new Suggestion(`Quick Reply`));
    //   agent.add(new Suggestion(`Suggestion`));
    //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    // }

    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("BuscarNumeroCarteirinha", realizarBusca);
    intentMap.set("BuscarMedicoPorEspecialidade", buscarMedicoPorEspecialidade);
    agent.handleRequest(intentMap);
  }
);
