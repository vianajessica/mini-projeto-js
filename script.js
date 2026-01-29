const overlay = document.getElementById("overlay");
const criarTarefa = document.getElementById("criarTarefa");
const lista = document.getElementById("lista");
const busca = document.getElementById("busca");
const nenhumaTarefa = document.getElementById("nenhuma-tarefa");

function abrirModal(){
    overlay.classList.add("active");
    criarTarefa.classList.add("active");
}

function fecharModal(){
    overlay.classList.remove("active");
    criarTarefa.classList.remove("active");
}


function buscarTarefas(){
    fetch("http://localhost:3000/tarefas")
        .then(res => res.json())
        .then(res => {
            inserirTarefas(res);
        });
}

buscarTarefas();

function inserirTarefas(listaDeTarefas){
    lista.innerHTML = "";

    if(listaDeTarefas.length > 0){
        nenhumaTarefa.classList.add("oculto");

        listaDeTarefas.forEach(tarefa => {
            lista.innerHTML += `
                <li>
                    <h5>${tarefa.titulo}</h5>
                    <p>${tarefa.descricao}</p>
                    <div class="actions">
                        <box-icon 
                            name="trash"
                            size="sm"
                            onclick="deletarTarefa(${tarefa.id})">
                        </box-icon>
                    </div>
                </li>
            `;
        });
    } else {
        nenhumaTarefa.classList.remove("oculto");
    }
}

function novaTarefa(){
    event.preventDefault();

    let tarefa = {
        titulo: titulo.value,
        descricao: descricao.value
    };

    fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
    })
    .then(res => res.json())
    .then(() => {
        fecharModal();
        buscarTarefas();
        document.querySelector("#criarTarefa form").reset();
    });
}

function deletarTarefa(id){
    fetch(`http://localhost:3000/tarefas/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        buscarTarefas();
    });
}

function pesquisarTarefas(){
    let lis = document.querySelectorAll("ul li");
    let termo = busca.value.toLowerCase();
    let encontrou = false;

    lis.forEach(li => {
        let titulo = li.children[0].innerText.toLowerCase();
        let descricao = li.children[1].innerText.toLowerCase();

        if(
            titulo.includes(termo) ||
            descricao.includes(termo)
        ){
            li.classList.remove("oculto");
            encontrou = true;
        } else {
            li.classList.add("oculto");
        }
    });

    if(termo.length > 0 && !encontrou){
        nenhumaTarefa.classList.remove("oculto");
    } else {
        nenhumaTarefa.classList.add("oculto");
    }
}
