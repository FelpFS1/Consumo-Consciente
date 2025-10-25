const sample = {
      labels:["Conhecem consumo consciente","Separam o lixo","Economizam água/energia","Acreditam que reduz gastos","Participariam de oficinas"],
      values:[80,55,70,65,75]
    };

   
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx,{
      type:'bar',
      data:{labels:sample.labels,datasets:[{label:'Percentual (%)',data:sample.values,backgroundColor: 'rgba(255, 122, 24, 0.9)'}]},
      options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,max:100}}}
    });

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx,{type:'pie',data:{labels:sample.labels,datasets:[{data:sample.values}]},options:{}});


    function downloadPDF(){
      const url = './Questionario_Economia_Sustentavel.pdf';
    
      window.open(url,'_blank');
    }

    const form = document.getElementById('surveyForm');
    const msg = document.getElementById('msg');
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = new FormData(form);
      const obj = {};
      for(const [k,v] of data.entries()) obj[k]=v;
      const all = JSON.parse(localStorage.getItem('cc_responses')||'[]');
      all.push(obj);
      localStorage.setItem('cc_responses', JSON.stringify(all));
      msg.innerText = 'Resposta registrada. Obrigado!';
      form.reset();
      setTimeout(()=>msg.innerText='','3000');
      refreshStats(all);
    });


    function refreshStats(responses){

      const total = responses.length + 30; 
      const counts = {
        q1: (sample.values[0]*30/100),
        q2Always: (sample.values[1]*30/100),
        q3: (sample.values[2]*30/100),
        q4: (sample.values[4]*30/100)
      };
      responses.forEach(r=>{
        if(r.q1==='Sim') counts.q1++;
        if(r.q2==='Sempre') counts.q2Always++;
        if(r.q3==='Sim') counts.q3++;
        if(r.q4==='Sim') counts.q4++;
      });
   
      document.getElementById('kno').innerText = Math.round((counts.q1/total)*100)+'%';
      document.getElementById('sep').innerText = Math.round((counts.q2Always/total)*100)+'%';
      document.getElementById('int').innerText = Math.round((counts.q4/total)*100)+'%';

   
      const newValues = [ (counts.q1/total)*100, (counts.q2Always/total)*100, (counts.q3/total)*100, sample.values[3], (counts.q4/total)*100 ];
      barChart.data.datasets[0].data = newValues.map(v=>Math.round(v));
      barChart.update();
      pieChart.data.datasets[0].data = newValues.map(v=>Math.round(v));
      pieChart.update();
    }


    function exportCSV(){
      const arr = JSON.parse(localStorage.getItem('cc_responses')||'[]');
      const headers = ['q1','q2','q3','q4','idade'];
      const rows = [headers.join(',')];
      arr.forEach(r=>{ rows.push(headers.map(h=> (r[h]||'')).join(',')) });
      const blob = new Blob([rows.join('\n')],{type:'text/csv'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='respostas_cc.csv'; a.click(); URL.revokeObjectURL(url);
    }

    
    document.addEventListener('DOMContentLoaded', ()=>{
      const stored = JSON.parse(localStorage.getItem('cc_responses')||'[]');
      refreshStats(stored);
    });