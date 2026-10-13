# Portfólio de Gustavo Lucas Sousa

## Abrir e utilizar

Extraia o ZIP e abra `index.html`. O pacote contém HTML, CSS, JavaScript e imagens locais, sem instalação nem compilação. Os repositórios usam a API pública do GitHub e contam com uma seleção local em caso de indisponibilidade.

## Revisão de 12/10/2026

- Slogan: “Inteligência para conectar. Tecnologia para transformar.”
- Textos impessoais, com foco em sistemas corporativos e conexão entre TI e negócio.
- Abas acessíveis com seis hard skills baseadas no currículo e seis soft skills da planilha “Principais soft skills.xlsx”. Aplicações práticas sempre visíveis.
- Resumo e “Veja mais” com atividades por experiência. Unimed e Senac visíveis; vínculos anteriores em “Ver outras experiências”.
- Bacharelado em Sistemas da Informação, Faculdade Pitágoras, 2013, e quatro pós-graduações. Três cursos selecionados visíveis e demais em “Ver outros cursos”. Matemática removida por solicitação.
- RPAMed em destaque: 2º lugar no Programa Uníssono 2025. A proposta de conciliação bancária é distinta da primeira iniciativa em desenvolvimento, integração de notas fiscais de serviços.
- OrientaMed preservado como proposta finalista do 2º Programa de Inovação.
- Busca textual e filtros removidos das seções de projetos e soluções.
- Azul-escuro, branco, ciano e dourado, com ícones em cores complementares e espaçamentos mais compactos.
- Foto da premiação editada para retirar objetos do ambiente, com arquivo original preservado em `assets/rpamed-premiacao-original.jpg`.

A versão foi entregue em arquivo. Nenhuma publicação ou alteração no repositório GitHub foi executada.

## Personalizar

Edite `js/config.js`:

- `person`: identidade, slogan, resumo, foto e contatos. WhatsApp permanece vazio.
- `experience[].activities`: lista de atividades expandida por “Veja mais”; `previous` recolhe vínculos anteriores e `brand` define a cor da organização.
- `education` e `courses`: formação e cursos complementares; `courses[].featured` seleciona os cursos inicialmente visíveis.
- `skills`: seis registros de `type: hard` e seis de `type: soft`, com exemplos em `application`.
- `problems`: desafios e contribuições do painel interativo.
- `innovation`: destaque da premiação, foto e estágios; use `null` para ocultar.
- `cases`: projetos com desafio, atuação, estágio e resultados.
- `github.curated` e `github.fallback`: descrições, categorias e seleção de repositórios.
- `theme`: cores principais. As cores complementares dos ícones e superfícies estão em `css/style.css`.

A pasta `modelo-neutro` é independente e não contém dados pessoais, imagens de Gustavo ou projetos. Preencha seu `js/config.js` antes de reutilizar.

## Publicar sem substituir o site antes da revisão

Procedimento via interface do GitHub, conferido com a documentação oficial em 10/10/2026:

1. Abra `https://github.com/gustavoldiv/portifolio`. Entre na sua conta.
2. Confira em **Settings → Pages** a fonte de publicação atual e anote a branch e a pasta. A branch padrão pública observada foi `main`; a configuração privada de Pages não foi consultada.
3. Faça backup pelo botão **Code → Download ZIP** e guarde o arquivo fora da pasta que será atualizada. No seletor de branches, crie também `backup-portfolio-2026-10-10` a partir da branch atual. Se esse nome já existir, use um novo sufixo.
4. A partir da branch atual, crie a branch `portfolio-v2`. Não modifique `main` neste momento.
5. Selecione `portfolio-v2`. Use **Add file → Upload files** e envie `index.html`, as pastas `css`, `js`, `assets` e o arquivo `.nojekyll`, mantendo a estrutura. O `index.html` deve ficar na raiz da branch, não dentro de `portfolio-gustavo/`.
6. Faça um commit nessa branch. Não envie o ZIP inteiro nem `modelo-neutro/` como página principal.
7. Para uma prévia pública sem alterar o endereço atual, crie um repositório separado `portifolio-preview`, envie os mesmos arquivos e configure **Settings → Pages → Deploy from a branch → main → /(root) → Save**. Revise o endereço `https://gustavoldiv.github.io/portifolio-preview/`. Nesse repositório de teste, ajuste `person.siteUrl` para o endereço da prévia. Essa prévia será pública; publique apenas o conteúdo já revisado.
8. Depois da validação, abra um pull request de `portfolio-v2` para a branch de publicação atual, confira os arquivos e faça o merge. Não mude a fonte de Pages para uma branch de teste sem querer substituir o site atual.
9. Se Pages ainda não estiver configurado para o novo HTML na raiz, em **Settings → Pages** selecione **Deploy from a branch**, a branch aprovada e **/(root)**. Salve e acompanhe a execução em **Actions**. Uma configuração existente por GitHub Actions pode exigir adaptação; não foi inspecionada com acesso autenticado.
10. Verifique `https://gustavoldiv.github.io/portifolio/`, inclusive por celular, após a conclusão do deploy. Confirme que `person.siteUrl` aponta para produção.

