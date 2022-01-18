const deleteCategory = (name, id, type) => {

    //Desativa todos os botões
    document.querySelectorAll(".btnDelete")
    .forEach(element => {
        element.disabled = true;
    });

    //insere o html lá no categorias.handlebars
    var $wrapper = document.querySelector('.divDelete'+id);

    //Form inicial
    if(type == 'categoria'){
    var form = document.createElement("form")
    form.action = "/admin/categorias/delete";
    form.method = "post";
    }
    
    if(type == 'post'){
        var form = document.createElement("form")
        form.action = "/posts/delete";
        form.method = "post";
        }

    //Card do input
    var subCard = document.createElement('div');
    subCard.className = "mb-3 cardInput";

    //Label do input
    var labelInput = document.createElement('label');
    labelInput.className = "form-label";
    labelInput.textContent = "Digite '" + name + "' para confirmar a exclusão:";
    labelInput.setAttribute("for", "confirmDelete");

    //Input
    var InputDelete = document.createElement('input');
    InputDelete.type = "text";
    InputDelete.className = "form-control";
    InputDelete.id = "confirmDelete";
    InputDelete.name = "confirmDelete";
    InputDelete.oninput = () => checkText(InputDelete.value, name);

    //Input invisível
    var InputId = document.createElement('input');
    InputId.type = "text";
    InputId.id = "_id";
    InputId.name = "_id";
    InputId.hidden = true;
    InputId.value = id;


    //Botões
    var btnConfirm = document.createElement("button");
    btnConfirm.className = "btn btn-danger mb-3 confirmDelete";
    btnConfirm.style = "float: right;";
    btnConfirm.textContent = "Confirmar exclusão";
    btnConfirm.type = "submit";
    btnConfirm.disabled = true;

    var btnCancel = document.createElement("button");
    btnCancel.className = "btn btn-primary mb-3";
    btnCancel.style = "float: right; margin-right: 1rem";
    btnCancel.textContent = "Cancelar";
    btnCancel.type = "button";
    btnCancel.onclick = () => {
        $wrapper.textContent = "";
        document.querySelectorAll(".btnDelete")
        .forEach(element => {
            element.disabled = false;
        });

    }


    subCard.appendChild(labelInput)
    subCard.appendChild(InputDelete)
    subCard.appendChild(InputId)
    form.appendChild(subCard)
    form.appendChild(btnConfirm)
    form.appendChild(btnCancel)
    $wrapper.appendChild(form)
}

const checkText = (text, category) => {

    text == category ? document.querySelector('.confirmDelete').disabled = false : document.querySelector('.confirmDelete').disabled = true

}