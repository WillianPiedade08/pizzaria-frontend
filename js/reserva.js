    const form = document.getElementById("reservaForm");
    const overlay = document.getElementById("overlayMensagem");
    const dataSpan = document.getElementById("dataReserva");
    const horaSpan = document.getElementById("horaReserva");
    const voltarBtn = document.getElementById("voltarBtn");


    voltarBtn.addEventListener("click", function () {
      window.location.href = "index.html";
    });


    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        overlay.classList.add("hidden");
      }
    });


    form.addEventListener("submit", function (e) {
      e.preventDefault();


      const dataReserva = document.getElementById("data").value;
      const horaReserva = document.getElementById("hora").value;


      const dataFormatada = new Date(dataReserva).toLocaleDateString('pt-BR');


      dataSpan.textContent = dataFormatada;
      horaSpan.textContent = horaReserva.slice(0, 5);

      form.reset();
      overlay.classList.remove("hidden");
    });