async function fetchDigimons() {
  try {
      const response = await fetch('https://digimon-api.vercel.app/api/digimon');
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Erro ao buscar os dados do arquivo JSON:', error);
      return [];
  }
}

let state = {
  page: 1,
  perPage: 20,
  totalPages: 0
};

async function createDigimonCards() {
  const digimons = await fetchDigimons();
  const digimonContainer = $('.container_card_digimons');

  // Limpa o container antes de adicionar novos cards
  digimonContainer.empty();

  // Atualiza o total de páginas
  state.totalPages = Math.ceil(digimons.length / state.perPage);

  // Calcula o índice inicial e final para a página atual
  let startIndex = (state.page - 1) * state.perPage;
  let endIndex = Math.min(startIndex + state.perPage, digimons.length);

  // Cria cards apenas para os Digimons na página atual
  for (let i = startIndex; i < endIndex; i++) {
    const digimon = digimons[i];
    const card = $('<div class="card_digimons"></div>');
    const nomeDigimon = $('<h2 class="nome_digimon"></h2>').text(digimon.name);
    const imgDigimon = $('<img class="imagem_digimon" />').attr('src', digimon.img);
    const levelDigimon = $('<h2 class="level_digimon"></h2>').text(digimon.level);
    const botaoDetalhes = $('<button class="verDetalhes">Ver Detalhes</button>');

    card.append(nomeDigimon, imgDigimon, levelDigimon, botaoDetalhes);
    digimonContainer.append(card);
  }

  // Atualiza a paginação
  updatePagination();
}

function updatePagination() {
  const paginationContainer = $('.pagination');
  paginationContainer.empty();

  for (let i = 1; i <= state.totalPages; i++) {
    const pageButton = $('<button class="botaoPagina"></button>').text(i);
    if (i === state.page) {
      pageButton.addClass('active');
    }
    pageButton.click(function() {
      state.page = i;
      createDigimonCards();
    });
    paginationContainer.append(pageButton);
  }

}

  //Filtra os Digimons pelo nome digitado no input
  $('.searchButton').click(async () => {
    const digimonInput = $('.searchInput').val().toLowerCase();

    //se o input estiver vazio, exibe todos os Digimons da página
    if (digimonInput === '') {
      createDigimonCards();
      return;
    }
    
    // Busca todos os Digimons
    const allDigimons = await fetchDigimons();
    
    // Filtra os Digimons pelo nome digitado
    const filteredDigimons = allDigimons.filter(digimon => digimon.name.toLowerCase().includes(digimonInput));
    
    // Atualiza a UI com os Digimons filtrados
    updateContainer(filteredDigimons);
  });

  // Filtra os Digimons pelo level selecionado
  $('.filtro').click(async function() {
    const levelSelecionado = $(this).text().trim();

    // Busca todos os Digimons
    const allDigimons = await fetchDigimons();

    // Filtra os Digimons pelo level selecionado
    const filteredDigimons = allDigimons.filter(digimon => {
      if (levelSelecionado === 'Todos') {
        return true;
      }
      return digimon.level.trim() === levelSelecionado;
    });

    // Atualiza a UI com os Digimons filtrados
    updateContainer(filteredDigimons);
  });
  
  // Função para atualizar a UI com os Digimons filtrados
  function updateContainer(digimons) {
    // Limpa o container de Digimons
    $('.container_card_digimons').empty();

    // Remove mensagens de erro existentes
    $('.containerErro .erro').remove();
  
    if (digimons.length === 0) {
      // Caso não haja Digimons correspondentes, exibe a mensagem de não encontrado
      $('.containerErro').append(`
          <h2 class="erro">Digimon não encontrado :(</h2>
      `);
    } else {
      // Adiciona os Digimons filtrados ao container
      digimons.forEach(digimon => {
        $('.container_card_digimons').append(`
          <div class="card_digimons">
            <h2 class="nome_digimon">${digimon.name}</h2>
            <img class="imagem_digimon" src="${digimon.img}">
            <h2 class="level_digimon">${digimon.level}</h2>
            <button class="verDetalhes">Ver Detalhes</button>
          </div>
        `);
      });
    }  
  }

$(document).ready(function() {
  createDigimonCards();

  // A função abaixo coleta os dados do Digimon clicado e os exibe em um modal.
  $(document).on("click", ".verDetalhes", function(){
    let nomeDigimon = $(this).siblings('.nome_digimon').text();
    let imgDigimon = $(this).siblings('.imagem_digimon').attr('src');
    let levelDigimon = $(this).siblings('.level_digimon').text();

    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

    // Cria um elemento html para ser exibido como um modal com as informações do Digimon clicado    
    $(".modal .modal-content").html(
      '<div class=nome_modal>'+ nomeDigimon +'</div>'     // Cria um elemento nome_digimon no modal
    + "<img class='img_modal' src='" + imgDigimon + "'>" // Cria um elemento img_digimon no modal
    + '<div class=level_modal>' + levelDigimon + '</div>'  // Cria um elemento level_digimon no modal
    + '<p class=descrição_modal>' + '<strong>Descrição: </strong>'+ lorem + '</p>' // Cria um elemento descrição no modal
    );
    
    // Adiciona um elemento button no modal com um &times; que representa um 'X' para fechar o modal
    $(".modal .modal-content").append("<button class='fechar'>&times;</button>");
    
    // Exibe o modal
    $(".modal").show();

    // Adiciona um efeito de blur no conteúdo principal ao abrir o modal
    $('main').css('filter', 'blur(5px)');
    $('main').css('pointer-events', 'none');
   
    // Ao clicar no botão fechar, o efeito de blur é removido e a página volta ao normal
    $('.fechar').click(() => {
        $('main').css('filter', 'none');
        $('main').css('pointer-events', 'auto');
    });
  });
  

  // Fecha o modal ao clicar no botão fechar
  $(document).on("click", ".fechar", function() {
    $(".modal").hide();
  });


  // Faz com que, ao pressionar a tecla Enter, o botão de pesquisa seja clicado
  $('.searchInput').keypress(function(event) {
    if (event.keyCode === 13) {
      $('.searchButton').click();
      $(".filtro").removeClass("filtro_ativo");

    }
  });

  // Adiciona a classe 'filtro_ativo' ao filtro selecionado pelo usuário
  $(".filtro").click(function() {
    $(".filtro").removeClass("filtro_ativo");
    $(this).addClass("filtro_ativo");
  });

});