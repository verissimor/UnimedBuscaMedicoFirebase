"use strict";

/**
* Enables lib debugging statements
*/
process.env.DEBUG = "dialogflow:debug";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { List } = require("actions-on-google");

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    const agent = new WebhookClient({ request, response });

    function buscarNumeroCarteirinha(agent) {
      const nmUsuarioConst = agent.parameters.NomeUsuario;
      let nuCarterinha = "";
      for (let i = 0; i < nmUsuarioConst.length; i++)
        nuCarterinha += nmUsuarioConst.charCodeAt(i);
      nuCarterinha += "000000000000";
      if (nuCarterinha.length > 12)
        nuCarterinha = nuCarterinha.substr(0, 12);
      agent.add(`O número da carteirinha é: 0 025 ${nuCarterinha} 3 `);
    }

    function buscarMedicoPorEspecialidade(agent) {
      const regiaoTxt = removerAcentos(agent.parameters.Regiao).toUpperCase();
      const especialidadesTxt = removerAcentos(agent.parameters.Especialidades).toUpperCase();
      const medicos = dbMedicos.filter(el => {
        let filter = true;
        if(regiaoTxt)
          filter = filter && el.regiao.filter(r => removerAcentos(r.bairro).toUpperCase().includes(regiaoTxt)).length
        if(especialidadesTxt)
          filter = filter && el.especialidades.filter(e => removerAcentos(e).toUpperCase().includes(especialidadesTxt)).length
        return filter;
      });
      return !medicos.length
        ? agent.add("Realizei um busca nos médicos , mas não consegui encontrar um  médico com essas características.")
        : medicos.forEach(medico => agent.add(medico.nome.toUpperCase()));
    }

    let intentMap = new Map();
    intentMap.set("BuscarNumeroCarteirinha", buscarNumeroCarteirinha);
    intentMap.set("BuscarMedicoPorEspecialidade", buscarMedicoPorEspecialidade);
    agent.handleRequest(intentMap);

  }
);

/**
 * Remove acentos de caracteres
 * @param  {String} stringComAcento [string que contem os acentos]
 * @return {String}                 [string sem acentos]
 */
function removerAcentos( newStringComAcento ) {
  var string = newStringComAcento;
  var mapaAcentosHex = {
    a : /[\xE0-\xE6]/g,
    A : /[\xC0-\xC6]/g,
    e : /[\xE8-\xEB]/g,
    E : /[\xC8-\xCB]/g,
    i : /[\xEC-\xEF]/g,
    I : /[\xCC-\xCF]/g,
    o : /[\xF2-\xF6]/g,
    O : /[\xD2-\xD6]/g,
    u : /[\xF9-\xFC]/g,
    U : /[\xD9-\xDC]/g,
    c : /\xE7/g,
    C : /\xC7/g,
    n : /\xF1/g,
    N : /\xD1/g
  };

  for ( var letra in mapaAcentosHex ) {
    var expressaoRegular = mapaAcentosHex[letra];
    string = string.replace( expressaoRegular, letra );
  }
  return string;
}

/**
 * LISTA DE MEDICOS DO SITE DA UNIMED
 */

