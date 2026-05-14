"use client";
import Image from "next/image";
import styles from "./Cadastro.module.css";
import LogoGoogle from "@/../public/images/logo-google.svg";
import LogoMicrosoft from "@/../public/images/logo-microsoft.svg";
import Graphs1 from "@/../public/images/graphs-1.svg";
import Graphs2 from "@/../public/images/graphs-2.svg";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRegister } from "@/lib/api";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    cpf: "",
    email: "",
    phone: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { firstName, lastName, birthDate, gender, cpf, email, phone, password } = formData;
    if (!firstName || !lastName || !birthDate || !gender || !cpf || !email || !phone || !password) {
      alert("Todos os campos são obrigatórios!");
      setLoading(false);
      return;
    }

    try {
      const res = await apiRegister(formData);
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao cadastrar");
        setLoading(false);
        return;
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/Entrar");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert("Erro no servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.signUpContainer}>
      {/* Lado esquerdo */}
      <div className={styles.signUpWelcome}>
        <Link
          href="/"
          className={styles.backButton}
          title="Voltar para a página inicial"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
        >
          <Icon icon="mdi:arrow-left" width={24} height={24} className={styles.returnIcon} />
          <span>Voltar</span>
        </Link>

        <Image alt="Grafos em formato de olho" src={Graphs1} className={styles.signUpCircles} />
        <Image alt="Grafos em formato de olho" src={Graphs2} className={styles.signUpCirclesBottom} />
        <h1>Seja Bem-Vindo</h1>
        <p>
          PostVision é uma solução inteligente que usa visão computacional para te ajudar a treinar com mais segurança. Corrija sua postura, evite lesões e acompanhe sua evolução com tecnologia a favor da sua saúde.
        </p>
      </div>

      {/* Lado direito */}
      <div className={styles.signUpFormSection}>
        <form className={styles.signUpFormBox} onSubmit={handleSubmit}>
          <div className={styles.signUpTitle}>Cadastro</div>

          <div className={styles.signUpRow}>
            <div className={styles.signUpInputGroup}>
              <label htmlFor="firstName">Nome</label>
              <input id="firstName" type="text" placeholder="Nome" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className={styles.signUpInputGroup}>
              <label htmlFor="lastName">Sobrenome</label>
              <input id="lastName" type="text" placeholder="Sobrenome" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.signUpRow}>
            <div className={styles.signUpInputGroup}>
              <label htmlFor="birthDate">Data de Nascimento</label>
              <input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
            </div>
            <div className={styles.signUpInputGroup}>
              <label htmlFor="gender">Gênero</label>
              <select id="gender" value={formData.gender} onChange={handleChange} className={`${styles.signUpInput} ${styles.signUpSelect}`}>
                <option value="" disabled>Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className={styles.signUpInputGroup}>
              <label htmlFor="cpf">CPF</label>
              <input id="cpf" type="text" placeholder="190.203.400-14" value={formData.cpf} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.signUpRow}>
            <div className={styles.signUpInputGroup}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="email@gmail.com" value={formData.email} onChange={handleChange} />
            </div>
            <div className={styles.signUpInputGroup}>
              <label htmlFor="phone">Telefone</label>
              <input id="phone" type="text" placeholder="13 997311644" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.signUpInputGroup}>
            <label htmlFor="password">Senha</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="************"
                className={styles.loginInput}
                style={{ width: "100%" }}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ position: "absolute", right: 16, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", height: "100%" }}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <Icon icon="mdi:eye-outline" width={24} /> : <Icon icon="mdi:eye-off-outline" width={24} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.signUpButton} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <div className={styles.signUpAccountLink}>
            Já tem conta? <Link href="/Entrar">Entrar</Link>
          </div>

          <div className={styles.signUpDivider}>Ou</div>
          <div className={styles.signUpSocialButtons}>
            <button type="button" className={styles.signUpSocialBtn}>
              <Image src={LogoGoogle} alt="Google" className={styles.signUpSocialIcon} />
              Continuar com o Google
            </button>
            <button type="button" className={styles.signUpSocialBtn}>
              <Image src={LogoMicrosoft} alt="Microsoft" className={styles.signUpSocialIcon} />
              Continuar com o Microsoft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
