var validPassword = (name1, name2) => {
    var $wrapper = document.querySelector('.divConfirmacao');
    var senha1 = document.getElementById(name1).value;
    var senha2 = document.getElementById(name2).value;

    if (senha1 === senha2) {
        //alert('senha iguais');
        if(senha1.length > 5 ){
            $wrapper.textContent = "";
            document.getElementById("btnSubmit").disabled = false;
        }else{
            $wrapper.textContent = "";
        var p = document.createElement('p')
        p.className = "alert alert-danger"
        p.textContent = "Senha muito curta!"
        $wrapper.appendChild(p)
        document.getElementById("btnSubmit").disabled = true;
        }
       
        
    } else {
        //alert('senhas diferentes');
        $wrapper.textContent = "";
        var p = document.createElement('p')
        p.className = "alert alert-danger"
        p.textContent = "Senha divergentes!"
        $wrapper.appendChild(p)
        document.getElementById("btnSubmit").disabled = true;
    }
}