var dbMedicos = [
   {
      "nome":"ABEL RAIMUNDO VIGA DO ROSARIO",
      "telefone":"(48) 3024-7863",
      "especialidades":[
         "Ortopedia e Traumatologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 404 - SL 508 T. II"
         }
      ]
   },
   {
      "nome":"ACKLEI VIANA",
      "telefone":"(48) 3225-2064 Telefone",
      "especialidades":[
         "Cirurgia de Cabeça e Pescoço",
         "Cirurgia de Cabeça e Pescoço"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - S/502"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA VIDAL RAMOS , 110 - 2 ANDAR"
         }
      ]
   },
   {
      "nome":"ADEMAR JOSE DE OLIVEIRA PAES JUNIOR",
      "telefone":"(48) 3229-7777",
      "especialidades":[
         "Radiologia e Diagnóstico por Imagem"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 -"
         }
      ]
   },
   {
      "nome":"ADEMAR VALSECHI",
      "telefone":"(48) 3222-8907",
      "especialidades":[
         "Oftalmologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AV HERCILIO LUZ , 1023 - S/02"
         }
      ]
   },
   {
      "nome":"ADILSON JOSE DAL MAGO",
      "telefone":"(48) 3228-8690",
      "especialidades":[
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PROFESSOR OTHON GAMA DECA , 900 - S/211"
         }
      ]
   },
   {
      "nome":"ADRIANA CARNEIRO WAISBLUT",
      "telefone":"(48) 4004-1300",
      "especialidades":[
         "Radiologia e Diagnóstico por Imagem"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA BOCAIUVA , 2013 -"
         }
      ]
   },
   {
      "nome":"ADRIANA DE SIQUEIRA CARVALHO KNABBEN",
      "telefone":"(48) 3029-6900",
      "especialidades":[
         "Pneumologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PROFESSOR HERMINIO JACQUES , 135 -"
         }
      ]
   },
   {
      "nome":"ADRIANA DE TOLEDO GIEBUROWSKI",
      "telefone":"(48) 3304-7306 Telefone",
      "especialidades":[
         "Ginecologia e Obstetrícia",
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PRESIDENTE NEREU RAMOS , 19 - SLS 901,902,903,904,905 E 906"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA BOCAIUVA , 2468 - 6 ANDAR SL. 09 E 10"
         }
      ]
   },
   {
      "nome":"ADRIANA DUTRA SCHMIDT",
      "telefone":"(48) 3235-3113 Telefone",
      "especialidades":[
         "Médico",
         "Médico"
      ],
      "regiao":[
         {
            "bairro":"CORREGO GRANDE",
            "endereco":"RUA SEBASTIAO LAURENTINO DA SILVA , 126 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PREFEITO OSMAR CUNHA , 415 -"
         }
      ]
   },
   {
      "nome":"ADRIANA FERRAZ MARTINS",
      "telefone":"(48) 3037-3900 Telefone",
      "especialidades":[
         "Cardiologia",
         "Cardiologia"
      ],
      "regiao":[
         {
            "bairro":"JOAO PAULO",
            "endereco":"RODOVIA JOSE CARLOS DAUX , 121 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA ESTEVES JUNIOR , 89 -"
         }
      ]
   },
   {
      "nome":"ADRIANA ISABEL COELHO",
      "telefone":"(48) 3222-4645 Telefone",
      "especialidades":[
         "Oftalmologia",
         "Oftalmologia"
      ],
      "regiao":[
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA SIDNEY NOCETTI , 62 - SALA 305 A 308"
         },
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA SIDNEY NOCETTI , 62 -"
         }
      ]
   },
   {
      "nome":"ADRIANA MAGALHAES DE OLIVEIRA FREITAS",
      "telefone":"(48) 3733-8103",
      "especialidades":[
         "Mastologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PROFESSOR OTHON GAMA D ECA , 677 - SL. 701"
         }
      ]
   },
   {
      "nome":"ADRIANA MELLO BAROTTO",
      "telefone":"(48) 3233-6169",
      "especialidades":[
         "Endocrinologia e Metabologia"
      ],
      "regiao":[
         {
            "bairro":"TRINDADE",
            "endereco":"RUA DES VITOR LIMA , 260 - SL. 309"
         }
      ]
   },
   {
      "nome":"ADRIANA SANTOS SOARES",
      "telefone":"(48) 3216-7000",
      "especialidades":[
         "Oftalmologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA DEPUTADO LEOBERTO LEAL , 14 -"
         }
      ]
   },
   {
      "nome":"ADRIANO CARNIEL VILELA",
      "telefone":"(48) 3223-6641",
      "especialidades":[
         "Cirurgia Vascular"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA ESTEVES JUNIOR , 366 - S/801"
         }
      ]
   },
   {
      "nome":"ADRIANO SCHAEFER MEYER",
      "telefone":"(48) 3207-2741 | (48) 3207-2742",
      "especialidades":[
         "Alergia e Imunologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PROF HERMINIO JACQUES , 122 -"
         }
      ]
   },
   {
      "nome":"ADUCIO LEONEL THIESEN",
      "telefone":"(48) 3223-5919 Telefone",
      "especialidades":[
         "Médico",
         "Médico"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 825 -"
         },
         {
            "bairro":"AGRONOMICA",
            "endereco":"AV RUI BARBOSA , 152 -"
         }
      ]
   },
   {
      "nome":"ADUCIO LEONEL THIESEN JUNIOR",
      "telefone":"(48) 3223-5919 | (48) 98822-4816 Telefone",
      "especialidades":[
         "Médico",
         "Médico"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 825 -"
         },
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA RUI BARBOSA , 152 -"
         }
      ]
   },
   {
      "nome":"AFFONSO NILTON WALMOR SELL RIBEIRO NETO",
      "telefone":"(48) 3228-8690 Telefone",
      "especialidades":[
         "Anestesiologia",
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PROFESSOR OTHON GAMA DECA , 900 - S/211"
         },
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PREFEITO OSMAR CUNHA , 415 -"
         }
      ]
   },
   {
      "nome":"AFONSO MARCIO BATISTA DA SILVA",
      "telefone":"(48) 3234-1654 | (48) 3234-1326",
      "especialidades":[
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"TRINDADE",
            "endereco":"AVENIDA MADRE BENVENUTA , 146 -"
         }
      ]
   },
   {
      "nome":"AIUKA JOSE DE ALMEIDA",
      "telefone":"(48) 3222-5900 | (48) 3222-5346 Telefone",
      "especialidades":[
         "Oncologia Clínica",
         "Oncologia Clínica"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 376 - HOSP DE CARIDADE"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - S/506"
         }
      ]
   },
   {
      "nome":"ALAN INDIO SERRANO",
      "telefone":"(48) 3028-9096 | (48) 3222-4096",
      "especialidades":[
         "Psiquiatria"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PRESIDENTE COUTINHO , 311 - SL. 505"
         }
      ]
   },
   {
      "nome":"ALBERTO AMBROGINI",
      "telefone":"(48) 3222-3605",
      "especialidades":[
         "Urologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 376 - HOSP DE CARIDADE"
         }
      ]
   },
   {
      "nome":"ALBERTO CHTERPENSQUE",
      "telefone":"(48) 3029-6900",
      "especialidades":[
         "Pneumologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PROFESSOR HERMINIO JACQUES , 135 -"
         }
      ]
   },
   {
      "nome":"ALBERTO DE PONTES JARDIM JUNIOR",
      "telefone":"(48) 3222-0087 Telefone",
      "especialidades":[
         "Anestesiologia",
         "Anestesiologia",
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - BLOCO A SALA 501"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - BLOCO C 2 ANDAR"
         },
         {
            "bairro":"CENTRO",
            "endereco":"AV HERCILIO LUZ , 1302 -"
         }
      ]
   },
   {
      "nome":"ALBERTO TRAPANI JUNIOR",
      "telefone":"(48) 3028-0878",
      "especialidades":[
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"CANTO",
            "endereco":"RUA PROFESSORA ANTONIETA DE BARROS , 211 -"
         }
      ]
   },
   {
      "nome":"ALDO ELIAS KIYOSHI TAKANO DE SAIDNEUY",
      "telefone":"(48) 3235-3113 Telefone",
      "especialidades":[
         "Cirurgia Geral",
         "Cirurgia do Aparelho Digestivo",
         "Cirurgia Geral",
         "Cirurgia do Aparelho Digestivo"
      ],
      "regiao":[
         {
            "bairro":"CORREGO GRANDE",
            "endereco":"RUA SEBASTIAO LAURENTINO DA SILVA , 126 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MADALENA BARBI , 125 -"
         }
      ]
   },
   {
      "nome":"ALEX MIRANDA RAMOS",
      "telefone":"(48) 3222-8898 Telefone",
      "especialidades":[
         "Geriatria",
         "Clínica Médica",
         "Geriatria",
         "Clínica Médica",
         "Geriatria",
         "Clínica Médica",
         "Geriatria",
         "Clínica Médica"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MADALENA BARBI , 67 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA VIDAL RAMOS , 110 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"AV MAURO RAMOS , 1494 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PREFEITO OSMAR CUNHA , 183 - BL A - SALAS 1110 A 1115"
         }
      ]
   },
   {
      "nome":"ALEXANDER ROMENO JANNER DAL FORNO",
      "telefone":"(48) 3028-2300 Telefone",
      "especialidades":[
         "Cardiologia",
         "Cardiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 633 -"
         },
         {
            "bairro":"JOAO PAULO",
            "endereco":"RODOVIA JOSE CARLOS DAUX , 121 -"
         }
      ]
   },
   {
      "nome":"ALEXANDRE BORTOLI MACHADO",
      "telefone":"(48) 3229-0290",
      "especialidades":[
         "Dermatologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA DOM JOAQUIM , 885 - 10 ANDAR CELSO RAMOS M.CENTER"
         }
      ]
   },
   {
      "nome":"ALEXANDRE CANELLA VALLIM",
      "telefone":"(48) 3224-0180",
      "especialidades":[
         "Radiologia e Diagnóstico por Imagem"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 380 - S/1103"
         }
      ]
   },
   {
      "nome":"ALEXANDRE CARLOS BUFFON",
      "telefone":"(48) 3251-9000 Telefone",
      "especialidades":[
         "Anestesiologia",
         "Anestesiologia",
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA RUI BARBOSA , 152 -"
         },
         {
            "bairro":"PANTANAL",
            "endereco":"RUA DEPUTADO ANTONIO EDU VIEIRA , 1414 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA FELIPE SCHMIDT , 982 -"
         }
      ]
   },
   {
      "nome":"ALEXANDRE DE AGUIAR RIBAS",
      "telefone":"(48) 3224-3265",
      "especialidades":[
         "Cardiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PRESIDENTE NEREU RAMOS , 69 - S/401"
         }
      ]
   },
   {
      "nome":"ALEXANDRE FALEIRO FIALHO",
      "telefone":"(48) 3223-6072",
      "especialidades":[
         "Cirurgia do Aparelho Digestivo",
         "Cirurgia Geral"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - SALA 209"
         }
      ]
   },
   {
      "nome":"ALEXANDRE HORN VIANNA",
      "telefone":"(48) 3322-0000",
      "especialidades":[
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MADALENA BARBI , 125 -"
         }
      ]
   },
   {
      "nome":"ALEXANDRE NASCIMENTO MATEUS",
      "telefone":"(48) 3322-0000",
      "especialidades":[
         "Cirurgia Oncológica",
         "Cirurgia Geral"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MADALENA BARBI , 125 -"
         }
      ]
   },
   {
      "nome":"ALEXANDRE POSSER",
      "telefone":"(48) 3244-9425 Telefone",
      "especialidades":[
         "Ortopedia e Traumatologia",
         "Ortopedia e Traumatologia"
      ],
      "regiao":[
         {
            "bairro":"ESTREITO",
            "endereco":"RUA SANTOS SARAIVA , 441 -"
         },
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA RUI BARBOSA , 152 -"
         }
      ]
   },
   {
      "nome":"ALEXANDRE SALLES IWERSEN",
      "telefone":"(48) 3029-0099 Telefone",
      "especialidades":[
         "Radiologia e Diagnóstico por Imagem",
         "Radiologia e Diagnóstico por Imagem"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA NEREU RAMOS , 19 - 1 andar"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA BARAO DE BATOVI , 551 -"
         }
      ]
   },
   {
      "nome":"ALEXANDRE STUDZINSKI DE SOUZA",
      "telefone":"(48) 3229-7777 Telefone",
      "especialidades":[
         "Radiologia e Diagnóstico por Imagem",
         "Radiologia e Diagnóstico por Imagem"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - BL A S/ 504"
         }
      ]
   },
   {
      "nome":"ALEXANDRE THOMAZ ARAUJO",
      "telefone":"(48) 3221-7500",
      "especialidades":[
         "Médico",
         "Medicina do Trabalho"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 376 -"
         }
      ]
   },
   {
      "nome":"ALFEU MARIANO DE OLIVEIRA",
      "telefone":"(48) 3248-7914",
      "especialidades":[
         "Medicina do Trabalho"
      ],
      "regiao":[
         {
            "bairro":"ESTREITO",
            "endereco":"RUA DOUTOR HEITOR BLUM , 522 -"
         }
      ]
   },
   {
      "nome":"ALFREDO MARTINS",
      "telefone":"(48) 3221-7524 | (48) 3221-7509",
      "especialidades":[
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 376 -"
         }
      ]
   },
   {
      "nome":"ALFREDO SPAUTZ GRANEMANN",
      "telefone":"(48) 3224-3099 Telefone",
      "especialidades":[
         "Cirurgia Plástica",
         "Cirurgia Plástica"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AV HERCILIO LUZ , 1302 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA HERCILIO LUZ , 1302 - SL. 01"
         }
      ]
   },
   {
      "nome":"ALICE FELDENS PEDOTTE",
      "telefone":"(48) 3228-7000 Telefone",
      "especialidades":[
         "Anestesiologia",
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA CRUZ E SOUZA , 73 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - BLOCO B 2 ANDAR"
         }
      ]
   },
   {
      "nome":"ALINE DA ROCHA LINO",
      "telefone":"(48) 3223-6072 Telefone",
      "especialidades":[
         "Oncologia Clínica",
         "Oncologia Clínica"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - SALA 209"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - BLOCO B 2 ANDAR"
         }
      ]
   },
   {
      "nome":"ALINE DE BORBA SCHEFFER",
      "telefone":"(48) 3324-1100",
      "especialidades":[
         "Clínica Médica"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA ANGELO LA PORTA , 64 -"
         }
      ]
   },
   {
      "nome":"ALINE DIAS SILVA GUERRERO GUIMARAES",
      "telefone":"(48) 4004-1300 E-mail",
      "especialidades":[
         "Radiologia e Diagnóstico por Imagem"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA BOCAIUVA , 2013 -"
         }
      ]
   },
   {
      "nome":"ALINE KOTH MENEGON AREND",
      "telefone":"(48) 3029-0099 Telefone",
      "especialidades":[
         "Radiologia e Diagnóstico por Imagem",
         "Radiologia e Diagnóstico por Imagem"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA BARAO DE BATOVI , 551 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA NEREU RAMOS , 19 - 1 andar"
         }
      ]
   },
   {
      "nome":"ALINE SUDOSKI",
      "telefone":"(48) 3224-9394 Telefone",
      "especialidades":[
         "Oftalmologia",
         "Oftalmologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA DOM JOAQUIM , 885 - 8 ANDAR"
         },
         {
            "bairro":"CENTRO",
            "endereco":"SRV MISSAO JOVEM , 38 - MATRIZ"
         }
      ]
   },
   {
      "nome":"ALISSON PITTOL BRESCIANI",
      "telefone":"(48) 3304-2504",
      "especialidades":[
         "Neurologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA TROMPOWSKY , 291 - TORRE A SL 803"
         }
      ]
   },
   {
      "nome":"ALMIR VIEIRA STADLER",
      "telefone":"(48) 3224-9922",
      "especialidades":[
         "Medicina do Trabalho"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA HERCILIO LUZ , 639 - SL.403"
         }
      ]
   },
   {
      "nome":"ALVARO ANTONIO DO NASCIMENTO",
      "telefone":"(48) 3037-2225 | (48) 99110-8510",
      "especialidades":[
         "Psiquiatria"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PROFESSOR OTHON GAMA DECA , 900 - SALA 514 BLOCO A"
         }
      ]
   },
   {
      "nome":"ALVARO GUIMARAES DE LIMA",
      "telefone":"(48) 3028-0878",
      "especialidades":[
         "Ortopedia e Traumatologia"
      ],
      "regiao":[
         {
            "bairro":"CANTO",
            "endereco":"RUA PROFESSORA ANTONIETA DE BARROS , 211 -"
         }
      ]
   },
   {
      "nome":"ALVARO KRAEMER SOUTO",
      "telefone":"(48) 3222-3605",
      "especialidades":[
         "Urologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 376 - HOSP DE CARIDADE"
         }
      ]
   },
   {
      "nome":"ALVARO STECKERT FILHO",
      "telefone":"(48) 3030-2930",
      "especialidades":[
         "Coloproctologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA OSVALDO RODRIGUES CABRAL , 1570 - SL. 302"
         }
      ]
   },
   {
      "nome":"ALVARO THADEU BENDER",
      "telefone":"(48) 3322-0015",
      "especialidades":[
         "Dermatologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA TROMPOWSKY , 291 - S/504, 505 E 506 T2"
         }
      ]
   },
   {
      "nome":"ALVIN LAEMMEL",
      "telefone":"(48) 3224-1111 | (48) 3224-0708",
      "especialidades":[
         "Cirurgia de Cabeça e Pescoço"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AV RUBENS DE ARRUDA RAMOS , 2560 -"
         }
      ]
   },
   {
      "nome":"ALZIRA COSTA UNGARETTI",
      "telefone":"(48) 3222-9381",
      "especialidades":[
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AV RIO BRANCO , 448 - SL. 604"
         }
      ]
   },
   {
      "nome":"AMILTON CARNIEL GUIMARAES",
      "telefone":"(48) 3222-6677",
      "especialidades":[
         "Gastroenterologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - S/308 A 310"
         }
      ]
   },
   {
      "nome":"ANA APARECIDA DE SANTIAGO",
      "telefone":"(48) 3030-3333",
      "especialidades":[
         "Otorrinolaringologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MARECHAL GUILHERME , 147 - SL 202 ED DAUX BOABAID"
         }
      ]
   },
   {
      "nome":"ANA CAMILA FLORES FARAH",
      "telefone":"(48) 3251-9000",
      "especialidades":[
         "Pediatria"
      ],
      "regiao":[
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA RUI BARBOSA , 152 -"
         }
      ]
   },
   {
      "nome":"ANA CAROLINA KOERICH RAMPINELLI",
      "telefone":"(48) 3228-1818 Telefone",
      "especialidades":[
         "Oftalmologia",
         "Oftalmologia",
         "Oftalmologia"
      ],
      "regiao":[
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA SIDNEY NOCETTI , 62 -"
         },
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA SIDNEY NOCETTI , 62 - SALA 305 A 308"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA PRESIDENTE COUTINHO , 579 - SL 501"
         }
      ]
   },
   {
      "nome":"ANA CAROLINA SEPETIBA RIBAS SIMOES DE ALMEIDA",
      "telefone":"(48) 3223-6072",
      "especialidades":[
         "Hematologia e Hemoterapia",
         "Clínica Médica"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - SALA 209"
         }
      ]
   },
   {
      "nome":"ANA CRISTINA GOMES MAMFRIN CAPANO",
      "telefone":"(48) 3228-0215",
      "especialidades":[
         "Pediatria"
      ],
      "regiao":[
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA RUI BARBOSA , 154 -"
         }
      ]
   },
   {
      "nome":"ANA CRISTINA SCHMITZ CHEREM",
      "telefone":"(48) 3024-5300",
      "especialidades":[
         "Medicina Nuclear"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PRESIDENTE COUTINHO , 348 -"
         }
      ]
   },
   {
      "nome":"ANA CRISTINA TORQUI DUARTE",
      "telefone":"(48) 3365-1655",
      "especialidades":[
         "Pediatria"
      ],
      "regiao":[
         {
            "bairro":"LAGOA DA CONCEICAO",
            "endereco":"RUA NOSSA SENHORA DA CONCEICAO , 223 -"
         }
      ]
   },
   {
      "nome":"ANA FLAVIA BORGES DE CARVALHO LIMA",
      "telefone":"(48) 3028-9100 Telefone",
      "especialidades":[
         "Acupuntura",
         "Acupuntura"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA SANTO INACIO DE LOYOLA , 193 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MAJOR COSTA , 221 -"
         }
      ]
   },
   {
      "nome":"ANA MARCIA WERNECK DE CASTRO",
      "telefone":"(48) 3229-7777 Telefone",
      "especialidades":[
         "Radiologia e Diagnóstico por Imagem",
         "Radiologia e Diagnóstico por Imagem"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - BLOCO C"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 -"
         }
      ]
   },
   {
      "nome":"ANA MARIA ZENHA RAPALLO",
      "telefone":"(48) 3216-8222",
      "especialidades":[
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MADALENA BARBI , 204 -"
         }
      ]
   },
   {
      "nome":"ANA PATRICIA CORREA",
      "telefone":"(48) 3222-4004",
      "especialidades":[
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA DOM JAIME CAMARA , 77 - S/501"
         }
      ]
   },
   {
      "nome":"ANA PAULA ARAGAO",
      "telefone":"(48) 3216-8222",
      "especialidades":[
         "Pediatria"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MADALENA BARBI , 204 -"
         }
      ]
   },
   {
      "nome":"ANA PAULA BELTRAME FARINA PASINATO",
      "telefone":"(48) 3222-3032 Telefone",
      "especialidades":[
         "Patologia",
         "Patologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PRESIDENTE COUTINHO , 197 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 376 - HOSP DE CARIDADE"
         }
      ]
   },
   {
      "nome":"ANA PAULA DOS SANTOS CARMINATTI",
      "telefone":"(48) 3216-8999",
      "especialidades":[
         "Pediatria"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MADALENA BARBI , 204 -"
         }
      ]
   },
   {
      "nome":"ANA PAULA TRENTIN",
      "telefone":"(48) 3222-7237 | (48) 98405-9771",
      "especialidades":[
         "Neurologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA BARAO DE BATOVI , 546 -"
         }
      ]
   },
   {
      "nome":"ANDRE LUIS TEIXEIRA DE SAN THIAGO",
      "telefone":"(48) 3028-2300",
      "especialidades":[
         "Cardiologia",
         "Clínica Médica"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 633 -"
         }
      ]
   },
   {
      "nome":"ANDRE LUZ PEREIRA ROMANO",
      "telefone":"(48) 3229-6500 Telefone",
      "especialidades":[
         "Anestesiologia",
         "Anestesiologia",
         "Anestesiologia",
         "Anestesiologia",
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MAJOR COSTA , 221 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA FELIPE SCHMIDT , 982 -"
         },
         {
            "bairro":"PANTANAL",
            "endereco":"RUA DEPUTADO ANTONIO EDU VIEIRA , 1414 -"
         },
         {
            "bairro":"SANTA MONICA",
            "endereco":"AVENIDA MADRE BENVENUTA , 1654 -"
         },
         {
            "bairro":"COQUEIROS",
            "endereco":"RUA GENERAL ESTILAC LEAL , 122 -"
         }
      ]
   },
   {
      "nome":"ANDRE MENDES ARENT",
      "telefone":"(48) 3952-4000",
      "especialidades":[
         "Neurocirurgia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA VIDAL RAMOS , 110 - 2 ANDAR"
         }
      ]
   },
   {
      "nome":"ANDRE MULLER TEIVE",
      "telefone":"(48) 3224-1888",
      "especialidades":[
         "Patologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA DOM JAIME CAMARA , 77 - SALAS 101 E 601"
         }
      ]
   },
   {
      "nome":"ANDRE ROBERTO BUSSMANN",
      "telefone":"(48) 4004-1300 Telefone",
      "especialidades":[
         "Anestesiologia",
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA BOCAIUVA , 2013 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA CRUZ E SOUZA , 73 -"
         }
      ]
   },
   {
      "nome":"ANDRE SOBIERAJSKI DOS SANTOS",
      "telefone":"(48) 3222-2223",
      "especialidades":[

      ],
      "regiao":[

      ]
   },
   {
      "nome":"ANDRE SOUZA DE ALBUQUERQUE MARANHAO",
      "telefone":"(48) 3224-1111",
      "especialidades":[
         "Otorrinolaringologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AV RUBENS DE ARRUDA RAMOS , 2560 -"
         }
      ]
   },
   {
      "nome":"ANDREA ANNELIESE REICHMUTH DAY",
      "telefone":"(48) 3324-1100 Telefone",
      "especialidades":[
         "Cirurgia Torácica",
         "Cirurgia Torácica",
         "Cirurgia Torácica"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA ANGELO LA PORTA , 64 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 376 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"LARGO SAO SEBASTIAO , 72 -"
         }
      ]
   },
   {
      "nome":"ANDREA ANTUNES CALDEIRA DE ANDRADA FERREIRA",
      "telefone":"(48) 3224-0180 Telefone",
      "especialidades":[
         "Ginecologia e Obstetrícia",
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 380 - S/1103"
         },
         {
            "bairro":"ITAGUACU",
            "endereco":"RUA ALVARO SOARES DE OLIVEIRA , 117 -"
         }
      ]
   },
   {
      "nome":"ANDREA BENINCA DE ALMEIDA",
      "telefone":"(48) 3251-9000",
      "especialidades":[
         "Pediatria"
      ],
      "regiao":[
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA RUI BARBOSA , 152 -"
         }
      ]
   },
   {
      "nome":"ANDREA CRISTINA BELLI",
      "telefone":"(48) 3224-2214",
      "especialidades":[
         "Dermatologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 404 - SL 302 TORRE I"
         }
      ]
   },
   {
      "nome":"ANDREA GISELE PEREIRA SIMONI",
      "telefone":"(48) 3251-9000 Telefone",
      "especialidades":[
         "Pediatria",
         "Pediatria"
      ],
      "regiao":[
         {
            "bairro":"AGRONOMICA",
            "endereco":"RUA RUI BARBOSA , 152 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA SALDANHA MARINHO , 374 - SL 404"
         }
      ]
   },
   {
      "nome":"ANDREA RODRIGUES DE SOUSA",
      "telefone":"(48) 3229-2829 Telefone",
      "especialidades":[
         "Otorrinolaringologia",
         "Otorrinolaringologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA MAURO RAMOS , 1612 -"
         },
         {
            "bairro":"COQUEIROS",
            "endereco":"RUA GENERAL ESTILAC LEAL , 122 -"
         }
      ]
   },
   {
      "nome":"ANDRESSA FERREIRA CATHCART DE ARAUJO",
      "telefone":"(48) 4009-0077 Telefone",
      "especialidades":[
         "Cardiologia",
         "Cardiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA ERNESTO STODIECK , 56 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 633 -"
         }
      ]
   },
   {
      "nome":"ANDREY MOREL PUCCI",
      "telefone":"(48) 3224-7466",
      "especialidades":[
         "Ortopedia e Traumatologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA IRMA BENWARDA , 128 -"
         }
      ]
   },
   {
      "nome":"ANTONIO NICOLEIT",
      "telefone":"(48) 3244-9425",
      "especialidades":[
         "Ortopedia e Traumatologia"
      ],
      "regiao":[
         {
            "bairro":"ESTREITO",
            "endereco":"RUA SANTOS SARAIVA , 441 -"
         }
      ]
   },
   {
      "nome":"ANTONIO OLIMPIO PACHECO",
      "telefone":"(48) 3271-4400",
      "especialidades":[
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"ITAGUACU",
            "endereco":"RUA ALVARO SOARES DE OLIVEIRA , 117 -"
         }
      ]
   },
   {
      "nome":"ANTONIO SERGIO DA SILVA GRANGEIRO",
      "telefone":"(48) 3212-0101",
      "especialidades":[
         "Anestesiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"SRV MISSAO JOVEM , 38 - MATRIZ"
         }
      ]
   },
   {
      "nome":"ARARE WEY",
      "telefone":"(48) 3271-4400",
      "especialidades":[
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"ITAGUACU",
            "endereco":"TRAVESSA HAMILTON BERRETA , 61 -"
         }
      ]
   },
   {
      "nome":"ARI CESAR LENTZ",
      "telefone":"(48) 3304-7306",
      "especialidades":[
         "Médico"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA PRESIDENTE NEREU RAMOS , 19 - SLS 901,902,903,904,905 E 906"
         }
      ]
   },
   {
      "nome":"ARI ROCHA",
      "telefone":"(48) 3229-6500 Telefone",
      "especialidades":[
         "Urologia",
         "Urologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA MAJOR COSTA , 221 -"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 376 - HOSP DE CARIDADE"
         }
      ]
   },
   {
      "nome":"ARIANE BORGONOVO RAYES",
      "telefone":"(48) 3222-3559",
      "especialidades":[
         "Gastroenterologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AV RIO BRANCO , 1181 -"
         }
      ]
   },
   {
      "nome":"ARIANE MARTINS DE MENEZES",
      "telefone":"(48) 3223-3031 Telefone",
      "especialidades":[
         "Ginecologia e Obstetrícia",
         "Ginecologia e Obstetrícia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PREFEITO OSMAR CUNHA , 183 - BL A - SALAS 1110 A 1115"
         },
         {
            "bairro":"ITAGUACU",
            "endereco":"TRAVESSA HAMILTON BERRETA , 61 -"
         }
      ]
   },
   {
      "nome":"ARISTILIANO RAMOS NETO",
      "telefone":"(48) 3222-1477 | (48) 3222-1798",
      "especialidades":[
         "Cardiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA PREFEITO OSMAR CUNHA , 486 - 1 ANDAR"
         }
      ]
   },
   {
      "nome":"ARMANDO TARANTO JUNIOR",
      "telefone":"(48) 3216-8000",
      "especialidades":[
         "Médico"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA DOM JAIME CAMARA , 94 -"
         }
      ]
   },
   {
      "nome":"ARMENIO MATIAS CORREA LIMA",
      "telefone":"(48) 3232-0470",
      "especialidades":[
         "Homeopatia"
      ],
      "regiao":[
         {
            "bairro":"LAGOA DA CONCEICAO",
            "endereco":"RUA ORLANDO CARIONI , 64 -"
         }
      ]
   },
   {
      "nome":"ARNALDO DONATO MARCON",
      "telefone":"(48) 3224-8483",
      "especialidades":[
         "Pediatria"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA ALVES DE BRITO , 141 - SL. 101"
         }
      ]
   },
   {
      "nome":"ARNO DAVI ANDERMANN",
      "telefone":"(48) 3248-2022 Telefone",
      "especialidades":[
         "Psiquiatria",
         "Psiquiatria"
      ],
      "regiao":[
         {
            "bairro":"ESTREITO",
            "endereco":"RUA SANTOS SARAIVA , 435 -"
         },
         {
            "bairro":"CANTO",
            "endereco":"RUA PROFESSORA ANTONIETA DE BARROS , 211 -"
         }
      ]
   },
   {
      "nome":"ARNO LOTAR CORDOVA JUNIOR",
      "telefone":"(48) 3222-7966 Telefone",
      "especialidades":[
         "Radioterapia",
         "Radioterapia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"RUA BOCAIUVA , 72 - LARGO SAO SEBASTIAO"
         },
         {
            "bairro":"CENTRO",
            "endereco":"RUA MENINO DEUS , 63 - SL 314 E 315"
         }
      ]
   },
   {
      "nome":"ARTHUR SERGIO DA SILVEIRA FILHO",
      "telefone":"(48) 3222-0082 | (48) 99912-7600",
      "especialidades":[
         "Cardiologia"
      ],
      "regiao":[
         {
            "bairro":"CENTRO",
            "endereco":"AVENIDA RIO BRANCO , 448 - SL 901"
         }
      ]
   }
];
