$(function() {
    var inputs = {};
    var previews = {};

    var preparePreviews = function() {
        $('body > article [itemprop]').each(function() {
            var node = $(this);
            var property = node.attr('itemprop');

            previews[property] = node;
        });
    };

    var prepareInputs = function() {
        $('body > form :input[name]').each(function() {
            var node = $(this);
            var name = node.attr('name');
            var preview = previews[name];

            preview.css({
                'position': 'absolute',
                'top': node.offset().top,
            });

            node.css({
                'font-size': preview.css('font-size'),
                'font-family': preview.css('font-family'),
                'font-weight': preview.css('font-weight'),
                'line-height': preview.css('line-height'),
            });

            node.on('keyup change', function(event) {
                preview.html(this.value);
            });
        });
    };

    var prepareEditor = function() {
        var input = document.forms[0].articleBody;

        var editor = CodeMirror.fromTextArea(input, {
            mode: 'htmlmixed',
            theme: 'html',
            lineWrapping: true,
            electricChars: false,
        });

        var node = $(input).trigger('change');

        var updatePreview = function(editor) {
            node.val(editor.getValue()).trigger('change');
        };

        editor.on('change', updatePreview);
    };

    preparePreviews();
    prepareInputs();
    prepareEditor();
});