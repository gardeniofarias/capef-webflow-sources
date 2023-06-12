
    const errorMsg1 = document.getElementById("error-msg-1")
    const errorContainer1 = document.getElementById("msg-ctn-1")
    const msgSuccess1 = document.getElementById("success-msg-1")
    const msgSuccessCtn1 = document.getElementById("success-ctn-1")
     
     async function validateProtocol({ cpf, protocol }) {

      const response = await api(`${urlConsulta}/Validar/Protocolo/Tactium/?NrProtocolo=${protocol}&CPF=${cpf}`, {
        key: urlConsulta
      })

      if (response.valido) {
        return false
      } else {
        errorMsg1.innerText = "Numero do Protocolo invalido";
        errorContainer1.style.display = "block";
        return true
      }

    }
    
    
    const buttonFormOuvidoria = document.getElementById("form-ouvidoria-send")
    const formOuvidoria = document.getElementById("wf-form-Ouvidoria")

    buttonFormOuvidoria.addEventListener("click", async () => {

      errorMsg1.innerText = ""
      errorContainer1.style.display = "none"

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const name = document.getElementById("Nome-3").value
      const cpf = document.getElementById("cpf02").value
      const phone = document.getElementById("phone02").value
      const email = document.getElementById("e-mail-3").value
      const assunto = document.getElementById("assunto-1").value
      const solicitation = document.getElementById("Solicita-1").value
      const oldProtocol = document.getElementById("Protocolo-de-atendimento").value 

      const isEmailValid = emailRegex.test(email);
      const isNameValid = name.trim() !== "";
      const isPhoneValid = formatPhone(phone).length === 11;
      const isCPFValid = formatCPF(cpf).length === 11;
      const iSolicitationValid = solicitation.trim() !== "";
      const isValidProtocol = oldProtocol.trim() !== ""

      if (!isNameValid) {
        errorMsg1.innerText = "Campo nome não deve estar vazio";
        errorContainer1.style.display = "block";
      } else if (!isCPFValid) {
        errorContainer1.style.display = "block"
        errorMsg1.style.display = "block"
        errorMsg1.innerText = "CPF inválido"
      } else if (!isPhoneValid) {
        errorContainer1.style.display = "block"
        errorMsg1.style.display = "block"
        errorMsg1.innerText = "Número de telefone inválido"
      } else if (!isEmailValid) {
        errorContainer1.style.display = "block"
        errorMsg1.style.display = "block"
        errorMsg1.innerText = "Email inválido"
      } else if (!iSolicitationValid) {
        errorContainer1.style.display = "block"
        errorMsg1.style.display = "block"
        errorMsg1.innerText = "Solicitação não pode estar vazio"
      }else if(isValidProtocol){
        errorContainer1.style.display = "block"
        errorMsg1.style.display = "block"
        errorMsg1.innerText = "Numero de protocolo invalido"
      }else {
        errorContainer1.style.display = "none";
        const cpfIsValid = await checkCPF(cpf)
        if (cpfIsValid) {
         console.log("test", { username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, oldProtocol, solicitation, assunto })
         await getProtocol({ username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, oldProtocol, solicitation, assunto })
        } else {
          errorContainer1.style.display = "block"
          errorMsg1.style.display = "block"
          errorMsg1.innerText = "CPF invalido"
        }
        
      }

    })

    async function getProtocolOuvidoria({ username, cpf, phone, email, oldProtocol, solicitation, assunto }) {

    const checkProtocol = await validateProtocol({ cpf, protocol: oldProtocol })

    if(!checkProtocol){
        return;
    }

      const response = await fetch(`${urlAPI_Form}/forms`, {
        method: "POST",
        body: JSON.stringify({
          name: "Ouvidoria",
          data: {
            Nome: username,
            CPF: cpf,
            Telefone: phone,
            "e-mail": email,
            Solicitação: solicitation,
            "Resumo da solicitação": assunto,
            "Protocolo de atendimento": oldProtocol
          }
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await response.json()
      const protocol = data.protocol

      if (protocol) {
        formOuvidoria.style.display = "none"
        msgSuccessCtn1.style.display = "flex"
        msgSuccess1.innerText = "Dados de atendimento envaido com sucesso, Novo número do protocol " + protocol
      } else {
        errorContainer1.style.display = "block"
        errorMsg1.style.display = "block"
        errorMsg1.innerText = "Erro ao gerar protocolo"
      }

    }

   