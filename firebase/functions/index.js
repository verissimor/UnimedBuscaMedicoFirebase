"use strict";

const {
  dialogflow,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  Button,
  Carousel,
  Image,
  LinkOutSuggestion,
  List,
  MediaObject,
  Suggestions,
  SimpleResponse,
  Table
 } = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({debug: true});

app.intent('BuscarNumeroCarteirinha', (conv, {NomeUsuario}) => {
  const nuCarterinha = gerarNumeroCarterinha(NomeUsuario);
  const mensagem = `O número de sua carteirinha é: 0 025 ${nuCarterinha} 3`;
  if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
    conv.close(mensagem);
  }else{
    conv.close(new SimpleResponse({speech:mensagem, text: mensagem}));
  }
});

app.intent('BuscarMedicoPorEspecialidade', (conv, {Regiao,Especialidades}) => {
  const medicos = buscarMedicos(Regiao,Especialidades);
  if(!medicos.length){
    conv.close("Realizei uma busca nos médicos , mas não consegui encontrar um  médico com essas características.");
    return;
  }
  if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
    medicos.forEach(medico => conv.ask(`${medico.nome} \n: ${medico.telefone}`));
  }else{
    const items = {}
    medicos.forEach((medico,indice) => {
      items[indice.toString()] = {
        title: medico.nome,
        description: `Telefone: ${medico.telefone}`,
        image: new Image({
          url: 'https://www.carwreckdoctor.com/hubfs/Car_Accident_Doctor.png?t=1537383967751',
          alt: 'imagem do médico'
        })
      }
    });
    conv.ask(`${medicos.length} médicos foram encontrados!`);
    conv.close(new List({title: 'Médicos',items}));
  }
});


