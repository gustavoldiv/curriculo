/* Sem bibliotecas, analytics, cookies ou envio de formulários a servidores. */
(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG;
  if (!config || !config.person) return;
  const person = config.person;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text ?? '');
    return node;
  };
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function safeWebUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; }
    catch { return ''; }
  }
  function validEmail(value) { return /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(value || ''); }
  function externalLink(node, href) {
    const safe = safeWebUrl(href);
    if (!safe) { node.hidden = true; node.removeAttribute('href'); return; }
    node.href = safe; node.target = '_blank'; node.rel = 'noopener noreferrer'; node.hidden = false;
  }
  function tags(items) { const group = el('div', 'tags'); (items || []).forEach(text => group.append(el('span','tag',text))); return group; }
  function empty(container, text) { container.append(el('p', 'empty-state', text)); }
  function textMatch(record, query) { return normalize(JSON.stringify(record)).includes(normalize(query.trim())); }
  // Pequeno núcleo também utilizado na validação automatizada do pacote.
  window.PortfolioCore = {normalize, safeWebUrl, textMatch};

  Object.entries(config.theme || {}).forEach(([key,value]) => {
    const cssName = {accent:'--accent',accentDark:'--accent-dark',accentSoft:'--accent-soft'}[key];
    if (cssName && /^#[0-9a-f]{6}$/i.test(value)) document.documentElement.style.setProperty(cssName,value);
  });
  $$('[data-text]').forEach(node => { node.textContent = person[node.dataset.text] || ''; });
  $$('[data-link]').forEach(node => {
    const key = node.dataset.link;
    if (key === 'email') {
      node.hidden = !validEmail(person.email);
      if (!node.hidden) {node.href = 'mailto:' + person.email; node.textContent = person.email;}
    } else externalLink(node,person[key]);
  });
  const whatsapp = String(person.whatsapp || '').replace(/\D/g,'');
  if (/^\d{10,15}$/.test(whatsapp)) externalLink($('#whatsapp-link'),'https://wa.me/' + whatsapp);
  $('#year').textContent = new Date().getFullYear();
  document.title = person.name ? person.name + ' | ' + (person.title || 'Portfólio profissional') : 'Portfólio profissional';
  $('meta[name="description"]').content = person.introduction || 'Experiência profissional, projetos e contato.';
  $('meta[property="og:title"]').content = document.title;
  $('meta[property="og:description"]').content = person.introduction || '';
  const canonical = safeWebUrl(person.siteUrl);
  if (canonical) { const link = el('link'); link.rel = 'canonical'; link.href = canonical; document.head.append(link); }
  if (person.name) {
    const schema = el('script'); schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({'@context':'https://schema.org','@type':'Person',name:person.name,jobTitle:person.title,url:canonical || undefined,sameAs:[person.linkedin,person.github].map(safeWebUrl).filter(Boolean)});
    document.head.append(schema);
  }
  const photo = $('#profile-photo');
  const localPhoto = /^assets\/[a-z0-9_./-]+\.(png|jpe?g|webp)$/i.test(person.photo || '') && !person.photo.includes('..');
  if (localPhoto) {
    photo.alt = person.photoAlt || 'Foto do profissional';
    photo.addEventListener('error',()=> { photo.hidden = true; });
    photo.src = person.photo; photo.hidden = false;
  }
  (person.facts || []).forEach(item => { const node=el('div','fact');node.append(el('strong','',item.value),el('span','',item.label));$('#facts').append(node); });
  (person.about || []).forEach(text => $('#about-copy').append(el('p','',text)));
  (config.experience || []).forEach(item => {
    const node=el('li');node.append(el('p','period',item.period),el('h4','',item.role),el('p','organization organization-'+(item.brand||'default'),item.organization),el('p','description',item.description));
    if((item.activities||[]).length){
      const details=el('details','experience-details');const summary=el('summary','','Veja mais');summary.setAttribute('aria-label','Veja mais atividades: '+item.role+' - '+item.organization);
      const list=el('ul');item.activities.forEach(text=>list.append(el('li','',text)));details.append(summary,list);node.append(details);
      details.addEventListener('toggle',()=>{summary.textContent=details.open?'Ver menos':'Veja mais';});
    }
    $(item.previous?'#experience-previous':'#experience').append(node);if(item.previous)$('#previous-experience').hidden=false;
  });
  const courseItem=item=>{const li=el('li');li.append(el('strong','',item.title),el('span','',item.provider+' · '+item.year));return li;};
  if((config.courses||[]).length){$('#courses-section').hidden=false;config.courses.forEach(item=>{if(item.featured){$('#courses-list').append(courseItem(item));}else{$('#courses-details').hidden=false;$('#courses-other').append(courseItem(item));}});}
  ['Pós-graduação','Bacharelado'].forEach(kind=>{
    const items=(config.education||[]).filter(item=>item.kind===kind);if(!items.length)return;
    const group=el('section','education-group');group.append(el('h4','education-group-title',kind==='Bacharelado'?'Graduação':'Pós-graduação'));const list=el('ul','education-list');
    items.forEach(item=>{const li=el('li');li.append(el('h5','',item.title),el('p','',item.institution+' · '+item.period));list.append(li);});group.append(list);$('#education').append(group);
  });

  const iconPaths = {
    compass:['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z','m16 8-3 5-5 3 3-5 5-3Z'],
    server:['M3 3h18v7H3zM3 14h18v7H3zM6 6.5h.01M6 17.5h.01M10 6.5h7M10 17.5h7M8 10v4M16 10v4'],
    network:['M9 2h6v6H9zM2 16h6v6H2zM16 16h6v6h-6zM12 8v4M5 16v-4h14v4'],
    medical:['M8 4H5v18h14V4h-3M8 2h8v4H8zM12 10v8M8 14h8'],
    shield:['M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z','m8 12 3 3 5-6'],
    tools:['M21 6a6 6 0 0 1-8 7l-7 8-3-3 8-7a6 6 0 0 1 7-8l-4 4 3 3 4-4Z'],
    mail:['M3 5h18v14H3zM3 6l9 7 9-7'],
    linkedin:['M4 9v11M4 4v1M10 20V9M10 14c0-7 10-7 10 0v6'],
    github:['M8 20c-4 1-4-2-6-2M16 22v-4c0-1 0-2-1-3 4 0 6-2 6-5 0-2-1-3-2-4 0-1 0-3-1-4-2 0-3 1-4 2h-4C9 3 7 2 5 2c-1 1-1 3-1 4-1 1-2 2-2 4 0 3 2 5 6 5-1 1-1 2-1 3v4'],
    flow:['M4 4h6v6H4zM14 14h6v6h-6zM7 10v7h7M10 7h7v7'],
    database:['M20 6c0 2-4 3-8 3S4 8 4 6s4-3 8-3 8 1 8 3Z','M4 6v12c0 2 4 3 8 3s8-1 8-3V6M4 12c0 2 4 3 8 3s8-1 8-3'],
    grid:['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    spark:['m13 2-8 12h6l-1 8 9-13h-6l1-7Z'],
    people:['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-3a7 7 0 0 1 14 0v3M17 4a4 4 0 0 1 0 8M18 15c3 0 4 2 4 5'],
    target:['M21 12a9 9 0 1 1-9-9M17 12a5 5 0 1 1-5-5M12 12l9-9M16 3h5v5'],
    code:['m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18'],
    book:['M3 3h6c2 0 3 1 3 3v15c0-2-1-3-3-3H3zM21 3h-6c-2 0-3 1-3 3M21 3v15h-6c-2 0-3 1-3 3'],
    award:['M8 3h8v5a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4M16 5h4v3a4 4 0 0 1-4 4M12 12v6M8 21h8M9 18h6']
  };
  function icon(name) {
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.classList.add('icon');svg.setAttribute('data-icon-type',name);
    (iconPaths[name] || iconPaths.grid).forEach(d=>{const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);svg.append(path);});return svg;
  }
  $$('[data-icon]').forEach(node=>node.append(icon(node.dataset.icon)));
  $('#email-link').prepend(icon('mail'));$$('[data-contact-icon]').forEach(node=>node.prepend(icon(node.dataset.contactIcon)));
  function renderSkills(type) {
    const container=$('#skills');container.replaceChildren();
    const items=(config.skills||[]).filter(item=>(item.type||'hard')===type);
    items.forEach(item=>{
      const node=el('article','skill');const heading=el('div','skill-heading');heading.append(icon(item.icon),el('h3','',item.title));
      node.append(heading,el('p','',item.description),tags(item.tags));
      const application=el('div','skill-application');application.append(el('h4','','Aplicação prática'),el('p','',item.application||item.description));node.append(application);container.append(node);
    });
    if(!items.length)empty(container,'Habilidades ainda não cadastradas.');
    $('#skill-status').textContent=items.length+' habilidades '+(type==='hard'?'técnicas':'comportamentais')+' apresentadas.';
  }
  function selectSkill(button,focus=false){
    $$('[data-skill-filter]').forEach(node=>{const selected=node===button;node.setAttribute('aria-selected',String(selected));node.setAttribute('tabindex',selected?'0':'-1');});
    $('#skills-panel').setAttribute('aria-labelledby',button.id);renderSkills(button.dataset.skillFilter);if(focus)button.focus();
  }
  $$('[data-skill-filter]').forEach(button=>{button.addEventListener('click',()=>selectSkill(button));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const buttons=$$('[data-skill-filter]');const target=event.key==='Home'?buttons[0]:event.key==='End'?buttons[buttons.length-1]:buttons.find(x=>x!==button);selectSkill(target,true);}});});renderSkills('hard');
  function showProblem(item,index) {
    const panel=$('#problem-panel');panel.replaceChildren();
    const top=el('div','problem-top');top.append(el('span','problem-index',String(index+1).padStart(2,'0')),icon(item.icon));
    panel.append(top,el('p','eyebrow','O desafio'),el('h4','',item.title),el('p','problem-challenge',item.challenge),el('p','',item.action));
    const result=el('div','problem-value');result.append(icon('target'),el('p','',item.value));panel.append(result,tags(item.tags));
  }
  (config.problems||[]).forEach((item,index)=>{
    const button=el('button','problem-button');button.type='button';button.setAttribute('aria-pressed',String(index===0));button.setAttribute('aria-controls','problem-panel');
    button.append(icon(item.icon),el('span','',item.title),el('span','problem-arrow','↗'));
    button.addEventListener('click',()=>{$$('.problem-button').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));showProblem(item,index);});$('#problem-buttons').append(button);
    if(index===0)showProblem(item,index);
  });
  if(!(config.problems||[]).length){$('.problem-explorer').hidden=true;$('.contribution-heading').hidden=true;}
  if(config.innovation){
    const item=config.innovation,feature=$('#innovation-feature');feature.hidden=false;feature.classList.add('award-feature');
    const copy=el('div','innovation-copy');const badge=el('p','innovation-badge');badge.append(icon('award'),document.createTextNode(item.eyebrow));
    copy.append(badge,el('h3','',item.title),el('p','innovation-organization',item.organization),el('p','innovation-lead',item.description),el('p','',item.summary));
    const impact=el('div','innovation-impact');impact.append(icon('people'),el('p','',item.impact));copy.append(impact);
    const current=el('div','innovation-current');current.append(el('span','status',item.status),el('h4','',item.currentTitle),el('p','',item.current));copy.append(current);
    const figure=el('figure','award-photo');
    if(/^assets\/[a-z0-9_-]+\.(png|jpe?g|webp)$/i.test(item.image||'')){
      const link=el('a');link.href=item.image;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Ampliar foto da premiação');
      const img=el('img');img.src=item.image;img.alt=item.imageAlt||'Registro da premiação';img.loading='lazy';img.decoding='async';img.width=1219;img.height=1290;link.append(img);figure.append(link,el('figcaption','',item.imageCaption));
    }
    const milestones=el('ol','innovation-milestones');(item.milestones||[]).forEach((step,i)=>{const li=el('li');li.append(el('span','milestone-index',String(i+1).padStart(2,'0')),el('strong','',step.label),el('p','',step.text));milestones.append(li);});
    feature.append(copy,figure,milestones);
  }
  const menu = $('#menu-toggle'), nav = $('#navigation');
  function setMenu(open) {menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);}
  menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  $$('a',nav).forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=> {if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus();}});
  document.addEventListener('click',event=> {if(!nav.contains(event.target)&&!menu.contains(event.target))setMenu(false);});
  if (window.matchMedia) window.matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)setMenu(false);});
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=> {entries.forEach(entry=> {if(entry.isIntersecting){$$('nav a').forEach(link=>link.removeAttribute('aria-current'));const active=$('nav a[href="#'+entry.target.id+'"]');if(active)active.setAttribute('aria-current','location');}});},{rootMargin:'-15% 0px -65% 0px',threshold:0});
    $$('main section[id]').forEach(section=>observer.observe(section));
  }
  let repositoryData=[];
  function renderCases() {
    const container=$('#cases'); container.replaceChildren();
    const list=config.cases || [];
    $('#case-count').textContent=list.length+' projetos e iniciativas';
    if(!list.length)empty(container,'Projetos ainda não cadastrados.');
    list.forEach(item=> {
      const card=el('article','case-card');const graphic=el('div','case-graphic');
      const iconName=({'orientamed':'compass','transicao-erp':'server','integracao-tiss':'network','sistema-assistencial':'medical','adequacao-regulatoria':'shield','autonomia-erp':'tools'})[item.id]||'target';
      card.dataset.caseIcon=iconName;
      const iconButton=el('button','case-icon-button');iconButton.type='button';iconButton.append(icon(iconName));
      iconButton.setAttribute('aria-label','Ver contexto e contribuição: '+item.title);iconButton.setAttribute('aria-expanded','false');
      graphic.append(iconButton,el('span','',(item.tags||[])[0]||item.category));card.append(graphic);const top=el('div','card-top');top.append(el('span','category',item.category),el('span','card-number',String((config.cases || []).indexOf(item)+1).padStart(2,'0')));
      const details=el('details'); const summary=el('summary','','Contexto e contribuição');summary.setAttribute('aria-label','Contexto e contribuição: '+item.title);details.append(summary);
      details.id='case-details-'+(config.cases||[]).indexOf(item);iconButton.setAttribute('aria-controls',details.id);
      const updateIcon=()=>{iconButton.setAttribute('aria-expanded',String(details.open));iconButton.setAttribute('aria-label',(details.open?'Recolher':'Ver')+' contexto e contribuição: '+item.title);};
      iconButton.addEventListener('click',()=>{details.open=!details.open;updateIcon();});details.addEventListener('toggle',updateIcon);
      [['Desafio',item.context],['Atuação profissional',item.contribution],['Resultado / estágio',item.result]].forEach(([label,text])=>{const p=el('p');p.append(el('strong','',label),document.createTextNode(text||''));details.append(p);});
      details.append(el('p','evidence',item.evidence));card.append(top,el('h3','',item.title),el('p','summary',item.summary),el('p','status',item.status),tags(item.tags),details);container.append(card);
    });
  }
  renderCases();

  function prepareRepos(items) {
    const gh=config.github || {}, owner=String(gh.username || '').toLowerCase();
    return (Array.isArray(items)?items:[]).filter(item=> {
      if(!item||typeof item.name!=='string'||item.fork||item.archived||(gh.exclude||[]).some(name=>normalize(name)===normalize(item.name)))return false;
      try{const u=new URL(item.html_url);return u.protocol==='https:'&&u.hostname==='github.com'&&!u.username&&!u.password&&u.pathname.toLowerCase()==='/'+owner+'/'+item.name.toLowerCase();}catch{return false;}
    }).map(item=> {
      const c=(gh.curated||{})[item.name]||{};
      return {name:item.name,title:c.title||item.name,description:c.description||item.description||'Repositório público sem descrição cadastrada.',apiDescription:item.description||'',language:item.language||'Não informada',url:item.html_url,category:c.category||'Código público',priority:c.priority||99};
    }).sort((a,b)=>a.priority-b.priority||a.name.localeCompare(b.name,'pt-BR'));
  }
  function renderRepos() {
    const container=$('#repos');container.replaceChildren();
    const list=repositoryData;
    if(!list.length)empty(container,'Nenhuma solução cadastrada no momento.');
    list.forEach(item=> {
      const card=el('article','repo-card');const top=el('div','card-top');const mark=el('div','repo-icon');mark.append(icon(item.name==='orientamed'?'spark':'code'));top.append(mark,el('span','card-number',String(repositoryData.indexOf(item)+1).padStart(2,'0')));card.append(top);const label=el('p','category',item.category);
      const footer=el('div','repo-footer');footer.append(el('span','language',item.language));
      card.append(label,el('h3','',item.title),el('p','',item.description),footer);container.append(card);
    });
  }
  function setRepos(items) {repositoryData=prepareRepos(items);renderRepos();}
  const gh=config.github||{};
  setRepos(gh.fallback||[]);
  async function loadRepositories() {
    if(!/^[a-z0-9-]{1,39}$/i.test(gh.username||'')){ $('#repo-status').textContent='Perfil GitHub não configurado.';return; }
    const status=$('#repo-status');status.textContent='Consultando os repositórios públicos no GitHub…';
    const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),Math.max(1000,Math.min(gh.timeoutMs||6500,15000)));
    let rows=[],truncated=false;
    try {
      const max=Math.max(1,Math.min(gh.maxPages||3,10));
      for(let page=1;page<=max;page++) {
        const response=await fetch('https://api.github.com/users/'+encodeURIComponent(gh.username)+'/repos?per_page=100&sort=updated&page='+page,{signal:controller.signal,headers:{Accept:'application/vnd.github+json'},credentials:'omit',referrerPolicy:'no-referrer'});
        if(!response.ok)throw new Error('GitHub indisponível');
        const data=await response.json();if(!Array.isArray(data))throw new Error('Resposta inválida');rows.push(...data);
        if(data.length<100)break;
        if(page===max)truncated=true;
      }
      setRepos(rows);status.textContent='Repositórios atualizados via GitHub.'+(truncated?' Lista limitada aos primeiros '+rows.length+' resultados.':'');
    } catch {
      setRepos(gh.fallback||[]);status.textContent='GitHub indisponível no momento. Exibindo a seleção local'+(gh.reviewedAt?' revisada em '+gh.reviewedAt:'')+'.';
    } finally {clearTimeout(timeout);}
  }
  loadRepositories();
})();
