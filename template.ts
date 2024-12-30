import handlebars from 'handlebars';

const htmlTemplate = `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nowe bilety</title>
    <style>
        li {
            line-height: 2rem;
        }
    </style>
</head>
<body>
    <h1>Nowe bilety na spektakl 1989 </h1>
    <ul>
        {{#each tickets}}
        <li>
            {{#if href}}
                <a href="{{href}}">{{date}} - {{time}}</a>
            {{/if}}
            {{#if reservation}}
                {{date}} - {{time}} - {{reservation}}
            {{/if}}
            {{#if icons.length}}
                <ul>
                    {{#each icons}}
                        <li>
                            {{this}}
                        </li>
                    {{/each}}
                </ul>
            {{/if}}
        </li>
        {{/each}}
    </ul>
</body>
</html>
`;

export const template = handlebars.compile(htmlTemplate);
