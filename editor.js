$(function() {
    var previews = {};

    var preparePreviews = function() {
        $('article [itemprop]').each(function() {
            var node = $(this);
            var property = node.attr('itemprop');

            previews[property] = node;
        });

        previews.articleBody.on('keypress', function(event){
            switch (event.which) {
                case 13:
                    event.preventDefault();
                    document.execCommand('InsertParagraph', false);
                    break;
            }
        });
    };

    var prepareInputs = function() {
        $('body > form :input[name]').each(function() {
            var node = $(this);
            var name = node.attr('name');
            var preview = previews[name];
            var previewNode = preview.get(0);

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
        var node = $(input).trigger('change');
        var editing = false;

        var editor = CodeMirror.fromTextArea(input, {
            mode: 'text/html',
            theme: 'html',
            autoCloseTags: {
                indentTags: false,
                whenOpening: true,
                whenClosing: true,
            },
            lineWrapping: true,
        });

        editor.on('change', function(editor) {
            node.val(editor.getValue());
            if (!editing) {
                node.trigger('change');
            }
        });

        $('article').contentEditable().change(function(event) {
            if (event.action === 'update') {
                editing = true;

                var data = event.changed.articleBody;
                data = html_sanitize(data);
                data = html_beautify(data, {
                    wrap_line_length: 0,
                    indent_size: -1
                });

                editor.setValue(data);

                editing = false;
            }
        });

        $('.CodeMirror').on('click', '.cm-tag', function(event) {
            console.log(event);
        });
    };

    preparePreviews();
    prepareInputs();
    prepareEditor();
});