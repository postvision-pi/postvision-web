import Image from "next/image";
import { Icon } from "@iconify/react";
import Logo from "@/../public/images/logo-white.svg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Projeto", href: "#projeto" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

export default function Footer() {
  return (
    <footer className="py-12 px-8 w-full" style={{ background: "#0d0f24", borderTop: "1px solid #1e2040" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src={Logo} alt="ByteMe" width={84} height={84} />
              <span className="font-bold text-white">PostVision</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Análise postural em exercícios físicos orientados a visão computacional.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://github.com/postvision-pi" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                style={{ background: "#111327", border: "1px solid #1e2040" }}>
                <Icon icon="mdi:github" width={18} />
              </a>
            </div>
          </div>
            {/* <div>
              <h4 className="text-sm font-semibold text-white mb-4">Navegação</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="block text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div> */}
        </div>
        <div style={{ borderTop: "1px solid #1e2040" }} className="pt-6">
          <p className="text-xs text-slate-500 text-center">
            © 2025 PostVision. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
