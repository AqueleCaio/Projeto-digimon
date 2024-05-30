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

async function createDigimonCards() {
  const digimons = await fetchDigimons();
  const digimonContainer = $('.container_card_digimons');

  digimons.forEach(function(digimon) {
      const card = $('<div class="card_digimons"></div>');
      const nomeDigimon = $('<h2 class="nome_digimon"></h2>').text(digimon.name);
      const imgDigimon = $('<img class="imagem_digimon" />').attr('src', digimon.img);
      const levelDigimon = $('<h2 class="level_digimon"></h2>').text(digimon.level);
      const botaoDetalhes = $('<button class="verDetalhes">Ver Detalhes</button>');

      card.append(nomeDigimon, imgDigimon, levelDigimon, botaoDetalhes);
      digimonContainer.append(card);
  });
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
    }
  });

    
  // Filtra os cards de Digimon pelo nome digitado no input
  $('.searchButton').click(() => {
    const digimonInput = $('.searchInput').val();
  
    // Esconde todos os cards de Digimon
    $('.container_card_digimons .card_digimons').hide();
  
    // Mostra apenas os cards que correspondem ao nome digitado
    $('.container_card_digimons .card_digimons').each(function() {
      const digimonName = $(this).find('.nome_digimon').text().toLowerCase();
      if (digimonName.includes(digimonInput.toLowerCase())) {
        $(this).show();
      }
    });
  
    // Remove mensagens de erro existentes
    $('.containerErro .erro').remove();
  
    // Se o Digimon digitado não existir no array, exibir mensagem de erro
    if ($('.container_card_digimons .card_digimons:visible').length === 0) {
      $('.containerErro').append('<h2 class="erro"> O Digimon ' + digimonInput + ' não foi encontrado :(</h2>');
    }
  });
  

  // Filtra os cards de Digimon pelo level selecionado
  $('.filtro').click(function() {
    const levelSelecionado = $(this).text().trim();

    $('.container_card_digimons .card_digimons').each(function() {
        const level = $(this).find('.level_digimon').text().trim();
        if (level !== levelSelecionado && levelSelecionado !== 'Todos') {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
  });

  // Adiciona a classe 'filtro_ativo' ao filtro selecionado pelo usuário
  $(".filtro").click(function() {
    $(".filtro").removeClass("filtro_ativo");
    $(this).addClass("filtro_ativo");
  });


});

