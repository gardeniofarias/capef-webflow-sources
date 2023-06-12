

    const buttonFormDenuncia = document.getElementById("form-denuncia-send")
    const formDenuncia = document.getElementById("wf-form-Den-ncia")

    buttonFormDenuncia.addEventListener("click", async () => {

      errorMsg.innerText = ""
      errorContainer.style.display = "none"

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const name = document.getElementById("Nome-2").value
      const cpf = document.getElementById("cpf01").value
      const phone = document.getElementById("phone01").value
      const email = document.getElementById("e-mail-2").value
      const solicitation = document.getElementById("Solicita-o").value
      const oldProtocol = document.getElementById("Protocolo-de-atendimento").value 
      const isValidProtocol = oldProtocol.trim() !== ""

      const formatCPF = (cpf) => cpf.replaceAll(".", "").replaceAll("-", "");
      const formatPhone = (phone) => phone.replace(/\D/g, "")

      const isEmailValid = emailRegex.test(email);
      const isNameValid = name.trim() !== "";
      const isPhoneValid = formatPhone(phone).length === 11;
      const isCPFValid = formatCPF(cpf).length === 11;
      const iSolicitationValid = solicitation.trim() !== "";

      if (!isNameValid) {
        errorMsg.innerText = "Campo nome não deve estar vazio";
        errorContainer.style.display = "block";
      } else if (!isCPFValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "CPF inválido"
      } else if (!isPhoneValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Número de telefone inválido"
      } else if (!isEmailValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Email inválido"
      } else if (!iSolicitationValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Solicitação não pode estar vazio"
      }else if(isValidProtocol){
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Numero de protocolo invalido"
      } else {
        errorContainer.style.display = "none";
        const cpfIsValid = await checkCPF(cpf)
        if (cpfIsValid) {
            console.log("test", { username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, oldProtocol, solicitation })
            await getProtocolDenuncia({ username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, oldProtocol, solicitation })
        } else {
          errorContainer.style.display = "block"
          errorMsg.style.display = "block"
          errorMsg.innerText = "CPF invalido"
        }
      }

    })

    async function getProtocolDenuncia({ username, cpf, phone, email, oldProtocol, solicitation }) {

    const checkProtocol = await validateProtocol({ cpf, protocol: oldProtocol })

    if(!checkProtocol){
        return;
    }

      const response = await fetch(`${urlAPI_Form}/forms`, {
        method: "POST",
        body: JSON.stringify({
          name: "Denúncia",
          data: {
            Nome: username,
            CPF: cpf,
            Telefone: phone,
            "e-mail": email,
            Solicitação: solicitation,
            "Resumo da solicitação": solicitation,
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
        formDenuncia.style.display = "none"
        msgSuccessCtn.style.display = "flex"
        msgSuccess.innerText = "Dados de atendimento envaido com sucesso, Novo número do protocol " + protocol
      } else {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Erro ao gerar protocolo"
      }

    }

   