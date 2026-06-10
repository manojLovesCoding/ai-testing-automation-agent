import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("gh_token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "GitHub token not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const allResp = [];
  let page = 1;
  while (true) {
    const resp = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );
    const respos = await resp.json();
    if (!respos.length) break;
    allResp.push(...respos);
    page++;
  }
  return NextResponse.json(
    allResp.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      full_name: repo.full_name,
      private_: repo.private,
      updated_at: repo.updated_at,
      language: repo.language,
      default_branch: repo.default_branch,
      owner: {
        login: repo.owner.login,
      },
    })),
  );
}
