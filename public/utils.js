export async function fetchLatestVacancies() {
  const res = await fetch("/latest-vacancies");
  return res.json();
}
