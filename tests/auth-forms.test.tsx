import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Entrar from "@/app/(public)/Entrar/page";
import Cadastro from "@/app/(public)/Cadastro/page";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next/image", () => ({ default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} /> }));
vi.mock("@iconify/react", () => ({ Icon: () => null }));

describe("formulários de autenticação", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    localStorage.clear();
    document.cookie = "token=; path=/; max-age=0";
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  async function fillLogin() {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("E-mail"), "demo@postvision.local");
    await user.type(screen.getByLabelText("Senha"), "PostVision123!");
    await user.click(screen.getByRole("button", { name: "Entrar" }));
  }

  function fillRegister() {
    for (const [label, value] of [
      ["Nome", "Ana"], ["Sobrenome", "Exemplo"], ["Data de Nascimento", "1998-02-10"],
      ["Gênero", "Outro"], ["CPF", "52998224725"], ["Email", "ana@exemplo.local"],
      ["Telefone", "11999999999"], ["Senha", "SenhaTeste123!"],
    ]) fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
  }

  it("envia login, salva sessão e navega ao painel", async () => {
    const payload = { id_usuario: "u1", nome_usuario: "Ana" };
    const token = `header.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.signature`;
    fetchMock.mockResolvedValueOnce(Response.json({ token }));
    render(<Entrar />);
    await fillLogin();
    await waitFor(() => expect(push).toHaveBeenCalledWith("/Status"));
    expect(localStorage.getItem("token")).toBe(token);
    expect(JSON.parse(localStorage.getItem("usuario")!)).toEqual(payload);
    expect(document.cookie).toContain(`token=${token}`);
  });

  it("mostra erro de credenciais sem salvar token nem navegar", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ error: "E-mail ou senha inválidos" }, { status: 400 }));
    render(<Entrar />);
    await fillLogin();
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("E-mail ou senha inválidos"));
    expect(localStorage.getItem("token")).toBeNull();
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
  });

  it("mantém o botão desabilitado enquanto o login está pendente", async () => {
    let resolve!: (response: Response) => void;
    fetchMock.mockReturnValueOnce(new Promise(r => { resolve = r; }));
    render(<Entrar />);
    await fillLogin();
    expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled();
    resolve(Response.json({ error: "Tente novamente" }, { status: 500 }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled());
  });

  it("permite tentar novamente após falha de rede no login", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Sem rede"));
    render(<Entrar />);
    await fillLogin();
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Erro no servidor"));
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
    expect(push).not.toHaveBeenCalled();
  });

  it("bloqueia cadastro com campos vazios", () => {
    render(<Cadastro />);
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));
    expect(window.alert).toHaveBeenCalledWith("Todos os campos são obrigatórios!");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("envia Outro conforme o contrato da API e navega ao login", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ message: "Criado" }, { status: 201 }));
    render(<Cadastro />);
    fillRegister();
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/Entrar"));
    const options = fetchMock.mock.calls[0][1];
    expect(JSON.parse(String(options?.body))).toMatchObject({ gender: "Outro", firstName: "Ana" });
    expect(window.alert).toHaveBeenCalledWith("Cadastro realizado com sucesso!");
  });

  it("apresenta erro do cadastro sem redirecionar", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ error: "E-mail já cadastrado" }, { status: 400 }));
    render(<Cadastro />);
    fillRegister();
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("E-mail já cadastrado"));
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Cadastrar" })).toBeEnabled();
  });
});
