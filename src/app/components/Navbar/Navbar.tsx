import Link from 'next/link';
import styles from './Navbar.module.css';
import Image from 'next/image';
import Logo from '../../../public/images/logo-purple.svg';
import { Icon } from '@iconify/react';

export default function Navbar() {
    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                {/* <Image src={Logo} alt="PostVision Logo" className={styles.logoImg}/> */}
                <Link href="/" className={styles.logoText}>PostVision</Link>
            </div>
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