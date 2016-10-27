(function($, document, window) {
    'use strict';
    var QUESTION_ACTIVE_CLASS = 'question--active';
    var PAGE_VISIBLE_CLASS = 'page--visible';
    var INITIAL_PROGRESS = 0;
    var quizPage = $('#quiz');
    var quizEnd = $('#quizEnd');
    var quizContainer = $('#quizPages');
    var resetButton = $('#resetButton');
    var resultButton = $('#resultButton');
    var prevButton = $('#prevButton');
    var nextButton = $('#nextButton');
    var quizBreakdown = $('#quizBreakdown');
    var progress = 0;
    var totalProgress = -1;
    var progressBar = $('#quizProgressBar');
    var tally = [];
    var takes = 1;
    var questionPages;
    var questions = window.questions;


    function resetProgress() {
        progress = 0;
        return progress;
    }

    function nextQuestionPage() {
        var curr;
        curr = questionPages[progress];
        $(curr).removeClass(QUESTION_ACTIVE_CLASS);
        progress++;

        if (progress < questionPages.length) {
            console.log('foo');

            console.log(progress);
            curr = questionPages[progress];
            $(curr).addClass(QUESTION_ACTIVE_CLASS);

        } else {
            console.log('END');
            console.log('Display END Page');
            //currentQuestion = questionPages.length - 1;
            quizPage.removeClass(PAGE_VISIBLE_CLASS);
            quizEnd.addClass(PAGE_VISIBLE_CLASS);
        }
    }

    function previousQuestionPage() {
        var curr;

        if (progress > 0) {
            curr = context.questionPages[progress];
            $(curr).removeClass(QUESTION_ACTIVE_CLASS);
            curr = context.questionPages[--progress];
            $(curr).addClass(QUESTION_ACTIVE_CLASS);
        } else {
            console.log('END');
            // go to end
        }
    }

    function setProgressBarValue(value) {
        progressBar.attr('aria-valuenow', value);
        progressBar.css('width', value + '%');
    }

    function checkAnswer(answer, questionIndex, questions) {
        var question = questions[questionIndex];
        var questionNumber = questionIndex + 1;
        var isCorrect = question.correct === parseInt(answer);

        console.log(question);

        if (isCorrect) {
            console.log('Correct Answer for Question#' + questionNumber);
            tally[questionIndex]++;
        } else {
            console.warn('Wrong Answer for Question#' + questionNumber);
        }
        nextQuestionPage();
        var progressNum = progress;
        var progressPercent = Math.ceil(100 * progressNum / totalProgress);
        $('#currentQuestion').text(progress);
        setProgressBarValue(progressPercent);
        console.log(tally);
    }

    function generateQuestions(questions) {
        var count;
        var questionsPlaceholder = $('<div/>');
        var buttonStr;
        var questionStr = '';

        for (count = 0; count < questions.length; count++) {
            var choices = questions[count].choices;
            var questionDiv = $('<li/>', {
                class: 'question',
                'data-index': count
            });
            var choiceCount;

            buttonStr = ''; //initialize
            choices.forEach(function(choice) {
                buttonStr += '<button class="btn btn-primary" data-value="' + choice.value + '">' + choice.text + '</button>';
            });

            questionDiv.append('<h3>' + 'Question #' + (count + 1) + '</h3>');
            questionDiv.append('<p>' + questions[count].text + '</p>');
            questionDiv.append('<div class="question-buttons btn-group">' + buttonStr + '</div>');
            questionDiv.appendTo(questionsPlaceholder);

            questionDiv.click(function(event) {
                var el = event.target;
                var isAButton = el.tagName === 'BUTTON';
                var value;
                var questionIndex;
                var answer;

                if (!isAButton) {
                    return;
                }

                answer = $(el).attr('data-value');
                questionIndex = parseInt($($('.' + QUESTION_ACTIVE_CLASS)[0]).attr('data-index'));
                console.log(answer);
                //_this.checkQuestion(questionIndex, answer);
                checkAnswer(answer, questionIndex, questions);

            });

        }

        return questionsPlaceholder;
    }


    function reset() {
      $(questionPages[questionPages.length - 1]).removeClass(QUESTION_ACTIVE_CLASS);
      $(questionPages[0]).addClass(QUESTION_ACTIVE_CLASS);
      progress = INITIAL_PROGRESS;
      quizEnd.removeClass(PAGE_VISIBLE_CLASS);
      quizPage.addClass(PAGE_VISIBLE_CLASS);
      setProgressBarValue(0);
      $('#currentQuestion').text(progress);
      takes++;
    }

    quizContainer.append(generateQuestions(questions).children());
    questionPages = $('.question');
    totalProgress = questionPages.length;
    $('#currentQuestion').text(progress);
    $('#totalQuestions').text(totalProgress);
    $(questionPages[0]).addClass(QUESTION_ACTIVE_CLASS);

    /* Initialize Tally */
    for (var qCount = 0; qCount < questions.length; qCount++) {
        tally[qCount] = 0;
    }

    resetButton.click(function() {
      reset();
    });

    resultButton.click(function() {
      var templateString = '';
      //teardown
      quizBreakdown.empty();
      //rerender

      for(var tCount = 0; tCount < tally.length; tCount++) {
        var tallyPercent = Math.ceil(100*tally[tCount]/takes);
        console.log(tallyPercent);
        var progressStrPre = '<li> Question '+ (tCount+1) +'/'+tally.length+'<div class="progress">';
        var progressBar = '<div style="width:'+tallyPercent+'%" class="progress-bar progress-bar-striped active" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">'+ tallyPercent +'% Correct </div>';
        var progressStrPost = '</div></li>';
        var res = progressStrPre+progressBar+progressStrPost;

        templateString+=res;
      }

      quizBreakdown.append(templateString);

      // hide whatever page is active
      //show page
      $('.'+PAGE_VISIBLE_CLASS).removeClass(PAGE_VISIBLE_CLASS);
      $('#results').addClass(PAGE_VISIBLE_CLASS);


    });

    prevButton.click(function() {
      previousQuestionPage();
    });

    nextButton.click(function() {
      nextQuestionPage();
    });


    $('#exitResults').click(function() {
      $('.'+PAGE_VISIBLE_CLASS).removeClass(PAGE_VISIBLE_CLASS);
      $('#quiz').addClass(PAGE_VISIBLE_CLASS);
      reset();
    });


}($, document, window));
