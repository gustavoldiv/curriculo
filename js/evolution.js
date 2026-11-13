/* Evolução profissional: filtros combinados e paginação local. */
(() => {
 'use strict';
 const section = document.getElementById('evolucao');
 if (!section) return;
 const find = id => document.getElementById('evolution-' + id);
 const entries = Array.from(section.querySelectorAll('.evolution-entry'));
 entries.sort((a,b) => b.dataset.date.localeCompare(a.dataset.date));
 entries.forEach(entry => find('list').append(entry));
 const month = find('month'), year = find('year'), skill = find('skill');
 const skillsOf = entry => Array.from(entry.querySelectorAll('.evolution-skills li'), node => node.textContent.trim());
 [...new Set(entries.flatMap(skillsOf))].sort((a,b)=>a.localeCompare(b,'pt-BR')).forEach(value => {
   const option=document.createElement('option');option.value=value;option.textContent=value;skill.append(option);
 });
 [...new Set(entries.map(entry => entry.dataset.date.slice(0,4)))].sort().reverse().forEach(value => {
   const option = document.createElement('option'); option.value = value; option.textContent = value; year.append(option);
 });
 let limit = 3;
 const matching = () => entries.filter(entry => (!month.value || entry.dataset.date.slice(5,7) === month.value) && (!year.value || entry.dataset.date.slice(0,4) === year.value) && (!skill.value || skillsOf(entry).includes(skill.value))); 
 function render(focusIndex) {
   const filtered = matching(), visible = filtered.slice(0, limit);
   entries.forEach(entry => { entry.hidden = !visible.includes(entry); });
   find('count').textContent = `Exibindo ${visible.length} de ${filtered.length} ${filtered.length === 1 ? 'atualização' : 'atualizações'}`;
   find('empty').hidden = filtered.length > 0;
   find('more').hidden = find('all').hidden = visible.length >= filtered.length;
   find('less').hidden = visible.length <= 3;
   find('actions').hidden = filtered.length <= 3;
   if (focusIndex !== undefined && visible[focusIndex]) visible[focusIndex].querySelector('h3').focus({preventScroll:true});
 }
 function resetPage() { limit = 3; render(); }
 month.addEventListener('change', resetPage); year.addEventListener('change', resetPage); skill.addEventListener('change', resetPage);
 find('reset').addEventListener('click', () => { month.value = ''; year.value = ''; skill.value = ''; resetPage(); });
 find('more').addEventListener('click', () => { const previous = limit; limit += 3; render(previous); });
 find('all').addEventListener('click', () => { const previous = limit; limit = matching().length; render(previous); });
 find('less').addEventListener('click', () => { limit = 3; render(0); find('filters').scrollIntoView({block:'start'}); });
 find('filters').hidden = false;
 render();
})();
