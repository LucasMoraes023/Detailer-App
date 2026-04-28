const supabase = window.supabase.createClient(
  "https://zmhwbnxnceibmdmntbhh.supabase.co",
  "sb_publishable_SARoClbz6SwUk1RHHWDHgw_SUxJAsPe"
);

async function agendar(){
  const nome = document.getElementById("nome").value;
  const servico = document.getElementById("servico").value;
  const horario = document.getElementById("horario").value;

  if(!nome){
    alert("Digite seu nome");
    return;
  }

  const { error } = await supabase
    .from('agendamentos')
    .insert([{ nome, servico, horario, status: "pendente" }]);

  if(error){
    alert("Erro ao agendar");
  } else {
    alert("Agendamento realizado com sucesso!");
  }
}
