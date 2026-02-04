fetch("../components/navbar.html")
  .then((res: Response) => res.text())
  .then((html: string) => {
    const navbar = document.getElementById("navbar") as HTMLDivElement | null;

    if (navbar) {
      navbar.innerHTML = html;
    } else {
      console.log("navbar not found");
    }
  });

fetch("../components/buttons.html")
  .then((res) => res.text())
  .then((html) => {
    document.querySelectorAll("[data-text]").forEach((container) => {
      container.innerHTML = html;

      const label = container.querySelector(".label");
      if (label) {
        label.textContent = container.getAttribute("data-text")!;
      }
    });
  });

fetch("../components/otrioBoard.fragment")
  .then((res: Response) => res.text())
  .then((html: string) => {
    const board = document.getElementById(
      "otrioBoard",
    ) as HTMLDivElement | null;

    console.log(html);
    if (board) {
      board.innerHTML = html;
    } else {
      console.log("Otrio Board not found");
    }
  });
