# Validação de 12/10/2026

## Executado

Verificação sintática dos arquivos JavaScript. 14 testes de conteúdo e interação em Node com LinkeDOM, detalhados em `testes-automatizados.json`. Verificação de referências locais, textos sem primeira pessoa, formação, quantidade de habilidades, arquivos do modelo neutro e integridade do ZIP.

## Não executado

A ferramenta de navegador necessária ao fluxo de inspeção não estava disponível. Não houve teste visual desktop/mobile, zoom, leitor de tela, envio de e-mail ou publicação no GitHub. LinkeDOM emula o DOM e não valida o layout renderizado.

## Conferência antes da publicação

1. Abra `index.html` e confira desktop e celular, incluindo 320 px de largura.
2. Expanda “Veja mais” em cada experiência e confira a lista de atividades.
3. Alterne hard/soft skills e abra os exemplos de aplicação.
4. Selecione os cinco desafios e teste os filtros de projetos e soluções.
5. Confira a foto e o texto do RPAMed. Clique na foto para ampliar.
6. Navegue pelo teclado, teste o menu móvel e confira o foco visível.
7. Preencha o formulário com dados de teste e confira o rascunho no aplicativo de e-mail, sem enviá-lo.
8. Confira que a indisponibilidade da API do GitHub preserva os quatro repositórios locais.

O arquivo original da foto está preservado em `assets/rpamed-premiacao-original.jpg` para comparação com a edição.

## Verificações adicionais desta revisão

Abas de habilidades verificadas por clique e teclas de seta; títulos conferidos com a planilha; experiências anteriores e cursos adicionais inicialmente recolhidos; remoções dos prints e filtros conferidos. A geração MIME foi verificada por parser independente: assunto UTF-8, destinatário, corpo e conteúdo de dois anexos preservados. Limite de 10 MB testado. Não foi testada a abertura do `.eml` em um cliente real de e-mail.

As regras CSS igualam as colunas e os painéis no desktop; em telas pequenas os blocos são empilhados e crescem conforme o conteúdo. A validação visual renderizada continua pendente.
