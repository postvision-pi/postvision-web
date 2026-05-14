"use client";
import Image from "next/image";
import styles from "./Entrar.module.css";
import Graphs1 from "@/../public/images/graphs-1.svg";
import Graphs2 from "@/../public/images/graphs-2.svg";
import LogoGoogle from "@/../public/images/logo-google.svg";
import LogoMicrosoft from "@/../public/images/logo-microsoft.svg";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiLogin, saveToken, decodeTokenPayload } from "@/lib/api";

export default function Entrar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiLogin(email, password);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      // Salva o token no localStorage e no cookie (para o middleware)
      saveToken(data.token);

      // Decodifica o payload do JWT para obter os dados do usuário
      const payload = decodeTokenPayload<{
        id_usuario: string;
        nome_usuario: string;
        sobrenome_usuario: string;
        email_usuario: string;
        cpf_usuario: string;
        genero_usuario: string;
        telefone_usuario: string;
        data_nascimento_usuario: string;
      }>(data.token);

      if (payload) {
        localStorage.setItem("usuario", JSON.stringify(payload));
      }

      router.push("/Status");
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro no servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      {/* Lado esquerdo */}
      <div className={styles.loginWelcome}>
        <Link
          href="/"
          className={styles.backButton}
          title="Voltar para a página inicial"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          <Icon icon="mdi:arrow-left" width={24} height={24} className={styles.returnIcon} />
          <span>Voltar</span>
        </Link>

        <Image alt="Grafos em formato de olho" src={Graphs1} className={styles.loginCircles} />
        <Image alt="Grafos em formato de olho" src={Graphs2} className={styles.loginCirclesBottom} />
        <h1>Seja Bem-Vindo</h1>
        <p>
          PostVision é uma solução inteligente que usa visão computacional para te ajudar a treinar com mais segurança. Corrija sua postura, evite lesões e acompanhe sua evolução com tecnologia a favor da sua saúde.
        </p>
      </div>

      {/* Lado direito */}
      <div className={styles.loginFormSection}>
        <form className={styles.loginFormBox} onSubmit={handleLogin}>
          <div className={styles.loginTitle}>Entre com a sua conta</div>

          <div className={styles.loginInputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.loginInputGroup}>
            <label htmlFor="password">Senha</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.loginInput}
                style={{ width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 16,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <Icon icon="mdi:eye-outline" width={24} />
                ) : (
                  <Icon icon="mdi:eye-off-outline" width={24} />
                )}
              </button>
            </div>
          </div>

          <div className={styles.loginAccountLink}>
            Não tem conta? <a href="/Cadastro">Cadastrar</a>
          </div>

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className={styles.loginDivider}>Ou</div>

          <div className={styles.loginSocialButtons}>
            <button type="button" className={styles.loginSocialBtn}>
              <Image src={LogoGoogle} alt="Google" className={styles.loginSocialIcon} />
              Continuar com o Google
            </button>
            <button type="button" className={styles.loginSocialBtn}>
              <Image src={LogoMicrosoft} alt="Microsoft" className={styles.loginSocialIcon} />
              Continuar com o Microsoft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