### Alternativa com Git no computador

```bash
git clone https://github.com/gustavoldiv/portifolio.git
cd portifolio
git switch main
git pull --ff-only
git branch backup-portfolio-2026-10-10
git push origin backup-portfolio-2026-10-10
git switch -c portfolio-v2
```

Copie os arquivos aprovados para essa pasta, sem apagar `.git`. Depois:

```bash
git add index.html css js assets .nojekyll
git diff --cached --stat
git diff --cached
git commit -m "Atualiza portfolio profissional"
git push -u origin portfolio-v2
```

Abra o pull request no GitHub e faça a revisão antes do merge. Se a branch usada em produção não for `main`, substitua esse nome pelo confirmado em Settings → Pages. Nenhum desses comandos foi executado em sua conta nesta entrega.

### Páginas antigas e reversão

O site anterior possui `about.html`, `projects.html`, `contact.html` e `project-detail.html`, além de `js/data.js`. Nesta nova versão, a navegação é por seções e não usa esses arquivos. Eles continuam acessíveis se você apenas enviar os novos arquivos. Após o backup, remova-os na branch de teste ou substitua os HTMLs por redirecionamentos para `index.html#sobre`, `#projetos` e `#contato`, conforme a página. Remova também o `js/data.js` antigo para não manter afirmações desatualizadas acessíveis.

Para reverter uma publicação feita por pull request, use **Revert** no PR que foi mesclado e aprove o PR de reversão. Outra opção, para publicação por branch, é selecionar temporariamente a branch de backup em Settings → Pages, usando a mesma pasta original. Não use `git reset --hard` ou force-push para um rollback rotineiro.

## Modelo white-label

A pasta `modelo-neutro/` é uma cópia funcional independente, sem nome, avatar, cases ou contatos de Gustavo. Comece por ela para outro cliente; não entregue a pasta principal inteira. Preencha `modelo-neutro/js/config.js` e revise a linguagem genérica de sistemas/negócios em `index.html`, caso o cliente seja de outra área. Veja `docs/PERSONALIZACAO.md`.

A estrutura própria pode ser adaptada comercialmente. Foto, nomes, marcas, cases e código dos repositórios externos não são licenciados automaticamente pelo fornecimento deste template. Os repositórios externos são apenas referenciados, não redistribuídos. O favicon é um SVG geométrico original sem dependências externas.

## Contato, SEO e limites

- O contato apresenta links de e-mail, LinkedIn e GitHub. O formulário foi removido e substituído por um painel de contribuição profissional. O link de e-mail abre o aplicativo do visitante, que redige e envia sua mensagem.
- Nenhum serviço terceiro de formulário foi integrado. Não há coleta de analytics.
- HTML com `lang`, viewport, landmarks, headings, metadados básicos e JSON-LD de Person. Título, descrição e canonical são personalizados em JavaScript. Alguns robôs de redes sociais não executam JavaScript; para previews personalizados no LinkedIn, preencha também os metadados estáticos do `<head>` com os dados finais do cliente. Esta limitação está documentada e não foi mascarada.
- A página utiliza JavaScript para apresentar os dados e contatos. O bloco `noscript` orienta sua ativação.
- Acessibilidade visual e responsividade foram implementadas, mas a inspeção em navegador real, o teste com leitor de tela e a auditoria WCAG completa não foram realizados neste ambiente.

Fontes e pendências: `docs/DIAGNOSTICO.md`, `docs/FONTES.md`, `docs/VALIDACAO.md`.

## Revisão conforme prints

Ícones e rótulos ampliados, elementos marcados removidos, diagrama local de processo, colunas de trajetória com mesma largura e altura no desktop, formação agrupada, destaque dourado na premiação e links de código individuais removidos. Marcos “18 anos” e “7 anos” conforme texto solicitado pelo profissional em outubro de 2026; são textos editoriais e não contadores automáticos.

## Última revisão: sete novos prints

- Formulário e seus avisos removidos. Painel “Clareza na demanda. Consistência na solução.” com três frentes de contribuição: negócio, sistemas e processos.
- Links diretos de e-mail, LinkedIn e GitHub preservados. Nenhum envio automático ou download de arquivo.
- Título “Projetos e Inovação” no tópico 04 e no atalho correspondente.
- Seis cartões com espaçamentos menores, sem alturas mínimas nos títulos/resumos. Fundo branco e ícones acionáveis preservados.
- Filtros removidos das seções de projetos e soluções. Contador de soluções também removido.
- Ordinais singulares apresentados como 1ª/1º e 2ª/2º.

A inspeção visual em navegador real permanece pendente; a ferramenta necessária não está disponível neste ambiente.
