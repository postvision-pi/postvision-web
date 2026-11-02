import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";
import { AppSettingsProvider, useAppSettings } from "@/app/context/AppSettingsContext";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));
const wrapper = ({ children }: { children: ReactNode }) => <AppSettingsProvider>{children}</AppSettingsProvider>;

describe("preferências existentes", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-font-size");
    vi.mocked(usePathname).mockReturnValue("/Status");
  });

  it("restaura tema, tamanho e idioma salvos", () => {
    localStorage.setItem("pv_theme", "dark");
    localStorage.setItem("pv_font_size", "large");
    localStorage.setItem("pv_language", "en");
    const { result } = renderHook(useAppSettings, { wrapper });
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).toHaveAttribute("data-font-size", "large");
    expect(document.documentElement.lang).toBe("en");
    expect(result.current.t("settings.title")).toBe("Settings");
  });

  it("ignora valores inválidos armazenados", () => {
    for (const key of ["pv_theme", "pv_font_size", "pv_language"]) localStorage.setItem(key, "invalido");
    const { result } = renderHook(useAppSettings, { wrapper });
    expect(result.current.theme).toBe("light");
    expect(result.current.fontSize).toBe("normal");
    expect(result.current.language).toBe("pt");
  });

  it("grava as escolhas para a próxima abertura", () => {
    const { result, unmount } = renderHook(useAppSettings, { wrapper });
    act(() => {
      result.current.setTheme("dark"); result.current.setFontSize("small"); result.current.setLanguage("es");
    });
    expect(localStorage.getItem("pv_theme")).toBe("dark");
    expect(localStorage.getItem("pv_font_size")).toBe("small");
    expect(localStorage.getItem("pv_language")).toBe("es");
    unmount();
    const restored = renderHook(useAppSettings, { wrapper });
    expect(restored.result.current.t("settings.title")).toBe("Configuración");
    expect(document.documentElement).toHaveClass("dark");
  });

  it.each(["/", "/Entrar", "/Cadastro"])("mantém %s claro e reaplica o escuro no painel", path => {
    localStorage.setItem("pv_theme", "dark");
    vi.mocked(usePathname).mockReturnValue(path);
    const { result, rerender } = renderHook(useAppSettings, { wrapper });
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement).not.toHaveClass("dark");
    vi.mocked(usePathname).mockReturnValue("/Status");
    rerender();
    expect(document.documentElement).toHaveClass("dark");
  });
});
