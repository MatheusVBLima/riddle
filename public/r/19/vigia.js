// A lógica fica à mostra. O que entra nela é que não.
window.vigia = window.vigia || {};
window.vigia.passar = function passar(s) {
  const letras = [...s.toUpperCase()].filter(c => /[A-Z]/.test(c));
  const gira = letras.map((c, i) =>
    String.fromCharCode(65 + ((c.charCodeAt(0) - 65) + (i % 7) + 1) % 26));
  return gira.reverse().filter((_, i) => (i + 1) % 3 !== 0).join("");
};