app.intent('actions.intent.OPTION', (conv, params, option) => {
  console.log(option);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

/**
* Funcao para gerar o numero da carterinha pelo nome do usuario
*/

function gerarNumeroCarterinha(nmUsuario){
  let nuCarterinha = "";
  for (let i = 0; i < nmUsuario.length; i++)
    nuCarterinha += nmUsuario.charCodeAt(i);
  nuCarterinha += "000000000000";
    if (nuCarterinha.length > 12)
      nuCarterinha = nuCarterinha.substr(0, 12);
  return nuCarterinha;
}

/**
* Funcao para buscar os medicos pelo regiao e especialidades
*/

function buscarMedicos(regiao,especialidades){
  const regiaoTxt = removerAcentos(regiao).toUpperCase();
  const especialidadesTxt = removerAcentos(especialidades).toUpperCase();
  return dbMedicos.filter(el => {
    let filter = true;
    if(regiaoTxt)
      filter = filter && el.regiao.filter(r => removerAcentos(r.bairro).toUpperCase().includes(regiaoTxt)).length
    if(especialidadesTxt)
      filter = filter && el.especialidades.filter(e => removerAcentos(e).toUpperCase().includes(especialidadesTxt)).length
    return filter;
  });
}

/**
 * Remove acentos de caracteres
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
      "nome":"Abel Raimundo Viga",
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
      "nome":"Acklei Viana",
      "telefone":"(48) 3225-2064",
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
      "nome":"Ademar Jose De Oliveira Junior",
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
      "nome":"Adilson Valsechi",
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
      "nome":"Aderbal Jose Dal Mago",
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
      "nome":"Adriana Carneiro",
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
      "nome":"Adriane De Siqueira",
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
      "nome":"Adria De Toledo",
      "telefone":"(48) 3304-7306",
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
      "nome":"Ana Dutra Schimit",
      "telefone":"(48) 3235-3113",
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
      "nome":"Ana Clara Martins",
      "telefone":"(48) 3037-3900",
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
      "nome":"Ana Claudia Coelho",
      "telefone":"(48) 3222-4645",
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
      "nome":"Ana Silvia Magalhães",
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
      "nome":"Bruna Elias",
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
      "nome":"Bianca Santos Soares",
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
      "nome":"Bernardete Carniel Viela",
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
      "nome":"Bernardo Schaefer Meyer",
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
      "nome":"Brutus Leonel Thiesen",
      "telefone":"(48) 3223-5919",
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
      "nome":"Bruno Leonel Thiesen",
      "telefone":"(48) 3223-5919 | (48) 98822-4816",
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
      "nome":"Brisola Nilton Weiss Neto",
      "telefone":"(48) 3228-8690",
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
      "nome":"Bernar Batista Da Silva",
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
      "nome":"Cassio Jose De Almeida",
      "telefone":"(48) 3222-5900 | (48) 3222-5346",
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
      "nome":"Caio Serrano",
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
      "nome":"Carlos Ambrogini",
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
      "nome":"Cleisson Gheller",
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
      "nome":"Claudio Souza",
      "telefone":"(48) 3222-0087",
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
      "nome":"Daniel Trampani Junior",
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
      "nome":"Daniel Elias Takano",
      "telefone":"(48) 3235-3113",
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
      "nome":"Douglas Miranda Ramos",
      "telefone":"(48) 3222-8898",
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
      "nome":"Dirceu Romeno Dal Forno",
      "telefone":"(48) 3028-2300",
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
      "nome":"Eduardo Bortoli Machado",
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
      "nome":"Eduarda Canellas Vallim",
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
      "nome":"Erica Buffoni",
      "telefone":"(48) 3251-9000",
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
      "nome":"Edileia De Aguias Ribas",
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
      "nome":"Fernanda Failero Alt",
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
      "nome":"Fernando Horn Vianna",
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
      "nome":"Felipe Nascimento",
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
      "nome":"Frederico Posser",
      "telefone":"(48) 3244-9425",
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
      "nome":"Fred Salles Iven",
      "telefone":"(48) 3029-0099",
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
      "nome":"Guilherme Stud De Souza",
      "telefone":"(48) 3229-7777",
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
      "nome":"Guilhermina Araújo",
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
      "nome":"Geromel Mariano De Oliveira",
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
      "nome":"Gilberto Martins",
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
      "nome":"Henrique Spautz Graneman",
      "telefone":"(48) 3224-3099",
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
      "nome":"Alice Feldens Pitz",
      "telefone":"(48) 3228-7000",
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
      "nome":"Aline Da Rocha Lino",
      "telefone":"(48) 3223-6072",
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
      "nome":"Ana Clara Borba",
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
      "nome":"Rafael Guerreiro",
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
      "nome":"Helio Rodolfo Roveda Teixeira",
      "telefone":"(48) 3029-0099",
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
      "nome":"Maria Elizabeth Teixeira",
      "telefone":"(48) 3224-9394",
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
      "nome":"Danusa Giusti Consoni",
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
      "nome":"João Verissimo Ribas",
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
      "nome":"Alavaro Antonio Do Nascimento",
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
      "nome":"Alavo De Lima",
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
      "nome":"Rafael Kraemer Souto",
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
      "nome":"Nereu Stecker Filho",
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
      "nome":"Tadeu Bender",
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
      "nome":"Alvin Laemmel",
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
      "nome":"Alzira Costa Union",
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
      "nome":"José Carniel Guimarães",
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
      "nome":"Flávia Aparecida De Santigo",
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
      "nome":"Kamila Flores Farah",
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
      "nome":"Carolina Koerich Pampinelli",
      "telefone":"(48) 3228-1818",
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
      "nome":"Carolina Sepetiba Ribas De Almeida",
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
      "nome":"Cristina Gomes Mamfrin",
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
      "nome":"Cristina Sshimitz Cherem",
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
      "nome":"Débora Torqui Duarte",
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
      "nome":"Flávia Borges Lima",
      "telefone":"(48) 3028-9100",
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
      "nome":"Marcia Werneck De Castro",
      "telefone":"(48) 3229-7777",
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
      "nome":"Maria Zenha Rapalo",
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
      "nome":"Patricia Correa",
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
      "nome":"Paula Aragão",
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
      "nome":"Paula Beltrame Farina",
      "telefone":"(48) 3222-3032",
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
      "nome":"Paula Dos Santos Carminatti",
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
      "nome":"Paula Trentini",
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
      "nome":"André Luiz Teixeira Alvez",
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
      "nome":"André Luiz Romano",
      "telefone":"(48) 3229-6500",
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
      "nome":"Arthur Arend",
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
      "nome":"Andre Muller Teive",
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
      "nome":"Andrpe Roberto Bussmann",
      "telefone":"(48) 4004-1300",
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
      "nome":"André Dos Santos",
      "telefone":"(48) 3222-2223",
      "especialidades":[

      ],
      "regiao":[

      ]
   },
   {
      "nome":"Renato Albuquerque Maranhão",
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
      "nome":"Anelise Bittencourt Santos",
      "telefone":"(48) 3324-1100",
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
      "nome":"Fernanda Alves Nascimento",
      "telefone":"(48) 3224-0180",
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
      "nome":"Andrea Almeida dos Santos",
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
      "nome":"Carla Elias Teixeira",
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
      "nome":"Cássia Barbosa",
      "telefone":"(48) 3251-9000",
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
      "nome":"Caroline Elias Saute",
      "telefone":"(48) 3229-2829",
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
      "nome":"Izabela Araujo",
      "telefone":"(48) 4009-0077",
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
      "nome":"Andrey Piccini Kauss",
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
      "nome":"GUILHERME NICOLEIT",
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
      "nome":"Heitor Olimpio Pacheco",
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
      "nome":"Iara Da Silva Tatim",
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
      "nome":"Igor Teixeira",
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
      "nome":"Jesus Cesar Lentz",
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
      "nome":"Julio Rocha Tavarez",
      "telefone":"(48) 3229-6500",
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
      "nome":"Jaqueline Borno Martini",
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
      "nome":"Lara Martins de Menezes",
      "telefone":"(48) 3223-3031",
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
      "nome":"Leandro Ramos Neto",
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
      "nome":"Maycon Taranto Junior",
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
      "nome":"Marcos da Silva Oliveira",
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
      "nome":"Tales Donato Marcon",
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
      "nome":"Tadeu Davi Durman",
      "telefone":"(48) 3248-2022",
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
      "nome":"Victor Teixeira Gueller",
      "telefone":"(48) 3222-7966",
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
      "nome":"Zenaide da Silveira Santos",
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
