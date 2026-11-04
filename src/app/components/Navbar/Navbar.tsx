import Link from 'next/link';
import styles from './Navbar.module.css';
import Image from 'next/image';
import { Icon } from '@iconify/react';

export default function Navbar() {
    return (
        <div className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                <Image src="/images/logo-purple.svg" alt="" width={47} height={46} className={styles.logoImg} />
                <span className={styles.logoText}>PostVision</span>
            </Link>
            <ul className={styles.navLinks}>
                <li><Link href="#Sobre">Sobre o projeto</Link></li>
                <li><Link href="#Aplicativo">Aplicativo</Link></li>
                <li><Link href="#Analises">Análises e Gráficos</Link></li>
            </ul>
            <div className={styles.navButtons}>
                <Link href="/Entrar" className={`${styles.login} ${styles.button}`}>Entrar</Link>
                <Link href="/Cadastro" className={`${styles.signup} ${styles.button}`}>Cadastrar</Link>
            </div>
            <Icon icon="mdi:menu" className={styles.menuIcon} />
        </div>
    );
}