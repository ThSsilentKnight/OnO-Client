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
