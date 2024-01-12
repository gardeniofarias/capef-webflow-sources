var questions = [{
    question: "{{wf {&quot;path&quot;:&quot;pergunta-1&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
        choices: ["{{wf {&quot;path&quot;:&quot;pergunta-1-opcao-a&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}", "{{wf {&quot;path&quot;:&quot;pergunta-1-opcao-b&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}", "{{wf {&quot;path&quot;:&quot;pergunta-1-opcao-c&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}"],
        correctAnswer: "{{wf {&quot;path&quot;:&quot;resposta-correta---pergunta-1&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}"
    }, {
        question: "{{wf {&quot;path&quot;:&quot;pergunta-2&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
        choices: ["{{wf {&quot;path&quot;:&quot;pergunta-2-opcao-a&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}", "{{wf {&quot;path&quot;:&quot;pergunta-2-opcao-b&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}", "{{wf {&quot;path&quot;:&quot;pergunta-2-opcao-c&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}"],
        correctAnswer: "{{wf {&quot;path&quot;:&quot;resposta-correta---pergunta-2&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}"
}];
// Variável que vai armazenar o resultado das respostas
var result = 0;
// Variável que vai armazenar todas as questões em um HTML que os loops vão montar
var allQuestionsInHTML = "";
// Loop das questões
for (var i = 0; i < questions.length; i++) {
    allQuestionsInHTML += '<div class="question" id="question' + (i + 1) + '">';
    allQuestionsInHTML += '<h4>' + questions[i].question + '</h4>';
    // Loop das escolhas
    for (var j = 0; j < questions[i].choices.length; j++) {
        allQuestionsInHTML += '<div class="form-check">';
        allQuestionsInHTML += '<input class="form-check-input" type="radio" name="q' + (i + 1) + '" value="' + questions[i].choices[j] + '">';
        allQuestionsInHTML += '<label class="form-check-label">' + questions[i].choices[j] + '</label>';
        allQuestionsInHTML += '</div>';
    }
    allQuestionsInHTML += '</div>';
}
// Reiniciar
function reiniciarQuiz() {
    // Limpa as respostas
    $('.question').removeClass('correct-answer incorrect-answer');
    //Limpa o result e a div do result
    result = 0;
    $('.result').html('<div></div>');
    // Desmarca as seleções
    $('input[type="radio"]').prop('checked', false);
    // Oculta o finalizar
    $('#finishBtn').hide();
    // Ocultar o reiniciar
    $('#restartBtn').hide();
    // Mostrar o botão de verificar as respostas
    $('#submitBtn').show();
}
// Exibe o allQuestionsInHTML 
$('#questions').html(allQuestionsInHTML);
console.log('chamada do questions');
// Função do botão de verificar as respostas
$('#submitBtn').on('click', function () {
    // Validação se todas as perguntas foram respondidas
    var todasRespondidas = true;
    // az um looping pra verificar se todas foram respondidas
    for (var i = 0; i < questions.length; i++) {
        var resposta = $('input[name="q' + (i + 1) + '"]:checked').val();
        if (!resposta) {
            todasRespondidas = false;
            break;
        }
    }
    // Se alguma não foi respondida exibe o Alert
    if (!todasRespondidas) {
        alert('Por favor, responda todas as perguntas.');
        return;
    }
    // Verifica as respostas
    for (var i = 0; i < questions.length; i++) {
        var resposta = $('input[name="q' + (i + 1) + '"]:checked').val();
        if (resposta === questions[i].correctAnswer) {
            result++;
            $('#question' + (i + 1)).addClass('correct-answer');
        } else {
            $('#question' + (i + 1)).addClass('incorrect-answer');
        }
    }
    // Mostra o resultado
    $('.result').html('<div><p class="alert alert-info">Você acertou ' + result + ' de ' + questions.length + ' perguntas.</p></div>');
    // Esconde o botão de verificar respostas e 
    $('#submitBtn').hide();
    // Exiba os botões de reiniciar 
    $('#restartBtn').show();
    // Exiba os botões de finalizar
    $('#finishBtn').show();
});
// Botão de reiniciar
$('#restartBtn').on('click', function () {
    reiniciarQuiz();
});
// Botão de finalizar (apenas fecha a aba)
$('#finishBtn').addClass('btn btn-danger').on('click', function () {
    window.close();
});